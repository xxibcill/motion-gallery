/**
 * @fileoverview Navigation component for Transition Lab section
 *
 * Provides a horizontal navigation bar with pill-style links for navigating
 * between transition lab routes. Highlights the active route based on
 * the current pathname.
 *
 * @module transition-lab/TransitionSectionNav
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AnimationMeta } from "@/lib/animation-registry";
import { isAnimationActive } from "@/lib/route-matching";

/**
 * Props for the TransitionSectionNav component
 */
interface TransitionSectionNavProps {
  items: AnimationMeta[];
}

/**
 * TransitionSectionNav - Horizontal navigation for transition lab routes
 *
 * @description Renders a horizontal scrolling navigation with pill-style links.
 * Uses isAnimationActive to determine which link should be highlighted.
 * The active link uses aria-current="page" for accessibility.
 *
 * @component
 * @example
 * const items = getTransitionLabRoutes();
 *
 * <TransitionSectionNav items={items} />
 *
 * @param props.items - Array of animation metadata to render as nav links
 */
export function TransitionSectionNav({ items }: TransitionSectionNavProps) {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto pb-1">
      <nav aria-label="Transition lab routes" className="flex min-w-max gap-2">
        {items.map((item) => {
          const isActive = isAnimationActive(pathname, item);

          return (
            <Link
              key={item.id}
              href={item.path}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-md border px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)] ${
                isActive
                  ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--text-primary)]"
                  : "border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)]"
              }`}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
