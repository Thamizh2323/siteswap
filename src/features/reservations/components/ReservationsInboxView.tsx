"use client";

import React, { useState } from "react";
import type { ReservationItem } from "../constants";
import {
  respondReservationAction,
  completeReservationAction,
  getContactAction,
} from "../actions";
import { ReservationCard } from "./ReservationCard";

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
  const [impactMap, setImpactMap] = useState<
    Record<string, { kgDiverted: number; co2SavedKg: number; moneySaved: number }>
  >({});
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

  const handleConfirmReceived = async (id: string) => {
    setActionError(null);
    setLoadingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await completeReservationAction({ reservationId: id });
      if (!res.ok) {
        setActionError(res.error.message);
        return;
      }
      setCompletedIds((prev) => [...prev, id]);
      setImpactMap((prev) => ({ ...prev, [id]: res.data }));
    } finally {
      setLoadingIds((prev) => ({ ...prev, [id]: false }));
    }
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
          {listItems.map((item) => (
            <ReservationCard
              key={item.id}
              item={item}
              activeTab={activeTab}
              isCompleted={item.status === "completed" || completedIds.includes(item.id)}
              isLoading={Boolean(loadingIds[item.id])}
              impact={impactMap[item.id]}
              onSellerResponse={handleSellerResponse}
              onConfirmReceived={handleConfirmReceived}
            />
          ))}
        </div>
      )}
    </div>
  );
}
