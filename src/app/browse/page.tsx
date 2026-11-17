import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function BrowsePage() {
  return (
    <div className="space-y-6">
      {/* Header & filters preview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Browse Surplus Materials</h2>
          <p className="text-xs text-slate-400">Salem / Tiruchengode • Radius: 10 km</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="accent">List View</Badge>
          <Badge variant="outline">Map View</Badge>
        </div>
      </div>

      {/* Radius filter chips */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 text-xs mr-1 hidden sm:inline">Radius:</span>
        <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-medium cursor-pointer">
          5 km
        </span>
        <span className="px-3 py-1 rounded-full bg-[#12161f] text-slate-300 border border-[#232c3d] cursor-pointer hover:border-slate-600">
          10 km
        </span>
        <span className="px-3 py-1 rounded-full bg-[#12161f] text-slate-300 border border-[#232c3d] cursor-pointer hover:border-slate-600">
          25 km
        </span>
      </div>

      {/* Responsive Grid for listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        <Card hoverable className="space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">DEMO LISTING</span>
                <h4 className="text-base font-semibold text-slate-100">Red Clay Bricks (250 nos)</h4>
                <p className="text-xs text-slate-400">Condition: Good • 3.2 km away</p>
              </div>
              <Badge variant="success">Save 21%</Badge>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#1f2633] text-xs">
            <div>
              <span className="text-lg font-bold text-orange-400">₹5.50</span>
              <span className="text-slate-400 text-xs line-through ml-1.5">₹7.00</span>
              <span className="text-slate-400 text-[10px]"> / brick</span>
            </div>
            <Button size="sm">View & Reserve</Button>
          </div>
        </Card>

        <Card hoverable className="space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">DEMO LISTING</span>
                <h4 className="text-base font-semibold text-slate-100">Cement Bags 50kg (12 bags)</h4>
                <p className="text-xs text-slate-400">Condition: Unused / Sealed • 5.8 km away</p>
              </div>
              <Badge variant="success">Save 26%</Badge>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#1f2633] text-xs">
            <div>
              <span className="text-lg font-bold text-orange-400">₹310</span>
              <span className="text-slate-400 text-xs line-through ml-1.5">₹420</span>
              <span className="text-slate-400 text-[10px]"> / bag</span>
            </div>
            <Button size="sm">View & Reserve</Button>
          </div>
        </Card>

        <Card hoverable className="space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">DEMO LISTING</span>
                <h4 className="text-base font-semibold text-slate-100">TMT Steel Bars 12mm (80 kg)</h4>
                <p className="text-xs text-slate-400">Condition: Good • 6.4 km away</p>
              </div>
              <Badge variant="success">Save 23%</Badge>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#1f2633] text-xs">
            <div>
              <span className="text-lg font-bold text-orange-400">₹50</span>
              <span className="text-slate-400 text-xs line-through ml-1.5">₹65</span>
              <span className="text-slate-400 text-[10px]"> / kg</span>
            </div>
            <Button size="sm">View & Reserve</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
