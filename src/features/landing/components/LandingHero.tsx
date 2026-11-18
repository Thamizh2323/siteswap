import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/i18n/t";

export interface LandingHeroMetrics {
  tonnes: number;
  co2Kg: number;
  rupees: number;
  deals: number;
}

interface Props {
  metrics: LandingHeroMetrics;
}

export function LandingHero({ metrics }: Props) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
      {/* Left Hero (7 cols on desktop) */}
      <div className="lg:col-span-7 p-6 sm:p-10 rounded-2xl bg-[#141417] border border-[#27272A] flex flex-col justify-between shadow-xl">
        <div className="space-y-4">
          <Badge variant="accent">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse mr-1.5 inline-block" />
            {t("home.hero_badge")}
          </Badge>

          {/* Problem in one line + Value proposition */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#A1A1AA]">
              Problem: 30% of building materials end up in dumps while nearby builders pay full retail.
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#FAFAFA] leading-tight">
              Turn Leftover Site Materials Into Cash &{" "}
              <span className="text-[#F59E0B]">Lower Waste</span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-xl">
            {t("home.hero_desc")}
          </p>
        </div>

        <div className="pt-6 sm:pt-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link href="/browse" className="sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8">
                {t("home.find_btn")}
              </Button>
            </Link>
            <Link href="/sell/new" className="sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                {t("home.post_btn")}
              </Button>
            </Link>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#A1A1AA] pt-2">
            <span className="flex items-center gap-1">✓ AI Material Valuation</span>
            <span className="flex items-center gap-1">✓ 24h Anti-Spam Hold</span>
            <span className="flex items-center gap-1">✓ Verified Landfill Diversion</span>
          </div>
        </div>
      </div>

      {/* Right Live Impact (5 cols on desktop) */}
      <div className="lg:col-span-5 p-6 rounded-2xl bg-[#141417] border border-[#27272A] flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FAFAFA]">
              LIVE AUDITED TELEMETRY
            </span>
          </div>
          <Link href="/impact" className="text-xs text-[#F59E0B] hover:underline font-semibold flex items-center gap-1">
            <span>Full Metrics</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* 2x2 Live Counter Grid */}
        <div className="grid grid-cols-2 gap-3 py-4">
          <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#27272A] space-y-1">
            <span className="text-[11px] text-[#A1A1AA] font-medium">{t("home.stat_diverted")}</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F59E0B] tabular-nums">
              {metrics.tonnes.toLocaleString("en-IN", { maximumFractionDigits: 1 })} t
            </div>
            <span className="text-[10px] text-[#A1A1AA]">Clean surplus reused</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#27272A] space-y-1">
            <span className="text-[11px] text-[#A1A1AA] font-medium">{t("home.stat_co2")}</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#10B981] tabular-nums">
              {metrics.co2Kg.toLocaleString("en-IN", { maximumFractionDigits: 0 })} kg
            </div>
            <span className="text-[10px] text-[#A1A1AA]">Embodied emissions</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#27272A] space-y-1">
            <span className="text-[11px] text-[#A1A1AA] font-medium">{t("home.stat_saved")}</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FAFAFA] tabular-nums">
              ₹{metrics.rupees.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-[#A1A1AA]">Direct buyer savings</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#27272A] space-y-1">
            <span className="text-[11px] text-[#A1A1AA] font-medium">Deals Completed</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 tabular-nums">
              {metrics.deals}
            </div>
            <span className="text-[10px] text-[#A1A1AA]">Verified handovers</span>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-[#A1A1AA] flex items-center justify-between border-t border-[#27272A]">
          <span>Verified in Salem pilot</span>
          <span className="text-[#10B981] font-semibold">100% Landfill Diverted</span>
        </div>
      </div>
    </section>
  );
}
