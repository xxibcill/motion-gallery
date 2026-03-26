"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

export interface CopyChipButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  textToCopy?: string;
  idleLabel?: string;
  copiedLabel?: string;
  resetAfter?: number;
}

export function CopyChipButton({
  textToCopy = "motion-gallery://micro-interaction",
  idleLabel = "Copy",
  copiedLabel = "Copied",
  resetAfter = 1800,
  disabled = false,
  className = "",
  ...props
}: CopyChipButtonProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (disabled) {
      return;
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setCopied(true);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      }
    } catch {
      // Optimistic UI is the primary feedback path for this demo.
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      timeoutRef.current = null;
    }, resetAfter);
  };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={handleCopy}
      className={`relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-45 ${
        copied
          ? "border-emerald-300/40 bg-emerald-300/12 text-emerald-50"
          : "border-white/12 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.08]"
      } ${className}`}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      {...props}
    >
      <span className="relative h-5 w-[5.8rem] overflow-hidden text-left">
        {prefersReducedMotion ? (
          <span>{copied ? copiedLabel : idleLabel}</span>
        ) : (
          <>
            <motion.span
              className="absolute inset-0"
              animate={{
                y: copied ? "-135%" : "0%",
                opacity: copied ? 0 : 1,
              }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {idleLabel}
            </motion.span>
            <motion.span
              className="absolute inset-0"
              animate={{
                y: copied ? "0%" : "135%",
                opacity: copied ? 1 : 0,
              }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {copiedLabel}
            </motion.span>
          </>
        )}
      </span>

      <span className="relative h-5 w-5">
        {prefersReducedMotion ? (
          copied ? (
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
              <path
                d="M4 10.5L8 14.5L16 6.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
              <path
                d="M7 7.5V5.5C7 4.4 7.9 3.5 9 3.5H13C14.1 3.5 15 4.4 15 5.5V11.5C15 12.6 14.1 13.5 13 13.5H11"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="5"
                y="7.5"
                width="8"
                height="9"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />
            </svg>
          )
        ) : copied ? (
          <motion.svg
            viewBox="0 0 20 20"
            className="h-5 w-5"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-hidden="true"
          >
            <motion.path
              d="M4 10.5L8 14.5L16 6.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.svg>
        ) : (
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
            <path
              d="M7 7.5V5.5C7 4.4 7.9 3.5 9 3.5H13C14.1 3.5 15 4.4 15 5.5V11.5C15 12.6 14.1 13.5 13 13.5H11"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="5"
              y="7.5"
              width="8"
              height="9"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>
        )}
      </span>
    </motion.button>
  );
}
