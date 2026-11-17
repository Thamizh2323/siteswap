import { describe, it, expect } from "vitest";
import { clientEnv } from "../env.client";
import { createBrowserSupabaseClient } from "../supabase/browser";
import { ok, fail } from "../result";

describe("Client Environment & Supabase Browser Client", () => {
  it("validates client environment defaults", () => {
    expect(clientEnv.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    expect(clientEnv.NEXT_PUBLIC_SITE_URL).toMatch(/^https?:\/\//);
  });

  it("instantiates browser supabase client", () => {
    const client = createBrowserSupabaseClient();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(client.from).toBeDefined();
  });

  it("handles result type helper functions", () => {
    const success = ok({ userId: "u-123" });
    expect(success.ok).toBe(true);
    if (success.ok) {
      expect(success.data.userId).toBe("u-123");
    }

    const failure = fail("UNAUTHENTICATED", "unauthenticated");
    expect(failure.ok).toBe(false);
    if (!failure.ok) {
      expect(failure.error.code).toBe("UNAUTHENTICATED");
    }
  });
});
