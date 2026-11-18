import React, { Suspense } from "react";
import { getImpactDashboardData } from "@/features/impact/queries";
import { ImpactDashboardView } from "@/features/impact/components/ImpactDashboardView";

export const metadata = {
  title: "Circular Impact Dashboard | SiteSwap",
  description: "Verified telemetry on construction waste diverted from landfills, embodied CO2 avoided, and contractor savings.",
};

async function ImpactDashboardContent() {
  const data = await getImpactDashboardData();
  return <ImpactDashboardView data={data} />;
}

export default function ImpactPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 animate-pulse">
          <div className="h-10 w-64 bg-[#141417] rounded-lg border border-[#27272A]" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-28 bg-[#141417] rounded-xl border border-[#27272A]" />
            <div className="h-28 bg-[#141417] rounded-xl border border-[#27272A]" />
            <div className="h-28 bg-[#141417] rounded-xl border border-[#27272A]" />
            <div className="h-28 bg-[#141417] rounded-xl border border-[#27272A]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 h-80 bg-[#141417] rounded-xl border border-[#27272A]" />
            <div className="lg:col-span-5 h-80 bg-[#141417] rounded-xl border border-[#27272A]" />
          </div>
        </div>
      }
    >
      <ImpactDashboardContent />
    </Suspense>
  );
}
