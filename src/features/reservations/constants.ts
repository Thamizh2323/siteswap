export interface ReservationItem {
  id: string;
  listingTitle: string;
  materialName: string;
  qty: number;
  unit: string;
  totalPrice: number;
  status: "accepted" | "pending" | "completed";
  counterpartyName: string;
  counterpartyRole: string;
  counterpartyPhone?: string;
  expiresInText?: string;
  createdAtText: string;
}

export const DEMO_PURCHASES: ReservationItem[] = [
  {
    id: "res-1",
    listingTitle: "UltraTech Cement Bags (Surplus Lot)",
    materialName: "Cement Bag (50kg)",
    qty: 10,
    unit: "bags",
    totalPrice: 2900,
    status: "accepted",
    counterpartyName: "Murugan Builders (Seller)",
    counterpartyRole: "Contractor",
    counterpartyPhone: "+919876543210",
    createdAtText: "Today, 11:30 AM",
  },
  {
    id: "res-2",
    listingTitle: "Red Clay Bricks (250 nos)",
    materialName: "Red Clay Brick",
    qty: 250,
    unit: "nos",
    totalPrice: 1375,
    status: "pending",
    counterpartyName: "Salem Mason Works (Seller)",
    counterpartyRole: "Mason",
    expiresInText: "Expires in 22h 15m",
    createdAtText: "Today, 1:15 PM",
  },
];

export const DEMO_REQUESTS: ReservationItem[] = [
  {
    id: "res-req-1",
    listingTitle: "TMT Steel Rebars (80 kg)",
    materialName: "TMT Steel Bar",
    qty: 80,
    unit: "kg",
    totalPrice: 4000,
    status: "pending",
    counterpartyName: "Karthi (Buyer)",
    counterpartyRole: "Home Builder",
    expiresInText: "Expires in 18h 40m",
    createdAtText: "Today, 12:45 PM",
  },
];
