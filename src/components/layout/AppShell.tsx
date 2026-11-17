import React from "react";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 flex flex-col justify-between">
      <TopBar />
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
