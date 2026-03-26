/**
 * @fileoverview Route matching utilities for navigation state
 *
 * This module provides functions for determining active navigation state
 * based on the current pathname. It handles edge cases like trailing slashes,
 * nested routes, and special handling for index pages.
 *
 * @module route-matching
 * @see lib/animation-registry.ts for animation metadata
 */

import type { AnimationMeta } from "@/lib/animation-registry";

/**
 * Normalizes a pathname by handling trailing slashes
 *
 * @description Ensures consistent pathname comparison by removing trailing
 * slashes (except for root "/"). This handles Next.js's flexible routing
 * where both "/path" and "/path/" are valid.
 *
 * @param pathname - The pathname to normalize
 * @returns Normalized pathname without trailing slash
 *
 * @example
 * normalizePathname("/gallery/") // Returns "/gallery"
 * normalizePathname("/") // Returns "/"
 * normalizePathname("") // Returns "/"
 */
function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

/**
 * Determines if a target path matches the current pathname
 *
 * @description Handles exact matching and optional nested path matching.
 * The root path "/" only matches exactly (never as a prefix).
 *
 * @param pathname - Current pathname from usePathname()
 * @param targetPath - Path to check against
 * @param matchNested - Whether to match nested paths (default: true)
 * @returns Whether the path is active
 *
 * @example
 * // Exact matching
 * isPathActive("/gallery", "/gallery") // true
 * isPathActive("/gallery/other", "/gallery") // false when matchNested is false
 *
 * @example
 * // Nested matching (default)
 * isPathActive("/gallery/item", "/gallery") // true
 * isPathActive("/", "/") // true (root only matches exactly)
 */
export function isPathActive(
  pathname: string,
  targetPath: string,
  matchNested = true
): boolean {
  const current = normalizePathname(pathname);
  const target = normalizePathname(targetPath);

  if (target === "/") {
    return current === "/";
  }

  if (current === target) {
    return true;
  }

  return matchNested ? current.startsWith(`${target}/`) : false;
}

/**
 * Determines if an animation is active based on the current pathname
 *
 * @description Uses animation metadata to determine active navigation state.
 * Special handling for:
 * - Root path ("/") - only matches exactly
 * - Transition index ("/transition") - only matches exactly, not nested routes
 * - All other animations - matches both exact and nested paths
 *
 * @param pathname - Current pathname from usePathname()
 * @param animation - Animation metadata with id and path
 * @returns Whether the animation's route is active
 *
 * @example
 * // In a navigation component
 * const pathname = usePathname();
 * const items = getAllAnimations();
 *
 * items.map(item => (
 *   <Link
 *     key={item.id}
 *     href={item.path}
 *     aria-current={isAnimationActive(pathname, item) ? "page" : undefined}
 *   >
 *     {item.title}
 *   </Link>
 * ));
 */
export function isAnimationActive(
  pathname: string,
  animation: Pick<AnimationMeta, "id" | "path">
): boolean {
  if (animation.path === "/") {
    return isPathActive(pathname, animation.path, false);
  }

  if (animation.id === "transition") {
    return isPathActive(pathname, animation.path, false);
  }

  return isPathActive(pathname, animation.path, true);
}
