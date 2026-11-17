"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signInAction, signUpAction } from "../actions";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/browse";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"seller" | "buyer" | "both">("both");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setFieldErrors({});

    if (mode === "signin") {
      const res = await signInAction({ email, password });
      if (!res.ok) {
        setIsLoading(false);
        setErrorMsg(res.error.message);
        if (res.error.fields) setFieldErrors(res.error.fields);
        return;
      }
    } else {
      const res = await signUpAction({ email, password, name, phone, role });
      if (!res.ok) {
        setIsLoading(false);
        setErrorMsg(res.error.message);
        if (res.error.fields) setFieldErrors(res.error.fields);
        return;
      }
    }

    setIsLoading(false);
    router.push(nextUrl);
    router.refresh();
  };

  return (
    <Card className="max-w-md w-full p-6 sm:p-8 bg-[#141417] border-[#27272A] space-y-6">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 mx-auto rounded-xl bg-[#F59E0B] flex items-center justify-center font-extrabold text-lg text-[#09090B]">
          S
        </div>
        <h1 className="text-2xl font-extrabold text-[#FAFAFA]">
          {mode === "signin" ? "Welcome Back" : "Join SiteSwap"}
        </h1>
        <p className="text-xs text-[#A1A1AA]">
          {mode === "signin"
            ? "Sign in to post surplus, reserve materials, or reveal contacts."
            : "Create an account to divert construction surplus and save money locally."}
        </p>
      </div>

      {/* Segmented Mode Selector */}
      <div className="grid grid-cols-2 p-1 rounded-lg bg-[#09090B] border border-[#27272A]">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setErrorMsg(null);
          }}
          className={`py-2 text-xs font-bold rounded-md transition-all ${
            mode === "signin"
              ? "bg-[#F59E0B] text-[#09090B] shadow-xs"
              : "text-[#A1A1AA] hover:text-[#FAFAFA]"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setErrorMsg(null);
          }}
          className={`py-2 text-xs font-bold rounded-md transition-all ${
            mode === "signup"
              ? "bg-[#F59E0B] text-[#09090B] shadow-xs"
              : "text-[#A1A1AA] hover:text-[#FAFAFA]"
          }`}
        >
          Create Account
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <Input
            label="Full Name or Business Name"
            placeholder="e.g. Ramesh Mason Works"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name}
            required
          />
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="builder@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          required
        />

        <Input
          label="Password (min 6 characters)"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          required
        />

        {mode === "signup" && (
          <>
            <Input
              label="Phone Number (for pickup coordination)"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={fieldErrors.phone}
              helperText="Hidden until seller accepts hold request"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#A1A1AA]">
                Primary Activity
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
          </>
        )}

        <Button size="lg" className="w-full mt-2" isLoading={isLoading}>
          {mode === "signin" ? "Sign In" : "Register Account"}
        </Button>
      </form>

      <div className="pt-2 border-t border-[#27272A] flex flex-col items-center gap-2 text-xs text-[#A1A1AA]">
        <Badge variant="accent">Supabase Auth Connected</Badge>
        <p className="text-[11px] text-center text-[#71717A]">
          By continuing, you agree to SiteSwap community guidelines for fair material inspection.
        </p>
      </div>
    </Card>
  );
}
