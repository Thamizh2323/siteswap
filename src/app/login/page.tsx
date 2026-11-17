import React, { Suspense } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function LoginForm() {
  return (
    <Card className="max-w-md w-full p-6 sm:p-8 bg-[#141417] border-[#27272A] space-y-6">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 mx-auto rounded-xl bg-[#F59E0B] flex items-center justify-center font-bold text-lg text-[#09090B]">
          S
        </div>
        <h1 className="text-2xl font-extrabold text-[#FAFAFA]">Sign In</h1>
        <p className="text-xs text-[#A1A1AA]">
          Sign in to post surplus materials, hold reservations, or view seller details.
        </p>
      </div>

      <div className="space-y-4">
        <Input label="Email address" type="email" placeholder="you@domain.com" />
        <Input label="Password" type="password" placeholder="••••••••" />

        <Button size="lg" className="w-full">
          Sign In
        </Button>
      </div>

      <div className="pt-2 border-t border-[#27272A] flex flex-col items-center gap-3 text-xs text-[#A1A1AA]">
        <Badge variant="accent">Phase A: S3 Supabase Auth Ready</Badge>
        <p className="text-[11px] text-center">
          Back to{" "}
          <Link href="/" className="text-[#F59E0B] hover:underline font-semibold">
            Home
          </Link>{" "}
          or{" "}
          <Link href="/browse" className="text-[#F59E0B] hover:underline font-semibold">
            Browse Materials
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <Suspense fallback={<div className="text-xs text-[#A1A1AA]">Loading auth...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
