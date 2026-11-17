"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function ImpactDashboardPage() {
  const [includeDemo, setIncludeDemo] = useState<boolean>(true);

  // Dynamic values depending on demo toggle
  const metrics = includeDemo
    ? {
        divertedTonnes: "12.4",
        co2AvoidedKg: "4,120",
        moneySaved: "84,200",
        dealsCount: 18,
        reuseRate: "82%",
      }
    : {
        divertedTonnes: "3.2",
        co2AvoidedKg: "1,040",
        moneySaved: "22,500",
        dealsCount: 5,
        reuseRate: "78%",
      };

  const materialsBreakdown = [
    { name: "Red clay brick", divertedKg: 5200, percent: 42, color: "#F59E0B" },
    { name: "M-Sand", divertedKg: 3600, percent: 29, color: "#10B981" },
    { name: "Cement bag (50kg)", divertedKg: 2100, percent: 17, color: "#6366F1" },
    { name: "TMT steel bar", divertedKg: 1500, percent: 12, color: "#EC4899" },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Header + Demo Data Toggle */}
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

        {/* Demo Data Toggle Switch */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#141417] border border-[#27272A] self-start sm:self-auto">
          <span className="text-xs font-semibold text-[#A1A1AA]">Include Demo Data</span>
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

      {/* KPI 4-Card Grid (grid-cols-2 lg:grid-cols-4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-[#141417] border-[#27272A] space-y-1">
          <span className="text-[11px] text-[#A1A1AA] font-bold uppercase tracking-wider">
            Waste Diverted
          </span>
          <div className="text-3xl font-extrabold text-[#F59E0B] tabular-nums">
            {metrics.divertedTonnes} t
          </div>
          <p className="text-[10px] text-[#A1A1AA]">Clean surplus diverted from landfill</p>
        </Card>

        <Card className="p-5 bg-[#141417] border-[#27272A] space-y-1">
          <span className="text-[11px] text-[#A1A1AA] font-bold uppercase tracking-wider">
            CO₂ Avoided
          </span>
          <div className="text-3xl font-extrabold text-[#10B981] tabular-nums">
            {metrics.co2AvoidedKg} kg
          </div>
          <p className="text-[10px] text-[#A1A1AA]">Embodied manufacturing emissions</p>
        </Card>

        <Card className="p-5 bg-[#141417] border-[#27272A] space-y-1">
          <span className="text-[11px] text-[#A1A1AA] font-bold uppercase tracking-wider">
            Buyer Savings
          </span>
          <div className="text-3xl font-extrabold text-[#FAFAFA] tabular-nums">
            ₹{metrics.moneySaved}
          </div>
          <p className="text-[10px] text-[#A1A1AA]">Saved compared to full retail price</p>
        </Card>

        <Card className="p-5 bg-[#141417] border-[#27272A] space-y-1">
          <span className="text-[11px] text-[#A1A1AA] font-bold uppercase tracking-wider">
            Deals Completed
          </span>
          <div className="text-3xl font-extrabold text-indigo-400 tabular-nums">
            {metrics.dealsCount}
          </div>
          <p className="text-[10px] text-[#A1A1AA]">Reuse success rate: {metrics.reuseRate}</p>
        </Card>
      </div>

      {/* Content Grid: Left 7 cols (Diversion by Material), Right 5 cols (Methodology) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Diversion by Material (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-6 bg-[#141417] border-[#27272A] space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
              <h3 className="text-base font-bold text-[#FAFAFA]">Diversion by Material</h3>
              <span className="text-xs text-[#A1A1AA]">By mass (kg)</span>
            </div>

            <div className="space-y-4">
              {materialsBreakdown.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#FAFAFA]">{item.name}</span>
                    <span className="text-[#A1A1AA] tabular-nums">
                      {item.divertedKg.toLocaleString("en-IN")} kg ({item.percent}%)
                    </span>
                  </div>
                  {/* Progress Bar Container */}
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
        </div>

        {/* Right Column: Methodology & Formulas (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="p-6 bg-[#141417] border-[#27272A] space-y-4">
            <h3 className="text-base font-bold text-[#FAFAFA] pb-2 border-b border-[#27272A]">
              📐 Methodology & Citations
            </h3>

            <div className="space-y-3 text-xs leading-relaxed text-[#A1A1AA]">
              <div className="p-3 rounded-lg bg-[#09090B] border border-[#27272A] space-y-1">
                <span className="font-bold text-[#FAFAFA] text-xs">1. Mass Diverted</span>
                <p className="font-mono text-[11px] text-[#F59E0B]">kg_diverted = quantity × kg_per_unit</p>
                <p className="text-[10px]">E.g., 1 brick = 2.85 kg, 1 cement bag = 50 kg.</p>
              </div>

              <div className="p-3 rounded-lg bg-[#09090B] border border-[#27272A] space-y-1">
                <span className="font-bold text-[#FAFAFA] text-xs">2. Embodied CO₂ Avoided</span>
                <p className="font-mono text-[11px] text-[#10B981]">co2_avoided = kg_diverted × factor</p>
                <p className="text-[10px]">
                  Cited from published lifecycle assessment (LCA) literature (cement: 0.82, steel: 1.46, brick: 0.22).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#09090B] border border-[#27272A] space-y-1">
                <span className="font-bold text-[#FAFAFA] text-xs">3. Honest Buyer Savings</span>
                <p className="font-mono text-[11px] text-[#FAFAFA]">saved = (new_price_ref - ask_price) × qty</p>
                <p className="text-[10px]">Calculated strictly against prevailing Salem retail references.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
