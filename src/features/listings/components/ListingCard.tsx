"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { NearbyListing } from "../types";

interface ListingCardProps {
  item: NearbyListing;
}

export function ListingCard({ item }: ListingCardProps) {
  const primaryPhoto = item.photos[0];
  const isImageSrc = primaryPhoto && (primaryPhoto.startsWith("http") || primaryPhoto.startsWith("/"));

  const conditionVariant =
    item.condition === "damaged"
      ? "danger"
      : item.condition === "fair"
      ? "warning"
      : "success";

  return (
    <Card
      hoverable
      className="flex flex-col justify-between p-4 bg-[#141417] border-[#27272A] space-y-3 group"
    >
      <div className="space-y-3">
        {/* Media Preview Box */}
        <div className="h-44 rounded-lg bg-[#09090B] border border-[#27272A] flex items-center justify-center relative overflow-hidden group-hover:border-[#3F3F46] transition-colors">
          {isImageSrc ? (
            <Image
              src={primaryPhoto}
              alt={item.materialNameEn}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <span className="text-4xl select-none">{primaryPhoto || "🧱"}</span>
          )}

          {item.savingsPercent > 0 && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#10B981] text-[#09090B] shadow-sm z-10">
              {item.savingsPercent}% OFF
            </span>
          )}

          <div className="absolute top-2.5 right-2.5 z-10">
            <Badge variant={conditionVariant}>{item.condition}</Badge>
          </div>

          {item.isDemo && (
            <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#09090B]/80 text-[#F59E0B] border border-[#F59E0B]/30 z-10">
              Demo Surplus
            </span>
          )}
        </div>

        {/* Specs & Location */}
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#FAFAFA] group-hover:text-[#F59E0B] transition-colors line-clamp-1">
            {item.materialNameEn}
          </h3>
          <div className="flex items-center justify-between text-xs text-[#A1A1AA] mt-1">
            <span>
              Qty: <strong className="text-[#FAFAFA] tabular-nums">{item.qtyAvailable} {item.unit}</strong>
            </span>
            <span className="tabular-nums font-medium text-[#FAFAFA]">{item.distanceKm} km away</span>
          </div>
          <div className="text-[11px] text-[#A1A1AA] truncate mt-0.5">
            📍 {item.areaText}
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="pt-3 border-t border-[#27272A] flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-[#F59E0B] tabular-nums">
              ₹{item.askPrice}
            </span>
            {item.originalPrice > item.askPrice && (
              <span className="text-xs text-[#A1A1AA] line-through tabular-nums">
                ₹{item.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#A1A1AA]">per {item.unit}</span>
        </div>
        <Link href={`/listing/${item.id}`}>
          <Button size="sm">View & Reserve</Button>
        </Link>
      </div>
    </Card>
  );
}
