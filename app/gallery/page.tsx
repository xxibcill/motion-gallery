"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  getAllAnimations,
  searchAnimations,
  type AnimationMeta,
  type AnimationCategory,
  type AnimationDifficulty,
  type AnimationLibrary,
} from "@/lib/animation-registry";

const categoryLabels: Record<AnimationCategory, string> = {
  "scroll-based": "Scroll Based",
  "text-effects": "Text Effects",
  "hover-interactions": "Hover",
  "3d-transforms": "3D",
  "page-transitions": "Transitions",
  "layout-animations": "Layout",
};

const difficultyColors: Record<AnimationDifficulty, string> = {
  beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

const libraryColors: Record<AnimationLibrary, string> = {
  "framer-motion": "bg-violet-400/20 text-violet-100",
  gsap: "bg-emerald-400/20 text-emerald-100",
};

const colorClasses: Record<string, string> = {
  zinc: "from-zinc-800 to-zinc-900",
  slate: "from-slate-800 to-slate-950",
  sky: "from-sky-800 to-sky-950",
  orange: "from-orange-800 to-orange-950",
  indigo: "from-indigo-800 to-indigo-950",
  violet: "from-violet-800 to-violet-950",
  fuchsia: "from-fuchsia-800 to-fuchsia-950",
  emerald: "from-emerald-800 to-emerald-950",
  rose: "from-rose-800 to-rose-950",
  amber: "from-amber-800 to-amber-950",
  cyan: "from-cyan-800 to-cyan-950",
};

const categoryOptions = Object.entries(categoryLabels) as [
  AnimationCategory,
  string,
][];

const difficultyOptions: AnimationDifficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
];

const libraryOptions: AnimationLibrary[] = ["framer-motion", "gsap"];

const entranceEase = [0.16, 1, 0.3, 1] as const;
const settleEase = [0.22, 1, 0.36, 1] as const;

function FilterChip({
  label,
  active,
  onClick,
  reducedMotion,
  tone = "zinc",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  reducedMotion: boolean;
  tone?: "zinc" | "violet" | "emerald";
}) {
  const toneClasses = {
    zinc: {
      fill: "bg-white text-zinc-950 shadow-[0_16px_36px_-24px_rgba(255,255,255,0.85)]",
      ring: "border-white/15",
      idle: "text-zinc-300 hover:text-white",
    },
    violet: {
      fill: "bg-violet-400 text-zinc-950 shadow-[0_16px_36px_-24px_rgba(167,139,250,0.9)]",
      ring: "border-violet-300/20",
      idle: "text-zinc-300 hover:text-violet-100",
    },
    emerald: {
      fill: "bg-emerald-400 text-zinc-950 shadow-[0_16px_36px_-24px_rgba(52,211,153,0.9)]",
      ring: "border-emerald-300/20",
      idle: "text-zinc-300 hover:text-emerald-100",
    },
  }[tone];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative overflow-hidden rounded-full border px-3.5 py-2 text-sm font-medium tracking-[0.01em] transition-colors duration-200 ${toneClasses.ring} ${active ? "text-zinc-950" : toneClasses.idle}`}
      whileHover={reducedMotion ? undefined : { y: -1 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.18, ease: settleEase }}
    >
      <AnimatePresence initial={false}>
        {active && (
          <motion.span
            className={`absolute inset-0 rounded-full ${toneClasses.fill}`}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.22, ease: settleEase }}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}

function AnimationCard({
  animation,
  reducedMotion,
}: {
  animation: AnimationMeta;
  reducedMotion: boolean;
}) {
  const gradientClass = colorClasses[animation.color] || colorClasses.zinc;
  const groupLabel = animation.group === "transition-lab" ? "Transition Lab" : "Core";
  const statusLabel = animation.status === "planned" ? "Planned" : "Ready";

  return (
    <Link
      href={animation.path}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
    >
      <motion.article
        className="relative flex h-full min-h-64 flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-6 shadow-[0_24px_60px_-34px_rgba(2,6,23,0.92)] transition-colors duration-200 group-hover:border-white/20"
        whileHover={reducedMotion ? undefined : { y: -6, scale: 1.01 }}
        transition={{ duration: 0.24, ease: entranceEase }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_36%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-10 top-0 h-20 rounded-full bg-white/10 blur-3xl opacity-40 transition-opacity duration-300 group-hover:opacity-60" />

        <div className="relative flex h-full flex-col justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-zinc-200">
                {groupLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-zinc-400">
                {statusLabel}
              </span>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">{animation.title}</h3>
            <p className="max-w-[34ch] text-sm leading-6 text-zinc-300">
              {animation.description}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-2.5 py-1 text-xs ${difficultyColors[animation.difficulty]}`}
              >
                {animation.difficulty}
              </span>
              {animation.library.map((library) => (
                <span
                  key={library}
                  className={`rounded-full px-2.5 py-1 text-xs ${libraryColors[library]}`}
                >
                  {library === "framer-motion" ? "Framer" : "GSAP"}
                </span>
              ))}
              <span className="rounded-full bg-zinc-700/50 px-2.5 py-1 text-xs text-zinc-300">
                {categoryLabels[animation.category]}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-100">
              <span className="text-zinc-300">View demo</span>
              <motion.span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/20"
                whileHover={reducedMotion ? undefined : { x: 4 }}
                transition={{ duration: 0.2, ease: settleEase }}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7m0 0l-7 7m7-7H4"
                  />
                </svg>
              </motion.span>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function LiveCue({
  label,
  value,
  delay,
  reducedMotion,
}: {
  label: string;
  value: string;
  delay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4 backdrop-blur-sm"
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ delay, duration: reducedMotion ? 0.01 : 0.45, ease: entranceEase }}
    >
      <p className="text-[0.7rem] uppercase tracking-[0.28em] text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-semibold tracking-tight text-white">{value}</p>
    </motion.div>
  );
}

export default function GalleryPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<AnimationCategory[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<AnimationDifficulty[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<AnimationLibrary[]>([]);

  const deferredQuery = useDeferredValue(query);
  const allAnimations = useMemo(() => getAllAnimations(), []);

  const results = useMemo(() => {
    let filtered = deferredQuery ? searchAnimations(deferredQuery) : allAnimations;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((animation) =>
        selectedCategories.includes(animation.category)
      );
    }
    if (selectedDifficulty.length > 0) {
      filtered = filtered.filter((animation) =>
        selectedDifficulty.includes(animation.difficulty)
      );
    }
    if (selectedLibrary.length > 0) {
      filtered = filtered.filter((animation) =>
        animation.library.some((library) => selectedLibrary.includes(library))
      );
    }

    return filtered;
  }, [
    allAnimations,
    deferredQuery,
    selectedCategories,
    selectedDifficulty,
    selectedLibrary,
  ]);

  const activeFilterCount =
    selectedCategories.length + selectedDifficulty.length + selectedLibrary.length;
  const hasActiveControls = query.trim().length > 0 || activeFilterCount > 0;
  const resultLabel = `${results.length} demo${results.length === 1 ? "" : "s"} ready`;
  const selectionLabel = query.trim()
    ? `Searching "${query.trim()}"`
    : "Browsing the full catalog";

  const toggleCategory = (category: AnimationCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((current) => current !== category)
        : [...prev, category]
    );
  };

  const toggleDifficulty = (difficulty: AnimationDifficulty) => {
    setSelectedDifficulty((prev) =>
      prev.includes(difficulty)
        ? prev.filter((current) => current !== difficulty)
        : [...prev, difficulty]
    );
  };

  const toggleLibrary = (library: AnimationLibrary) => {
    setSelectedLibrary((prev) =>
      prev.includes(library)
        ? prev.filter((current) => current !== library)
        : [...prev, library]
    );
  };

  const clearAll = () => {
    setQuery("");
    setSelectedCategories([]);
    setSelectedDifficulty([]);
    setSelectedLibrary([]);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(250,204,21,0.1),transparent_24%),linear-gradient(180deg,#09090b_0%,#020617_44%,#020617_100%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.04] px-6 py-8 shadow-[0_28px_90px_-48px_rgba(8,47,73,0.9)] sm:px-8 sm:py-10 lg:px-10">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_38%,transparent_62%,rgba(255,255,255,0.05))]" />
          {!prefersReducedMotion && (
            <>
              <motion.div
                aria-hidden
                className="absolute -left-12 top-0 h-40 w-40 rounded-full bg-cyan-300/15 blur-3xl"
                animate={{ x: [-12, 14, -12], y: [0, 18, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                aria-hidden
                className="absolute right-0 top-10 h-48 w-48 rounded-full bg-amber-200/10 blur-3xl"
                animate={{ x: [10, -16, 10], y: [0, -12, 0], scale: [1.02, 1, 1.02] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div className="max-w-3xl">
              <motion.p
                className="text-xs uppercase tracking-[0.34em] text-cyan-200/75"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.4, ease: entranceEase }}
              >
                Motion Discovery
              </motion.p>
              <motion.h1
                className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: prefersReducedMotion ? 0 : 0.08,
                  duration: prefersReducedMotion ? 0.01 : 0.55,
                  ease: entranceEase,
                }}
              >
                Find the right motion pattern without breaking your scanning flow.
              </motion.h1>
              <motion.p
                className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: prefersReducedMotion ? 0 : 0.16,
                  duration: prefersReducedMotion ? 0.01 : 0.5,
                  ease: entranceEase,
                }}
              >
                Search by implementation detail, tighten the scope with filters, and keep the
                current selection visible as the catalog reshuffles around it.
              </motion.p>

              <motion.div
                className="mt-6 flex flex-wrap gap-2.5"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: prefersReducedMotion ? 0 : 0.24,
                  duration: prefersReducedMotion ? 0.01 : 0.45,
                  ease: entranceEase,
                }}
              >
                {[
                  "Searchable implementation tags",
                  "Reduced-motion aware",
                  "Curated for frontend engineers",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-black/20 px-3.5 py-2 text-sm text-zinc-200"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>

            <div className="grid gap-3">
              <LiveCue
                label="Catalog"
                value={`${allAnimations.length} demos indexed`}
                delay={0.18}
                reducedMotion={prefersReducedMotion}
              />
              <LiveCue
                label="Current Selection"
                value={selectionLabel}
                delay={0.24}
                reducedMotion={prefersReducedMotion}
              />
              <LiveCue
                label="Visible Now"
                value={resultLabel}
                delay={0.3}
                reducedMotion={prefersReducedMotion}
              />
            </div>
          </div>
        </section>

        <motion.section
          className="sticky top-4 z-20 mt-8 rounded-[2rem] border border-white/10 bg-zinc-950/75 p-4 shadow-[0_24px_70px_-38px_rgba(2,6,23,0.95)] backdrop-blur-xl"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: prefersReducedMotion ? 0 : 0.16,
            duration: prefersReducedMotion ? 0.01 : 0.45,
            ease: entranceEase,
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <label htmlFor="animation-search" className="sr-only">
                  Search animations
                </label>
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  id="animation-search"
                  type="text"
                  placeholder="Search by title, behavior, or implementation detail"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full rounded-[1.15rem] border border-white/10 bg-white/[0.04] py-3 pl-12 pr-12 text-white placeholder:text-zinc-500 transition-[border-color,box-shadow,background-color] duration-200 focus:border-cyan-300/35 focus:bg-white/[0.06] focus:outline-none focus:ring-4 focus:ring-cyan-300/10"
                />
                <AnimatePresence initial={false}>
                  {query && (
                    <motion.button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/20 text-zinc-300 transition-colors hover:text-white"
                      aria-label="Clear search"
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
                      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: prefersReducedMotion ? 0.01 : 0.18, ease: settleEase }}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={`${results.length}-${activeFilterCount}-${deferredQuery}`}
                      className="inline-flex items-center gap-2"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                      transition={{
                        duration: prefersReducedMotion ? 0.01 : 0.2,
                        ease: settleEase,
                      }}
                    >
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_0_4px_rgba(34,211,238,0.14)]" />
                      {resultLabel}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {hasActiveControls && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2">
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-zinc-500">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map(([category, label]) => (
                    <FilterChip
                      key={category}
                      label={label}
                      active={selectedCategories.includes(category)}
                      onClick={() => toggleCategory(category)}
                      reducedMotion={prefersReducedMotion}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-zinc-500">
                  Difficulty
                </p>
                <div className="flex flex-wrap gap-2">
                  {difficultyOptions.map((difficulty) => (
                    <FilterChip
                      key={difficulty}
                      label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      active={selectedDifficulty.includes(difficulty)}
                      onClick={() => toggleDifficulty(difficulty)}
                      reducedMotion={prefersReducedMotion}
                      tone="violet"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-zinc-500">
                  Library
                </p>
                <div className="flex flex-wrap gap-2">
                  {libraryOptions.map((library) => (
                    <FilterChip
                      key={library}
                      label={library === "framer-motion" ? "Framer Motion" : "GSAP"}
                      active={selectedLibrary.includes(library)}
                      onClick={() => toggleLibrary(library)}
                      reducedMotion={prefersReducedMotion}
                      tone={library === "framer-motion" ? "violet" : "emerald"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="py-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.3em] text-zinc-500">
                Live Results
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.h2
                  key={`${resultLabel}-${selectionLabel}`}
                  className="mt-2 text-2xl font-semibold tracking-tight text-white"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.22,
                    ease: settleEase,
                  }}
                >
                  {resultLabel}
                </motion.h2>
              </AnimatePresence>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400">{selectionLabel}</p>
          </div>

          <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false} mode="popLayout">
              {results.map((animation, index) => (
                <motion.div
                  key={animation.id}
                  layout
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.28,
                    delay: prefersReducedMotion ? 0 : Math.min(index * 0.025, 0.16),
                    ease: entranceEase,
                  }}
                >
                  <AnimationCard
                    animation={animation}
                    reducedMotion={prefersReducedMotion}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence initial={false}>
            {results.length === 0 && (
              <motion.div
                className="mt-10 rounded-[2rem] border border-dashed border-white/12 bg-white/[0.03] px-6 py-12 text-center"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.28,
                  ease: entranceEase,
                }}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-200">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M10 6a8 8 0 105.293 14.293L21 21"
                    />
                  </svg>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">No matching demos</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">
                  Broaden the search, remove a few filters, or reset the panel to scan the full
                  gallery again.
                </p>
                {hasActiveControls && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-6 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
                  >
                    Reset filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
