import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function PostSurplusPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Badge variant="accent">Module 2 Preview</Badge>
        <h2 className="text-xl font-bold text-white mt-1">Post Surplus Material</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Snap a photo — Gemini AI analyzes material & suggests fair pricing in 10s.
        </p>
      </div>

      {/* Upload Dropzone */}
      <Card className="border-dashed border-2 border-[#2b3548] bg-[#0c1017] p-8 sm:p-12 text-center space-y-3 cursor-pointer hover:border-orange-500/50 transition-colors">
        <div className="w-14 h-14 mx-auto rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center text-2xl">
          📷
        </div>
        <div>
          <p className="text-sm sm:text-base font-semibold text-slate-200">Tap or drag photos to upload</p>
          <p className="text-xs text-slate-400">Max 4 photos • Auto-compressed &lt;300 KB for fast India networks</p>
        </div>
        <Button size="sm" variant="outline">
          Select Photos
        </Button>
      </Card>

      <div className="p-4 rounded-xl bg-[#12161f] border border-[#232c3d] space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span>⚡ How it works across devices</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          1. Photo upload → 2. AI detects material + quantity → 3. You confirm & set price → 4. Nearby buyers reserve within 24h.
        </p>
      </div>
    </div>
  );
}
