import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUser } from "@/server/auth";
import type { Database } from "@/types/database";

export type ProfileRecord = Database["public"]["Tables"]["profiles"]["Row"];
export type PublicProfileRecord = Database["public"]["Views"]["public_profiles"]["Row"];

export async function getProfile(): Promise<ProfileRecord> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    // Return standard fallback profile initialized from auth user metadata
    return {
      id: user.id,
      name: (user.user_metadata?.name as string) || user.email?.split("@")[0] || "User",
      phone: (user.user_metadata?.phone as string) || null,
      role: (user.user_metadata?.role as ProfileRecord["role"]) || "both",
      lang: "en",
      area_text: "Salem Pilot Region",
      location: null,
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return profile;
}

export async function getPublicProfile(id: string): Promise<PublicProfileRecord | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}
