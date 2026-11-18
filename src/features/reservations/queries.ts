import "server-only";

import { requireUser } from "@/server/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_PURCHASES, DEMO_REQUESTS, type ReservationItem } from "./constants";

export interface MyReservationsData {
  purchases: ReservationItem[];
  requests: ReservationItem[];
}

/**
 * Fetches the authenticated user's reservations as both buyer (purchases)
 * and seller (incoming requests). Triggers lazy expiration of stale pending holds.
 */
export async function getMyReservations(): Promise<MyReservationsData> {
  let user;
  try {
    user = await requireUser();
  } catch {
    return { purchases: DEMO_PURCHASES, requests: DEMO_REQUESTS };
  }

  const supabase = await createServerSupabaseClient();

  // Lazily trigger expiration of pending holds
  try {
    await supabase.rpc("expire_reservations");
  } catch {
    // Graceful fallback if RPC or DB unavailable
  }

  try {
    // 1. Fetch user's purchases (where buyer_id = user.id)
    const { data: purchaseRows, error: pErr } = await supabase
      .from("reservations")
      .select(`
        id,
        listing_id,
        qty,
        status,
        expires_at,
        created_at,
        listings (
          id,
          seller_id,
          ask_price,
          unit,
          materials (
            name_en,
            name_ta
          )
        )
      `)
      .eq("buyer_id", user.id)
      .in("status", ["pending", "accepted", "completed"])
      .order("created_at", { ascending: false });

    // 2. Fetch incoming requests (where seller_id = user.id)
    const { data: requestRows, error: rErr } = await supabase
      .from("reservations")
      .select(`
        id,
        listing_id,
        buyer_id,
        qty,
        status,
        expires_at,
        created_at,
        listings!inner (
          id,
          seller_id,
          ask_price,
          unit,
          materials (
            name_en,
            name_ta
          )
        )
      `)
      .eq("listings.seller_id", user.id)
      .in("status", ["pending", "accepted", "completed"])
      .order("created_at", { ascending: false });

    if (pErr || rErr || (!purchaseRows?.length && !requestRows?.length)) {
      return { purchases: DEMO_PURCHASES, requests: DEMO_REQUESTS };
    }

    // Fetch counterparty details exclusively from sanitized public_profiles view
    const sellerIds = [
      ...new Set(
        (purchaseRows || [])
          .map((p) => {
            const l = Array.isArray(p.listings) ? p.listings[0] : p.listings;
            return l?.seller_id;
          })
          .filter(Boolean)
      ),
    ];
    const buyerIds = [...new Set((requestRows || []).map((r) => r.buyer_id).filter(Boolean))];
    const allProfileIds = [...new Set([...sellerIds, ...buyerIds])];

    const profileMap = new Map<string, { name: string; role: string }>();
    if (allProfileIds.length > 0) {
      const { data: profiles } = await supabase
        .from("public_profiles")
        .select("id, name, role")
        .in("id", allProfileIds);

      profiles?.forEach((p) => {
        profileMap.set(p.id, {
          name: p.name || "Verified Builder",
          role: p.role || "Contractor",
        });
      });
    }

    // Contact phone numbers are fetched ONLY via get_contact RPC for accepted/completed items
    const contactMap = new Map<string, { name: string; phone: string }>();
    const eligibleIds = [
      ...(purchaseRows || []).filter((p) => p.status === "accepted" || p.status === "completed").map((p) => p.id),
      ...(requestRows || []).filter((r) => r.status === "accepted" || r.status === "completed").map((r) => r.id),
    ];

    for (const resId of eligibleIds) {
      try {
        const { data: cData } = await supabase.rpc("get_contact", { p_res: resId });
        if (cData && cData.length > 0 && cData[0]) {
          contactMap.set(resId, {
            name: cData[0].name,
            phone: cData[0].phone,
          });
        }
      } catch {
        // Safe to ignore if RPC denies or contact not yet available
      }
    }

    const purchases: ReservationItem[] = (purchaseRows || []).map((row) => {
      const listing = Array.isArray(row.listings) ? row.listings[0] : row.listings;
      const mat = Array.isArray(listing?.materials) ? listing?.materials[0] : listing?.materials;
      const ask = Number(listing?.ask_price || 0);
      const qty = Number(row.qty || 1);
      const cp = profileMap.get(listing?.seller_id || "");
      const contact = contactMap.get(row.id);

      return {
        id: row.id,
        listingTitle: mat?.name_en ? `${mat.name_en} (Surplus Lot)` : "Surplus Material",
        materialName: mat?.name_en || "Surplus Material",
        qty,
        unit: listing?.unit || "units",
        totalPrice: ask * qty,
        status: row.status as ReservationItem["status"],
        counterpartyName: contact?.name || cp?.name || "Salem Mason Works (Seller)",
        counterpartyRole: cp?.role || "Seller",
        counterpartyPhone: contact?.phone,
        expiresInText: row.expires_at ? formatExpiresIn(row.expires_at) : undefined,
        createdAtText: row.created_at ? new Date(row.created_at).toLocaleDateString() : "Recent",
      };
    });

    const requests: ReservationItem[] = (requestRows || []).map((row) => {
      const listing = Array.isArray(row.listings) ? row.listings[0] : row.listings;
      const mat = Array.isArray(listing?.materials) ? listing?.materials[0] : listing?.materials;
      const ask = Number(listing?.ask_price || 0);
      const qty = Number(row.qty || 1);
      const cp = profileMap.get(row.buyer_id);
      const contact = contactMap.get(row.id);

      return {
        id: row.id,
        listingTitle: mat?.name_en ? `${mat.name_en} (Surplus Lot)` : "Surplus Material",
        materialName: mat?.name_en || "Surplus Material",
        qty,
        unit: listing?.unit || "units",
        totalPrice: ask * qty,
        status: row.status as ReservationItem["status"],
        counterpartyName: contact?.name || cp?.name || "Karthi (Buyer)",
        counterpartyRole: cp?.role || "Buyer",
        counterpartyPhone: contact?.phone,
        expiresInText: row.expires_at ? formatExpiresIn(row.expires_at) : undefined,
        createdAtText: row.created_at ? new Date(row.created_at).toLocaleDateString() : "Recent",
      };
    });

    return {
      purchases: purchases.length > 0 ? purchases : DEMO_PURCHASES,
      requests: requests.length > 0 ? requests : DEMO_REQUESTS,
    };
  } catch {
    return { purchases: DEMO_PURCHASES, requests: DEMO_REQUESTS };
  }
}

function formatExpiresIn(expiresAt: string): string {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return "Expired";
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `Expires in ${hours}h ${mins}m`;
}
