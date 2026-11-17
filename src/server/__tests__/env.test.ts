import { describe, it, expect, vi, afterEach } from "vitest";
import { assertProductionSecrets } from "../env";

describe("Server Environment Production Guards", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("throws when placeholder keys are supplied in production runtime", () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    delete process.env.CI;
    delete process.env.NEXT_PHASE;

    expect(() =>
      assertProductionSecrets({
        SUPABASE_SERVICE_ROLE_KEY: "placeholder_service_role_key",
        GEMINI_API_KEY: "AQ.valid_key_123456789",
      })
    ).toThrowError(/SUPABASE_SERVICE_ROLE_KEY/);

    expect(() =>
      assertProductionSecrets({
        SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOi_valid_key_123456789",
        GEMINI_API_KEY: "placeholder_gemini_key",
      })
    ).toThrowError(/GEMINI_API_KEY/);
  });

  it("passes when live keys are provided in production runtime", () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    delete process.env.CI;
    delete process.env.NEXT_PHASE;

    expect(() =>
      assertProductionSecrets({
        SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOi_live_supabase_secret_key_12345",
        GEMINI_API_KEY: "AIzaSy_live_gemini_api_key_12345",
      })
    ).not.toThrow();
  });
});
