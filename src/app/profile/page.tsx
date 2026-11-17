import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Your Profile</h2>
        <p className="text-xs sm:text-sm text-slate-400">Manage your contact, language, and role preferences.</p>
      </div>

      <Card className="space-y-5 p-6">
        <div className="flex items-center gap-4 pb-4 border-b border-[#1f2633]">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xl">
            T
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Thamizh (Chief)</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="accent">Contractor & Buyer</Badge>
              <Badge variant="outline">Salem</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Input label="Display Name" defaultValue="Thamizh" />
          <Input label="Phone (shared only after reservation accept)" defaultValue="+91 98765 43210" />
          <Input label="Operating Area" defaultValue="Salem & Suramangalam" />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button size="md" className="flex-1">
            Save Profile
          </Button>
          <Button size="md" variant="outline">
            Sign Out
          </Button>
        </div>
      </Card>

      <Card className="p-4 bg-[#12161f] border-[#232c3d] space-y-1">
        <span className="text-sm font-semibold text-slate-200">🌐 Language Selection</span>
        <p className="text-xs text-slate-400">English / தமிழ் toggle active in Module 6</p>
      </Card>
    </div>
  );
}
