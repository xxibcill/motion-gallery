import type { ReactNode } from "react";
import {
  getAnimationById,
  getTransitionLabRoutes,
  type AnimationMeta,
} from "@/lib/animation-registry";
import { TransitionSectionNav } from "@/components/transition-lab/TransitionSectionNav";

function getNavigationItems(): AnimationMeta[] {
  const hub = getAnimationById("transition");
  if (!hub) {
    return getTransitionLabRoutes();
  }

  return [hub, ...getTransitionLabRoutes()];
}

export default function TransitionLayout({
  children,
}: {
  children: ReactNode;
}) {
  const hub = getAnimationById("transition");
  const navItems = getNavigationItems();

  return (
    <div className="relative min-h-screen bg-[var(--surface-0)] text-[var(--text-primary)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-24 sm:px-8 lg:px-10 lg:pt-20">
        <header className="mb-10 space-y-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-tertiary)]">
                Transition Lab
              </p>
              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-4xl">
                  {hub?.title ?? "Transition Lab"}
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
                  {hub?.description ??
                    "A dedicated section for high-drama route transitions, scene swaps, and reusable motion systems."}
                </p>
              </div>
            </div>
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-2)] px-4 py-3">
                <p className="text-[0.65rem] uppercase tracking-[0.26em] text-[var(--text-tertiary)]">
                  Demos
                </p>
                <p className="mt-2 text-lg text-[var(--text-primary)]">11 transitions</p>
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">Interactive demos with unique motion signatures</p>
              </div>
              <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-2)] px-4 py-3">
                <p className="text-[0.65rem] uppercase tracking-[0.26em] text-[var(--text-tertiary)]">
                  Showcase
                </p>
                <p className="mt-2 text-lg text-[var(--text-primary)]">Side-by-side comparison</p>
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">All modes from one control surface</p>
              </div>
              <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-2)] px-4 py-3">
                <p className="text-[0.65rem] uppercase tracking-[0.26em] text-[var(--text-tertiary)]">
                  Toolkit
                </p>
                <p className="mt-2 text-lg text-[var(--text-primary)]">Shared primitives</p>
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">Reusable components for building transitions</p>
              </div>
            </div>
          </div>
          <TransitionSectionNav items={navItems} />
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
