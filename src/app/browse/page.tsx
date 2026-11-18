"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MATERIAL_FILTERS } from "@/features/listings/constants";
import { ListingCard } from "@/features/listings/components/ListingCard";
import { fetchNearbyListingsAction } from "@/features/listings/actions";
import type { NearbyListing } from "@/features/listings/types";

export default function BrowsePage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [radius, setRadius] = useState<number>(10);
  const [material, setMaterial] = useState<string>("all");
  const [coords] = useState({ lat: 11.6643, lng: 78.146, area: "Salem, TN" });
  const [listings, setListings] = useState<NearbyListing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [activeMarker, setActiveMarker] = useState<NearbyListing | null>(null);

  useEffect(() => {
    let ignore = false;

    fetchNearbyListingsAction({
      lat: coords.lat,
      lng: coords.lng,
      radiusKm: radius,
      materialKey: material,
      limit: 20,
      offset: 0,
    }).then((res) => {
      if (!ignore && res.ok) {
        setListings(res.data);
        setActiveMarker(res.data[0] ?? null);
        setHasMore(res.data.length === 20);
        setIsLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [radius, material, coords.lat, coords.lng]);

  const handleRadiusChange = (newRadius: number) => {
    setIsLoading(true);
    setRadius(newRadius);
  };

  const handleMaterialChange = (newMaterial: string) => {
    setIsLoading(true);
    setMaterial(newMaterial);
  };

  const handleLoadMore = async () => {
    const res = await fetchNearbyListingsAction({
      lat: coords.lat,
      lng: coords.lng,
      radiusKm: radius,
      materialKey: material,
      limit: 20,
      offset: listings.length,
    });
    if (res.ok) {
      setListings((prev) => [...prev, ...res.data]);
      setHasMore(res.data.length === 20);
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Bar & Segmented Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <h1 className="text-xl font-extrabold text-[#FAFAFA]">Surplus Materials</h1>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            {coords.area} • Within <span className="text-[#F59E0B] font-semibold">{radius} km</span> radius
          </p>
        </div>

        <div className="inline-flex items-center bg-[#141417] border border-[#27272A] rounded-lg p-0.5 self-start sm:self-auto">
          {(["list", "map"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                viewMode === mode
                  ? "bg-[#F59E0B] text-[#09090B] font-bold shadow-xs"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Chips & Radius */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {MATERIAL_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => handleMaterialChange(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                material === f.key
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
              onClick={() => handleRadiusChange(r)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                radius === r
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
        <div className="space-y-6">
          {isLoading && listings.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 rounded-xl bg-[#141417] border border-[#27272A] animate-pulse p-4 flex flex-col justify-between">
                  <div className="h-32 rounded bg-[#27272A]" />
                  <div className="h-4 w-3/4 rounded bg-[#27272A]" />
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-[#141417] border border-[#27272A] space-y-3">
              <span className="text-4xl">🔍</span>
              <h3 className="text-base font-bold text-[#FAFAFA]">No surplus materials found</h3>
              <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
                No active listings match within {radius} km. Try expanding your search radius or clearing material filters.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleRadiusChange(25)}>Expand to 25 km</Button>
                <Button size="sm" onClick={() => handleMaterialChange("all")}>All Materials</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {hasMore && !isLoading && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={handleLoadMore}>Load More Surplus</Button>
            </div>
          )}
        </div>
      )}

      {/* VIEW: MAP MODE */}
      {viewMode === "map" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="hidden lg:block lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {listings.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveMarker(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeMarker?.id === item.id ? "bg-[#1C1C21] border-[#F59E0B]" : "bg-[#141417] border-[#27272A]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#FAFAFA]">{item.materialNameEn}</h4>
                    <span className="text-xs text-[#A1A1AA]">{item.qtyAvailable} {item.unit} • {item.distanceKm} km away</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#F59E0B]">₹{item.askPrice}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 relative h-[460px] lg:h-[600px] rounded-2xl bg-[#09090B] border border-[#27272A] overflow-hidden flex flex-col justify-between p-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/5 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#141417]/90 border border-[#27272A] text-[#FAFAFA]">
                Salem Center • {radius} km circle
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#10B981]/20 text-[#10B981]">
                {listings.length} listings nearby
              </span>
            </div>

            <div className="relative z-10 my-auto flex flex-wrap items-center justify-around gap-4 py-8">
              {listings.slice(0, 6).map((m) => (
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
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#FAFAFA]">{activeMarker.materialNameEn}</h4>
                  <p className="text-[11px] text-[#A1A1AA]">
                    {activeMarker.qtyAvailable} {activeMarker.unit} • <span className="text-[#10B981] font-semibold">{activeMarker.savingsPercent}% OFF</span> • {activeMarker.distanceKm} km away
                  </p>
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
