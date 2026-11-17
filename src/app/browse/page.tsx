"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DEMO_LISTINGS, MATERIAL_FILTERS, DemoListing } from "@/features/listings/constants";

export default function BrowsePage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedRadius, setSelectedRadius] = useState<number>(10);
  const [activeMaterial, setActiveMaterial] = useState<string>("all");
  const [activeMarker, setActiveMarker] = useState<DemoListing | null>(DEMO_LISTINGS[0] ?? null);

  const filteredListings = DEMO_LISTINGS.filter((item) => {
    const matchesMaterial = activeMaterial === "all" || item.materialKey === activeMaterial;
    return matchesMaterial && item.distanceKm <= selectedRadius;
  });

  return (
    <div className="space-y-6">
      {/* Location Bar & List/Map Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <h1 className="text-xl font-extrabold text-[#FAFAFA]">Surplus Materials</h1>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Salem, TN • Within <span className="text-[#F59E0B] font-semibold">{selectedRadius} km</span> radius
          </p>
        </div>

        {/* Segmented List | Map Toggle Pill */}
        <div className="inline-flex items-center bg-[#141417] border border-[#27272A] rounded-lg p-0.5 self-start sm:self-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "list"
                ? "bg-[#F59E0B] text-[#09090B] font-bold shadow-xs"
                : "text-[#A1A1AA] hover:text-[#FAFAFA]"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "map"
                ? "bg-[#F59E0B] text-[#09090B] font-bold shadow-xs"
                : "text-[#A1A1AA] hover:text-[#FAFAFA]"
            }`}
          >
            Map
          </button>
        </div>
      </div>

      {/* Filter Row: Material Chips + Radius Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {MATERIAL_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveMaterial(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeMaterial === f.key
                  ? "bg-[#F59E0B] text-[#09090B] shadow-xs"
                  : "bg-[#141417] text-[#A1A1AA] border border-[#27272A] hover:border-[#3F3F46] hover:text-[#FAFAFA]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 self-start md:self-auto text-xs">
          <span className="text-[#A1A1AA] text-xs mr-1 hidden sm:inline">Radius:</span>
          {[5, 10, 25].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRadius(r)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                selectedRadius === r
                  ? "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40"
                  : "bg-[#141417] text-[#A1A1AA] border border-[#27272A] hover:text-[#FAFAFA]"
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* VIEW: LIST MODE */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((item) => (
            <Card
              key={item.id}
              hoverable
              className="flex flex-col justify-between p-4 bg-[#141417] border-[#27272A] space-y-3 group"
            >
              <div className="space-y-3">
                <div className="h-40 rounded-lg bg-[#09090B] border border-[#27272A] flex items-center justify-center relative overflow-hidden group-hover:border-[#3F3F46] transition-colors">
                  <span className="text-4xl">{item.photoUrl}</span>
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#10B981] text-[#09090B]">
                    {item.savingsPercent}% OFF
                  </span>
                  <div className="absolute top-2.5 right-2.5">
                    <Badge variant={item.condition === "damaged" ? "danger" : item.condition === "fair" ? "warning" : "success"}>
                      {item.condition}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#FAFAFA] group-hover:text-[#F59E0B] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[#A1A1AA] mt-1">
                    <span>Qty: <strong className="text-[#FAFAFA] tabular-nums">{item.qtyAvailable} {item.unit}</strong></span>
                    <span>{item.distanceKm} km away</span>
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] truncate mt-0.5">{item.locationText}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#27272A] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-extrabold text-[#F59E0B] tabular-nums">₹{item.askPrice}</span>
                    <span className="text-xs text-[#A1A1AA] line-through tabular-nums">₹{item.originalPrice}</span>
                  </div>
                  <span className="text-[10px] text-[#A1A1AA]">per {item.unit}</span>
                </div>
                <Link href={`/listing/${item.id}`}>
                  <Button size="sm">View & Reserve</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* VIEW: MAP MODE */}
      {viewMode === "map" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="hidden lg:block lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveMarker(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeMarker?.id === item.id ? "bg-[#1C1C21] border-[#F59E0B]" : "bg-[#141417] border-[#27272A]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#FAFAFA]">{item.title}</h4>
                    <span className="text-xs text-[#A1A1AA]">{item.qtyAvailable} {item.unit} • {item.distanceKm} km away</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#F59E0B]">₹{item.askPrice}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 relative h-[460px] lg:h-[600px] rounded-2xl bg-[#09090B] border border-[#27272A] overflow-hidden flex flex-col justify-between p-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/5 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#141417]/90 border border-[#27272A] text-[#FAFAFA]">
                Salem Center • {selectedRadius} km circle
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#10B981]/20 text-[#10B981]">
                {filteredListings.length} listings nearby
              </span>
            </div>

            <div className="relative z-10 my-auto flex flex-wrap items-center justify-around gap-6 py-8">
              {filteredListings.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMarker(m)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-transform shadow-lg ${
                    activeMarker?.id === m.id
                      ? "bg-[#F59E0B] text-[#09090B] scale-110"
                      : "bg-[#141417] text-[#F59E0B] border border-[#F59E0B]/50"
                  }`}
                >
                  ₹{m.askPrice}/{m.unit}
                </button>
              ))}
            </div>

            {activeMarker && (
              <div className="relative z-10 p-3.5 rounded-xl bg-[#141417]/95 border border-[#F59E0B]/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#09090B] border border-[#27272A] flex items-center justify-center text-xl">
                    {activeMarker.photoUrl}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#FAFAFA]">{activeMarker.title}</h4>
                    <p className="text-[11px] text-[#A1A1AA]">
                      {activeMarker.qtyAvailable} {activeMarker.unit} • <span className="text-[#10B981] font-semibold">{activeMarker.savingsPercent}% OFF</span> • {activeMarker.distanceKm} km
                    </p>
                  </div>
                </div>
                <Link href={`/listing/${activeMarker.id}`}>
                  <Button size="sm">View</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
