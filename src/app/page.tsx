import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/i18n/t";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-[#161c28] via-[#10141e] to-[#0d1017] border border-[#232c3d] shadow-xl">
        <div className="max-w-3xl space-y-4">
          <Badge variant="accent">{t("home.hero_badge")}</Badge>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t("home.hero_title_left")}{" "}
            <span className="text-orange-500">{t("home.hero_title_accent")}</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {t("home.hero_desc")}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
            <Link href="/browse" className="sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8">
                {t("home.find_btn")}
              </Button>
            </Link>
            <Link href="/sell/new" className="sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                {t("home.post_btn")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Impact Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 text-center sm:text-left space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-400">12.4 t</div>
          <div className="text-xs text-slate-400">{t("home.stat_diverted")}</div>
        </Card>
        <Card className="p-5 text-center sm:text-left space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">4.1 t</div>
          <div className="text-xs text-slate-400">{t("home.stat_co2")}</div>
        </Card>
        <Card className="p-5 text-center sm:text-left space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">₹84,200</div>
          <div className="text-xs text-slate-400">{t("home.stat_saved")}</div>
        </Card>
      </div>

      {/* Responsive Showcase / Nearby Banner */}
      <Card hoverable className="p-6 bg-[#12161f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm sm:text-base font-semibold text-slate-100">
            {t("home.nearby_title")}
          </div>
          <div className="text-xs sm:text-sm text-slate-400">
            {t("home.nearby_desc")}
          </div>
        </div>
        <Link href="/browse">
          <Button variant="outline" size="sm">
            {t("common.view")} &rarr;
          </Button>
        </Link>
      </Card>
    </div>
  );
}
