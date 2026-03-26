/**
 * @fileoverview Animated gradient veil for Transition Lab scene transitions
 *
 * Provides a smooth, animated gradient overlay that transitions in with the scene.
 * Used as the primary visual layer between the background and content in
 * transition lab demos.
 *
 * @module transition-lab/GradientVeil
 */

"use client";

import { motion, useReducedMotion } from "motion/react";
import { transitionLabLayers, withReducedMotion } from "@/lib/transition-lab";
import { transitionLabDurations, transitionLabEasings } from "@/lib/animation-presets";

/**
 * Props for the GradientVeil component
 */
interface GradientVeilProps {
  className?: string;
  from: string;
  to: string;
  accent?: string;
}

/**
 * GradientVeil - Animated gradient background layer
 *
 * @description Renders a full-bleed gradient with an optional accent glow.
 * Animates in with a subtle scale and opacity transition. The gradient uses
 * a radial accent combined with a linear base for depth.
 *
 * @component
 * @example
 * <GradientVeil
 *   from="rgba(34, 211, 238, 0.2)"
 *   to="rgba(9, 20, 37, 0.96)"
 *   accent="rgba(196, 181, 253, 0.16)"
 * />
 *
 * @param props.className - Additional CSS classes
 * @param props.from - Starting gradient color (top)
 * @param props.to - Ending gradient color (bottom)
 * @param props.accent - Accent glow color (default: rgba(255,255,255,0.14))
 */
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
