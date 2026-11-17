export type MaterialCondition = "unused" | "good" | "fair" | "damaged";

export const CONDITION_FACTORS: Record<MaterialCondition, number> = {
  unused: 0.8,
  good: 0.75,
  fair: 0.65,
  damaged: 0.45,
};

/**
 * Calculates suggested ask price based on original retail reference and material condition.
 */
export function calculateSuggestedPrice(
  originalPrice: number,
  condition: MaterialCondition
): number {
  if (originalPrice <= 0) return 0;
  const factor = CONDITION_FACTORS[condition] ?? 0.75;
  const rawPrice = originalPrice * factor;
  return Math.round(rawPrice * 100) / 100;
}

/**
 * Calculates discount percentage saved compared to retail price.
 */
export function calculateSavingsPercent(
  originalPrice: number,
  askPrice: number
): number {
  if (originalPrice <= 0 || askPrice >= originalPrice) return 0;
  const savings = ((originalPrice - askPrice) / originalPrice) * 100;
  return Math.round(savings);
}
