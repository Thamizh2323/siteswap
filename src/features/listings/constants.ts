export interface DemoListing {
  id: string;
  title: string;
  materialKey: string;
  qtyAvailable: number;
  unit: string;
  condition: "good" | "fair" | "damaged" | "unused";
  askPrice: number;
  originalPrice: number;
  savingsPercent: number;
  distanceKm: number;
  locationText: string;
  lat: number;
  lng: number;
  photoUrl: string;
}

export const DEMO_LISTINGS: DemoListing[] = [
  {
    id: "l-1",
    title: "Red Clay Bricks (Surplus Lot)",
    materialKey: "red_clay_brick",
    qtyAvailable: 450,
    unit: "nos",
    condition: "good",
    askPrice: 5.5,
    originalPrice: 7.0,
    savingsPercent: 21,
    distanceKm: 1.8,
    locationText: "Near Fairlands, Salem",
    lat: 11.671,
    lng: 78.142,
    photoUrl: "🧱",
  },
  {
    id: "l-2",
    title: "UltraTech Cement Bags (Sealed)",
    materialKey: "cement_bag",
    qtyAvailable: 14,
    unit: "bags",
    condition: "good",
    askPrice: 310,
    originalPrice: 420,
    savingsPercent: 26,
    distanceKm: 2.4,
    locationText: "Suramangalam, Salem",
    lat: 11.662,
    lng: 78.125,
    photoUrl: "📦",
  },
  {
    id: "l-3",
    title: "TMT Steel Rebars (12mm / 16mm)",
    materialKey: "tmt_steel",
    qtyAvailable: 120,
    unit: "kg",
    condition: "good",
    askPrice: 50,
    originalPrice: 65,
    savingsPercent: 23,
    distanceKm: 3.7,
    locationText: "Ammapet, Salem",
    lat: 11.654,
    lng: 78.172,
    photoUrl: "🏗️",
  },
  {
    id: "l-4",
    title: "Filtered M-Sand (Plastering Grade)",
    materialKey: "m_sand",
    qtyAvailable: 80,
    unit: "cft",
    condition: "fair",
    askPrice: 24,
    originalPrice: 35,
    savingsPercent: 31,
    distanceKm: 4.5,
    locationText: "Kandhampatty Bypass, Salem",
    lat: 11.639,
    lng: 78.118,
    photoUrl: "🏖️",
  },
  {
    id: "l-5",
    title: "Solid Concrete Blocks (8-inch)",
    materialKey: "solid_block",
    qtyAvailable: 180,
    unit: "nos",
    condition: "good",
    askPrice: 42,
    originalPrice: 55,
    savingsPercent: 24,
    distanceKm: 5.1,
    locationText: "Attur Road, Salem",
    lat: 11.649,
    lng: 78.201,
    photoUrl: "🪨",
  },
  {
    id: "l-6",
    title: "Kajaria Floor Tiles (60x60 cm Unopened)",
    materialKey: "floor_tile",
    qtyAvailable: 35,
    unit: "sqft",
    condition: "unused",
    askPrice: 32,
    originalPrice: 45,
    savingsPercent: 28,
    distanceKm: 6.2,
    locationText: "Meyyanur, Salem",
    lat: 11.674,
    lng: 78.131,
    photoUrl: "Tiles",
  },
];

export const MATERIAL_FILTERS = [
  { key: "all", label: "All Materials" },
  { key: "red_clay_brick", label: "Red Clay Brick" },
  { key: "cement_bag", label: "Cement Bag" },
  { key: "tmt_steel", label: "TMT Steel" },
  { key: "m_sand", label: "M-Sand" },
];

export const MATERIALS_CATALOG = [
  { key: "red_clay_brick", name: "Red Clay Brick", unit: "nos", refPrice: 7.0 },
  { key: "fly_ash_brick", name: "Fly Ash Brick", unit: "nos", refPrice: 6.0 },
  { key: "solid_block", name: "Solid Concrete Block", unit: "nos", refPrice: 55.0 },
  { key: "cement_bag", name: "Cement Bag (50kg)", unit: "bags", refPrice: 420.0 },
  { key: "tmt_steel", name: "TMT Steel Bar", unit: "kg", refPrice: 65.0 },
  { key: "m_sand", name: "M-Sand", unit: "cft", refPrice: 35.0 },
];
