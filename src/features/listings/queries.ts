import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ok, fail, type Result } from "@/lib/result";
import { calculateSavingsPercent } from "@/lib/price";
import { DEMO_LISTINGS } from "./constants";
import type { BrowseFilters, NearbyListing } from "./types";

/**
 * Fetches nearby active listings within a specified radius using PostGIS nearby_listings RPC.
 */
export async function getNearbyListings(
  filters: BrowseFilters
): Promise<Result<NearbyListing[]>> {
  const { lat, lng, radiusKm = 10, materialKey, limit = 20, offset = 0 } = filters;

  if (typeof lat !== "number" || typeof lng !== "number") {
    return fail("VALIDATION", "Valid latitude and longitude are required");
  }

  const supabase = await createServerSupabaseClient();
  const selectedKey = materialKey && materialKey !== "all" ? materialKey : null;

  try {
    const { data, error } = await supabase.rpc("nearby_listings", {
      lat,
      lng,
      radius_km: radiusKm,
      material_key: selectedKey,
      lim: limit,
      off: offset,
    });

    if (error) {
      return fail("UPSTREAM", `Database RPC error: ${error.message}`);
    }

    if (Array.isArray(data) && data.length > 0) {
      const items: NearbyListing[] = data.map((row) => {
        const ask = Number(row.ask_price);
        const orig = Number(row.original_price);
        const distM = Number(row.distance_m || 0);
        const rowAny = row as unknown as { lat?: number; lng?: number; lat_out?: number; lng_out?: number };
        const itemLat = rowAny.lat ?? rowAny.lat_out ?? lat + ((row.id.charCodeAt(0) % 20) - 10) * 0.002;
        const itemLng = rowAny.lng ?? rowAny.lng_out ?? lng + ((row.id.charCodeAt(1) % 20) - 10) * 0.002;

        return {
          id: row.id,
          sellerId: row.seller_id,
          materialId: row.material_id,
          materialKey: row.material_key_out,
          materialNameEn: row.material_name_en,
          materialNameTa: row.material_name_ta,
          qtyAvailable: Number(row.qty_available),
          unit: row.unit,
          condition: (row.condition as NearbyListing["condition"]) || "good",
          askPrice: ask,
          originalPrice: orig,
          savingsPercent: calculateSavingsPercent(orig, ask),
          distanceKm: Math.round((distM / 1000) * 10) / 10,
          distanceM: distM,
          lat: Math.round(itemLat * 10000) / 10000,
          lng: Math.round(itemLng * 10000) / 10000,
          areaText: row.area_text || "Salem",
          photos: Array.isArray(row.photos) ? row.photos : [],
          negotiable: Boolean(row.negotiable),
          status: row.status,
          isDemo: Boolean(row.is_demo),
          createdAt: row.created_at,
        };
      });

      return ok(items);
    }

    // Fallback to local demo listings if DB has not been seeded yet
    if (offset === 0) {
      const demoMatches = DEMO_LISTINGS.filter((item) => {
        const matchesMat = !selectedKey || item.materialKey === selectedKey;
        const matchesRad = item.distanceKm <= radiusKm;
        return matchesMat && matchesRad;
      }).map((item) => ({
        id: item.id,
        sellerId: "demo-seller",
        materialId: item.materialKey,
        materialKey: item.materialKey,
        materialNameEn: item.title,
        materialNameTa: item.title,
        qtyAvailable: item.qtyAvailable,
        unit: item.unit,
        condition: (item.condition as NearbyListing["condition"]) || "good",
        askPrice: item.askPrice,
        originalPrice: item.originalPrice,
        savingsPercent: item.savingsPercent,
        distanceKm: item.distanceKm,
        distanceM: item.distanceKm * 1000,
        lat: item.lat,
        lng: item.lng,
        areaText: item.locationText,
        photos: item.photoUrl ? [item.photoUrl] : [],
        negotiable: true,
        status: "active",
        isDemo: true,
        createdAt: new Date().toISOString(),
      }));

      return ok(demoMatches);
    }

    return ok([]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error in getNearbyListings";
    return fail("INTERNAL", message);
  }
}
