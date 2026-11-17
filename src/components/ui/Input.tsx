import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className = "", id, ...props }: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#A1A1AA]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-[#09090B] border ${
          error ? "border-red-500 focus:border-red-400" : "border-[#27272A] focus:border-[#F59E0B]"
        } rounded-lg px-3.5 py-2.5 text-sm text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/50 transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#A1A1AA]">{helperText}</p>}
    </div>
  );
}
