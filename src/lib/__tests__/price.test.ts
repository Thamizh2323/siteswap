import { describe, it, expect } from "vitest";
import {
  calculateSuggestedPrice,
  calculateSavingsPercent,
} from "../price";

describe("calculateSuggestedPrice", () => {
  it("calculates 75% for good condition", () => {
    expect(calculateSuggestedPrice(100, "good")).toBe(75);
    expect(calculateSuggestedPrice(7, "good")).toBe(5.25);
  });

  it("calculates 65% for fair condition", () => {
    expect(calculateSuggestedPrice(100, "fair")).toBe(65);
  });

  it("calculates 45% for damaged condition", () => {
    expect(calculateSuggestedPrice(100, "damaged")).toBe(45);
  });

  it("calculates 80% for unused condition", () => {
    expect(calculateSuggestedPrice(100, "unused")).toBe(80);
  });

  it("returns 0 for non-positive original price", () => {
    expect(calculateSuggestedPrice(0, "good")).toBe(0);
    expect(calculateSuggestedPrice(-10, "good")).toBe(0);
  });
});

describe("calculateSavingsPercent", () => {
  it("computes honest savings percentage", () => {
    expect(calculateSavingsPercent(100, 75)).toBe(25);
    expect(calculateSavingsPercent(7, 5.5)).toBe(21);
  });

  it("returns 0 when ask price is not lower", () => {
    expect(calculateSavingsPercent(100, 100)).toBe(0);
    expect(calculateSavingsPercent(100, 120)).toBe(0);
  });
});
