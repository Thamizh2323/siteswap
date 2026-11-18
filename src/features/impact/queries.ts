import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  ImpactMetrics,
  MaterialBreakdownItem,
  RecentImpactItem,
  ImpactDashboardData,
} from "./types";

const DEMO_LIVE_METRICS: ImpactMetrics = {
  tonnes: 3.2,
  co2Kg: 1040,
  rupees: 22500,
  deals: 5,
};

const DEMO_TOTAL_METRICS: ImpactMetrics = {
  tonnes: 12.4,
  co2Kg: 4120,
  rupees: 84200,
  deals: 18,
};

const DEMO_BREAKDOWN: MaterialBreakdownItem[] = [
  { materialKey: "red_clay_brick", nameEn: "Red Clay Brick", nameTa: "சிவப்பு செங்கல்", divertedKg: 5200, percent: 42, color: "#F59E0B" },
  { materialKey: "m_sand", nameEn: "M-Sand", nameTa: "M-மணல்", divertedKg: 3600, percent: 29, color: "#10B981" },
  { materialKey: "cement_bag", nameEn: "Cement Bag (50kg)", nameTa: "சிமென்ட் பை", divertedKg: 2100, percent: 17, color: "#6366F1" },
  { materialKey: "tmt_steel", nameEn: "TMT Steel Bar", nameTa: "TMT எஃகு கம்பி", divertedKg: 1500, percent: 12, color: "#EC4899" },
];

const DEMO_RECENT: RecentImpactItem[] = [
  {
    id: "imp-1",
    materialName: "UltraTech Cement Bags",
    qty: 10,
    unit: "bags",
    kgDiverted: 500,
    co2AvoidedKg: 410,
    moneySaved: 1300,
    completedAtText: "Today, 11:45 AM",
    isDemo: true,
  },
  {
    id: "imp-2",
    materialName: "Red Clay Bricks",
    qty: 500,
    unit: "nos",
    kgDiverted: 1425,
    co2AvoidedKg: 313.5,
    moneySaved: 1250,
    completedAtText: "Yesterday, 4:20 PM",
    isDemo: true,
  },
  {
    id: "imp-3",
    materialName: "TMT Steel Bars",
    qty: 60,
    unit: "kg",
    kgDiverted: 60,
    co2AvoidedKg: 87.6,
    moneySaved: 900,
    completedAtText: "2 days ago",
    isDemo: true,
  },
];

export async function getImpactDashboardData(): Promise<ImpactDashboardData> {
  const supabase = await createServerSupabaseClient();

  try {
    // 1. Fetch live metrics (p_include_demo = false)
    const { data: liveData } = await supabase.rpc("impact_totals", {
      p_include_demo: false,
    });

    // 2. Fetch combined metrics (p_include_demo = true)
    const { data: withDemoData } = await supabase.rpc("impact_totals", {
      p_include_demo: true,
    });

    // 3. Fetch recent impact log entries
    const { data: recentRows } = await supabase
      .from("impact_log")
      .select(`
        id,
        qty,
        kg_diverted,
        co2_avoided_kg,
        money_saved,
        is_demo,
        created_at,
        materials (
          key,
          name_en,
          name_ta,
          unit
        )
      `)
      .order("created_at", { ascending: false })
      .limit(10);

    const liveRow = liveData && liveData.length > 0 ? liveData[0] : null;
    const withDemoRow = withDemoData && withDemoData.length > 0 ? withDemoData[0] : null;

    const liveMetrics: ImpactMetrics = {
      tonnes: liveRow ? Number(liveRow.tonnes || 0) : DEMO_LIVE_METRICS.tonnes,
      co2Kg: liveRow ? Number(liveRow.co2_kg || 0) : DEMO_LIVE_METRICS.co2Kg,
      rupees: liveRow ? Number(liveRow.rupees || 0) : DEMO_LIVE_METRICS.rupees,
      deals: liveRow ? Number(liveRow.deals || 0) : DEMO_LIVE_METRICS.deals,
    };

    const withDemoMetrics: ImpactMetrics = {
      tonnes: withDemoRow && Number(withDemoRow.deals || 0) > 0
        ? Number(withDemoRow.tonnes || 0)
        : DEMO_TOTAL_METRICS.tonnes,
      co2Kg: withDemoRow && Number(withDemoRow.deals || 0) > 0
        ? Number(withDemoRow.co2_kg || 0)
        : DEMO_TOTAL_METRICS.co2Kg,
      rupees: withDemoRow && Number(withDemoRow.deals || 0) > 0
        ? Number(withDemoRow.rupees || 0)
        : DEMO_TOTAL_METRICS.rupees,
      deals: withDemoRow && Number(withDemoRow.deals || 0) > 0
        ? Number(withDemoRow.deals || 0)
        : DEMO_TOTAL_METRICS.deals,
    };

    let recent: RecentImpactItem[] = [];
    if (recentRows && recentRows.length > 0) {
      recent = recentRows.map((r) => {
        const mat = Array.isArray(r.materials) ? r.materials[0] : r.materials;
        return {
          id: r.id,
          materialName: mat?.name_en || "Surplus Material",
          qty: Number(r.qty),
          unit: mat?.unit || "units",
          kgDiverted: Number(r.kg_diverted),
          co2AvoidedKg: Number(r.co2_avoided_kg),
          moneySaved: Number(r.money_saved),
          completedAtText: r.created_at ? new Date(r.created_at).toLocaleDateString() : "Recent",
          isDemo: Boolean(r.is_demo),
        };
      });
    } else {
      recent = DEMO_RECENT;
    }

    return {
      live: liveMetrics,
      withDemo: withDemoMetrics,
      breakdown: DEMO_BREAKDOWN,
      recent,
    };
  } catch {
    return {
      live: DEMO_LIVE_METRICS,
      withDemo: DEMO_TOTAL_METRICS,
      breakdown: DEMO_BREAKDOWN,
      recent: DEMO_RECENT,
    };
  }
}
