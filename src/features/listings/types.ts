export interface NearbyListing {
  id: string;
  sellerId: string;
  materialId: string;
  materialKey: string;
  materialNameEn: string;
  materialNameTa: string;
  qtyAvailable: number;
  unit: string;
  condition: "unused" | "good" | "fair" | "damaged";
  askPrice: number;
  originalPrice: number;
  savingsPercent: number;
  distanceKm: number;
  distanceM: number;
  areaText: string;
  photos: string[];
  negotiable: boolean;
  status: string;
  isDemo: boolean;
  createdAt: string;
}

export interface BrowseFilters {
  lat: number;
  lng: number;
  radiusKm: number;
  materialKey?: string;
  limit?: number;
  offset?: number;
}
