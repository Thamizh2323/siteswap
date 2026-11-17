import React, { Suspense } from "react";
import { requireUser } from "@/server/auth";
import { signOutAction } from "@/features/auth/actions";
import { getProfile } from "@/features/profile/queries";
import { ProfileView } from "@/features/profile/components/ProfileView";

async function ProfileContent() {
  await requireUser();
  const profile = await getProfile();
  return <ProfileView initialProfile={profile} onSignOut={signOutAction} />;
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto p-6 rounded-xl bg-[#141417] border border-[#27272A] text-xs text-[#A1A1AA] animate-pulse">
          Loading profile...
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
