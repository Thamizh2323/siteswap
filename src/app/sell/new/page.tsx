"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { calculateSuggestedPrice, calculateSavingsPercent } from "@/lib/price";
import { MATERIALS_CATALOG } from "@/features/listings/constants";
import { PhotoPicker, type PhotoItem } from "@/features/listings/components/PhotoPicker";
import { LocationPicker } from "@/features/listings/components/LocationPicker";
import { createListingAction } from "@/features/listings/actions";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { AnalyzeEstimateSuccess } from "@/lib/ai-schemas";
import type { ListingCondition } from "@/features/listings/schemas";

const DEFAULT_MAT = { key: "red_clay_brick", name: "Red Clay Brick", unit: "nos", refPrice: 7.0 };
const CONDITIONS: { key: ListingCondition; factor: string }[] = [
  { key: "good", factor: "0.75x" },
  { key: "fair", factor: "0.65x" },
  { key: "damaged", factor: "0.45x" },
];

export default function PostSurplusPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [materialKey, setMaterialKey] = useState("red_clay_brick");
  const [condition, setCondition] = useState<ListingCondition>("good");
  const [qty, setQty] = useState(350);
  const [originalPrice, setOriginalPrice] = useState(7.0);
  const [askPrice, setAskPrice] = useState(5.25);
  const [negotiable, setNegotiable] = useState(true);
  const [loc, setLoc] = useState({ lat: 11.6643, lng: 78.146, areaText: "Fairlands, Salem" });
  const [aiEstimate, setAiEstimate] = useState<AnalyzeEstimateSuccess | null>(null);
  const [aiFallback, setAiFallback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    createBrowserSupabaseClient().auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login?next=/sell/new");
      else setUserId(user.id);
    });
  }, [router]);

  const activeMat = MATERIALS_CATALOG.find((m) => m.key === materialKey) ?? DEFAULT_MAT;

  const handleCondition = (c: ListingCondition) => {
    setCondition(c);
    setAskPrice(calculateSuggestedPrice(originalPrice, c));
  };

  const handleOriginalPrice = (val: number) => {
    setOriginalPrice(val);
    setAskPrice(calculateSuggestedPrice(val, condition));
  };

  const handleAiEstimate = (est: AnalyzeEstimateSuccess) => {
    setAiEstimate(est);
    setAiFallback(false);
    setMaterialKey(est.materialKey);
    setQty(est.estimatedQty);
    setCondition(est.condition);
    const refPrice = MATERIALS_CATALOG.find((m) => m.key === est.materialKey)?.refPrice ?? originalPrice;
    setOriginalPrice(refPrice);
    setAskPrice(calculateSuggestedPrice(refPrice, est.condition));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const res = await createListingAction({
      materialKey,
      qty,
      unit: activeMat.unit,
      condition,
      originalPrice,
      askPrice,
      negotiable,
      photos: photos.map((p) => p.publicUrl),
      lat: loc.lat,
      lng: loc.lng,
      areaText: loc.areaText,
      pickupType: "self",
      qtyAiEstimate: aiEstimate?.estimatedQty,
      aiConfidence: aiEstimate?.confidence,
    });

    setIsSubmitting(false);
    if (!res.ok) {
      setSubmitError(res.error.message || "Failed to publish listing.");
      return;
    }
    router.push(`/browse?created=${res.data.id}`);
  };

  const savings = calculateSavingsPercent(originalPrice, askPrice);

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#FAFAFA]">Post Surplus Material</h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
          Divert construction waste by listing nearby. AI analyzes your material photo in seconds.
        </p>
      </div>

      {submitError && <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-400">{submitError}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-5">
          <Card className="p-4 bg-[#141417]">
            <PhotoPicker userId={userId} photos={photos} onPhotosChange={setPhotos} onAiEstimate={handleAiEstimate} onAiFallback={() => setAiFallback(true)} />
          </Card>
          <Card className="p-4 bg-[#141417]">
            <LocationPicker lat={loc.lat} lng={loc.lng} areaText={loc.areaText} onChange={setLoc} />
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-5">
          {aiEstimate && !aiFallback && (
            <div className="p-4 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="text-lg">⚡</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#F59E0B]">AI estimate, please confirm • {Math.round(aiEstimate.confidence * 100)}% confidence</h4>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">Detected: <strong>{activeMat.name}</strong> (~{aiEstimate.estimatedQty} {aiEstimate.unit}), condition: <strong>{aiEstimate.condition}</strong>.</p>
                </div>
              </div>
              <Badge variant="accent">Gemini Vision</Badge>
            </div>
          )}

          {aiFallback && (
            <div className="p-3 rounded-xl bg-[#27272A]/50 border border-[#3F3F46] text-xs text-[#A1A1AA]">
              ℹ️ Manual mode active: Please confirm or adjust your surplus material specs below.
            </div>
          )}

          <Card className="space-y-4 p-5 sm:p-6 bg-[#141417]">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#A1A1AA]">Material Type</label>
              <select
                value={materialKey}
                onChange={(e) => {
                  setMaterialKey(e.target.value);
                  const mat = MATERIALS_CATALOG.find((m) => m.key === e.target.value);
                  if (mat) handleOriginalPrice(mat.refPrice);
                }}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3.5 py-2.5 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B]"
              >
                {MATERIALS_CATALOG.map((m) => (
                  <option key={m.key} value={m.key} className="bg-[#141417]">{m.name} ({m.unit})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Available Quantity" type="number" min="1" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#A1A1AA]">Unit</label>
                <div className="w-full bg-[#09090B] border border-[#27272A] rounded-lg px-3.5 py-2.5 text-sm text-[#A1A1AA]">{activeMat.unit}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#A1A1AA]">Condition Factor</label>
              <div className="grid grid-cols-3 gap-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => handleCondition(c.key)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold capitalize transition-all border ${
                      condition === c.key ? "bg-[#F59E0B] text-[#09090B] border-[#F59E0B]" : "bg-[#09090B] text-[#A1A1AA] border-[#27272A]"
                    }`}
                  >
                    {c.key} ({c.factor})
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#27272A] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FAFAFA] uppercase">Pricing & Value</span>
                {savings > 0 && <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#10B981]/15 text-[#10B981]">{savings}% below retail</span>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Original Retail (₹)" type="number" step="0.5" value={originalPrice} onChange={(e) => handleOriginalPrice(Number(e.target.value))} />
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

            <Button size="lg" type="submit" className="w-full mt-4" isLoading={isSubmitting}>Publish Listing</Button>
          </Card>
        </div>
      </div>
    </form>
  );
}
