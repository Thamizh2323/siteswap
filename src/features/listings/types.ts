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
  lat?: number;
  lng?: number;
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

export interface ListingDetail {
  id: string;
  title: string;
  materialKey: string;
  materialNameEn: string;
  materialNameTa: string;
  unit: string;
  qtyAvailable: number;
  qtyTotal: number;
  askPrice: number;
  originalPrice: number;
  savingsPercent: number;
  condition: "unused" | "good" | "fair" | "damaged";
  pickupType: "self" | "seller_delivers";
  areaText: string;
  photos: string[];
  negotiable: boolean;
  status: string;
  isDemo: boolean;
  createdAt: string;
  seller: {
    id: string;
    name: string;
    role: string;
    areaText: string;
  };
}
