import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ children, hoverable = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-[#12161f] border border-[#232c3d] rounded-xl p-4 transition-all ${
        hoverable ? "hover:border-slate-700 hover:bg-[#151b26] cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-3 flex items-center justify-between ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-base font-semibold text-slate-100 ${className}`}>{children}</h3>;
}
