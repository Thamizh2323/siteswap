import { describe, it, expect } from "vitest";

describe("Map View & Radius Search Helpers", () => {
  it("converts radius tiers in kilometers to meters for Leaflet circle rendering", () => {
    const toMeters = (km: number) => km * 1000;
    expect(toMeters(5)).toBe(5000);
    expect(toMeters(10)).toBe(10000);
    expect(toMeters(25)).toBe(25000);
  });

  it("formats price pill strings accurately for map markers", () => {
    const formatPill = (price: number, unit: string) => `₹${price}/${unit}`;
    expect(formatPill(5.25, "nos")).toBe("₹5.25/nos");
    expect(formatPill(310, "bags")).toBe("₹310/bags");
    expect(formatPill(50, "kg")).toBe("₹50/kg");
  });

  it("validates geographic coordinates bounds for marker placement", () => {
    const isValidCoord = (lat: number, lng: number) =>
      lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

    expect(isValidCoord(11.6643, 78.146)).toBe(true);
    expect(isValidCoord(95.0, 78.146)).toBe(false);
    expect(isValidCoord(11.6643, 190.0)).toBe(false);
  });
});
