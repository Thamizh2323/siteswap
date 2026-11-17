import { EmptyState } from "@/components/ui/EmptyState";

export default function ReservationsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">Reservations Inbox</h2>
        <p className="text-xs text-slate-400">Track your incoming buyers and your material reservations.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1f2633] text-xs">
        <button className="pb-2.5 px-3 font-semibold text-orange-400 border-b-2 border-orange-500">
          I am Buying (0)
        </button>
        <button className="pb-2.5 px-3 font-medium text-slate-400 hover:text-slate-200">
          I am Selling (0)
        </button>
      </div>

      {/* Empty State */}
      <EmptyState
        title="No active reservations yet"
        description="When you reserve materials from nearby sellers or someone reserves your surplus, they'll appear here."
      />

      <div className="p-3.5 rounded-xl bg-[#12161f] border border-[#232c3d] space-y-1 text-[11px] text-slate-400">
        <p className="font-semibold text-slate-300">🛡️ Zero-Spam Contact Guarantee</p>
        <p>Phone numbers are only revealed after the seller accepts the reservation.</p>
      </div>
    </div>
  );
}
