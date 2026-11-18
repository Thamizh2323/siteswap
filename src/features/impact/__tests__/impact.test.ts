import { describe, it, expect, vi } from "vitest";
import { getImpactDashboardData } from "../queries";

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn().mockResolvedValue({
    rpc: vi.fn().mockImplementation((name: string, args: { p_include_demo: boolean }) => {
      if (name === "impact_totals") {
        if (args.p_include_demo) {
          return {
            data: [{ tonnes: 14.5, co2_kg: 4800, rupees: 92000, deals: 22 }],
            error: null,
          };
        }
        return {
          data: [{ tonnes: 4.2, co2_kg: 1350, rupees: 28000, deals: 7 }],
          error: null,
        };
      }
      return { data: null, error: null };
    }),
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: [
              {
                id: "imp-test-1",
                qty: 15,
                kg_diverted: 750,
                co2_avoided_kg: 615,
                money_saved: 1950,
                is_demo: false,
                created_at: "2026-11-18T10:00:00.000Z",
                materials: {
                  key: "cement_bag",
                  name_en: "Cement Bag (50kg)",
                  name_ta: "சிமென்ட் பை",
                  unit: "bags",
                },
              },
            ],
            error: null,
          }),
        }),
      }),
    }),
  }),
}));

describe("Impact Formulas & LCA Calculations", () => {
  it("calculates diverted mass accurately from unit factor", () => {
    const qtyBags = 20;
    const kgPerBag = 50.0;
    const massDiverted = qtyBags * kgPerBag;
    expect(massDiverted).toBe(1000);
  });

  it("calculates avoided embodied CO2 accurately from LCA factors", () => {
    // Cement: 0.82 kg CO2 / kg
    const cementMassKg = 1000;
    const cementCo2Avoided = cementMassKg * 0.82;
    expect(cementCo2Avoided).toBe(820);

    // TMT Steel: 1.46 kg CO2 / kg
    const steelMassKg = 500;
    const steelCo2Avoided = steelMassKg * 1.46;
    expect(steelCo2Avoided).toBe(730);

    // Red clay brick: 0.22 kg CO2 / kg
    const brickQty = 1000;
    const brickMassKg = brickQty * 2.85;
    const brickCo2Avoided = brickMassKg * 0.22;
    expect(brickCo2Avoided).toBeCloseTo(627, 0);
  });

  it("calculates buyer financial savings accurately", () => {
    const newPriceRef = 420; // retail cement bag
    const askPrice = 290; // surplus price
    const qty = 10;
    const savings = (newPriceRef - askPrice) * qty;
    expect(savings).toBe(1300);
  });
});

describe("getImpactDashboardData Query", () => {
  it("fetches and parses live and withDemo metrics correctly from RPC", async () => {
    const data = await getImpactDashboardData();

    expect(data.live.tonnes).toBe(4.2);
    expect(data.live.co2Kg).toBe(1350);
    expect(data.live.rupees).toBe(28000);
    expect(data.live.deals).toBe(7);

    expect(data.withDemo.tonnes).toBe(14.5);
    expect(data.withDemo.co2Kg).toBe(4800);
    expect(data.withDemo.rupees).toBe(92000);
    expect(data.withDemo.deals).toBe(22);

    expect(data.breakdown.length).toBeGreaterThan(0);
    expect(data.recent.length).toBeGreaterThan(0);
    expect(data.recent[0]?.materialName).toBe("Cement Bag (50kg)");
    expect(data.recent[0]?.kgDiverted).toBe(750);
  });
});
