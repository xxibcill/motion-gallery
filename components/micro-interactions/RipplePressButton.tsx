"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface RipplePressButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  label?: string;
  rippleSize?: number;
  duration?: number;
}

export function RipplePressButton({
  label = "Ping Action",
  rippleSize = 180,
  duration = 220,
  disabled = false,
  className = "",
  ...props
}: RipplePressButtonProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [flashKey, setFlashKey] = useState(0);
  const nextId = useRef(0);

  useEffect(() => {
    return () => {
      setRipples([]);
    };
  }, []);

  const spawnRipple = (x: number, y: number) => {
    if (disabled) {
      return;
    }

    if (prefersReducedMotion) {
      setFlashKey((current) => current + 1);
      return;
    }

    const id = nextId.current++;
    setRipples((current) => [...current, { id, x, y, size: rippleSize }]);

    window.setTimeout(() => {
      setRipples((current) => current.filter((ripple) => ripple.id !== id));
    }, duration + 40);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    spawnRipple(event.clientX - rect.left, event.clientY - rect.top);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.repeat || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    spawnRipple(rect.width / 2, rect.height / 2);
  };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950 px-6 py-4 text-sm font-semibold tracking-[0.08em] text-zinc-100 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.9)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 360, damping: 26 }}
      {...props}
    >
      <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.16),transparent_40%,rgba(236,72,153,0.18))]" />

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="pointer-events-none absolute rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.85),rgba(34,211,238,0.45),transparent_72%)]"
            style={{
              width: ripple.size,
              height: ripple.size,
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
            }}
            initial={{ scale: 0.1, opacity: 0.55 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration / 1000, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {prefersReducedMotion ? (
          <motion.span
            key={flashKey}
            className="pointer-events-none absolute inset-0 bg-cyan-200/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          />
        ) : null}
      </AnimatePresence>

      <span className="relative z-10 flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-cyan-200/80" />
        <span>{label}</span>
      </span>
    </motion.button>
  );
}
