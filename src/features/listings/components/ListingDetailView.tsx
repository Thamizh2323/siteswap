"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ListingProps {
  id: string;
  title: string;
  unit: string;
  qtyAvailable: number;
  askPrice: number;
  originalPrice: number;
  savingsPercent: number;
  condition: string;
  pickupType: string;
  distanceKm: number;
  areaText: string;
  sellerName: string;
  sellerRole: string;
  sellerArea: string;
  photosCount: number;
}

export function ListingDetailView({ listing }: { listing: ListingProps }) {
  const [reserveQty, setReserveQty] = useState<number>(10);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [reservedSuccess, setReservedSuccess] = useState<boolean>(false);

  const totalCost = reserveQty * listing.askPrice;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
        <Link href="/browse" className="hover:text-[#FAFAFA] flex items-center gap-1">
          &larr; Back to Listings
        </Link>
        <span>/</span>
        <span className="text-[#FAFAFA] truncate">{listing.title}</span>
      </div>

      {/* Main Grid: Left 7 cols (Gallery + Specs + Safety), Right 5 cols (Sticky Reserve Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Photo Gallery Viewer */}
          <div className="relative h-72 sm:h-96 rounded-2xl bg-[#141417] border border-[#27272A] overflow-hidden flex items-center justify-center">
            <span className="text-6xl">📦</span>

            {/* Photo Counter Pill */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-[#09090B]/80 backdrop-blur-md text-[#FAFAFA] border border-[#27272A]">
              {activePhotoIdx + 1} / {listing.photosCount}
            </div>

            {/* Gallery Thumbnail Selector */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`w-10 h-10 rounded-lg bg-[#09090B] border flex items-center justify-center text-xs transition-all ${
                    activePhotoIdx === idx
                      ? "border-[#F59E0B] ring-1 ring-amber-400"
                      : "border-[#27272A] opacity-70 hover:opacity-100"
                  }`}
                >
                  📦
                </button>
              ))}
            </div>
          </div>

          {/* Specs & Pricing Details */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">Save {listing.savingsPercent}%</Badge>
              <Badge variant="success">{listing.condition} Condition</Badge>
              <span className="text-xs text-[#A1A1AA]">• {listing.distanceKm} km away</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FAFAFA] leading-tight">
              {listing.title}
            </h1>

            {/* Pricing Row */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#F59E0B] tabular-nums">
                ₹{listing.askPrice}
              </span>
              <span className="text-base text-[#A1A1AA] line-through tabular-nums">
                ₹{listing.originalPrice}
              </span>
              <span className="text-xs text-[#A1A1AA]">per {listing.unit}</span>
            </div>

            {/* Meta Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A]">
                <span className="text-[10px] text-[#A1A1AA] uppercase font-semibold">Available</span>
                <p className="text-sm font-bold text-[#FAFAFA] tabular-nums">
                  {listing.qtyAvailable} {listing.unit}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A]">
                <span className="text-[10px] text-[#A1A1AA] uppercase font-semibold">Pickup Mode</span>
                <p className="text-sm font-bold text-[#FAFAFA]">{listing.pickupType}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#A1A1AA] uppercase font-semibold">Location Area</span>
                <p className="text-sm font-bold text-[#FAFAFA] truncate">{listing.areaText}</p>
              </div>
            </div>
          </div>

          {/* Seller Card (Public Profile - no phone exposed) */}
          <Card className="flex items-center justify-between p-4 bg-[#141417]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center font-bold text-lg">
                M
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#FAFAFA]">{listing.sellerName}</h4>
                <p className="text-xs text-[#A1A1AA]">
                  {listing.sellerRole} • {listing.sellerArea}
                </p>
              </div>
            </div>
            <Badge variant="outline">Verified Seller</Badge>
          </Card>

          {/* Safety Notice Box */}
          <div className="p-4 rounded-xl bg-[#141417] border border-[#27272A] flex items-start gap-3">
            <span className="text-xl">🛡️</span>
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-[#FAFAFA]">Safe Inspection Guarantee</h5>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Inspect materials on site before paying. Seller contact phone and WhatsApp reveal immediately after the seller accepts your reservation hold.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Reservation Action Card (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <Card className="p-6 bg-[#141417] border-[#27272A] space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <span className="text-sm font-bold text-[#FAFAFA]">Reserve Quantity</span>
              <span className="text-xs text-[#10B981] font-semibold">24-Hour Hold</span>
            </div>

            {/* Stepper Control */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#A1A1AA]">
                How many {listing.unit} do you need?
              </label>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#09090B] border border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setReserveQty(Math.max(1, reserveQty - 1))}
                  className="w-10 h-10 rounded-lg bg-[#141417] hover:bg-[#1C1C21] text-[#FAFAFA] font-bold text-lg flex items-center justify-center transition-colors cursor-pointer"
                >
                  -
                </button>
                <div className="text-center">
                  <span className="text-xl font-extrabold text-[#FAFAFA] tabular-nums">
                    {reserveQty}
                  </span>
                  <span className="text-xs text-[#A1A1AA] ml-1">{listing.unit}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReserveQty(Math.min(listing.qtyAvailable, reserveQty + 1))}
                  className="w-10 h-10 rounded-lg bg-[#141417] hover:bg-[#1C1C21] text-[#FAFAFA] font-bold text-lg flex items-center justify-center transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
              <p className="text-[11px] text-[#A1A1AA] text-right">
                Max available: {listing.qtyAvailable} {listing.unit}
              </p>
            </div>

            {/* Cost Breakdown */}
            <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#27272A] space-y-2 text-xs">
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Rate per {listing.unit}</span>
                <span className="text-[#FAFAFA] tabular-nums">₹{listing.askPrice}</span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Quantity</span>
                <span className="text-[#FAFAFA] tabular-nums">{reserveQty} {listing.unit}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#27272A] text-sm font-bold text-[#FAFAFA]">
                <span>Total Value</span>
                <span className="text-[#F59E0B] text-base tabular-nums">
                  ₹{totalCost.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Reservation Button or Success State */}
            {reservedSuccess ? (
              <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-center space-y-2">
                <span className="text-sm font-bold text-[#10B981]">🎉 Reservation Requested!</span>
                <p className="text-xs text-[#A1A1AA]">
                  The seller has been alerted. Check your{" "}
                  <Link href="/my/reservations" className="text-[#F59E0B] underline font-semibold">
                    Reservations Inbox
                  </Link>.
                </p>
              </div>
            ) : (
              <Button
                size="lg"
                className="w-full text-base py-3.5"
                onClick={() => setReservedSuccess(true)}
              >
                Reserve {reserveQty} Bags • ₹{totalCost.toLocaleString("en-IN")}
              </Button>
            )}

            <p className="text-[11px] text-[#A1A1AA] text-center leading-relaxed">
              No immediate online payment required. Pay upon physical inspection and collection.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
