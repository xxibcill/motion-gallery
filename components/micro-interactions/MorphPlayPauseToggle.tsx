"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";

export interface MorphPlayPauseToggleProps
  extends Omit<HTMLMotionProps<"button">, "children" | "defaultValue"> {
  size?: number;
  cornerRounding?: number;
  defaultPlaying?: boolean;
}

export function MorphPlayPauseToggle({
  size = 92,
  cornerRounding = 14,
  defaultPlaying = false,
  disabled = false,
  className = "",
  ...props
}: MorphPlayPauseToggleProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [playing, setPlaying] = useState(defaultPlaying);

  const iconSize = Math.max(28, size * 0.34);
  const barWidth = iconSize * 0.26;
  const barGap = iconSize * 0.18;

  return (
    <motion.button
      type="button"
      aria-pressed={playing}
      aria-label={playing ? "Pause playback" : "Play media"}
      disabled={disabled}
      onClick={() => setPlaying((current) => !current)}
      className={`relative inline-flex items-center justify-center overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(15,23,42,0.9))] text-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: cornerRounding,
      }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      {...props}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.18),transparent_48%)]" />

      {prefersReducedMotion ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={playing ? "pause" : "play"}
            className="relative z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            {playing ? (
              <span className="flex gap-2">
                <span className="h-8 w-2.5 rounded-full bg-white" />
                <span className="h-8 w-2.5 rounded-full bg-white" />
              </span>
            ) : (
              <svg width={30} height={34} viewBox="0 0 30 34" fill="none" aria-hidden="true">
                <path d="M6 4.5L25 17L6 29.5V4.5Z" fill="currentColor" />
              </svg>
            )}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span
          className="relative z-10"
          style={{ width: iconSize, height: iconSize }}
          aria-hidden="true"
        >
          <motion.span
            className="absolute top-0 left-0 h-full bg-white"
            animate={{
              x: playing ? 0 : iconSize * 0.08,
              width: playing ? barWidth : iconSize * 0.7,
              borderRadius: playing ? 999 : 12,
              clipPath: playing
                ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                : "polygon(0 0, 100% 50%, 0 100%, 0 100%)",
            }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            className="absolute top-0 h-full rounded-full bg-white"
            animate={{
              x: playing ? barWidth + barGap : iconSize * 0.5,
              width: playing ? barWidth : iconSize * 0.12,
              opacity: playing ? 1 : 0.08,
            }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
      )}
    </motion.button>
  );
}
