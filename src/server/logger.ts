import "server-only";

export type LogLevel = "info" | "warn" | "error";

export interface LogPayload {
  event: string;
  userId?: string;
  listingId?: string;
  reservationId?: string;
  error?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

function sanitize(payload: LogPayload): LogPayload {
  const sanitized = { ...payload };

  // Never log phone numbers, keys, or tokens
  if (sanitized.metadata) {
    const cleanMeta: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(sanitized.metadata)) {
      const lower = key.toLowerCase();
      if (
        lower.includes("phone") ||
        lower.includes("key") ||
        lower.includes("token") ||
        lower.includes("secret") ||
        lower.includes("password")
      ) {
        cleanMeta[key] = "[REDACTED]";
      } else {
        cleanMeta[key] = val;
      }
    }
    sanitized.metadata = cleanMeta;
  }

  return sanitized;
}

function writeLog(level: LogLevel, payload: LogPayload): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    ...sanitize(payload),
  };

  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    // Info logging
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[INFO] ${entry.event}`, entry);
    }
  }
}

export const logger = {
  info: (payload: LogPayload) => writeLog("info", payload),
  warn: (payload: LogPayload) => writeLog("warn", payload),
  error: (payload: LogPayload) => writeLog("error", payload),
};
