"use client";

import { motion, useReducedMotion } from "motion/react";
import { transitionLabLayers, withReducedMotion } from "@/lib/transition-lab";
import { transitionLabDurations, transitionLabEasings } from "@/lib/animation-presets";

interface GradientVeilProps {
  className?: string;
  from: string;
  to: string;
  accent?: string;
}

export function GradientVeil({
  className = "",
  from,
  to,
  accent = "rgba(255,255,255,0.14)",
}: GradientVeilProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        zIndex: transitionLabLayers.veil,
        background: `
          radial-gradient(circle at 20% 20%, ${accent}, transparent 42%),
          linear-gradient(135deg, ${from}, ${to})
        `,
      }}
      initial={withReducedMotion(
        prefersReducedMotion,
        { opacity: 1, scale: 1 },
        { opacity: 0.82, scale: 1.05 }
      )}
      animate={{ opacity: 1, scale: 1 }}
      transition={withReducedMotion(
        prefersReducedMotion,
        { duration: transitionLabDurations.instant },
        {
          duration: transitionLabDurations.linger,
          ease: transitionLabEasings.fluid,
        }
      )}
    />
  );
}
