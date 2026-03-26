import type { TargetAndTransition, Transition } from "motion/react";
import {
  transitionLabDurations,
  transitionLabEasings,
  transitionLabSprings,
} from "@/lib/animation-presets";

export const transitionLabLayers = {
  base: 0,
  veil: 10,
  noise: 20,
  content: 30,
  chrome: 40,
  overlay: 50,
} as const;

export function withReducedMotion<T>(
  prefersReducedMotion: boolean,
  reducedValue: T,
  motionValue: T
): T {
  return prefersReducedMotion ? reducedValue : motionValue;
}

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

export function getSharedElementTransition(
  prefersReducedMotion: boolean
): Transition {
  return withReducedMotion(
    prefersReducedMotion,
    { duration: transitionLabDurations.instant },
    { type: "spring", ...transitionLabSprings.sharedElement }
  );
}

export const transitionLabControlPillars = [
  "Mode comparison",
  "Replay controls",
  "Intensity filters",
] as const;
