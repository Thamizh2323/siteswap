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
        className={`w-5 h-5 transition-colors ${active ? "text-[#F59E0B]" : "text-[#A1A1AA]"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
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
      <svg
        className={`w-5 h-5 transition-colors ${active ? "text-[#F59E0B]" : "text-[#A1A1AA]"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
  {
    key: "nav.reservations",
    href: "/my/reservations",
    icon: (active) => (
      <svg
        className={`w-5 h-5 transition-colors ${active ? "text-[#F59E0B]" : "text-[#A1A1AA]"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
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
        className={`w-5 h-5 transition-colors ${active ? "text-[#F59E0B]" : "text-[#A1A1AA]"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
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
        className={`w-5 h-5 transition-colors ${active ? "text-[#F59E0B]" : "text-[#A1A1AA]"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
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
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090B]/95 backdrop-blur-lg border-t border-[#27272A]"
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
              className="relative flex-1 flex flex-col items-center justify-center py-1 min-h-[48px] touch-manipulation group"
            >
              {/* Amber Active Indicator Bar */}
              {isActive && (
                <span className="absolute top-0 left-4 right-4 h-0.5 bg-[#F59E0B] rounded-full" />
              )}
              <div className="transition-transform group-active:scale-95">{item.icon(isActive)}</div>
              <span
                className={`text-[10px] mt-1 font-semibold transition-colors ${
                  isActive ? "text-[#F59E0B]" : "text-[#A1A1AA] group-hover:text-[#FAFAFA]"
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
