# SiteSwap Environmental & Economic Impact Methodology

## 1. Core Principles: Zero Inflated Claims
In conventional carbon accounting, platforms often report theoretical savings based merely on user listings or listings viewed. **SiteSwap rejects this practice.**

On SiteSwap:
1. **Physical Handover Verification:** Impact records are inserted into `impact_log` **exclusively** when a buyer confirms receipt in hand via the `complete_reservation` SQL RPC.
2. **Transparent Segregation:** Live transactions are strictly segregated from demo transactions via the `is_demo` boolean flag. The public dashboard enables toggling between pure live data and combined demo telemetry.
3. **Double-Counting Prevention:** Every material lot is tracked by remaining quantity. Once reserved and completed, its mass cannot be logged a second time.

---

## 2. Calculation Formulas

### 2.1 Landfill Waste Diverted
Quantifies the mass of clean, usable construction materials diverted from municipal dumping grounds, road berms, or lake beds:
$$\text{kg\_diverted} = \text{quantity} \times \text{kg\_per\_unit}$$
$$\text{tonnes\_diverted} = \frac{\sum \text{kg\_diverted}}{1000}$$

### 2.2 Embodied Carbon ($CO_2$) Avoided
Quantifies the avoided cradle-to-gate manufacturing emissions. By reusing surplus material already manufactured, buyers avert the need for newly fired kiln bricks, virgin clinker cement, or blast-furnace steel:
$$\text{co2\_avoided\_kg} = \text{kg\_diverted} \times \text{co2\_per\_kg}$$

### 2.3 Contractor & Home Builder Savings
Measures direct capital saved compared to purchasing equivalent new materials from retail dealers:
$$\text{money\_saved} = \max(\text{new\_price\_ref} - \text{ask\_price}, 0) \times \text{quantity}$$

---

## 3. Materials Catalog & Emission Factors

The values below are calibrated against published Lifecycle Assessments (LCA) and standard building material references (Inventory of Carbon & Energy - ICE v3.0, Centre for Science and Environment - CSE India, and BMTPC India):

| Material Key | Material Name | Standard Unit | Mass ($kg/\text{unit}$) | Embodied $CO_2$ ($kg/\text{kg}$) | Salem Retail Reference Price (₹) |
|---|---|---|---|---|---|
| `red_clay_brick` | Red Clay Brick | nos | 2.85 | 0.22 | ₹7.00 |
| `fly_ash_brick` | Fly Ash Brick | nos | 2.60 | 0.08 | ₹6.00 |
| `solid_block` | Solid Concrete Block | nos | 17.00 | 0.14 | ₹55.00 |
| `cement_bag` | Cement Bag (50kg) | bags | 50.00 | 0.82 | ₹420.00 |
| `tmt_steel` | TMT Steel Bar | kg | 1.00 | 1.46 | ₹65.00 |
| `m_sand` | Manufactured Sand | cft | 46.00 | 0.005 | ₹35.00 |
| `blue_metal` | Blue Metal / Jelly (20mm) | cft | 44.00 | 0.04 | ₹40.00 |
| `river_sand` | River Sand | cft | 44.00 | 0.01 | ₹55.00 |
| `floor_tile` | Floor Ceramic Tile | sqft | 2.20 | 0.65 | ₹45.00 |
| `tile_adhesive` | Tile Adhesive Bag | bags | 20.00 | 0.40 | ₹220.00 |
| `pvc_pipe` | PVC Pipe (6ft) | nos | 0.50 | 2.50 | ₹80.00 |
| `paint_bucket` | Emulsion Paint (10L) | nos | 12.00 | 2.90 | ₹850.00 |
| `wooden_plank` | Hardwood Plank | nos | 8.00 | 0.42 | ₹250.00 |

---

## 4. Database Telemetry Implementation

Impact metrics are computed server-side within the `complete_reservation(p_res uuid)` PostgreSQL transaction:
```sql
INSERT INTO impact_log (reservation_id, material_id, qty, kg_diverted, co2_avoided_kg, money_saved, is_demo)
VALUES (
  p_res,
  v_m.id,
  v_r.qty,
  v_r.qty * v_m.kg_per_unit,
  v_r.qty * v_m.kg_per_unit * v_m.co2_per_kg,
  GREATEST(COALESCE(v_m.new_price_ref, v_l.original_price, v_l.ask_price) - v_l.ask_price, 0) * v_r.qty,
  v_l.is_demo
);
```

Public aggregated statistics are exposed through the secure RPC `impact_totals(p_include_demo boolean)`:
```sql
SELECT COALESCE(SUM(kg_diverted), 0) / 1000.0,
       COALESCE(SUM(co2_avoided_kg), 0),
       COALESCE(SUM(money_saved), 0),
       COUNT(*)
FROM impact_log
WHERE p_include_demo OR NOT is_demo;
```
