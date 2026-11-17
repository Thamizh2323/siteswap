import "server-only";
import { z } from "zod";

const isPlaceholder = (val: string | undefined): boolean =>
  !val ||
  val.toLowerCase().includes("placeholder") ||
  val === "placeholder_service_role_key" ||
  val === "placeholder_gemini_key";

/**
 * Validates that production environments do not execute with dummy/placeholder secrets.
 * Throws a fatal Error if called with invalid secrets in production.
 */
export function assertProductionSecrets(env: {
  SUPABASE_SERVICE_ROLE_KEY: string;
  GEMINI_API_KEY: string;
}) {
  const isProduction =
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build" &&
    !process.env.CI;

  if (isProduction) {
    if (isPlaceholder(env.SUPABASE_SERVICE_ROLE_KEY)) {
      throw new Error(
        "[FATAL CONFIG] SUPABASE_SERVICE_ROLE_KEY is set to a placeholder. A valid Supabase service_role secret is required in production."
      );
    }
    if (isPlaceholder(env.GEMINI_API_KEY)) {
      throw new Error(
        "[FATAL CONFIG] GEMINI_API_KEY is set to a placeholder. A valid Gemini API key is required in production."
      );
    }
  }
}

const serverEnvSchema = z
  .object({
    GEMINI_API_KEY: z.string().min(1).default("placeholder_gemini_key"),
    GEMINI_MODEL: z.string().default("gemini-2.0-flash"),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default("placeholder_service_role_key"),
    TELEGRAM_BOT_TOKEN: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isRuntimeProduction =
      process.env.NODE_ENV === "production" &&
      process.env.NEXT_PHASE !== "phase-production-build" &&
      !process.env.CI;

    if (isRuntimeProduction) {
      if (isPlaceholder(data.GEMINI_API_KEY)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["GEMINI_API_KEY"],
          message: "GEMINI_API_KEY cannot be a placeholder in production.",
        });
      }
      if (isPlaceholder(data.SUPABASE_SERVICE_ROLE_KEY)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["SUPABASE_SERVICE_ROLE_KEY"],
          message: "SUPABASE_SERVICE_ROLE_KEY cannot be a placeholder in production.",
        });
      }
    }
  });

export const serverEnv = serverEnvSchema.parse({
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || undefined,
  GEMINI_MODEL: process.env.GEMINI_MODEL || undefined,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || undefined,
});
