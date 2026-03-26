/**
 * @fileoverview Animated shell component with shared element transition support
 *
 * SharedElementShell is a card-like container that supports Framer Motion's
 * shared element transitions via layoutId. Used for elements that should
 * smoothly animate between different page contexts.
 *
 * @module transition-lab/SharedElementShell
 * @see lib/transition-lab.ts for shared element transition config
 */

"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { getSharedElementTransition } from "@/lib/transition-lab";

/**
 * Props for the SharedElementShell component
 */
interface SharedElementShellProps {
  layoutId: string;
  label: string;
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * SharedElementShell - Card container with shared element transition support
 *
 * @description A styled card component that uses layoutId for shared element
 * transitions. When the same layoutId is used across different routes or states,
 * Framer Motion smoothly animates the element between positions.
 *
 * Features:
 * - Spring-based shared element transitions
 * - Consistent styling with rounded corners and backdrop blur
 * - Label and status indicator in the header
 * - Reduced motion support
 *
 * @component
 * @example
 * // On page A
 * <SharedElementShell
 *   layoutId="hero-card"
 *   label="Featured"
 *   title="Card Title"
 * >
 *   <p>Card content</p>
 * </SharedElementShell>
 *
 * // On page B - will animate from page A's position
 * <SharedElementShell
 *   layoutId="hero-card"
 *   label="Featured"
 *   title="Card Title"
 * >
 *   <p>Expanded content</p>
 * </SharedElementShell>
 *
 * @param props.layoutId - Unique ID for shared element transitions
 * @param props.label - Small label text in the header
 * @param props.title - Title text for the shell
 * @param props.children - Content inside the shell
 * @param props.className - Additional CSS classes
 */
export function SharedElementShell({
  layoutId,
  label,
  title,
  children,
  className = "",
}: SharedElementShellProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      layout
      layoutId={layoutId}
      transition={getSharedElementTransition(prefersReducedMotion)}
      className={`rounded-[1.75rem] border border-white/12 bg-black/30 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-md ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="text-[0.65rem] uppercase tracking-[0.28em] text-white/50">
          {label}
        </span>
        <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
      </div>
      <div className="space-y-3">
        <h2 className="font-serif text-2xl text-white">{title}</h2>
        {children}
      </div>
    </motion.div>
  );
}
