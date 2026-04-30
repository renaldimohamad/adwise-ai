"use client";

import { motion } from "framer-motion";

export function SkeletonCard() {
  return (
    <div className="bg-card p-6 rounded-3xl shadow-premium border border-border flex flex-col space-y-5 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

      <div className="flex justify-between items-start z-10">
        <div className="space-y-3 w-full">
          <div className="h-3 bg-foreground/10 rounded-full w-24"></div>
          <div className="h-6 bg-foreground/5 rounded-xl w-48"></div>
        </div>
        <div className="w-10 h-10 bg-foreground/10 rounded-2xl"></div>
      </div>

      <div className="grid grid-cols-2 gap-6 py-4 z-10 border-t border-border/50">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-2.5 bg-foreground/5 rounded-full w-12"></div>
            <div className="h-5 bg-foreground/10 rounded-lg w-20"></div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border/50 z-10">
        <div className="h-4 bg-foreground/5 rounded-lg w-32"></div>
      </div>
    </div>
  );
}

export function PremiumSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4"
  };

  return (
    <div className={`relative ${sizes[size]}`}>
      <motion.div
        className="absolute inset-0 border-primary/20 rounded-full"
        style={{ borderStyle: "solid", borderTopColor: "transparent" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <div className={`absolute inset-0 border-foreground/5 rounded-full`} style={{ borderStyle: "solid" }} />
    </div>
  );
}

export function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card h-32 rounded-3xl border border-border animate-pulse shadow-premium" />
        ))}
      </div>
      <div className="bg-card h-[400px] rounded-3xl border border-border animate-pulse shadow-premium" />
    </div>
  );
}
