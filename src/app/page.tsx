import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/i18n/t";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* 2-Column Split Hero (Mobile: stacked, Desktop: lg:grid-cols-12) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Hero (7 cols on desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-2xl bg-[#141417] border border-[#27272A] flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <Badge variant="accent">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse mr-1.5 inline-block" />
              {t("home.hero_badge")}
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#FAFAFA] leading-tight">
              Turn Leftover Site Materials Into Cash &{" "}
              <span className="text-[#F59E0B]">Lower Waste</span>
            </h1>

            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-xl">
              Resell surplus bricks, cement, steel, and sand locally within 10 km. Snap a photo, let AI detect quantities, and divert waste from landfills.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 sm:pt-8">
            <Link href="/browse" className="sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Find Materials
              </Button>
            </Link>
            <Link href="/sell/new" className="sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                Sell Surplus
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Live Impact (5 cols on desktop) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#141417] border border-[#27272A] flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#27272A]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FAFAFA]">
                LIVE IMPACT
              </span>
            </div>
            <Link href="/impact" className="text-xs text-[#F59E0B] hover:underline font-semibold">
              Full Metrics &rarr;
            </Link>
          </div>

          {/* 2x2 Metric Card Grid */}
          <div className="grid grid-cols-2 gap-3 py-4">
            <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#27272A] space-y-1">
              <span className="text-[11px] text-[#A1A1AA] font-medium">Materials Diverted</span>
              <div className="text-2xl font-extrabold text-[#F59E0B] tabular-nums">12.4 t</div>
              <span className="text-[10px] text-[#A1A1AA]">Clean surplus reused</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#27272A] space-y-1">
              <span className="text-[11px] text-[#A1A1AA] font-medium">CO₂ Avoided</span>
              <div className="text-2xl font-extrabold text-[#10B981] tabular-nums">4,120 kg</div>
              <span className="text-[10px] text-[#A1A1AA]">Embodied emissions</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#27272A] space-y-1">
              <span className="text-[11px] text-[#A1A1AA] font-medium">Rupees Saved</span>
              <div className="text-2xl font-extrabold text-[#FAFAFA] tabular-nums">₹84,200</div>
              <span className="text-[10px] text-[#A1A1AA]">Direct buyer savings</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#27272A] space-y-1">
              <span className="text-[11px] text-[#A1A1AA] font-medium">Deals Completed</span>
              <div className="text-2xl font-extrabold text-indigo-400 tabular-nums">18</div>
              <span className="text-[10px] text-[#A1A1AA]">Verified handovers</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-[#A1A1AA] flex items-center justify-between border-t border-[#27272A]">
            <span>Verified in Salem pilot</span>
            <span className="text-[#10B981] font-semibold">100% Landfill Diverted</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (1-column on mobile, 3-column on desktop) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#FAFAFA]">How SiteSwap Works</h2>
          <p className="text-xs text-[#A1A1AA]">3 simple steps to turn surplus materials into circular value.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-base font-semibold text-[#FAFAFA]">Snap & AI-Scan Surplus</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Upload site photos. Gemini AI estimates material type, count, and condition, suggesting fair pricing 20–40% below retail in seconds.
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-base font-semibold text-[#FAFAFA]">Reserve Nearby Materials</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Nearby builders and homeowners browse within 5/10/25 km and reserve quantities with a 24-hour hold. Zero phone spam until accepted.
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-base font-semibold text-[#FAFAFA]">Inspect, Pick Up & Log Impact</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Coordinate pickup via direct WhatsApp or phone. Confirm receipt on-site to automatically update tonnes diverted and CO₂ avoided.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
