import { z } from "zod";

export const LISTING_CONDITIONS = ["unused", "good", "fair", "damaged"] as const;
export type ListingCondition = (typeof LISTING_CONDITIONS)[number];

export const PICKUP_TYPES = ["self", "seller_delivers"] as const;
export type PickupType = (typeof PICKUP_TYPES)[number];

export const createListingSchema = z.object({
  materialKey: z.string().min(1, "Material type is required"),
  qty: z.number().positive("Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  condition: z.enum(LISTING_CONDITIONS),
  originalPrice: z.number().positive("Original price must be greater than 0"),
  askPrice: z.number().positive("Ask price must be greater than 0"),
  negotiable: z.boolean().default(false),
  photos: z.array(z.string()).default([]),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  areaText: z.string().min(1, "Pickup area text is required").max(200),
  pickupType: z.enum(PICKUP_TYPES).default("self"),
  qtyAiEstimate: z.number().positive().optional(),
  aiConfidence: z.number().min(0).max(1).optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
