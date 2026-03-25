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
    <div className="relative min-h-screen overflow-hidden bg-[#070b16] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-[-18rem] h-[34rem] bg-[radial-gradient(circle_at_top,rgba(94,234,212,0.18),transparent_52%)]" />
        <div className="absolute right-[-12rem] top-24 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/14 blur-3xl" />
        <div className="absolute left-[-10rem] top-48 h-[26rem] w-[26rem] rounded-full bg-sky-500/12 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:7rem_7rem] opacity-[0.12]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-24 sm:px-8 lg:px-10 lg:pt-20">
        <header className="mb-10 space-y-6 rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                Section Shell
              </p>
              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-4xl">
                  {hub?.title ?? "Transition Lab"}
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-white/68 sm:text-base">
                  {hub?.description ??
                    "A dedicated section for high-drama route transitions, scene swaps, and reusable motion systems."}
                </p>
              </div>
            </div>
            <div className="grid gap-3 text-sm text-white/65 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-[0.65rem] uppercase tracking-[0.26em] text-white/40">
                  Demos
                </p>
                <p className="mt-2 text-lg text-white">10 routes</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-[0.65rem] uppercase tracking-[0.26em] text-white/40">
                  Showcase
                </p>
                <p className="mt-2 text-lg text-white">1 flagship path</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-[0.65rem] uppercase tracking-[0.26em] text-white/40">
                  Toolkit
                </p>
                <p className="mt-2 text-lg text-white">Shared primitives</p>
              </div>
            </div>
          </div>
          <TransitionSectionNav items={navItems} />
        </header>

        <main className="relative flex-1">{children}</main>
      </div>
    </div>
  );
}
