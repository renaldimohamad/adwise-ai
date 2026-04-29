"use client";

import { motion } from "framer-motion";

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-full">
          <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded-md w-1/3 animate-pulse"></div>
          <div className="h-6 bg-gray-100 dark:bg-slate-800 rounded-md w-2/3 animate-pulse"></div>
        </div>
        <div className="w-8 h-8 bg-gray-50 dark:bg-slate-800 rounded-lg animate-pulse"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 bg-gray-50 dark:bg-slate-800 rounded-md w-1/2 animate-pulse"></div>
            <div className="h-5 bg-gray-100 dark:bg-slate-800 rounded-md w-3/4 animate-pulse"></div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-50 dark:border-slate-800">
        <div className="h-4 bg-gray-50 dark:bg-slate-800 rounded-md w-1/3 animate-pulse"></div>
      </div>
    </div>
  );
}

export function PremiumSpinner() {
  return (
    <div className="relative w-12 h-12">
      <motion.div
        className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900/30 rounded-full"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 border-t-4 border-indigo-600 dark:border-t-indigo-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
