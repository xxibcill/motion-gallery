"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";

export interface MagneticCtaButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  label?: string;
  intensity?: number;
  radius?: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function MagneticCtaButton({
  label = "Launch Demo",
  intensity = 0.72,
  radius = 180,
  disabled = false,
  className = "",
  ...props
}: MagneticCtaButtonProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLButtonElement>(null);
  const [isEngaged, setIsEngaged] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 220, damping: 20, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 220, damping: 20, mass: 0.6 });

  const reset = () => {
    x.set(0);
    y.set(0);
    setIsEngaged(false);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled || prefersReducedMotion) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const maxTravel = Math.min(18, 8 + intensity * 8);

    x.set(clamp((dx / radius) * maxTravel, -maxTravel, maxTravel));
    y.set(clamp((dy / radius) * maxTravel, -maxTravel, maxTravel));
    setIsEngaged(true);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      onFocus={() => setIsEngaged(true)}
      className={`group relative inline-flex min-h-16 items-center justify-center overflow-hidden rounded-full border border-cyan-200/20 bg-[linear-gradient(135deg,#cffafe_0%,#0ea5e9_48%,#0f766e_100%)] px-8 py-4 text-base font-semibold tracking-[0.02em] text-slate-950 shadow-[0_22px_48px_-28px_rgba(34,211,238,0.75)] transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
      style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
      animate={{
        opacity: disabled ? 0.55 : 1,
        scale: isEngaged && !disabled ? 1.01 : 1,
        boxShadow:
          isEngaged && !disabled
            ? "0 28px 56px -28px rgba(34,211,238,0.72)"
            : "0 22px 48px -28px rgba(34,211,238,0.48)",
      }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{
        type: "spring",
        stiffness: 340,
        damping: 24,
      }}
      {...props}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent_46%)] opacity-70" />
      <span
        className={`absolute inset-[1px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.02))] transition-opacity ${
          isEngaged && !prefersReducedMotion ? "opacity-100" : "opacity-80"
        }`}
      />
      <span className="relative z-10 flex items-center gap-3">
        <span>{label}</span>
        <span className="text-lg transition-transform group-hover:translate-x-0.5">↗</span>
      </span>
    </motion.button>
  );
}
