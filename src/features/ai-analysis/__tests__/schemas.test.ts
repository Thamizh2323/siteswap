import { describe, it, expect } from "vitest";
import {
  analyzeRequestSchema,
  geminiRawOutputSchema,
  CANONICAL_MATERIAL_KEYS,
  MATERIAL_UNITS,
  MATERIAL_CONDITIONS,
} from "../schemas";

describe("AI Analysis Request Schema (analyzeRequestSchema)", () => {
  it("accepts valid photo URLs array within bounds", () => {
    const valid = analyzeRequestSchema.safeParse({
      photoUrls: [
        "https://xyz.supabase.co/storage/v1/object/public/listing-photos/user-1/photo-1.jpg",
      ],
    });
    expect(valid.success).toBe(true);
  });

  it("accepts valid photoBase64 payload", () => {
    const valid = analyzeRequestSchema.safeParse({
      photoBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
    });
    expect(valid.success).toBe(true);
  });

  it("rejects when neither photoUrls nor photoBase64 is provided", () => {
    const result = analyzeRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects when photoUrls exceeds maximum of 4", () => {
    const result = analyzeRequestSchema.safeParse({
      photoUrls: [
        "https://example.com/1.jpg",
        "https://example.com/2.jpg",
        "https://example.com/3.jpg",
        "https://example.com/4.jpg",
        "https://example.com/5.jpg",
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid URL formats", () => {
    const result = analyzeRequestSchema.safeParse({
      photoUrls: ["not-a-valid-url"],
    });
    expect(result.success).toBe(false);
  });
});

describe("Gemini Raw Output Schema (geminiRawOutputSchema)", () => {
  it("validates a compliant raw model response", () => {
    const sample = {
      material_key: "red_clay_brick",
      estimated_qty: 450,
      unit: "nos",
      condition: "good",
      confidence: 0.94,
      is_construction_material: true,
      is_hazardous: false,
      visible_issues: ["Minor chipping on outer edges"],
      notes: "Stack of approximately 450 red clay bricks.",
    };

    const parsed = geminiRawOutputSchema.safeParse(sample);
    expect(parsed.success).toBe(true);
  });

  it("rejects confidence outside the [0, 1] range", () => {
    const sample = {
      material_key: "cement_bag",
      estimated_qty: 10,
      unit: "bags",
      condition: "good",
      confidence: 1.5,
      is_construction_material: true,
      is_hazardous: false,
    };

    const parsed = geminiRawOutputSchema.safeParse(sample);
    expect(parsed.success).toBe(false);
  });

  it("rejects negative estimated quantities", () => {
    const sample = {
      material_key: "tmt_steel",
      estimated_qty: -5,
      unit: "kg",
      condition: "fair",
      confidence: 0.8,
      is_construction_material: true,
      is_hazardous: false,
    };

    const parsed = geminiRawOutputSchema.safeParse(sample);
    expect(parsed.success).toBe(false);
  });
});

describe("Canonical Material Catalog Invariants", () => {
  it("includes all 13 canonical construction surplus materials", () => {
    expect(CANONICAL_MATERIAL_KEYS).toContain("red_clay_brick");
    expect(CANONICAL_MATERIAL_KEYS).toContain("fly_ash_brick");
    expect(CANONICAL_MATERIAL_KEYS).toContain("solid_block");
    expect(CANONICAL_MATERIAL_KEYS).toContain("cement_bag");
    expect(CANONICAL_MATERIAL_KEYS).toContain("tmt_steel");
    expect(CANONICAL_MATERIAL_KEYS).toContain("m_sand");
    expect(CANONICAL_MATERIAL_KEYS).toContain("blue_metal");
    expect(CANONICAL_MATERIAL_KEYS).toContain("river_sand");
    expect(CANONICAL_MATERIAL_KEYS).toContain("floor_tile");
    expect(CANONICAL_MATERIAL_KEYS).toContain("tile_adhesive");
    expect(CANONICAL_MATERIAL_KEYS).toContain("pvc_pipe");
    expect(CANONICAL_MATERIAL_KEYS).toContain("paint_bucket");
    expect(CANONICAL_MATERIAL_KEYS).toContain("wooden_plank");
    expect(CANONICAL_MATERIAL_KEYS.length).toBe(13);
  });

  it("defines standard units and conditions", () => {
    expect(MATERIAL_UNITS).toEqual(["nos", "bags", "kg", "cft", "sqft"]);
    expect(MATERIAL_CONDITIONS).toEqual(["good", "fair", "damaged"]);
  });
});
