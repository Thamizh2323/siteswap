import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-[#1a202c] rounded-md ${className}`} />;
}
