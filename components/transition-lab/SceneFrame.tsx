/**
 * @fileoverview Header section component for Transition Lab pages
 *
 * SceneFrame provides a consistent page header with eyebrow, title, description,
 * and optional aside content. Includes entrance animation for the header area.
 *
 * @module transition-lab/SceneFrame
 */

"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { getSceneEntrance } from "@/lib/transition-lab";

/**
 * Props for the SceneFrame component
 */
interface SceneFrameProps {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * SceneFrame - Page header with title, description, and optional aside
 *
 * @description Provides a consistent header layout for transition lab pages.
 * Uses a two-column grid on large screens with the main content on the left
 * and an optional aside card on the right. The header animates in on mount.
 *
 * @component
 * @example
 * <SceneFrame
 *   eyebrow="Transition Showcase"
 *   title="Transition Showcase"
 *   description="Compare every transition mode side by side."
 *   aside={<div>Additional info</div>}
 * >
 *   <TransitionStage>
 *     Scene content here
 *   </TransitionStage>
 * </SceneFrame>
 *
 * @param props.eyebrow - Small label above the title
 * @param props.title - Main page heading
 * @param props.description - Page description text
 * @param props.aside - Optional aside content for the right column
 * @param props.children - Main page content below the header
 * @param props.className - Additional CSS classes
 */
export function SceneFrame({
  eyebrow,
  title,
  description,
  aside,
  children,
  className = "",
}: SceneFrameProps) {
  const entrance = getSceneEntrance(false);

  return (
    <section className={`space-y-8 ${className}`}>
      <motion.div
        className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-end"
        initial={entrance.initial}
        animate={entrance.animate}
        transition={entrance.transition}
      >
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
            {eyebrow}
          </p>
          <h1 className="max-w-4xl font-serif text-4xl leading-none text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
            {description}
          </p>
        </div>
        {aside ? (
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] p-5 text-sm text-[var(--text-secondary)]">
            {aside}
          </div>
        ) : null}
      </motion.div>
      {children}
    </section>
  );
}
