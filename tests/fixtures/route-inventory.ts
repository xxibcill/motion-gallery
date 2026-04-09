/**
 * @fileoverview Route inventory helper for smoke tests
 *
 * Derives route data from the animation registry to ensure smoke tests
 * stay in sync with the actual route definitions.
 *
 * @module route-inventory
 */

import {
  getAnimationsByGroup,
  type AnimationMeta,
} from "@/lib/animation-registry";

/**
 * Returns all core gallery routes for smoke testing.
 * These are the main animation demo pages (gsap, parallax, text-reveal, etc.)
 */
export function getCoreRoutes(): string[] {
  return getAnimationsByGroup("core").map((animation) => animation.path);
}

/**
 * Returns all transition lab routes for smoke testing.
 * These are route transition experiments under /transition/
 */
export function getTransitionLabRoutes(): string[] {
  return getAnimationsByGroup("transition-lab").map((animation) => animation.path);
}

/**
 * Returns all registered routes as path strings.
 * Useful for comprehensive smoke test suites.
 */
export function getAllRoutes(): string[] {
  return [...getCoreRoutes(), ...getTransitionLabRoutes()];
}

/**
 * Returns full animation metadata for core routes.
 * Use when tests need more than just the path (title, description, etc.)
 */
export function getCoreAnimations(): AnimationMeta[] {
  return getAnimationsByGroup("core");
}

/**
 * Returns full animation metadata for transition lab routes.
 * Use when tests need more than just the path (title, description, etc.)
 */
export function getTransitionLabAnimations(): AnimationMeta[] {
  return getAnimationsByGroup("transition-lab");
}