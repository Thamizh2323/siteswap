import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function PostSurplusPage() {
  return (
    <div className="space-y-5">
      <div>
        <Badge variant="accent">Module 2 Preview</Badge>
        <h2 className="text-lg font-bold text-white mt-1">Post Surplus Material</h2>
        <p className="text-xs text-slate-400">Snap a photo — Gemini AI analyzes material & suggests fair pricing in 10s.</p>
      </div>

      {/* Upload Dropzone Preview */}
      <Card className="border-dashed border-2 border-[#2b3548] bg-[#0c1017] p-8 text-center space-y-3 cursor-pointer hover:border-orange-500/50 transition-colors">
        <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center text-xl">
          📷
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">Tap to snap or upload photos</p>
          <p className="text-[11px] text-slate-400">Max 4 photos • Auto-compressed &lt;300 KB</p>
        </div>
        <Button size="sm" variant="outline">
          Select Photos
        </Button>
      </Card>

      <div className="p-3.5 rounded-xl bg-[#12161f] border border-[#232c3d] space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span>⚡ How it works</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          1. Photo upload → 2. AI detects material + quantity → 3. You confirm & set price → 4. Nearby buyers reserve within 24h.
        </p>
      </div>
    </div>
  );
}
