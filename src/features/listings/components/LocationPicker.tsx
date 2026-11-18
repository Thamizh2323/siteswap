"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  lat: number;
  lng: number;
  areaText: string;
  onChange: (location: { lat: number; lng: number; areaText: string }) => void;
}

export function LocationPicker({
  lat,
  lng,
  areaText,
  onChange,
}: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const onChangeRef = useRef(onChange);
  const areaTextRef = useRef(areaText);

  useEffect(() => {
    onChangeRef.current = onChange;
    areaTextRef.current = areaText;
  });

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = await import("leaflet");

      // Custom amber marker icon
      const amberIcon = L.divIcon({
        className: "custom-amber-pin",
        html: `
          <div style="
            width: 28px;
            height: 28px;
            background: #F59E0B;
            border: 2px solid #09090B;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          ">
            <div style="
              width: 10px;
              height: 10px;
              background: #09090B;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const marker = L.marker([lat, lng], {
        icon: amberIcon,
        draggable: true,
      }).addTo(map);

      marker.on("dragend", async () => {
        const position = marker.getLatLng();
        const roundedLat = Math.round(position.lat * 10000) / 10000;
        const roundedLng = Math.round(position.lng * 10000) / 10000;
        onChangeRef.current({
          lat: roundedLat,
          lng: roundedLng,
          areaText: areaTextRef.current || "Salem",
        });
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newLat = Math.round(pos.coords.latitude * 10000) / 10000;
        const newLng = Math.round(pos.coords.longitude * 10000) / 10000;
        onChange({ lat: newLat, lng: newLng, areaText: areaText || "Current GPS Location" });

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([newLat, newLng], 14);
          markerRef.current.setLatLng([newLat, newLng]);
        }
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#FAFAFA] uppercase">Pickup Location</span>
          <p className="text-[11px] text-[#A1A1AA]">Drag the pin to your exact site</p>
        </div>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="text-[11px] px-2.5 py-1 rounded bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA] font-medium transition-colors"
        >
          {isLocating ? "Locating..." : "📍 Use My GPS"}
        </button>
      </div>

      <div className="relative h-44 rounded-lg overflow-hidden border border-[#27272A] bg-[#09090B]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-[#A1A1AA]">Area / Landmark</label>
        <input
          type="text"
          value={areaText}
          onChange={(e) => onChange({ lat, lng, areaText: e.target.value })}
          placeholder="e.g. Fairlands, Near New Bus Stand, Salem"
          className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#F59E0B]"
        />
        <div className="flex items-center justify-between text-[10px] text-[#71717A] pt-0.5">
          <span>Lat: {lat}, Lng: {lng}</span>
          <span className="font-mono text-[#F59E0B]">SRID=4326;POINT({lng} {lat})</span>
        </div>
      </div>
    </div>
  );
}
