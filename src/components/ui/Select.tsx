"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="block text-[10px] font-black text-foreground/40 ml-1 uppercase tracking-[0.3em]">
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            className={`
              w-full bg-foreground/[0.03] dark:bg-white/[0.02] border border-border rounded-2xl px-6 py-4 
              font-bold text-foreground outline-none appearance-none cursor-pointer
              focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all
              ${error ? "border-red-500/50 focus:ring-red-500/10 focus:border-red-500" : ""}
              ${className}
            `}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-card text-foreground">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/30 group-focus-within:text-primary transition-colors">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && (
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
