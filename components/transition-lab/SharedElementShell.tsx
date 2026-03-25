"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getSharedElementTransition } from "@/lib/transition-lab";

interface SharedElementShellProps {
  layoutId: string;
  label: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function SharedElementShell({
  layoutId,
  label,
  title,
  children,
  className = "",
}: SharedElementShellProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      layout
      layoutId={layoutId}
      transition={getSharedElementTransition(prefersReducedMotion)}
      className={`rounded-[1.75rem] border border-white/12 bg-black/30 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-md ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="text-[0.65rem] uppercase tracking-[0.28em] text-white/50">
          {label}
        </span>
        <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
      </div>
      <div className="space-y-3">
        <h2 className="font-serif text-2xl text-white">{title}</h2>
        {children}
      </div>
    </motion.div>
  );
}
