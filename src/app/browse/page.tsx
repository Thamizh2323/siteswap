"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MATERIAL_FILTERS } from "@/features/listings/constants";
import { ListingCard } from "@/features/listings/components/ListingCard";
import { BrowseMapView } from "@/features/listings/components/BrowseMapView";
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
        <BrowseMapView
          center={coords}
          radiusKm={radius}
          listings={listings}
          selectedListing={activeMarker}
          onSelectListing={setActiveMarker}
        />
      )}
    </div>
  );
}
