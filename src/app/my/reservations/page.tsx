"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ReservationItem {
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

const DEMO_PURCHASES: ReservationItem[] = [
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

const DEMO_REQUESTS: ReservationItem[] = [
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

export default function ReservationsInboxPage() {
  const [activeTab, setActiveTab] = useState<"purchases" | "requests">("purchases");
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);

  const handleConfirmReceived = (id: string) => {
    setCompletedIds([...completedIds, id]);
  };

  const handleSellerResponse = (id: string, accept: boolean) => {
    if (accept) {
      setAcceptedIds([...acceptedIds, id]);
    }
  };

  const listItems = activeTab === "purchases" ? DEMO_PURCHASES : DEMO_REQUESTS;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#FAFAFA]">Reservations Inbox</h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
          Manage your materials holds, buyer inquiries, and handover completions.
        </p>
      </div>

      {/* Segmented Tab Bar: My Purchases vs Incoming Requests */}
      <div className="flex border-b border-[#27272A] gap-4">
        <button
          onClick={() => setActiveTab("purchases")}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "purchases"
              ? "border-[#F59E0B] text-[#F59E0B]"
              : "border-transparent text-[#A1A1AA] hover:text-[#FAFAFA]"
          }`}
        >
          <span>My Purchases</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-[#141417] text-[#FAFAFA] border border-[#27272A]">
            {DEMO_PURCHASES.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "requests"
              ? "border-[#F59E0B] text-[#F59E0B]"
              : "border-transparent text-[#A1A1AA] hover:text-[#FAFAFA]"
          }`}
        >
          <span>Incoming Requests</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-[#141417] text-[#FAFAFA] border border-[#27272A]">
            {DEMO_REQUESTS.length}
          </span>
        </button>
      </div>

      {/* Card Grid (Responsive: grid-cols-1 md:grid-cols-2 gap-4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listItems.map((item) => {
          const isCompleted = completedIds.includes(item.id);
          const isAccepted = item.status === "accepted" || acceptedIds.includes(item.id);

          return (
            <Card
              key={item.id}
              className="p-5 bg-[#141417] border-[#27272A] flex flex-col justify-between space-y-4"
            >
              {/* Card Header & Status */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#FAFAFA] line-clamp-1">
                      {item.listingTitle}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">{item.counterpartyName}</p>
                  </div>

                  {isCompleted ? (
                    <Badge variant="success">Completed</Badge>
                  ) : isAccepted ? (
                    <Badge variant="success">Accepted</Badge>
                  ) : (
                    <Badge variant="warning">Pending</Badge>
                  )}
                </div>

                {/* Reservation Metric Row */}
                <div className="p-3 rounded-lg bg-[#09090B] border border-[#27272A] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#A1A1AA]">Quantity Held: </span>
                    <strong className="text-[#FAFAFA] tabular-nums">
                      {item.qty} {item.unit}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA]">Total: </span>
                    <strong className="text-[#F59E0B] text-sm tabular-nums">
                      ₹{item.totalPrice.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons based on status and tab */}
              <div className="pt-2 border-t border-[#27272A] space-y-3">
                {/* When ACCEPTED: reveal Call & WhatsApp via get_contact RPC */}
                {isAccepted && !isCompleted && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${item.counterpartyPhone || "+919876543210"}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#1C1C21] hover:bg-[#27272A] text-xs font-bold text-[#FAFAFA] border border-[#27272A] transition-colors"
                      >
                        <span>📞</span> Call
                      </a>
                      <a
                        href={`https://wa.me/${(item.counterpartyPhone || "+919876543210").replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#10B981] hover:bg-[#059669] text-xs font-bold text-white transition-colors"
                      >
                        <span>💬</span> WhatsApp
                      </a>
                    </div>

                    {activeTab === "purchases" && (
                      <Button
                        size="md"
                        className="w-full text-xs font-bold"
                        onClick={() => handleConfirmReceived(item.id)}
                      >
                        Confirm Received (Log Impact)
                      </Button>
                    )}
                  </div>
                )}

                {/* When PENDING on Purchases: countdown notice */}
                {!isAccepted && activeTab === "purchases" && (
                  <div className="p-3 rounded-lg bg-[#09090B] border border-[#27272A] text-center text-xs text-[#A1A1AA]">
                    <span className="text-[#F59E0B] font-semibold">{item.expiresInText}</span> • Phone reveals on seller accept
                  </div>
                )}

                {/* When PENDING on Incoming Requests: Accept / Decline buttons */}
                {!isAccepted && activeTab === "requests" && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-[#A1A1AA] text-center">{item.expiresInText}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSellerResponse(item.id, true)}
                      >
                        Accept Hold
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSellerResponse(item.id, false)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                )}

                {/* When COMPLETED */}
                {isCompleted && (
                  <div className="p-3 rounded-lg bg-[#10B981]/10 text-center text-xs font-bold text-[#10B981]">
                    ✅ Handover Confirmed & Tonnes Diverted Logged
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
