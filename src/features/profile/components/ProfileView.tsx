"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updateProfileAction } from "../actions";
import type { ProfileRecord } from "../queries";

export function ProfileView({
  initialProfile,
  onSignOut,
}: {
  initialProfile: ProfileRecord;
  onSignOut?: () => Promise<unknown>;
}) {
  const [name, setName] = useState(initialProfile.name || "");
  const [phone, setPhone] = useState(initialProfile.phone || "");
  const [role, setRole] = useState(initialProfile.role);
  const [areaText, setAreaText] = useState(initialProfile.area_text || "");
  const [lang, setLang] = useState(initialProfile.lang);

  const [isLoading, setIsLoading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);

    const res = await updateProfileAction({
      name,
      phone,
      role,
      area_text: areaText,
      lang,
    });

    setIsLoading(false);
    if (!res.ok) {
      setStatusMsg({ type: "error", text: res.error.message });
    } else {
      setStatusMsg({ type: "success", text: "Profile updated successfully!" });
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    if (onSignOut) {
      await onSignOut();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#FAFAFA]">Account & Profile</h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
          Manage your contact credentials, operating area, and role permissions.
        </p>
      </div>

      <Card className="p-6 bg-[#141417] border-[#27272A] space-y-6">
        {/* Header with Avatar & Role Badge */}
        <div className="flex items-center gap-4 pb-4 border-b border-[#27272A]">
          <div className="w-14 h-14 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center font-bold text-xl border border-[#F59E0B]/30">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#FAFAFA]">{name || "SiteSwap User"}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="accent" className="capitalize">
                {role}
              </Badge>
              {initialProfile.is_admin && <Badge variant="warning">Admin</Badge>}
              <Badge variant="outline">{areaText || "Salem Region"}</Badge>
            </div>
          </div>
        </div>

        {statusMsg && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold ${
              statusMsg.type === "success"
                ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        {/* Profile Update Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Thamizh Contractor"
            required
          />

          <Input
            label="Phone Number (shared with counterparty only after hold is accepted)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            helperText="Encrypted & protected by get_contact RPC"
          />

          <Input
            label="Operating Area"
            value={areaText}
            onChange={(e) => setAreaText(e.target.value)}
            placeholder="e.g. Fairlands, Salem"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#A1A1AA]">
              Role on Marketplace
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["buyer", "seller", "both"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-2 rounded-lg text-xs font-bold capitalize transition-all border ${
                    role === r
                      ? "bg-[#F59E0B] text-[#09090B] border-[#F59E0B]"
                      : "bg-[#09090B] text-[#A1A1AA] border-[#27272A]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#A1A1AA]">
              Preferred Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                  lang === "en"
                    ? "bg-[#F59E0B] text-[#09090B] border-[#F59E0B]"
                    : "bg-[#09090B] text-[#A1A1AA] border-[#27272A]"
                }`}
              >
                English (EN)
              </button>
              <button
                type="button"
                onClick={() => setLang("ta")}
                className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                  lang === "ta"
                    ? "bg-[#F59E0B] text-[#09090B] border-[#F59E0B]"
                    : "bg-[#09090B] text-[#A1A1AA] border-[#27272A]"
                }`}
              >
                தமிழ் (Tamil)
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#27272A] flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-1" isLoading={isLoading}>
              Save Profile Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleSignOut}
              isLoading={isSigningOut}
            >
              Sign Out
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
