/**
 * @fileoverview Utilities and configurations for the Transition Lab section
 *
 * This module provides shared utilities, z-index layers, and animation helpers
 * specifically designed for the /transition route section. It handles reduced
 * motion fallbacks and provides consistent animation patterns across all
 * transition lab demos.
 *
 * @module transition-lab
 * @see lib/animation-presets.ts for duration and easing values
 * @see components/transition-lab/ for UI components
 */

import type { TargetAndTransition, Transition } from "motion/react";
import {
  transitionLabDurations,
  transitionLabEasings,
  transitionLabSprings,
} from "@/lib/animation-presets";

/**
 * Z-index layer constants for Transition Lab components
 *
 * @description Provides consistent stacking order across all transition lab demos.
 * Use these values instead of magic numbers for maintainability.
 *
 * Layers (bottom to top):
 * - base (0): Background layer
 * - veil (10): Gradient veils and overlays
 * - noise (20): Texture overlays
 * - content (30): Main content area
 * - chrome (40): UI elements like labels and controls
 * - overlay (50): Highest priority overlays
 */
export const transitionLabLayers = {
  base: 0,
  veil: 10,
  noise: 20,
  content: 30,
  chrome: 40,
  overlay: 50,
} as const;

/**
 * Conditionally returns a value based on reduced motion preference
 *
 * @description Utility function for providing accessible fallback values.
 * Use this when you need to conditionally switch between animated and
 * static values in animation configurations.
 *
 * @param prefersReducedMotion - Whether the user prefers reduced motion
 * @param reducedValue - Value to use when reduced motion is preferred
 * @param motionValue - Value to use when full motion is enabled
 * @returns The appropriate value based on the preference
 *
 * @example
 * const prefersReducedMotion = useReducedMotion() ?? false;
 * const initial = withReducedMotion(prefersReducedMotion, { opacity: 1 }, { opacity: 0 });
 */
export function withReducedMotion<T>(
  prefersReducedMotion: boolean,
  reducedValue: T,
  motionValue: T
): T {
  return prefersReducedMotion ? reducedValue : motionValue;
}

/**
 * Generates entrance animation configuration for Transition Lab scenes
 *
 * @description Creates consistent initial/animate/transition objects for
 * scene containers. Automatically handles reduced motion by returning
 * instant transitions and visible initial states.
 *
 * @param prefersReducedMotion - Whether the user prefers reduced motion
 * @param delay - Optional delay before animation starts (default: 0)
 *
 * @returns Object with initial, animate, and transition properties
 *
 * @example
 * const prefersReducedMotion = useReducedMotion() ?? false;
 * const entrance = getSceneEntrance(prefersReducedMotion, 0.1);
 *
 * return (
 *   <motion.div
 *     initial={entrance.initial}
 *     animate={entrance.animate}
 *     transition={entrance.transition}
 *   />
 * );
 */
export function getSceneEntrance(
  prefersReducedMotion: boolean,
  delay = 0
): {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  transition: Transition;
} {
  return {
    initial: withReducedMotion(
      prefersReducedMotion,
      { opacity: 1, y: 0, scale: 1 },
      { opacity: 0, y: 28, scale: 0.98 }
    ),
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: withReducedMotion(
      prefersReducedMotion,
      { duration: transitionLabDurations.instant },
      {
        duration: transitionLabDurations.base,
        delay,
        ease: transitionLabEasings.emphasis,
      }
    ),
  };
}

/**
 * Generates transition configuration for shared element animations
 *
 * @description Provides spring-based transition config for elements with
 * layoutId (shared element transitions). Returns instant transition when
 * reduced motion is preferred.
 *
 * @param prefersReducedMotion - Whether the user prefers reduced motion
 * @returns Transition object for use with layoutId elements
 *
 * @example
 * const transition = getSharedElementTransition(prefersReducedMotion);
 *
 * return (
 *   <motion.div
 *     layoutId="shared-card"
 *     transition={transition}
 *   />
 * );
 */
export function getSharedElementTransition(
  prefersReducedMotion: boolean
): Transition {
  return withReducedMotion(
    prefersReducedMotion,
    { duration: transitionLabDurations.instant },
    { type: "spring", ...transitionLabSprings.sharedElement }
  );
}

/**
 * The three core features of the Transition Lab controller
 *
 * @description Used for documentation and UI labels to describe what
 * the showcase controller provides to users.
 */
export const transitionLabControlPillars = [
  "Mode comparison",
  "Replay controls",
  "Intensity filters",
] as const;
