import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ok, fail, type Result } from "@/lib/result";
import { calculateSavingsPercent } from "@/lib/price";
import { DEMO_LISTINGS } from "./constants";
import type { BrowseFilters, NearbyListing, ListingDetail } from "./types";

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
        createdAt: "2026-11-17T00:00:00.000Z",
      }));

      return ok(demoMatches);
    }

    return ok([]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error in getNearbyListings";
    return fail("INTERNAL", message);
  }
}

/**
 * Fetches full surplus listing details including materials and seller public profile.
 */
export async function getListingById(id: string): Promise<Result<ListingDetail>> {
  if (!id) {
    return fail("VALIDATION", "Listing ID is required");
  }

  // 1. Check local demo listings fallback
  const demo = DEMO_LISTINGS.find((d) => d.id === id || id === `l-demo-1`);
  if (demo) {
    return ok({
      id: demo.id,
      title: demo.title,
      materialKey: demo.materialKey,
      materialNameEn: demo.title,
      materialNameTa: demo.title,
      unit: demo.unit,
      qtyAvailable: demo.qtyAvailable,
      qtyTotal: demo.qtyAvailable,
      askPrice: demo.askPrice,
      originalPrice: demo.originalPrice,
      savingsPercent: demo.savingsPercent,
      condition: (demo.condition as ListingDetail["condition"]) || "good",
      pickupType: "self",
      areaText: demo.locationText,
      photos: demo.photoUrl ? [demo.photoUrl] : [],
      negotiable: true,
      status: "active",
      isDemo: true,
      createdAt: "2026-11-17T00:00:00.000Z",
      seller: {
        id: "demo-seller-1",
        name: "Murugan Builders",
        role: "Contractor",
        areaText: "Salem North",
      },
    });
  }

  // 2. Fetch live listing from DB
  const supabase = await createServerSupabaseClient();

  try {
    const { data: listing, error: listError } = await supabase
      .from("listings")
      .select(`
        id, seller_id, material_id, qty_total, qty_available, unit,
        condition, original_price, ask_price, negotiable, photos,
        area_text, pickup_type, status, is_demo, created_at,
        materials ( key, name_en, name_ta )
      `)
      .eq("id", id)
      .single();

    if (listError || !listing) {
      return fail("NOT_FOUND", "Listing not found or has been removed");
    }

    // 3. Fetch public profile (NO phone number exposed)
    const { data: profile } = await supabase
      .from("public_profiles")
      .select("id, name, role, area_text")
      .eq("id", listing.seller_id)
      .single();

    const mat = Array.isArray(listing.materials) ? listing.materials[0] : listing.materials;
    const ask = Number(listing.ask_price);
    const orig = Number(listing.original_price);

    return ok({
      id: listing.id,
      title: mat?.name_en ? `${mat.name_en} (Surplus Lot)` : "Surplus Material",
      materialKey: mat?.key || "unknown",
      materialNameEn: mat?.name_en || "Surplus Material",
      materialNameTa: mat?.name_ta || "கட்டுமான உதிரி பொருட்கள்",
      unit: listing.unit,
      qtyAvailable: Number(listing.qty_available),
      qtyTotal: Number(listing.qty_total),
      askPrice: ask,
      originalPrice: orig,
      savingsPercent: calculateSavingsPercent(orig, ask),
      condition: (listing.condition as ListingDetail["condition"]) || "good",
      pickupType: (listing.pickup_type as ListingDetail["pickupType"]) || "self",
      areaText: listing.area_text || "Salem",
      photos: Array.isArray(listing.photos) ? listing.photos : [],
      negotiable: Boolean(listing.negotiable),
      status: listing.status || "active",
      isDemo: Boolean(listing.is_demo),
      createdAt: listing.created_at || new Date().toISOString(),
      seller: {
        id: profile?.id || listing.seller_id,
        name: profile?.name || "Verified Builder",
        role: profile?.role || "Contractor",
        areaText: profile?.area_text || listing.area_text || "Salem",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error loading listing";
    return fail("INTERNAL", message);
  }
}
