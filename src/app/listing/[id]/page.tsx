import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getListingById } from "@/features/listings/queries";
import { ListingDetailView } from "@/features/listings/components/ListingDetailView";

export function generateStaticParams() {
  return [{ id: "l-1" }, { id: "l-2" }, { id: "l-demo-1" }];
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getListingById(id);

  if (!result.ok) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <span className="text-5xl">📦</span>
        <h1 className="text-xl font-bold text-[#FAFAFA]">Listing Not Found</h1>
        <p className="text-xs text-[#A1A1AA]">
          This surplus material lot has either been fully claimed, removed by the seller, or the link is invalid.
        </p>
        <div className="pt-2">
          <Link href="/browse">
            <Button size="sm">Browse Other Surplus</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <ListingDetailView listing={result.data} />;
}
