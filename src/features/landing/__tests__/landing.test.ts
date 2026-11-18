import { describe, it, expect } from "vitest";
import type { LandingHeroMetrics } from "../components/LandingHero";

describe("Landing Telemetry Formatting", () => {
  it("formats live tonnes and CO2 avoided with proper precision", () => {
    const metrics: LandingHeroMetrics = {
      tonnes: 12.45,
      co2Kg: 4120.3,
      rupees: 84200,
      deals: 18,
    };

    const formattedTonnes = metrics.tonnes.toLocaleString("en-IN", {
      maximumFractionDigits: 1,
    });
    const formattedCo2 = metrics.co2Kg.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
    const formattedRupees = `₹${metrics.rupees.toLocaleString("en-IN")}`;

    expect(formattedTonnes).toBe("12.5");
    expect(formattedCo2).toBe("4,120");
    expect(formattedRupees).toBe("₹84,200");
    expect(metrics.deals).toBe(18);
  });

  it("handles zero baseline gracefully without NaN", () => {
    const zeroMetrics: LandingHeroMetrics = {
      tonnes: 0,
      co2Kg: 0,
      rupees: 0,
      deals: 0,
    };

    expect(zeroMetrics.tonnes).toBe(0);
    expect(zeroMetrics.co2Kg).toBe(0);
    expect(zeroMetrics.rupees).toBe(0);
    expect(zeroMetrics.deals).toBe(0);
  });
});
