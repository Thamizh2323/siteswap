import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "accent" | "outline";
}

export function Badge({ children, variant = "default", className = "", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#1C1C21] text-[#A1A1AA] border border-[#27272A]",
    accent: "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30",
    success: "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30",
    warning: "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30",
    danger: "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30",
    outline: "border border-[#27272A] text-[#A1A1AA] bg-transparent",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-tight ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
