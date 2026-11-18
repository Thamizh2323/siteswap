"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ReservationItem } from "../constants";

interface Props {
  item: ReservationItem;
  activeTab: "purchases" | "requests";
  isCompleted: boolean;
  isLoading: boolean;
  impact?: { kgDiverted: number; co2SavedKg: number; moneySaved: number };
  onSellerResponse: (id: string, accept: boolean) => void;
  onConfirmReceived: (id: string) => void;
}

export function ReservationCard({
  item,
  activeTab,
  isCompleted,
  isLoading,
  impact,
  onSellerResponse,
  onConfirmReceived,
}: Props) {
  const isAccepted = item.status === "accepted";
  const phone = item.counterpartyPhone || "+919876543210";
  const cleanPhone = phone.replace(/[^0-9]/g, "");

  return (
    <Card className="p-5 bg-[#141417] border-[#27272A] flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#FAFAFA] line-clamp-1">{item.listingTitle}</h3>
            <p className="text-xs text-[#A1A1AA] mt-0.5">{item.counterpartyName} • {item.counterpartyRole}</p>
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
            <strong className="text-[#FAFAFA] tabular-nums">{item.qty} {item.unit}</strong>
          </div>
          <div>
            <span className="text-[#A1A1AA]">Total: </span>
            <strong className="text-[#F59E0B] text-sm tabular-nums">₹{item.totalPrice.toLocaleString("en-IN")}</strong>
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
              <Button
                size="md"
                className="w-full text-xs font-bold"
                disabled={isLoading}
                onClick={() => onConfirmReceived(item.id)}
              >
                {isLoading ? "Logging Handover..." : "Confirm Received (Log Impact)"}
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
              <Button variant="primary" size="sm" disabled={isLoading} onClick={() => onSellerResponse(item.id, true)}>
                {isLoading ? "Updating..." : "Accept Hold"}
              </Button>
              <Button variant="secondary" size="sm" disabled={isLoading} onClick={() => onSellerResponse(item.id, false)}>
                Decline
              </Button>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#10B981]">
                <span>🎉</span>
                <span>Handover Confirmed & Impact Logged!</span>
              </div>
              {impact ? (
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                  Diverted <strong className="text-[#FAFAFA]">{impact.kgDiverted} kg</strong> •{" "}
                  Avoided <strong className="text-[#FAFAFA]">{impact.co2SavedKg} kg CO₂</strong> •{" "}
                  Saved <strong className="text-[#10B981]">₹{impact.moneySaved.toLocaleString("en-IN")}</strong>
                </p>
              ) : (
                <p className="text-[11px] text-[#A1A1AA]">
                  Surplus materials diverted from landfills and carbon footprint recorded.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <Link href="/impact" className="text-[#F59E0B] hover:underline font-semibold flex items-center gap-1">
                <span>View Impact Dashboard</span>
                <span>&rarr;</span>
              </Link>
              <div className="flex gap-2">
                <a href={`tel:${phone}`} className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">📞 Call</a>
                <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noreferrer" className="text-[#10B981] hover:underline">💬 WhatsApp</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
