import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  GEMINI_API_KEY: z.string().min(1).default("placeholder_gemini_key"),
  GEMINI_MODEL: z.string().default("gemini-2.0-flash"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default("placeholder_service_role_key"),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
});

export const serverEnv = serverEnvSchema.parse({
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || undefined,
  GEMINI_MODEL: process.env.GEMINI_MODEL || undefined,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || undefined,
});
