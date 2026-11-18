import "server-only";
import { supabaseAdmin } from "@/server/supabase-admin";
import { logger } from "@/server/logger";

// Fallback in-memory cache for test/local environments when DB is unreachable
const memoryRateLimits = new Map<string, { count: number; windowStart: number }>();

/**
 * Checks and increments rate limit for a given key.
 * Calls Postgres RPC `check_rate_limit(p_key, p_limit, p_window_seconds)`.
 * Returns true if request is allowed, false if rate limit is exceeded.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.rpc("check_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      logger.warn({
        event: "db_rate_limit_fallback",
        error: error.message,
        metadata: { key },
      });
      return checkMemoryRateLimit(key, limit, windowSeconds);
    }

    return Boolean(data);
  } catch (err) {
    logger.warn({
      event: "db_rate_limit_exception",
      error: err instanceof Error ? err.message : String(err),
      metadata: { key },
    });
    return checkMemoryRateLimit(key, limit, windowSeconds);
  }
}

function checkMemoryRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): boolean {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const current = memoryRateLimits.get(key);

  if (!current || now - current.windowStart > windowMs) {
    memoryRateLimits.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count += 1;
  return true;
}
