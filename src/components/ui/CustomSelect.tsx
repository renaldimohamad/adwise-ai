"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CustomSelect = ({ label, options, value, onChange, error }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 w-full relative" ref={containerRef}>
      <label className="block text-[10px] font-black text-foreground/40 ml-1 uppercase tracking-[0.3em]">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between bg-foreground/[0.03] dark:bg-white/[0.02] border rounded-2xl px-5 py-4 
          font-bold text-foreground transition-all duration-300 group
          ${isOpen ? "border-primary ring-4 ring-primary/10 shadow-lg" : "border-border hover:border-foreground/20"}
          ${error ? "border-red-500/50" : ""}
        `}
      >
        <div className="flex items-center gap-3">
          {selectedOption.icon && <div className="text-primary">{selectedOption.icon}</div>}
          <span className="text-sm">{selectedOption.label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-foreground/30 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 right-0 z-50 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden p-2 backdrop-blur-xl"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all
                  ${value === option.value ? "bg-primary text-white" : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"}
                `}
              >
                <div className="flex items-center gap-3">
                  {option.icon}
                  {option.label}
                </div>
                {value === option.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-[10px] text-red-500 font-black uppercase tracking-wider ml-1 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};
