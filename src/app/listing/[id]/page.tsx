import React from "react";
import { ListingDetailView } from "@/features/listings/components/ListingDetailView";

export function generateStaticParams() {
  return [{ id: "l-1" }, { id: "l-2" }, { id: "l-demo-1" }];
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const listingId = resolvedParams.id;

  // Mock server listing data (will connect to DB query in S11)
  const listing = {
    id: listingId,
    title: "UltraTech Cement Bags (Surplus Lot)",
    unit: "bags",
    qtyAvailable: 18,
    askPrice: 290,
    originalPrice: 390,
    savingsPercent: 25,
    condition: "Good",
    pickupType: "Self Pickup",
    distanceKm: 1.8,
    areaText: "Fairlands, Salem",
    sellerName: "Murugan Builders",
    sellerRole: "Contractor",
    sellerArea: "Salem North",
    photosCount: 3,
  };

  return <ListingDetailView listing={listing} />;
}
