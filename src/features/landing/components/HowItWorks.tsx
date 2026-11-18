import React from "react";
import { Card } from "@/components/ui/Card";

export function HowItWorks() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#FAFAFA]">How SiteSwap Works</h2>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
          A frictionless peer-to-peer loop to turn surplus materials into circular value.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <Card className="p-6 bg-[#141417] border-[#27272A] space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center font-extrabold text-sm border border-[#F59E0B]/30">
              1
            </div>
            <h3 className="text-base font-bold text-[#FAFAFA]">Snap & AI-Scan Surplus</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Upload photos of leftover bricks, cement, or steel. Gemini AI vision classifies material type, estimates counts, evaluates condition, and suggests pricing 20–40% below retail in seconds.
            </p>
          </div>
          <span className="text-[10px] text-[#F59E0B] font-semibold uppercase tracking-wider">
            ⚡ 2-Minute Listing
          </span>
        </Card>

        {/* Step 2 */}
        <Card className="p-6 bg-[#141417] border-[#27272A] space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-extrabold text-sm border border-[#10B981]/30">
              2
            </div>
            <h3 className="text-base font-bold text-[#FAFAFA]">Reserve with 24h Hold</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Nearby builders and homeowners browse within 5/10/25 km on an interactive map. Placing a hold reserves inventory for 24 hours. Contact numbers remain private until the seller accepts.
            </p>
          </div>
          <span className="text-[10px] text-[#10B981] font-semibold uppercase tracking-wider">
            🛡️ Zero Phone Spam
          </span>
        </Card>

        {/* Step 3 */}
        <Card className="p-6 bg-[#141417] border-[#27272A] space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-extrabold text-sm border border-indigo-500/30">
              3
            </div>
            <h3 className="text-base font-bold text-[#FAFAFA]">Inspect, Pick Up & Log Impact</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Coordinate local self-pickup via WhatsApp or call. The buyer inspects materials on-site, pays cash, and taps &quot;Received&quot; to log kilograms diverted and avoided CO₂ to our public ledger.
            </p>
          </div>
          <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
            🌱 Verified Circularity
          </span>
        </Card>
      </div>

      {/* Hackathon Theme Banner */}
      <div className="p-5 rounded-2xl bg-[#09090B] border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
            Arbiter Hacks V1 • Theme: Rethinking Waste
          </span>
          <p className="text-xs text-[#A1A1AA] max-w-2xl leading-relaxed">
            Construction accounts for over 35% of global solid waste. SiteSwap enables hyper-local reuse
            across Tamil Nadu, preventing clean usable building materials from being dumped in lakebeds or road shoulders.
          </p>
        </div>
        <div className="text-xs font-mono text-[#FAFAFA] bg-[#141417] px-3 py-2 rounded-lg border border-[#27272A] shrink-0">
          Built for Salem, TN 🇮🇳
        </div>
      </div>
    </section>
  );
}
