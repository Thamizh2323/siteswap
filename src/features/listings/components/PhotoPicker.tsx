"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { uploadListingPhoto, deleteListingPhoto } from "../storage";
import type { AnalyzeEstimateSuccess } from "@/lib/ai-schemas";

export interface PhotoItem {
  path: string;
  publicUrl: string;
}

interface PhotoPickerProps {
  userId: string;
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
  onAiEstimate: (estimate: AnalyzeEstimateSuccess) => void;
  onAiFallback: (reason?: string) => void;
}

export function PhotoPicker({
  userId,
  photos,
  onPhotosChange,
  onAiEstimate,
  onAiFallback,
}: PhotoPickerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - photos.length;
    if (remainingSlots <= 0) return;

    const file = files[0];
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);

    // 1. Client-side compress and upload to Supabase Storage
    const uploadResult = await uploadListingPhoto(file, userId);
    setIsUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (!uploadResult.ok) {
      setUploadError(uploadResult.error.message);
      return;
    }

    const newPhoto: PhotoItem = {
      path: uploadResult.data.path,
      publicUrl: uploadResult.data.publicUrl,
    };

    const updatedPhotos = [...photos, newPhoto];
    onPhotosChange(updatedPhotos);

    // 2. Trigger Gemini surplus AI analysis for the first photo
    if (photos.length === 0) {
      setIsAnalyzing(true);
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photoUrls: [newPhoto.publicUrl] }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result && !result.fallback) {
            onAiEstimate(result as AnalyzeEstimateSuccess);
          } else {
            onAiFallback(result?.reason || "manual_review_needed");
          }
        } else {
          onAiFallback("ai_unavailable");
        }
      } catch {
        onAiFallback("network_error");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleRemovePhoto = async (index: number) => {
    const target = photos[index];
    if (!target) return;

    // Optimistically update UI
    onPhotosChange(photos.filter((_, idx) => idx !== index));

    // Delete in background
    await deleteListingPhoto(target.path);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#FAFAFA] uppercase">
          Photos ({photos.length}/4)
        </span>
        <span className="text-[11px] text-[#A1A1AA]">
          {isUploading
            ? "Compressing & uploading..."
            : isAnalyzing
            ? "AI analyzing surplus..."
            : "<300 KB compressed JPEG"}
        </span>
      </div>

      {uploadError && (
        <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-xs text-red-400">
          {uploadError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        {photos.map((item, idx) => (
          <div
            key={item.path}
            className="relative h-28 rounded-lg bg-[#09090B] border border-[#27272A] overflow-hidden group"
          >
            <Image
              src={item.publicUrl}
              alt={`Surplus photo ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
            <button
              type="button"
              onClick={() => handleRemovePhoto(idx)}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#09090B]/80 text-[#FAFAFA] text-xs flex items-center justify-center hover:bg-red-500 transition-colors z-10"
              title="Remove photo"
            >
              ×
            </button>
            <span className="absolute bottom-1 left-1.5 text-[9px] px-1.5 py-0.5 rounded bg-[#09090B]/80 text-[#A1A1AA] z-10">
              Slot {idx + 1}
            </span>
          </div>
        ))}

        {photos.length < 4 && (
          <button
            type="button"
            disabled={isUploading || isAnalyzing}
            onClick={() => fileInputRef.current?.click()}
            className="h-28 rounded-lg border-2 border-dashed border-[#27272A] hover:border-[#F59E0B]/50 flex flex-col items-center justify-center gap-1 text-xs text-[#A1A1AA] transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className="text-xl text-[#F59E0B] font-bold">
              {isUploading || isAnalyzing ? "⏳" : "+"}
            </span>
            <span>
              {isUploading
                ? "Compressing..."
                : isAnalyzing
                ? "Analyzing..."
                : "Add Photo"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
