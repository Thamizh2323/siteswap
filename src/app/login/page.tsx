import React, { Suspense } from "react";
import { AuthForm } from "@/features/auth/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8 px-4">
      <Suspense fallback={<div className="text-xs text-[#A1A1AA]">Loading auth interface...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
