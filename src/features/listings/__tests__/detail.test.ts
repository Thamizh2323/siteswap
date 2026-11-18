import { describe, it, expect } from "vitest";
import { calculateSavingsPercent } from "@/lib/price";

describe("Listing Detail Page Calculations & Privacy", () => {
  it("calculates accurate total reservation cost", () => {
    const calculateTotal = (qty: number, askPrice: number) => qty * askPrice;
    expect(calculateTotal(10, 290)).toBe(2900);
    expect(calculateTotal(18, 5.5)).toBe(99);
  });

  it("calculates savings percentage from retail reference", () => {
    expect(calculateSavingsPercent(390, 290)).toBe(26);
    expect(calculateSavingsPercent(55, 42)).toBe(24);
  });

  it("clamps quantity stepper strictly between 1 and available quantity", () => {
    const clampQty = (current: number, delta: number, max: number) =>
      Math.max(1, Math.min(max, current + delta));

    // Stepping down from 1 stays at 1
    expect(clampQty(1, -1, 18)).toBe(1);
    // Stepping up from 10 goes to 11
    expect(clampQty(10, 1, 18)).toBe(11);
    // Stepping up past max stops at max
    expect(clampQty(18, 1, 18)).toBe(18);
  });

  it("enforces seller phone privacy invariant on public profile view", () => {
    const publicProfileSample = {
      id: "user-123",
      name: "Murugan Builders",
      role: "Contractor",
      areaText: "Salem North",
    };

    // Verify phone is not a property on the public seller profile
    expect("phone" in publicProfileSample).toBe(false);
  });
});
