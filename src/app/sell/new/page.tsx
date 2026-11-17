"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { calculateSuggestedPrice, calculateSavingsPercent, MaterialCondition } from "@/lib/price";
import { MATERIALS_CATALOG } from "@/features/listings/constants";

export default function PostSurplusPage() {
  const [photos, setPhotos] = useState<string[]>(["photo-1"]);
  const [selectedMaterial, setSelectedMaterial] = useState("red_clay_brick");
  const [condition, setCondition] = useState<MaterialCondition>("good");
  const [qty, setQty] = useState<number>(350);
  const [originalPrice, setOriginalPrice] = useState<number>(7.0);
  const [askPrice, setAskPrice] = useState<number>(5.25);
  const [negotiable, setNegotiable] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeMaterialObj = MATERIALS_CATALOG.find((m) => m.key === selectedMaterial) || MATERIALS_CATALOG[0];

  const handleConditionChange = (newCondition: MaterialCondition) => {
    setCondition(newCondition);
    setAskPrice(calculateSuggestedPrice(originalPrice, newCondition));
  };

  const handleOriginalPriceChange = (val: number) => {
    setOriginalPrice(val);
    setAskPrice(calculateSuggestedPrice(val, condition));
  };

  const savingsPercent = calculateSavingsPercent(originalPrice, askPrice);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#FAFAFA]">Post Surplus Material</h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
          Divert construction waste by listing nearby. AI analyzes your material photo in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Media & Map (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="space-y-3 p-4 bg-[#141417]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FAFAFA] uppercase">Photos ({photos.length}/4)</span>
              <span className="text-[11px] text-[#A1A1AA]">&lt;300 KB compressed</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {photos.map((_, idx) => (
                <div key={idx} className="relative h-28 rounded-lg bg-[#09090B] border border-[#27272A] flex items-center justify-center text-3xl">
                  <span>🧱</span>
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#09090B]/80 text-[#FAFAFA] text-xs flex items-center justify-center hover:bg-red-500"
                  >
                    ×
                  </button>
                  <span className="absolute bottom-1 left-1.5 text-[9px] px-1.5 py-0.5 rounded bg-[#09090B]/80 text-[#A1A1AA]">Slot {idx + 1}</span>
                </div>
              ))}
              {photos.length < 4 && (
                <button
                  type="button"
                  onClick={() => setPhotos([...photos, `photo-${photos.length + 1}`])}
                  className="h-28 rounded-lg border-2 border-dashed border-[#27272A] hover:border-[#F59E0B]/50 flex flex-col items-center justify-center gap-1 text-xs text-[#A1A1AA] cursor-pointer"
                >
                  <span className="text-xl text-[#F59E0B] font-bold">+</span>
                  <span>Add Photo</span>
                </button>
              )}
            </div>
          </Card>

          <Card className="space-y-3 p-4 bg-[#141417]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FAFAFA] uppercase">Pickup Location</span>
              <span className="text-[11px] text-[#10B981] font-semibold">Draggable Pin</span>
            </div>
            <div className="relative h-36 rounded-lg bg-[#09090B] border border-[#27272A] flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-[#09090B] flex items-center justify-center font-bold text-sm shadow-xl animate-bounce">📍</div>
              <span className="text-[11px] font-bold text-[#FAFAFA] bg-[#141417] px-2 py-0.5 rounded mt-1 border border-[#27272A]">Fairlands, Salem</span>
            </div>
            <p className="text-[11px] text-[#A1A1AA]">Saved as <code className="text-[#F59E0B]">SRID=4326;POINT(78.14 11.67)</code></p>
          </Card>
        </div>

        {/* Right Column: AI Banner + Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-4 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="text-lg">⚡</span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#F59E0B]">AI estimate, please confirm • 94% confidence</h4>
                <p className="text-xs text-[#A1A1AA] mt-0.5">Detected: <strong>Red Clay Bricks</strong> (~350 pcs), condition: <strong>Good</strong>.</p>
              </div>
            </div>
            <Badge variant="accent">Gemini Vision</Badge>
          </div>

          <Card className="space-y-4 p-5 sm:p-6 bg-[#141417]">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#A1A1AA]">Material Type</label>
              <select
                value={selectedMaterial}
                onChange={(e) => {
                  setSelectedMaterial(e.target.value);
                  const mat = MATERIALS_CATALOG.find((m) => m.key === e.target.value);
                  if (mat) handleOriginalPriceChange(mat.refPrice);
                }}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3.5 py-2.5 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B]"
              >
                {MATERIALS_CATALOG.map((m) => (
                  <option key={m.key} value={m.key} className="bg-[#141417]">{m.name} ({m.unit})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Available Quantity" type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#A1A1AA]">Unit</label>
                <div className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3.5 py-2.5 text-sm text-[#A1A1AA]">{activeMaterialObj?.unit || "units"}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#A1A1AA]">Condition Factor</label>
              <div className="grid grid-cols-3 gap-2">
                {(["good", "fair", "damaged"] as MaterialCondition[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleConditionChange(c)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold capitalize transition-all border ${
                      condition === c ? "bg-[#F59E0B] text-[#09090B] border-[#F59E0B]" : "bg-[#09090B] text-[#A1A1AA] border-[#27272A]"
                    }`}
                  >
                    {c} ({c === "good" ? "0.75x" : c === "fair" ? "0.65x" : "0.45x"})
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#27272A] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FAFAFA] uppercase">Pricing & Value</span>
                {savingsPercent > 0 && <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#10B981]/15 text-[#10B981]">{savingsPercent}% below retail</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input label="Original Retail (₹)" type="number" step="0.5" value={originalPrice} onChange={(e) => handleOriginalPriceChange(Number(e.target.value))} />
                <Input label="Suggested Ask Price (₹)" type="number" step="0.1" value={askPrice} onChange={(e) => setAskPrice(Number(e.target.value))} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#09090B] border border-[#27272A]">
                <div>
                  <span className="text-xs font-semibold text-[#FAFAFA]">Allow Negotiation</span>
                  <p className="text-[11px] text-[#A1A1AA]">Buyers can propose close offers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNegotiable(!negotiable)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${negotiable ? "bg-[#10B981]" : "bg-[#27272A]"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${negotiable ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-4"
              isLoading={isSubmitting}
              onClick={() => {
                setIsSubmitting(true);
                setTimeout(() => setIsSubmitting(false), 1000);
              }}
            >
              Publish Listing
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
