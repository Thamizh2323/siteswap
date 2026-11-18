import React, { Suspense } from "react";
import { getImpactDashboardData } from "@/features/impact/queries";
import { LandingHero } from "@/features/landing/components/LandingHero";
import { HowItWorks } from "@/features/landing/components/HowItWorks";

export const metadata = {
  title: "SiteSwap | P2P Construction Surplus Marketplace",
  description: "Rethinking waste: buy and sell leftover bricks, cement, steel, and sand locally. Powered by Gemini AI vision and PostGIS.",
};

async function LandingContent() {
  const data = await getImpactDashboardData();

  return (
    <div className="space-y-12">
      <LandingHero metrics={data.withDemo} />
      <HowItWorks />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-12 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 h-96 bg-[#141417] rounded-2xl border border-[#27272A]" />
            <div className="lg:col-span-5 h-96 bg-[#141417] rounded-2xl border border-[#27272A]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-48 bg-[#141417] rounded-xl border border-[#27272A]" />
            <div className="h-48 bg-[#141417] rounded-xl border border-[#27272A]" />
            <div className="h-48 bg-[#141417] rounded-xl border border-[#27272A]" />
          </div>
        </div>
      }
    >
      <LandingContent />
    </Suspense>
  );
}
