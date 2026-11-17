"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Browse",
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
    label: "Sell",
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
    label: "Reserved",
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
    label: "Impact",
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
    label: "Profile",
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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 flex flex-col justify-between">
      {/* Top Header */}
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
              <span className="text-[10px] text-slate-400 leading-tight">rethinking surplus waste</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Pilot Live
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area (Mobile constrained at max-w-md = 448px, optimized for 390px) */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 pb-24">{children}</main>

      {/* Bottom Navigation */}
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
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
