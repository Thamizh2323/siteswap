import { z } from "zod";

export const CANONICAL_MATERIAL_KEYS = [
  "red_clay_brick",
  "fly_ash_brick",
  "solid_block",
  "cement_bag",
  "tmt_steel",
  "m_sand",
  "blue_metal",
  "river_sand",
  "floor_tile",
  "tile_adhesive",
  "pvc_pipe",
  "paint_bucket",
  "wooden_plank",
] as const;

export type CanonicalMaterialKey = (typeof CANONICAL_MATERIAL_KEYS)[number];

export const MATERIAL_UNITS = ["nos", "bags", "kg", "cft", "sqft"] as const;
export type MaterialUnit = (typeof MATERIAL_UNITS)[number];

export const MATERIAL_CONDITIONS = ["good", "fair", "damaged"] as const;
export type MaterialCondition = (typeof MATERIAL_CONDITIONS)[number];

export const analyzeRequestSchema = z
  .object({
    photoUrls: z.array(z.string().url()).min(1).max(4).optional(),
    photoBase64: z.string().min(1).max(7_000_000).optional(),
  })
  .refine(
    (data) => (data.photoUrls && data.photoUrls.length > 0) || Boolean(data.photoBase64),
    {
      message: "At least one photo URL or photoBase64 must be provided",
      path: ["photoUrls"],
    }
  );

export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>;

export const geminiRawOutputSchema = z.object({
  material_key: z.string(),
  estimated_qty: z.number().nonnegative(),
  unit: z.string(),
  condition: z.string(),
  confidence: z.number().min(0).max(1),
  is_construction_material: z.boolean(),
  is_hazardous: z.boolean(),
  visible_issues: z.array(z.string()).default([]),
  notes: z.string().default(""),
});

export type GeminiRawOutput = z.infer<typeof geminiRawOutputSchema>;

export interface AnalyzeEstimateSuccess {
  fallback: false;
  materialKey: CanonicalMaterialKey;
  estimatedQty: number;
  unit: MaterialUnit;
  condition: MaterialCondition;
  confidence: number;
  visibleIssues: string[];
  notes: string;
}

export interface AnalyzeFallbackResponse {
  fallback: true;
  reason?: string;
  error?: string;
}

export type AnalyzeResponse = AnalyzeEstimateSuccess | AnalyzeFallbackResponse;
