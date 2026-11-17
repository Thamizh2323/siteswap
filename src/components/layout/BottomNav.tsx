"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/i18n/t";

interface NavItem {
  key: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

const navItems: NavItem[] = [
  {
    key: "nav.browse",
    href: "/browse",
    icon: (active) => (
      <svg
        className={`w-5 h-5 ${active ? "text-orange-500" : "text-slate-400"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    ),
  },
  {
    key: "nav.sell",
    href: "/sell/new",
    icon: (active) => (
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
          active ? "bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30" : "bg-orange-500/20 text-orange-400"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
    ),
  },
  {
    key: "nav.reservations",
    href: "/my/reservations",
    icon: (active) => (
      <svg
        className={`w-5 h-5 ${active ? "text-orange-500" : "text-slate-400"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
        />
      </svg>
    ),
  },
  {
    key: "nav.impact",
    href: "/impact",
    icon: (active) => (
      <svg
        className={`w-5 h-5 ${active ? "text-orange-500" : "text-slate-400"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
  {
    key: "nav.profile",
    href: "/profile",
    icon: (active) => (
      <svg
        className={`w-5 h-5 ${active ? "text-orange-500" : "text-slate-400"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f131a]/95 backdrop-blur-lg border-t border-[#1f2633]"
    >
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            item.href === "/browse"
              ? pathname === "/browse" || pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-1 min-h-[48px] touch-manipulation group"
            >
              <div className="transition-transform group-active:scale-90">{item.icon(isActive)}</div>
              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? "text-orange-500" : "text-slate-400 group-hover:text-slate-200"
                }`}
              >
                {t(item.key)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
