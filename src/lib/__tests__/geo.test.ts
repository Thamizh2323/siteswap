import { describe, it, expect } from "vitest";
import { toPointWKT, calculateDistanceKm } from "../geo";

describe("toPointWKT", () => {
  it("formats coordinates in PostGIS EWKT SRID=4326;POINT(lng lat) order", () => {
    // Note: Salem coords lat: 11.6643, lng: 77.8253
    const wkt = toPointWKT(11.6643, 77.8253);
    expect(wkt).toBe("SRID=4326;POINT(77.8253 11.6643)");
  });

  it("throws error for out-of-range coordinates", () => {
    expect(() => toPointWKT(95, 77.8)).toThrow("Invalid latitude");
    expect(() => toPointWKT(11.6, 185)).toThrow("Invalid longitude");
  });
});

describe("calculateDistanceKm", () => {
  it("calculates near-zero distance for identical coordinates", () => {
    expect(calculateDistanceKm(11.6643, 77.8253, 11.6643, 77.8253)).toBe(0);
  });

  it("calculates approximate distance between Salem and Tiruchengode (~40 km)", () => {
    // Salem (11.6643, 78.1460) to Tiruchengode (11.3800, 77.8900)
    const distance = calculateDistanceKm(11.6643, 78.146, 11.38, 77.89);
    expect(distance).toBeGreaterThan(35);
    expect(distance).toBeLessThan(48);
  });
});
