"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { ImpactDashboardData } from "../types";

interface Props {
  data: ImpactDashboardData;
}

export function ImpactDashboardView({ data }: Props) {
  const [includeDemo, setIncludeDemo] = useState<boolean>(true);

  const metrics = includeDemo ? data.withDemo : data.live;

  return (
    <div className="space-y-8">
      {/* Dashboard Header + Demo Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#FAFAFA]">Circular Impact Dashboard</h1>
            <Badge variant="success">Verified Public Log</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Real-time environmental and economic savings from construction materials diverted from dumps.
          </p>
        </div>

        {/* Demo Data Toggle */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#141417] border border-[#27272A] self-start sm:self-auto">
          <span className="text-xs font-semibold text-[#A1A1AA]">
            {includeDemo ? "Showing Demo + Live" : "Verified Live Only"}
          </span>
          <button
            type="button"
            onClick={() => setIncludeDemo(!includeDemo)}
            className={`w-10 h-6 rounded-full p-1 transition-colors ${
              includeDemo ? "bg-[#F59E0B]" : "bg-[#27272A]"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-[#09090B] transition-transform ${
                includeDemo ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* KPI 4-Card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-[#141417] border-[#27272A] space-y-1">
          <span className="text-[11px] text-[#A1A1AA] font-bold uppercase tracking-wider">
            Waste Diverted
          </span>
          <div className="text-3xl font-extrabold text-[#F59E0B] tabular-nums">
            {metrics.tonnes.toLocaleString("en-IN", { maximumFractionDigits: 1 })} t
          </div>
          <p className="text-[10px] text-[#A1A1AA]">Clean surplus diverted from landfill</p>
        </Card>

        <Card className="p-5 bg-[#141417] border-[#27272A] space-y-1">
          <span className="text-[11px] text-[#A1A1AA] font-bold uppercase tracking-wider">
            CO₂ Avoided
          </span>
          <div className="text-3xl font-extrabold text-[#10B981] tabular-nums">
            {metrics.co2Kg.toLocaleString("en-IN", { maximumFractionDigits: 0 })} kg
          </div>
          <p className="text-[10px] text-[#A1A1AA]">Embodied manufacturing emissions</p>
        </Card>

        <Card className="p-5 bg-[#141417] border-[#27272A] space-y-1">
          <span className="text-[11px] text-[#A1A1AA] font-bold uppercase tracking-wider">
            Buyer Savings
          </span>
          <div className="text-3xl font-extrabold text-[#FAFAFA] tabular-nums">
            ₹{metrics.rupees.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-[#A1A1AA]">Saved compared to full retail price</p>
        </Card>

        <Card className="p-5 bg-[#141417] border-[#27272A] space-y-1">
          <span className="text-[11px] text-[#A1A1AA] font-bold uppercase tracking-wider">
            Deals Completed
          </span>
          <div className="text-3xl font-extrabold text-indigo-400 tabular-nums">
            {metrics.deals}
          </div>
          <p className="text-[10px] text-[#A1A1AA]">Confirmed handovers on SiteSwap</p>
        </Card>
      </div>

      {/* Content Grid: Left 7 cols (Material Breakdown & Recent Log), Right 5 cols (Methodology) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Diversion by Material */}
          <Card className="p-6 bg-[#141417] border-[#27272A] space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
              <h3 className="text-base font-bold text-[#FAFAFA]">Diversion by Material</h3>
              <span className="text-xs text-[#A1A1AA]">Mass share (kg)</span>
            </div>

            <div className="space-y-4">
              {data.breakdown.map((item) => (
                <div key={item.materialKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#FAFAFA]">
                      {item.nameEn} <span className="text-[#A1A1AA] font-normal">({item.nameTa})</span>
                    </span>
                    <span className="text-[#A1A1AA] tabular-nums">
                      {item.divertedKg.toLocaleString("en-IN")} kg ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#09090B] border border-[#27272A] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>Only buyer-confirmed completions counted.</span>
              <span className="text-[#10B981] font-semibold">Zero Inflated Claims</span>
            </div>
          </Card>

          {/* Recent Handover Log */}
          <Card className="p-6 bg-[#141417] border-[#27272A] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
              <h3 className="text-base font-bold text-[#FAFAFA]">Recent Completed Handovers</h3>
              <span className="text-xs text-[#10B981] font-medium">Live Stream</span>
            </div>

            <div className="divide-y divide-[#27272A]">
              {data.recent.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-[#FAFAFA]">{item.materialName}</h4>
                    <p className="text-[11px] text-[#A1A1AA]">
                      {item.qty} {item.unit} • {item.completedAtText}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#10B981] tabular-nums">
                      +{item.kgDiverted} kg diverted
                    </span>
                    <p className="text-[11px] text-[#F59E0B] tabular-nums">
                      Saved ₹{item.moneySaved.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Methodology & Citations */}
        <div className="lg:col-span-5">
          <Card className="p-6 bg-[#141417] border-[#27272A] space-y-4">
            <h3 className="text-base font-bold text-[#FAFAFA] pb-2 border-b border-[#27272A]">
              📐 Methodology & Formulas
            </h3>

            <div className="space-y-3 text-xs leading-relaxed text-[#A1A1AA]">
              <div className="p-3 rounded-lg bg-[#09090B] border border-[#27272A] space-y-1">
                <span className="font-bold text-[#FAFAFA] text-xs">1. Mass Diverted</span>
                <p className="font-mono text-[11px] text-[#F59E0B]">kg_diverted = qty × kg_per_unit</p>
                <p className="text-[10px]">E.g., 1 brick = 2.85 kg, 1 cement bag = 50 kg.</p>
              </div>

              <div className="p-3 rounded-lg bg-[#09090B] border border-[#27272A] space-y-1">
                <span className="font-bold text-[#FAFAFA] text-xs">2. Embodied CO₂ Avoided</span>
                <p className="font-mono text-[11px] text-[#10B981]">co2_avoided = kg_diverted × factor</p>
                <p className="text-[10px]">
                  Cited from published lifecycle assessment (LCA) literature (cement: 0.82, steel: 1.46, clay brick: 0.22).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#09090B] border border-[#27272A] space-y-1">
                <span className="font-bold text-[#FAFAFA] text-xs">3. Honest Buyer Savings</span>
                <p className="font-mono text-[11px] text-[#FAFAFA]">saved = (new_price_ref - ask_price) × qty</p>
                <p className="text-[10px]">Calculated strictly against prevailing Salem retail references.</p>
              </div>

              <div className="p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 space-y-1 text-xs">
                <span className="font-bold text-[#10B981]">Zero Inflated Claims Policy</span>
                <p className="text-[11px] text-[#A1A1AA]">
                  Postings alone do not count. Impact is logged exclusively when a buyer confirms receipt in hand.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
