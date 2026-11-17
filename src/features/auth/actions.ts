"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fail, ok, Result } from "@/lib/result";
import { flattenZodError } from "@/lib/errors";
import { signInSchema, signUpSchema } from "./schemas";

export async function signInAction(input: unknown): Promise<Result<{ userId: string }>> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION", "Please check your email and password.", flattenZodError(parsed.error));
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error || !data.user) {
      return fail("UNAUTHENTICATED", error?.message || "Invalid email or password.");
    }

    revalidatePath("/", "layout");
    return ok({ userId: data.user.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Authentication failed.";
    return fail("INTERNAL", msg);
  }
}

export async function signUpAction(input: unknown): Promise<Result<{ userId: string }>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION", "Please correct the form errors.", flattenZodError(parsed.error));
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          name: parsed.data.name,
          role: parsed.data.role,
        },
      },
    });

    if (error || !data.user) {
      return fail("CONFLICT", error?.message || "Unable to register account.");
    }

    // Upsert initial profile row
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      role: parsed.data.role,
      lang: parsed.data.lang,
      is_admin: false,
    });

    if (profileError) {
      // Non-fatal profile upsert notice
      console.warn("Profile creation warning:", profileError.message);
    }

    revalidatePath("/", "layout");
    return ok({ userId: data.user.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Account registration failed.";
    return fail("INTERNAL", msg);
  }
}

export async function signOutAction(): Promise<Result<void>> {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
  } catch {
    // Ignore sign-out failures
  }
  redirect("/login");
}
