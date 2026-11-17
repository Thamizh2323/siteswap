import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="p-5 rounded-2xl bg-gradient-to-b from-[#161c28] to-[#10141e] border border-[#232c3d] space-y-3">
        <Badge variant="accent">Arbiter Hacks V1 • Rethinking Waste</Badge>
        <h1 className="text-2xl font-bold tracking-tight text-white leading-snug">
          Leftover construction material? <span className="text-orange-500">Sell or save nearby.</span>
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          List leftover bricks, cement, steel, or sand in 2 minutes using AI. Or buy at 20–40% discount within 10 km.
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <Link href="/browse">
            <Button size="md" className="w-full">
              Find Materials
            </Button>
          </Link>
          <Link href="/sell/new">
            <Button variant="secondary" size="md" className="w-full">
              + Post Surplus
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Impact Counters preview */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-orange-400">12.4 t</div>
          <div className="text-[10px] text-slate-400">Waste Diverted</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-emerald-400">4.1 t</div>
          <div className="text-[10px] text-slate-400">CO₂ Avoided</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-slate-200">₹84k</div>
          <div className="text-[10px] text-slate-400">Money Saved</div>
        </Card>
      </div>

      {/* Featured quick banner */}
      <Card hoverable className="flex items-center justify-between p-4 bg-[#12161f]">
        <div>
          <div className="text-xs font-semibold text-slate-200">Browse Surplus Near Salem</div>
          <div className="text-[11px] text-slate-400">Bricks, cement, and M-Sand within 25 km</div>
        </div>
        <Link href="/browse" className="text-xs text-orange-400 font-medium">
          View &rarr;
        </Link>
      </Card>
    </div>
  );
}
