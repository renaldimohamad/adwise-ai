"use client";

import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helperText, className, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    // Check if there's any value (controlled or uncontrolled)
    const [internalValue, setInternalValue] = useState("");
    const hasValue = isFocused || internalValue.length > 0 || (props.value !== undefined && props.value !== "");

    return (
      <div className="space-y-1.5 w-full text-left">
        <label className="block text-[10px] font-black text-foreground/30 ml-1 uppercase tracking-[0.3em]">
          {label}
        </label>
        
        <div className="relative group">
          {/* Background Highlight on focus */}
          <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-all duration-500 blur-xl" />
          
          <div className={`
            relative flex items-center bg-foreground/[0.03] dark:bg-white/[0.02] border rounded-2xl transition-all duration-300
            ${isFocused ? "border-primary ring-4 ring-primary/10 shadow-lg shadow-primary/5" : "border-border hover:border-foreground/20"}
            ${error ? "border-red-500/50 ring-red-500/10 focus-within:border-red-500" : ""}
            ${className}
          `}>
            {icon && (
              <div className={`pl-5 pr-0 transition-colors duration-300 ${isFocused ? "text-primary" : "text-foreground/30"}`}>
                {icon}
              </div>
            )}
            
            <input
              ref={ref}
              {...props}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur?.(e);
              }}
              onChange={(e) => {
                setInternalValue(e.target.value);
                props.onChange?.(e);
              }}
              className={`
                w-full bg-transparent px-5 py-4 font-bold text-foreground outline-none text-sm
                placeholder:text-foreground/20 placeholder:font-medium
                ${icon ? "pl-4" : ""}
              `}
            />
          </div>
        </div>

        <div className="flex justify-between px-1">
          {error ? (
            <p className="text-[9px] text-red-500 font-black uppercase tracking-wider animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          ) : helperText ? (
            <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-widest">
              {helperText}
            </p>
          ) : <div />}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
