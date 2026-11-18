import { describe, it, expect, vi } from "vitest";
import {
  reserveListingSchema,
  respondReservationSchema,
  completeReservationSchema,
} from "../schemas";
import {
  reserveListingAction,
  respondReservationAction,
  completeReservationAction,
  getContactAction,
} from "../actions";

vi.mock("@/server/auth", () => ({
  requireUser: vi.fn().mockResolvedValue({
    id: "usr-mock-123",
    email: "builder@siteswap.local",
  }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Reservation Schemas", () => {
  it("validates reserveListingSchema with positive quantity", () => {
    const valid = reserveListingSchema.safeParse({
      listingId: "listing-abc-123",
      qty: 25,
    });
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.qty).toBe(25);
    }
  });

  it("rejects non-positive quantities in reserveListingSchema", () => {
    const zero = reserveListingSchema.safeParse({
      listingId: "listing-abc-123",
      qty: 0,
    });
    expect(zero.success).toBe(false);

    const negative = reserveListingSchema.safeParse({
      listingId: "listing-abc-123",
      qty: -5,
    });
    expect(negative.success).toBe(false);
  });

  it("validates respondReservationSchema with boolean decisions", () => {
    const accept = respondReservationSchema.safeParse({
      reservationId: "res-123",
      accept: true,
    });
    expect(accept.success).toBe(true);

    const decline = respondReservationSchema.safeParse({
      reservationId: "res-123",
      accept: false,
    });
    expect(decline.success).toBe(true);
  });

  it("rejects missing reservationId in respondReservationSchema", () => {
    const missing = respondReservationSchema.safeParse({
      reservationId: "",
      accept: true,
    });
    expect(missing.success).toBe(false);
  });

  it("validates completeReservationSchema with valid reservationId", () => {
    const valid = completeReservationSchema.safeParse({
      reservationId: "res-xyz-789",
    });
    expect(valid.success).toBe(true);
  });

  it("rejects empty reservationId in completeReservationSchema", () => {
    const empty = completeReservationSchema.safeParse({
      reservationId: "",
    });
    expect(empty.success).toBe(false);
  });
});

describe("Reservation Server Actions", () => {
  it("processes demo reservation successfully via reserveListingAction", async () => {
    const result = await reserveListingAction({
      listingId: "l-demo-1",
      qty: 10,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.id).toMatch(/^demo-res-/);
    }
  });

  it("returns validation error on malformed reserveListingAction input", async () => {
    const result = await reserveListingAction({
      listingId: "",
      qty: -1,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION");
    }
  });

  it("processes demo response via respondReservationAction", async () => {
    const result = await respondReservationAction({
      reservationId: "demo-res-1",
      accept: true,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toBe(true);
    }
  });

  it("processes demo completion and calculates impact metrics via completeReservationAction", async () => {
    const result = await completeReservationAction({
      reservationId: "demo-res-1",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.kgDiverted).toBeGreaterThan(0);
      expect(result.data.co2SavedKg).toBeGreaterThan(0);
      expect(result.data.moneySaved).toBeGreaterThan(0);
    }
  });

  it("returns validation error on malformed completeReservationAction input", async () => {
    const result = await completeReservationAction({
      reservationId: "",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION");
    }
  });

  it("returns contact details for demo reservation via getContactAction", async () => {
    const result = await getContactAction("demo-res-1");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toContain("Murugan Builders");
      expect(result.data.phone).toBe("+919876543210");
    }
  });

  it("rejects empty reservation ID in getContactAction", async () => {
    const result = await getContactAction("");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION");
    }
  });
});
