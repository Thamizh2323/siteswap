import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fail, ok, Result } from "@/lib/result";

/**
 * Server-side auth guard.
 * Must be called in every protected Server Component page and Server Action.
 * Calls supabase.auth.getUser() to verify with the Supabase auth server.
 */
export async function requireUser(): Promise<User> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return user;
}

/**
 * Server-side admin guard.
 * Verifies user authentication and checks profiles.is_admin = true.
 */
export async function requireAdmin(): Promise<{ user: User; isAdmin: boolean }> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (error || !profile?.is_admin) {
    redirect("/");
  }

  return { user, isAdmin: true };
}

/**
 * Returns current authenticated user or null without throwing or redirecting.
 */
export async function getOptionalUser(): Promise<User | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ?? null;
  } catch {
    return null;
  }
}

/**
 * Returns Result<User> for Server Actions that prefer typed Result over redirects.
 */
export async function getAuthUser(): Promise<Result<User>> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return fail("UNAUTHENTICATED", "unauthenticated");
    }

    return ok(user);
  } catch {
    return fail("INTERNAL", "internal");
  }
}
