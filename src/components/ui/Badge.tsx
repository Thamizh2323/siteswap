import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "accent" | "outline";
}

export function Badge({ children, variant = "default", className = "", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#1a202c] text-slate-300 border border-[#232c3d]",
    accent: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    danger: "bg-red-500/15 text-red-400 border border-red-500/30",
    outline: "border border-slate-700 text-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tracking-tight ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
