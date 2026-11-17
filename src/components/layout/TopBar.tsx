"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/i18n/t";

export function TopBar() {
  const pathname = usePathname();

  const links = [
    { href: "/browse", label: t("nav.browse") },
    { href: "/my/reservations", label: t("nav.reservations") },
    { href: "/impact", label: t("nav.impact") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0c10]/90 backdrop-blur-md border-b border-[#1f2633]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white text-lg shadow-sm shadow-orange-950 group-hover:bg-orange-600 transition-colors">
            S
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-none text-white">
              Site<span className="text-orange-500">Swap</span>
            </span>
            <span className="text-[11px] text-slate-400 leading-tight hidden sm:block">
              {t("common.tagline")}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Tablet & Desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => {
            const isActive =
              link.href === "/browse"
                ? pathname === "/browse"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-orange-400 ${
                  isActive ? "text-orange-500 font-semibold" : "text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side CTAs */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xs:inline">{t("common.pilot_live")}</span>
            <span className="xs:hidden">Live</span>
          </span>

          {/* Desktop Post Surplus Button */}
          <Link
            href="/sell/new"
            className="hidden sm:inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm shadow-orange-950"
          >
            <span>+</span>
            <span>{t("nav.sell")}</span>
          </Link>

          {/* Desktop Profile Icon */}
          <Link
            href="/profile"
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#161c28] border border-[#232c3d] text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            title={t("nav.profile")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
