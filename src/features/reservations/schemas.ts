import { z } from "zod";

export const reserveListingSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  qty: z.number().positive("Quantity must be greater than 0"),
});

export type ReserveListingInput = z.infer<typeof reserveListingSchema>;

export const respondReservationSchema = z.object({
  reservationId: z.string().min(1, "Reservation ID is required"),
  accept: z.boolean(),
});

export type RespondReservationInput = z.infer<typeof respondReservationSchema>;

export const completeReservationSchema = z.object({
  reservationId: z.string().min(1, "Reservation ID is required"),
});

export type CompleteReservationInput = z.infer<typeof completeReservationSchema>;
