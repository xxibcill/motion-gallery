/**
 * @fileoverview Shared motion utility functions for accessible animations
 *
 * Portable helpers that provide reduced motion fallbacks and consistent
 * animation patterns across installable components.
 *
 * @module registry/libs/motion-helpers
 *
 * @example
 * import { withReducedMotion } from "@/registry/libs/motion-helpers";
 *
 * const prefersReducedMotion = useReducedMotion() ?? false;
 * const initial = withReducedMotion(prefersReducedMotion, { opacity: 1 }, { opacity: 0 });
 */

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
 */
export function withReducedMotion<T>(
  prefersReducedMotion: boolean,
  reducedValue: T,
  motionValue: T
): T {
  return prefersReducedMotion ? reducedValue : motionValue;
}
