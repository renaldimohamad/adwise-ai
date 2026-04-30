"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "variant"> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "premium";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white shadow-glow hover:brightness-110",
      premium: "bg-gradient-to-br from-primary via-secondary to-secondary text-white shadow-glow border border-white/10 hover:scale-[1.02] active:scale-[0.98]",
      secondary: "bg-foreground/[0.03] dark:bg-white/[0.02] text-foreground border border-border hover:bg-foreground/[0.08]",
      danger: "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600",
      outline: "bg-transparent border border-border text-foreground hover:bg-foreground/5",
      ghost: "bg-transparent text-foreground hover:bg-foreground/5",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading || disabled}
        className={`
          relative flex items-center justify-center gap-3 px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] 
          transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden
          ${variants[variant as keyof typeof variants] || variants.primary}
          ${className}
        `}
        {...props}
      >
        {variant === "premium" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform" />
        )}

        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="transition-transform group-hover:-translate-x-1">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="transition-transform group-hover:translate-x-1">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
