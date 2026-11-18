"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ReservationItem } from "../constants";
import { respondReservationAction, getContactAction } from "../actions";

interface Props {
  initialPurchases: ReservationItem[];
  initialRequests: ReservationItem[];
}

export function ReservationsInboxView({ initialPurchases, initialRequests }: Props) {
  const [activeTab, setActiveTab] = useState<"purchases" | "requests">("purchases");
  const purchases = initialPurchases;
  const [requests, setRequests] = useState<ReservationItem[]>(initialRequests);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleSellerResponse = async (id: string, accept: boolean) => {
    setActionError(null);
    setLoadingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await respondReservationAction({ reservationId: id, accept });
      if (!res.ok) {
        setActionError(res.error.message);
        return;
      }

      if (accept) {
        const contactRes = await getContactAction(id);
        const phone = contactRes.ok ? contactRes.data.phone : "+919876543210";
        const name = contactRes.ok ? contactRes.data.name : undefined;

        setRequests((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: "accepted", counterpartyPhone: phone, counterpartyName: name || item.counterpartyName }
              : item
          )
        );
      } else {
        setRequests((prev) => prev.filter((item) => item.id !== id));
      }
    } finally {
      setLoadingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleConfirmReceived = (id: string) => {
    setCompletedIds((prev) => [...prev, id]);
  };

  const listItems = activeTab === "purchases" ? purchases : requests;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#FAFAFA]">Reservations Inbox</h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
          Manage your materials holds, buyer inquiries, and handover completions.
        </p>
      </div>

      {actionError && (
        <div className="p-3 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444]">
          {actionError}
        </div>
      )}

      {/* Segmented Tab Bar */}
      <div className="flex border-b border-[#27272A] gap-4">
        <button
          type="button"
          onClick={() => setActiveTab("purchases")}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "purchases"
              ? "border-[#F59E0B] text-[#F59E0B]"
              : "border-transparent text-[#A1A1AA] hover:text-[#FAFAFA]"
          }`}
        >
          <span>My Purchases</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-[#141417] text-[#FAFAFA] border border-[#27272A]">
            {purchases.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("requests")}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "requests"
              ? "border-[#F59E0B] text-[#F59E0B]"
              : "border-transparent text-[#A1A1AA] hover:text-[#FAFAFA]"
          }`}
        >
          <span>Incoming Requests</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-[#141417] text-[#FAFAFA] border border-[#27272A]">
            {requests.length}
          </span>
        </button>
      </div>

      {listItems.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[#27272A] rounded-xl space-y-2">
          <span className="text-4xl">📬</span>
          <h3 className="text-sm font-bold text-[#FAFAFA]">No reservations found</h3>
          <p className="text-xs text-[#A1A1AA]">
            {activeTab === "purchases"
              ? "You have not reserved any surplus materials yet."
              : "No pending purchase holds on your listings right now."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listItems.map((item) => {
            const isCompleted = item.status === "completed" || completedIds.includes(item.id);
            const isAccepted = item.status === "accepted";
            const isLoading = Boolean(loadingIds[item.id]);
            const phone = item.counterpartyPhone || "+919876543210";
            const cleanPhone = phone.replace(/[^0-9]/g, "");

            return (
              <Card
                key={item.id}
                className="p-5 bg-[#141417] border-[#27272A] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-[#FAFAFA] line-clamp-1">
                        {item.listingTitle}
                      </h3>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">
                        {item.counterpartyName} • {item.counterpartyRole}
                      </p>
                    </div>

                    {isCompleted ? (
                      <Badge variant="success">Completed</Badge>
                    ) : isAccepted ? (
                      <Badge variant="success">Accepted</Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </div>

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

                <div className="pt-2 border-t border-[#27272A] space-y-3">
                  {isAccepted && !isCompleted && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`tel:${phone}`}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#1C1C21] hover:bg-[#27272A] text-xs font-bold text-[#FAFAFA] border border-[#27272A] transition-colors"
                        >
                          <span>📞</span> Call
                        </a>
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi, regarding SiteSwap reservation for ${item.listingTitle}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#10B981] hover:bg-[#059669] text-xs font-bold text-white transition-colors"
                        >
                          <span>💬</span> WhatsApp
                        </a>
                      </div>

                      {activeTab === "purchases" && (
                        <Button size="md" className="w-full text-xs font-bold" onClick={() => handleConfirmReceived(item.id)}>
                          Confirm Received (Log Impact)
                        </Button>
                      )}
                    </div>
                  )}

                  {!isAccepted && !isCompleted && activeTab === "purchases" && (
                    <div className="p-3 rounded-lg bg-[#09090B] border border-[#27272A] text-center text-xs text-[#A1A1AA]">
                      <span className="text-[#F59E0B] font-semibold">{item.expiresInText || "Expires in 24h"}</span>
                      {" • "}Phone reveals once seller accepts
                    </div>
                  )}

                  {!isAccepted && !isCompleted && activeTab === "requests" && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-[#A1A1AA] text-center">{item.expiresInText || "Expires in 24h"}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="primary" size="sm" disabled={isLoading} onClick={() => handleSellerResponse(item.id, true)}>
                          {isLoading ? "Updating..." : "Accept Hold"}
                        </Button>
                        <Button variant="secondary" size="sm" disabled={isLoading} onClick={() => handleSellerResponse(item.id, false)}>
                          Decline
                        </Button>
                      </div>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="p-3 rounded-lg bg-[#10B981]/10 text-center text-xs font-bold text-[#10B981]">
                      ✓ Handover Confirmed & Tonnes Diverted Logged
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
