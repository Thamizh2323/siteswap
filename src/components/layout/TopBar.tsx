"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/i18n/t";
import { getClientLocale, setClientLocale, Locale } from "@/i18n/locale";

export function TopBar() {
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<Locale>(() => getClientLocale());

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    setClientLocale(newLocale);
    setCurrentLocale(newLocale);
    window.location.reload();
  };

  const navLinks = [
    { href: "/browse", label: t("nav.browse") },
    { href: "/sell/new", label: t("nav.sell") },
    { href: "/my/reservations", label: t("nav.reservations") },
    { href: "/impact", label: t("nav.impact") },
    { href: "/profile", label: t("nav.profile") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#09090B]/90 backdrop-blur-md border-b border-[#27272A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Geometric Amber Cube Icon + SiteSwap Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center shadow-md shadow-amber-950/40 group-hover:bg-[#D97706] transition-colors">
            {/* Geometric Cube SVG */}
            <svg
              className="w-5 h-5 text-[#09090B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight leading-none text-[#FAFAFA]">
              Site<span className="text-[#F59E0B]">Swap</span>
            </span>
            <span className="text-[10px] text-[#A1A1AA] leading-tight font-medium hidden sm:block">
              {t("common.tagline")}
            </span>
          </div>
        </Link>

        {/* Center: Desktop Horizontal Nav Links (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/browse"
                ? pathname === "/browse"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-[#F59E0B] bg-[#F59E0B]/10"
                    : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#141417]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#F59E0B] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Bilingual Pill Toggle EN | தமிழ் */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center bg-[#141417] border border-[#27272A] rounded-full p-0.5 text-xs font-semibold">
            <button
              onClick={() => handleLocaleChange("en")}
              className={`px-2.5 py-1 rounded-full transition-all ${
                currentLocale === "en"
                  ? "bg-[#F59E0B] text-[#09090B] font-bold shadow-xs"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLocaleChange("ta")}
              className={`px-2.5 py-1 rounded-full transition-all ${
                currentLocale === "ta"
                  ? "bg-[#F59E0B] text-[#09090B] font-bold shadow-xs"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
