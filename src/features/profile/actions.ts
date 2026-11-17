"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUser } from "@/server/auth";
import { fail, ok, Result } from "@/lib/result";
import { flattenZodError } from "@/lib/errors";
import { updateProfileSchema } from "./schemas";

export async function updateProfileAction(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION", "Please check your profile details.", flattenZodError(parsed.error));
  }

  try {
    const user = await requireUser();
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        role: parsed.data.role,
        area_text: parsed.data.area_text || null,
        lang: parsed.data.lang,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return fail("INTERNAL", error.message);
    }

    revalidatePath("/profile");
    return ok({ id: user.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Profile update failed.";
    return fail("INTERNAL", msg);
  }
}
