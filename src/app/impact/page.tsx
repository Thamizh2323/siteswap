import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function ImpactPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-white">Impact Dashboard</h2>
          <p className="text-xs text-slate-400">Public transparent metrics on construction waste diverted from landfills.</p>
        </div>
        <div>
          <Badge variant="success">Verified Pilot Data</Badge>
        </div>
      </div>

      {/* Aggregate Cards (Responsive: 2 columns on mobile, 4 columns on tablet/desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Diverted</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-400">12.4 t</div>
          <span className="text-[11px] text-slate-400">Tonnes of surplus reused</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">CO₂ Avoided</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">4,120 kg</div>
          <span className="text-[11px] text-slate-400">Embodied carbon saved</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">₹ Saved</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">₹84,200</div>
          <span className="text-[11px] text-slate-400">Direct savings by buyers</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Reuse Rate</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">82%</div>
          <span className="text-[11px] text-slate-400">Completed vs listed qty</span>
        </Card>
      </div>

      {/* Methodology notice */}
      <Card className="bg-[#12161f] border-[#232c3d] p-5 space-y-2">
        <h4 className="text-sm font-semibold text-slate-200">📐 Transparent Methodology</h4>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          • <span className="text-slate-300 font-medium">kg_diverted</span> = quantity × material unit weight.<br />
          • <span className="text-slate-300 font-medium">CO₂ avoided</span> = kg_diverted × embodied carbon coefficient (cited from published civil engineering literature).<br />
          • Only completed, buyer-confirmed deals count to prevent inflated numbers.
        </p>
      </Card>
    </div>
  );
}
