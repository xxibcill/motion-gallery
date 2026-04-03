"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "motion/react";

// Re-export controls from unified module for backward compatibility
export {
  SliderControl,
  ToggleControl,
  OptionPills,
  type SliderControlProps,
  type ToggleControlProps,
  type OptionPillsProps,
} from "@/components/ui/controls";

// Legacy aliases
export { SliderControl as RangeControl } from "@/components/ui/controls";

interface MicroInteractionSceneProps {
  title: string;
  description: string;
  reducedMotionNote: string;
  controls?: ReactNode;
  notes?: string[];
  children: ReactNode;
}

export function MicroInteractionScene({
  title,
  description,
  reducedMotionNote,
  controls,
  notes = [],
  children,
}: MicroInteractionSceneProps) {
  return (
    <main className="min-h-screen bg-[var(--surface-0)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/micro-interactions"
            className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-2)]"
          >
            Micro Interactions
          </Link>
          <Link
            href="/gallery"
            className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-2)]"
          >
            Open Gallery
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] p-8"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
              Phase 1 Demo
            </p>
            <h1 className="max-w-3xl text-4xl font-serif tracking-tight text-[var(--text-primary)] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
              {description}
            </p>

            {notes.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {notes.map((note) => (
                  <span
                    key={note}
                    className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-2)] px-3 py-1.5 text-sm text-[var(--text-secondary)]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            ) : null}
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6"
          >
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-2)] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
                Reduced Motion
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{reducedMotionNote}</p>
            </div>

            {controls ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
                  Controls
                </p>
                {controls}
              </div>
            ) : null}
          </motion.aside>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)]"
        >
          <div className="border-b border-[var(--border-subtle)] px-6 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">Live Example</p>
          </div>
          <div className="min-h-[420px] px-6 py-8 sm:px-8">{children}</div>
        </motion.section>
      </div>
    </main>
  );
}
