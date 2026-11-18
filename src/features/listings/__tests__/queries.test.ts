import { describe, it, expect } from "vitest";
import { calculateSavingsPercent } from "@/lib/price";
import { calculateDistanceKm } from "@/lib/geo";

describe("Listings Search & Filtering Invariants", () => {
  it("calculates accurate savings percentage for surplus materials", () => {
    // Red clay brick: retail 7.0, ask 5.25 -> 25% savings
    expect(calculateSavingsPercent(7.0, 5.25)).toBe(25);
    // Cement bag: retail 420.0, ask 310.0 -> 26% savings
    expect(calculateSavingsPercent(420.0, 310.0)).toBe(26);
    // Edge case: ask price equals retail
    expect(calculateSavingsPercent(100, 100)).toBe(0);
    // Edge case: invalid negative or zero original price
    expect(calculateSavingsPercent(0, 50)).toBe(0);
  });

  it("calculates distance between GPS coordinates using Haversine formula", () => {
    // Salem Fairlands (11.671, 78.142) to Suramangalam (11.662, 78.125) ~ 2.1 km
    const dist = calculateDistanceKm(11.671, 78.142, 11.662, 78.125);
    expect(dist).toBeGreaterThan(1.5);
    expect(dist).toBeLessThan(3.0);
  });

  it("identifies distance boundaries within radius filter tiers", () => {
    const dist1 = calculateDistanceKm(11.664, 78.146, 11.671, 78.142); // ~1 km
    const dist2 = calculateDistanceKm(11.664, 78.146, 11.639, 78.118); // ~4.1 km
    const dist3 = calculateDistanceKm(11.664, 78.146, 11.649, 78.201); // ~6.2 km

    expect(dist1 <= 5).toBe(true);
    expect(dist2 <= 5).toBe(true);
    expect(dist3 <= 10).toBe(true);
    expect(dist3 <= 5).toBe(false);
  });
});
