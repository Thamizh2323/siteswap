export type ErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "VALIDATION"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "UPSTREAM"
  | "INTERNAL";

export interface AppError {
  code: ErrorCode;
  message: string;
  fields?: Record<string, string>;
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: AppError };

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });

export const fail = (
  code: ErrorCode,
  message: string,
  fields?: Record<string, string>
): Result<never> => ({
  ok: false,
  error: { code, message, fields },
});
