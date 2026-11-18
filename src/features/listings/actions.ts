"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/server/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { toPointWKT } from "@/lib/geo";
import { ok, fail, type Result } from "@/lib/result";
import { createListingSchema } from "./schemas";
import { getNearbyListings } from "./queries";
import type { BrowseFilters, NearbyListing } from "./types";

export async function createListingAction(
  input: unknown
): Promise<Result<{ id: string }>> {
  const parsed = createListingSchema.safeParse(input);
  if (!parsed.success) {
    const errorMap: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      errorMap[key] = issue.message;
    }
    return fail("VALIDATION", "Invalid listing submission", errorMap);
  }

  const user = await requireUser();
  const data = parsed.data;
  const supabase = await createServerSupabaseClient();

  // 1. Resolve material key to DB material_id
  const { data: material, error: matError } = await supabase
    .from("materials")
    .select("id, unit")
    .eq("key", data.materialKey)
    .single();

  if (matError || !material) {
    return fail("NOT_FOUND", `Unknown material type: ${data.materialKey}`);
  }

  // 2. Format PostGIS EWKT Point
  let locationWkt: string;
  try {
    locationWkt = toPointWKT(data.lat, data.lng);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid coordinates";
    return fail("VALIDATION", msg);
  }

  // 3. Insert surplus listing under seller RLS check
  const { data: listing, error: insertError } = await supabase
    .from("listings")
    .insert({
      seller_id: user.id,
      material_id: material.id,
      qty_total: data.qty,
      qty_available: data.qty,
      unit: data.unit || material.unit,
      condition: data.condition,
      original_price: data.originalPrice,
      ask_price: data.askPrice,
      negotiable: data.negotiable,
      photos: data.photos,
      location: locationWkt,
      area_text: data.areaText,
      pickup_type: data.pickupType,
      qty_ai_estimate: data.qtyAiEstimate ?? null,
      ai_confidence: data.aiConfidence ?? null,
      status: "active",
    })
    .select("id")
    .single();

  if (insertError || !listing) {
    return fail(
      "INTERNAL",
      `Failed to create listing: ${insertError?.message || "Unknown DB error"}`
    );
  }

  revalidatePath("/browse");
  revalidatePath("/");

  return ok({ id: listing.id });
}

export async function fetchNearbyListingsAction(
  filters: BrowseFilters
): Promise<Result<NearbyListing[]>> {
  return getNearbyListings(filters);
}
