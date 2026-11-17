import { fail, Result } from "./result";

interface DbErrorLike {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

export function flattenZodError(error: { issues: readonly { path: readonly PropertyKey[]; message: string }[] }): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".");
    if (key) fields[key] = issue.message;
  }
  return fields;
}

export function mapDbError(error: unknown): Result<never> {
  const err = error as DbErrorLike;
  const msg = err?.message || "Unknown database error";

  if (msg.includes("not found")) {
    return fail("NOT_FOUND", "not_found");
  }
  if (msg.includes("Access denied") || msg.includes("permission denied")) {
    return fail("FORBIDDEN", "forbidden");
  }
  if (msg.includes("duplicate key") || msg.includes("already exists")) {
    return fail("CONFLICT", "conflict");
  }
  if (msg.includes("rate limit") || msg.includes("rate_limited")) {
    return fail("RATE_LIMITED", "rate_limited");
  }
  if (msg.includes("violates check constraint") || msg.includes("invalid input")) {
    return fail("VALIDATION", "validation");
  }

  return fail("INTERNAL", "internal");
}
