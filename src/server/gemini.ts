import "server-only";
import { GoogleGenAI } from "@google/genai";
import { serverEnv } from "@/server/env";
import { logger } from "@/server/logger";
import {
  CANONICAL_MATERIAL_KEYS,
  MATERIAL_CONDITIONS,
  MATERIAL_UNITS,
  geminiRawOutputSchema,
  type AnalyzeResponse,
  type CanonicalMaterialKey,
  type MaterialCondition,
  type MaterialUnit,
} from "@/lib/ai-schemas";

export interface ImageInputPayload {
  base64: string;
  mimeType?: string;
}

const SYSTEM_PROMPT = `
You are an expert civil engineering surplus evaluator for SiteSwap, a P2P marketplace for surplus building materials.
Analyze the provided construction site photo(s).
Your goals:
1. Identify the primary surplus building material.
2. Estimate the quantity, count, volume, or weight based on visual clues (standard pallet size, brick stack layers, rebar bundles, bag dimensions).
3. Evaluate the physical condition: "good" (clean, reusable, structurally sound), "fair" (weathered, dusty, minor chips), "damaged" (broken, cracked, rusted, or ruined).
4. Identify visible issues (e.g. "Chipped corners", "Surface rust", "Torn paper bag", "Weather exposure").
5. Assess whether the image is genuinely construction surplus material and whether it contains hazardous materials.

STRICT CONSTRAINTS:
- material_key MUST be chosen from this exact list:
  ${CANONICAL_MATERIAL_KEYS.join(", ")}
- unit MUST be chosen from this exact list:
  ${MATERIAL_UNITS.join(", ")}
- condition MUST be chosen from:
  ${MATERIAL_CONDITIONS.join(", ")}
- If the item is NOT a construction material (e.g., household items, electronics, trash, animals, vehicles, food), set "is_construction_material": false.
- If the item is hazardous (e.g., asbestos, medical waste, corrosive acids, explosives), set "is_hazardous": true.
- Output MUST be valid JSON adhering to the schema.
`;

export async function analyzeSurplusWithGemini(
  images: ImageInputPayload[]
): Promise<AnalyzeResponse> {
  if (
    !serverEnv.GEMINI_API_KEY ||
    serverEnv.GEMINI_API_KEY.startsWith("placeholder")
  ) {
    logger.warn({
      event: "gemini_api_key_placeholder",
      metadata: { reason: "ai_unavailable" },
    });
    return { fallback: true, reason: "ai_unavailable" };
  }

  if (!images || images.length === 0) {
    return { fallback: true, reason: "no_images_provided" };
  }

  const ai = new GoogleGenAI({ apiKey: serverEnv.GEMINI_API_KEY });
  const imageParts = images.map((img) => ({
    inlineData: {
      mimeType: img.mimeType || "image/jpeg",
      data: img.base64,
    },
  }));

  const contents = [...imageParts, { text: SYSTEM_PROMPT }];

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: serverEnv.GEMINI_MODEL,
        contents,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const text = response.text?.trim();
      if (!text) {
        if (attempt === 1) continue;
        return { fallback: true, reason: "empty_response" };
      }

      const json = JSON.parse(text);
      const parsed = geminiRawOutputSchema.safeParse(json);

      if (!parsed.success) {
        logger.warn({
          event: "gemini_schema_parse_failure",
          metadata: { attempt, issueCount: parsed.error.issues.length },
        });
        if (attempt === 1) continue;
        return { fallback: true, reason: "parse_error" };
      }

      const data = parsed.data;

      if (!data.is_construction_material) {
        return { fallback: true, reason: "non_construction_material" };
      }

      if (data.is_hazardous) {
        return { fallback: true, reason: "hazardous_material" };
      }

      const matchedKey = matchCanonicalMaterialKey(data.material_key);
      if (!matchedKey) {
        if (attempt === 1) continue;
        return { fallback: true, reason: "unknown_material" };
      }

      const condition: MaterialCondition = MATERIAL_CONDITIONS.includes(
        data.condition as MaterialCondition
      )
        ? (data.condition as MaterialCondition)
        : "good";

      const unit: MaterialUnit = MATERIAL_UNITS.includes(
        data.unit as MaterialUnit
      )
        ? (data.unit as MaterialUnit)
        : "nos";

      return {
        fallback: false,
        materialKey: matchedKey,
        estimatedQty: Math.max(1, Math.round(data.estimated_qty || 1)),
        unit,
        condition,
        confidence: Math.min(1, Math.max(0, data.confidence || 0.8)),
        visibleIssues: Array.isArray(data.visible_issues)
          ? data.visible_issues
          : [],
        notes: data.notes || "Estimated from uploaded surplus photo.",
      };
    } catch (err) {
      logger.error({
        event: "gemini_attempt_error",
        error: err instanceof Error ? err.message : String(err),
        metadata: { attempt },
      });
      if (attempt === 1) continue;
      return {
        fallback: true,
        reason: "upstream_error",
        error: err instanceof Error ? err.message : "Upstream error",
      };
    }
  }

  return { fallback: true, reason: "failed_after_retry" };
}

function matchCanonicalMaterialKey(key: string): CanonicalMaterialKey | null {
  const normalized = key.toLowerCase().trim().replace(/[-\s]/g, "_");
  if (CANONICAL_MATERIAL_KEYS.includes(normalized as CanonicalMaterialKey)) {
    return normalized as CanonicalMaterialKey;
  }

  // Common synonyms mapping
  if (normalized.includes("brick")) return "red_clay_brick";
  if (normalized.includes("cement")) return "cement_bag";
  if (normalized.includes("steel") || normalized.includes("rebar")) return "tmt_steel";
  if (normalized.includes("sand")) return "m_sand";
  if (normalized.includes("tile")) return "floor_tile";
  if (normalized.includes("block")) return "solid_block";
  if (normalized.includes("pipe")) return "pvc_pipe";
  if (normalized.includes("paint")) return "paint_bucket";
  if (normalized.includes("wood") || normalized.includes("timber")) return "wooden_plank";
  if (normalized.includes("jelly") || normalized.includes("metal")) return "blue_metal";

  return null;
}
