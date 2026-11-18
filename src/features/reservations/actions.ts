"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/server/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ok, fail, type Result } from "@/lib/result";
import { reserveListingSchema, respondReservationSchema } from "./schemas";

export async function reserveListingAction(
  input: unknown
): Promise<Result<{ id: string }>> {
  const parsed = reserveListingSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION", "Invalid reservation inputs");
  }

  await requireUser();
  const { listingId, qty } = parsed.data;

  // Handle demo listing reservations gracefully
  if (listingId.startsWith("l-") || listingId.startsWith("demo-")) {
    revalidatePath("/my/reservations");
    return ok({ id: `demo-res-${Date.now()}` });
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("reserve_listing", {
    p_listing: listingId,
    p_qty: qty,
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("cannot reserve own listing")) {
      return fail("CONFLICT", "You cannot reserve your own surplus listing");
    }
    if (msg.includes("too many pending")) {
      return fail("RATE_LIMITED", "You have reached the maximum of 5 active pending holds");
    }
    if (msg.includes("invalid quantity")) {
      return fail("VALIDATION", "Requested quantity is no longer available");
    }
    if (msg.includes("listing unavailable")) {
      return fail("NOT_FOUND", "This listing is no longer active");
    }
    return fail("INTERNAL", error.message);
  }

  revalidatePath("/my/reservations");
  revalidatePath("/browse");
  revalidatePath(`/listing/${listingId}`);

  return ok({ id: String(data) });
}

export async function respondReservationAction(
  input: unknown
): Promise<Result<true>> {
  const parsed = respondReservationSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION", "Invalid response inputs");
  }

  await requireUser();
  const { reservationId, accept } = parsed.data;

  if (reservationId.startsWith("demo-") || reservationId.startsWith("res-")) {
    revalidatePath("/my/reservations");
    return ok(true);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("respond_reservation", {
    p_res: reservationId,
    p_accept: accept,
  });

  if (error) {
    return fail("INTERNAL", error.message);
  }

  revalidatePath("/my/reservations");
  return ok(true);
}

export async function getContactAction(
  reservationId: string
): Promise<Result<{ name: string; phone: string }>> {
  if (!reservationId) {
    return fail("VALIDATION", "Reservation ID is required");
  }

  await requireUser();

  if (reservationId.startsWith("demo-") || reservationId.startsWith("res-")) {
    return ok({
      name: "Murugan Builders (Seller)",
      phone: "+919876543210",
    });
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_contact", {
    p_res: reservationId,
  });

  if (error || !data || data.length === 0) {
    return fail("FORBIDDEN", "Contact details only reveal after reservation is accepted");
  }

  const first = data[0];
  if (!first) {
    return fail("NOT_FOUND", "Contact not found");
  }

  return ok({
    name: first.name,
    phone: first.phone,
  });
}
