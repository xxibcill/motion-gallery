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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.2),_transparent_38%),linear-gradient(180deg,_#09090b_0%,_#0f172a_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/micro-interactions"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/10"
          >
            Micro Interactions
          </Link>
          <Link
            href="/gallery"
            className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition-colors hover:bg-cyan-300/18"
          >
            Open Gallery
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[var(--mi-shadow-soft)] backdrop-blur-sm"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.32em] text-cyan-200/80">
              Phase 1 Demo
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              {description}
            </p>

            {notes.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {notes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-sm text-zinc-200"
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
            className="flex flex-col gap-4 rounded-[2rem] border border-cyan-200/10 bg-slate-950/80 p-6 shadow-[var(--mi-shadow-soft)]"
          >
            <div className="rounded-2xl border border-cyan-200/10 bg-cyan-300/8 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/75">
                Reduced Motion
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{reducedMotionNote}</p>
            </div>

            {controls ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
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
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] shadow-[var(--mi-shadow-strong)]"
        >
          <div className="border-b border-white/10 px-6 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Live Example</p>
          </div>
          <div className="min-h-[420px] px-6 py-8 sm:px-8">{children}</div>
        </motion.section>
      </div>
    </main>
  );
}
