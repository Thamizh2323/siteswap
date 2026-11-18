"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { NearbyListing } from "../types";
import "leaflet/dist/leaflet.css";

interface BrowseMapViewProps {
  center: { lat: number; lng: number; area: string };
  radiusKm: number;
  listings: NearbyListing[];
  selectedListing: NearbyListing | null;
  onSelectListing: (listing: NearbyListing | null) => void;
}

export function BrowseMapView({
  center,
  radiusKm,
  listings,
  selectedListing,
  onSelectListing,
}: BrowseMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize map and tilelayer once
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;
      const L = await import("leaflet");

      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      // Translucent amber radius circle
      const circle = L.circle([center.lat, center.lng], {
        radius: radiusKm * 1000,
        color: "#F59E0B",
        fillColor: "#F59E0B",
        fillOpacity: 0.08,
        weight: 1.5,
      }).addTo(map);

      mapInstanceRef.current = map;
      circleRef.current = circle;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center.lat, center.lng, radiusKm]);

  // Update radius circle and view when radius or center changes
  useEffect(() => {
    if (circleRef.current && mapInstanceRef.current) {
      circleRef.current.setRadius(radiusKm * 1000);
      circleRef.current.setLatLng([center.lat, center.lng]);
    }
  }, [radiusKm, center.lat, center.lng]);

  // Render or update custom amber price pill markers
  useEffect(() => {
    let isMounted = true;

    async function updateMarkers() {
      if (!mapInstanceRef.current) return;
      const L = await import("leaflet");
      if (!isMounted || !mapInstanceRef.current) return;

      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();

      listings.forEach((item) => {
        const itemLat = item.lat ?? center.lat;
        const itemLng = item.lng ?? center.lng;
        const isSelected = selectedListing?.id === item.id;

        const pillStyle = `background: ${isSelected ? "#F59E0B" : "#141417"}; color: ${isSelected ? "#09090B" : "#F59E0B"}; border: 1px solid ${isSelected ? "#D97706" : "rgba(245,158,11,0.4)"}; padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: 800; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.5); cursor: pointer; transform: ${isSelected ? "scale(1.15)" : "scale(1)"};`;
        const pillIcon = L.divIcon({
          className: "custom-price-pill",
          html: `<div style="${pillStyle}">₹${item.askPrice}/${item.unit}</div>`,
          iconSize: [60, 24],
          iconAnchor: [30, 12],
        });

        const marker = L.marker([itemLat, itemLng], { icon: pillIcon }).addTo(map);

        marker.on("click", () => {
          onSelectListing(item);
          map.panTo([itemLat, itemLng], { animate: true });
        });

        markersRef.current.set(item.id, marker);
      });
    }

    updateMarkers();

    return () => {
      isMounted = false;
    };
  }, [listings, selectedListing, center.lat, center.lng, onSelectListing]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Desktop Left Scrollable Feed (5 cols) */}
      <div className="hidden lg:block lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {listings.map((item) => {
          const isSelected = selectedListing?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => {
                onSelectListing(item);
                if (mapInstanceRef.current && item.lat && item.lng) {
                  mapInstanceRef.current.panTo([item.lat, item.lng], { animate: true });
                }
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#1C1C21] border-[#F59E0B] shadow-md"
                  : "bg-[#141417] border-[#27272A] hover:border-[#3F3F46]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-[#FAFAFA]">{item.materialNameEn}</h4>
                  <span className="text-xs text-[#A1A1AA]">
                    {item.qtyAvailable} {item.unit} • {item.distanceKm} km away
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#F59E0B]">₹{item.askPrice}</span>
                  {item.savingsPercent > 0 && (
                    <div className="text-[10px] text-[#10B981] font-bold">
                      {item.savingsPercent}% OFF
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Map (7 cols on desktop, full-width on mobile) */}
      <div className="lg:col-span-7 relative h-[480px] lg:h-[600px] rounded-2xl bg-[#09090B] border border-[#27272A] overflow-hidden flex flex-col justify-between">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Top Info Pill */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#141417]/90 border border-[#27272A] text-[#FAFAFA] backdrop-blur-sm pointer-events-auto shadow-md">
            📍 {center.area} • {radiusKm} km radius
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 backdrop-blur-sm pointer-events-auto shadow-md">
            {listings.length} nearby
          </span>
        </div>

        {/* Floating Bottom Preview Mini-Card */}
        {selectedListing && (
          <div className="absolute bottom-3 left-3 right-3 z-10 p-3.5 rounded-xl bg-[#141417]/95 border border-[#F59E0B]/50 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-12 h-12 rounded-lg bg-[#09090B] border border-[#27272A] flex items-center justify-center shrink-0 overflow-hidden relative">
                {selectedListing.photos[0] && selectedListing.photos[0].startsWith("http") ? (
                  <Image
                    src={selectedListing.photos[0]}
                    alt={selectedListing.materialNameEn}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xl">{selectedListing.photos[0] || "🧱"}</span>
                )}
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#FAFAFA] truncate">
                    {selectedListing.materialNameEn}
                  </h4>
                  <Badge variant={selectedListing.condition === "damaged" ? "danger" : selectedListing.condition === "fair" ? "warning" : "success"}>
                    {selectedListing.condition}
                  </Badge>
                </div>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5 truncate">
                  {selectedListing.qtyAvailable} {selectedListing.unit} •{" "}
                  <span className="text-[#10B981] font-semibold">
                    {selectedListing.savingsPercent}% OFF
                  </span>{" "}
                  • {selectedListing.distanceKm} km away
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right hidden sm:block">
                <span className="text-sm font-extrabold text-[#F59E0B] block">
                  ₹{selectedListing.askPrice}
                </span>
                <span className="text-[10px] text-[#A1A1AA]">per {selectedListing.unit}</span>
              </div>
              <Link href={`/listing/${selectedListing.id}`}>
                <Button size="sm">View</Button>
              </Link>
              <button
                type="button"
                onClick={() => onSelectListing(null)}
                className="w-7 h-7 rounded-full bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA] text-xs flex items-center justify-center transition-colors"
                title="Dismiss preview"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
