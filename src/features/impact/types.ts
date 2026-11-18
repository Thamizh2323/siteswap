export interface ImpactMetrics {
  tonnes: number;
  co2Kg: number;
  rupees: number;
  deals: number;
}

export interface MaterialBreakdownItem {
  materialKey: string;
  nameEn: string;
  nameTa: string;
  divertedKg: number;
  percent: number;
  color: string;
}

export interface RecentImpactItem {
  id: string;
  materialName: string;
  qty: number;
  unit: string;
  kgDiverted: number;
  co2AvoidedKg: number;
  moneySaved: number;
  completedAtText: string;
  isDemo: boolean;
}

export interface ImpactDashboardData {
  live: ImpactMetrics;
  withDemo: ImpactMetrics;
  breakdown: MaterialBreakdownItem[];
  recent: RecentImpactItem[];
}
