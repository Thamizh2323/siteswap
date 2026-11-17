import React from "react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#232c3d] rounded-2xl bg-[#0d1017]">
      {icon ? (
        <div className="mb-4 text-slate-500">{icon}</div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-[#1a202c] text-slate-400 flex items-center justify-center mb-4">
          📦
        </div>
      )}
      <h4 className="text-sm font-semibold text-slate-200 mb-1">{title}</h4>
      <p className="text-xs text-slate-400 max-w-xs mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
