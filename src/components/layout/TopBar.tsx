import React from "react";
import Link from "next/link";
import { t } from "@/i18n/t";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0c10]/90 backdrop-blur-md border-b border-[#1f2633]">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/browse" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white text-base shadow-sm group-hover:bg-orange-600 transition-colors">
            S
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight leading-none text-white">
              Site<span className="text-orange-500">Swap</span>
            </span>
            <span className="text-[10px] text-slate-400 leading-tight">{t("common.tagline")}</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t("common.pilot_live")}
          </span>
        </div>
      </div>
    </header>
  );
}
