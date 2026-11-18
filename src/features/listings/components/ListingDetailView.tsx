"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ListingDetail } from "../types";

export function ListingDetailView({ listing }: { listing: ListingDetail }) {
  const [reserveQty, setReserveQty] = useState<number>(
    Math.min(10, listing.qtyAvailable)
  );
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [reservedNotice, setReservedNotice] = useState<boolean>(false);

  const totalCost = reserveQty * listing.askPrice;
  const photos = listing.photos.length > 0 ? listing.photos : ["🧱"];
  const currentPhoto = photos[activePhotoIdx] ?? photos[0] ?? "🧱";
  const isImageSrc = currentPhoto.startsWith("http") || currentPhoto.startsWith("/");

  const conditionVariant =
    listing.condition === "damaged"
      ? "danger"
      : listing.condition === "fair"
      ? "warning"
      : "success";

  const handleStep = (delta: number) => {
    setReserveQty((prev) => Math.max(1, Math.min(listing.qtyAvailable, prev + delta)));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
        <Link href="/browse" className="hover:text-[#FAFAFA] flex items-center gap-1 transition-colors">
          &larr; Back to Listings
        </Link>
        <span>/</span>
        <span className="text-[#FAFAFA] truncate font-medium">{listing.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Gallery + Specs + Safety */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gallery Container */}
          <div className="relative h-72 sm:h-96 rounded-2xl bg-[#141417] border border-[#27272A] overflow-hidden flex items-center justify-center">
            {isImageSrc ? (
              <Image
                src={currentPhoto}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            ) : (
              <span className="text-6xl select-none">{currentPhoto}</span>
            )}

            {/* Counter pill */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-[#09090B]/80 backdrop-blur-md text-[#FAFAFA] border border-[#27272A] z-10">
              {activePhotoIdx + 1} / {photos.length}
            </div>

            {/* Thumbnails */}
            {photos.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-2 z-10">
                {photos.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-11 h-11 rounded-lg bg-[#09090B] border overflow-hidden relative transition-all ${
                      activePhotoIdx === idx
                        ? "border-[#F59E0B] ring-2 ring-[#F59E0B]/50"
                        : "border-[#27272A] opacity-70 hover:opacity-100"
                    }`}
                  >
                    {p.startsWith("http") ? (
                      <Image src={p} alt="thumb" fill className="object-cover" />
                    ) : (
                      <span className="text-sm flex items-center justify-center h-full">{p}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specs Details */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {listing.savingsPercent > 0 && <Badge variant="accent">Save {listing.savingsPercent}%</Badge>}
              <Badge variant={conditionVariant}>{listing.condition} Condition</Badge>
              <span className="text-xs text-[#A1A1AA]">• 📍 {listing.areaText}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FAFAFA] leading-tight">
              {listing.title}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#F59E0B] tabular-nums">
                ₹{listing.askPrice}
              </span>
              {listing.originalPrice > listing.askPrice && (
                <span className="text-base text-[#A1A1AA] line-through tabular-nums">
                  ₹{listing.originalPrice}
                </span>
              )}
              <span className="text-xs text-[#A1A1AA]">per {listing.unit}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-[#141417] border border-[#27272A]">
                <span className="text-[10px] uppercase font-bold text-[#A1A1AA]">Available</span>
                <p className="text-sm font-bold text-[#FAFAFA] tabular-nums mt-0.5">
                  {listing.qtyAvailable} {listing.unit}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#141417] border border-[#27272A]">
                <span className="text-[10px] uppercase font-bold text-[#A1A1AA]">Fulfillment</span>
                <p className="text-sm font-bold text-[#FAFAFA] capitalize mt-0.5">
                  {listing.pickupType === "self" ? "Self Pickup" : "Delivered"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#141417] border border-[#27272A]">
                <span className="text-[10px] uppercase font-bold text-[#A1A1AA]">Price Terms</span>
                <p className="text-sm font-bold text-[#FAFAFA] mt-0.5">
                  {listing.negotiable ? "Negotiable" : "Fixed Price"}
                </p>
              </div>
            </div>
          </div>

          {/* Safety Notice Box */}
          <div className="p-4 rounded-xl bg-[#09090B] border border-[#27272A] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FAFAFA]">
              <span className="text-[#F59E0B]">🛡️</span>
              <span>SiteSwap Surplus Protection</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Inspect materials on site before paying. Direct seller phone contact reveals automatically
              after the seller accepts your reservation.
            </p>
          </div>
        </div>

        {/* Right Column (5 cols): Sticky Reservation Card & Seller */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
          <Card className="p-6 bg-[#141417] border-[#27272A] space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-[#FAFAFA]">Reserve Materials</h3>

            {reservedNotice && (
              <div className="p-3 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#10B981]">
                ✓ Reservation flow initialized. S12 reserve RPC will finalize and notify the seller.
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#A1A1AA] flex justify-between">
                <span>Select Quantity ({listing.unit})</span>
                <span className="text-[#F59E0B]">Max: {listing.qtyAvailable}</span>
              </label>
              <div className="flex items-center border border-[#27272A] rounded-lg bg-[#09090B] p-1">
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  disabled={reserveQty <= 1}
                  className="w-10 h-10 rounded-md bg-[#141417] text-[#FAFAFA] text-lg font-bold hover:bg-[#27272A] transition-colors disabled:opacity-30"
                >
                  -
                </button>
                <div className="flex-1 text-center font-extrabold text-[#FAFAFA] tabular-nums text-base">
                  {reserveQty} <span className="text-xs font-normal text-[#A1A1AA]">{listing.unit}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  disabled={reserveQty >= listing.qtyAvailable}
                  className="w-10 h-10 rounded-md bg-[#141417] text-[#FAFAFA] text-lg font-bold hover:bg-[#27272A] transition-colors disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#09090B] border border-[#27272A] space-y-2">
              <div className="flex justify-between text-xs text-[#A1A1AA]">
                <span>Rate per {listing.unit}</span>
                <span className="tabular-nums text-[#FAFAFA]">₹{listing.askPrice}</span>
              </div>
              <div className="flex justify-between text-xs text-[#A1A1AA]">
                <span>Quantity</span>
                <span className="tabular-nums text-[#FAFAFA]">{reserveQty} {listing.unit}</span>
              </div>
              <div className="pt-2 border-t border-[#27272A] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#FAFAFA]">Total Pay on Pickup</span>
                <span className="text-xl font-extrabold text-[#F59E0B] tabular-nums">
                  ₹{totalCost.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full text-sm font-bold"
              disabled={listing.qtyAvailable <= 0}
              onClick={() => setReservedNotice(true)}
            >
              {listing.qtyAvailable > 0
                ? `Reserve ${reserveQty} ${listing.unit} • ₹${totalCost.toLocaleString("en-IN")}`
                : "Sold Out"}
            </Button>
          </Card>

          {/* Seller Profile Card (Phone NEVER exposed here) */}
          <Card className="p-4 bg-[#141417] border-[#27272A] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-[#09090B] font-extrabold text-sm flex items-center justify-center shrink-0">
                {listing.seller.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#FAFAFA]">{listing.seller.name}</h4>
                <p className="text-[11px] text-[#A1A1AA]">
                  {listing.seller.role} • 📍 {listing.seller.areaText}
                </p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#27272A] text-[#10B981] font-medium shrink-0">
              Verified
            </span>
          </Card>
        </div>
      </div>
    </div>
  );
}
