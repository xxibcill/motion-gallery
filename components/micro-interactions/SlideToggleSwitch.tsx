"use client";

import type { ButtonHTMLAttributes } from "react";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface SlideToggleSwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "defaultValue"> {
  defaultChecked?: boolean;
  size?: number;
  damping?: number;
}

export function SlideToggleSwitch({
  defaultChecked = false,
  size = 1,
  damping = 24,
  disabled = false,
  className = "",
  ...props
}: SlideToggleSwitchProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [checked, setChecked] = useState(defaultChecked);

  const width = 72 * size;
  const height = 40 * size;
  const thumb = 30 * size;
  const x = width - thumb - 5 * size;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => setChecked((current) => !current)}
      className={`relative inline-flex items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-45 ${
        checked
          ? "border-cyan-200/30 bg-cyan-300/18"
          : "border-white/10 bg-white/[0.06]"
      } ${className}`}
      style={{ width, height }}
      {...props}
    >
      <span
        className={`absolute inset-[1px] rounded-full ${
          checked
            ? "bg-[linear-gradient(90deg,rgba(34,211,238,0.22),rgba(125,211,252,0.38))]"
            : "bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]"
        }`}
      />
      <motion.span
        className="absolute inset-y-1 left-1 rounded-full bg-cyan-200/15"
        animate={{
          width: checked ? width - 8 * size : thumb + 10 * size,
          opacity: checked ? 1 : 0.45,
        }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
        }
      />
      <motion.span
        className="absolute left-[4px] top-[4px] flex items-center justify-center rounded-full bg-white text-slate-950 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.85)]"
        style={{ width: thumb, height: thumb }}
        animate={{ x: checked ? x : 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 340, damping }
        }
      >
        <motion.span
          animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.7 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.16 }}
        >
          ✓
        </motion.span>
        <motion.span
          className="absolute"
          animate={{ opacity: checked ? 0 : 1, scale: checked ? 0.7 : 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.16 }}
        >
          •
        </motion.span>
      </motion.span>
    </button>
  );
}
