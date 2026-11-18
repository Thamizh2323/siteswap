import React, { Suspense } from "react";
import { requireUser } from "@/server/auth";
import { getMyReservations } from "@/features/reservations/queries";
import { ReservationsInboxView } from "@/features/reservations/components/ReservationsInboxView";

export const metadata = {
  title: "Reservations Inbox | SiteSwap",
  description: "Manage material holds, contact counterparty contractors, and confirm handovers.",
};

async function ReservationsContent() {
  await requireUser();
  const { purchases, requests } = await getMyReservations();

  return (
    <ReservationsInboxView
      initialPurchases={purchases}
      initialRequests={requests}
    />
  );
}

export default function ReservationsInboxPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-8 w-48 bg-[#141417] rounded-lg border border-[#27272A]" />
          <div className="h-10 w-64 bg-[#141417] rounded-lg border border-[#27272A]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-44 bg-[#141417] rounded-xl border border-[#27272A]" />
            <div className="h-44 bg-[#141417] rounded-xl border border-[#27272A]" />
          </div>
        </div>
      }
    >
      <ReservationsContent />
    </Suspense>
  );
}
