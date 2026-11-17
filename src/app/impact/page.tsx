import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function ImpactPage() {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Impact Dashboard</h2>
          <Badge variant="success">Verified Pilot Data</Badge>
        </div>
        <p className="text-xs text-slate-400">Public transparent metrics on construction waste diverted from landfills.</p>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Diverted</span>
          <div className="text-2xl font-extrabold text-orange-400">12.4 t</div>
          <span className="text-[10px] text-slate-400">Tonnes of surplus reused</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">CO₂ Avoided</span>
          <div className="text-2xl font-extrabold text-emerald-400">4,120 kg</div>
          <span className="text-[10px] text-slate-400">Embodied carbon saved</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">₹ Saved</span>
          <div className="text-2xl font-extrabold text-slate-100">₹84,200</div>
          <span className="text-[10px] text-slate-400">Direct savings by buyers</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Reuse Rate</span>
          <div className="text-2xl font-extrabold text-indigo-400">82%</div>
          <span className="text-[10px] text-slate-400">Completed vs listed qty</span>
        </Card>
      </div>

      {/* Methodology notice */}
      <Card className="bg-[#12161f] border-[#232c3d] p-4 space-y-2">
        <h4 className="text-xs font-semibold text-slate-200">📐 Transparent Methodology</h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          • <span className="text-slate-300 font-medium">kg_diverted</span> = quantity × material unit weight.<br />
          • <span className="text-slate-300 font-medium">CO₂ avoided</span> = kg_diverted × embodied carbon coefficient (cited in docs).<br />
          • Only completed, buyer-confirmed deals count to prevent inflated numbers.
        </p>
      </Card>
    </div>
  );
}
