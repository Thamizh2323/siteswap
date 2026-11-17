-- Seed demo data for SiteSwap
-- Run AFTER schema.sql + policies.sql
-- All demo records have is_demo = true

-- Demo listings (uses a placeholder seller_id — replace with real user id after first login)
-- Usage: Set is_demo = true so judges can clearly see real vs demo data
-- These are labelled with "DEMO" prefix in area_text

-- Note: insert real seller UUIDs after pilot onboarding
-- Example structure — update seller_id and location coords to your pilot area (Salem/Tiruchengode)

/*
INSERT INTO listings (seller_id, material_id, qty_total, qty_available, unit,
  condition, original_price, ask_price, negotiable, photos, location, area_text,
  pickup_type, status, is_demo)
SELECT
  '<YOUR_SELLER_UUID>',
  m.id,
  200, 200, 'nos',
  'good', 7.00, 5.50, true,
  ARRAY['demo/bricks1.jpg'],
  ST_MakePoint(77.8253, 11.6643)::geography,  -- Salem coords
  'DEMO - Attur Road, Salem',
  'self', 'active', true
FROM materials m WHERE m.key = 'red_clay_brick';
*/

-- Demo impact log entry (shows dashboard working from day 1)
-- INSERT INTO impact_log (reservation_id, material_id, qty, kg_diverted, co2_avoided_kg, money_saved, is_demo)
-- VALUES ('<RES_UUID>', '<MATERIAL_UUID>', 200, 570, 125.4, 300.00, true);
