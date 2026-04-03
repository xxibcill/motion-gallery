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
  beginner: "bg-[var(--surface-2)] text-[var(--text-secondary)]",
  intermediate: "bg-[var(--surface-2)] text-[var(--text-secondary)]",
  advanced: "bg-[var(--surface-2)] text-[var(--text-secondary)]",
};

const libraryColors: Record<AnimationLibrary, string> = {
  "framer-motion": "bg-[var(--surface-2)] text-[var(--text-secondary)]",
  gsap: "bg-[var(--surface-2)] text-[var(--text-secondary)]",
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
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  reducedMotion: boolean;
  tone?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md border px-3.5 py-2 text-sm font-medium tracking-[0.01em] transition-colors duration-200 ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-white"
          : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--surface-3)]"
      }`}
      whileHover={reducedMotion ? undefined : { y: -1 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.18, ease: settleEase }}
    >
      {label}
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
  const groupLabel = animation.group === "transition-lab" ? "Transition Lab" : "Core";
  const statusLabel = animation.status === "planned" ? "Planned" : "Ready";

  return (
    <Link
      href={animation.path}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)]"
    >
      <motion.article
        className="relative flex h-full min-h-64 flex-col overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6 transition-colors duration-200 group-hover:border-[var(--accent-muted)]"
        whileHover={reducedMotion ? undefined : { y: -3 }}
        transition={{ duration: 0.24, ease: entranceEase }}
      >
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded bg-[var(--surface-2)] px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                {groupLabel}
              </span>
              <span className="rounded bg-[var(--surface-2)] px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-[var(--text-tertiary)]">
                {statusLabel}
              </span>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">{animation.title}</h3>
            <p className="max-w-[34ch] text-sm leading-6 text-[var(--text-secondary)]">
              {animation.description}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded px-2.5 py-1 text-xs ${difficultyColors[animation.difficulty]}`}
              >
                {animation.difficulty}
              </span>
              {animation.library.map((library) => (
                <span
                  key={library}
                  className={`rounded px-2.5 py-1 text-xs ${libraryColors[library]}`}
                >
                  {library === "framer-motion" ? "Framer" : "GSAP"}
                </span>
              ))}
              <span className="rounded bg-[var(--surface-2)] px-2.5 py-1 text-xs text-[var(--text-tertiary)]">
                {categoryLabels[animation.category]}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">View demo</span>
              <motion.span
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--text-secondary)]"
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
      className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-2)] p-4"
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ delay, duration: reducedMotion ? 0.01 : 0.45, ease: entranceEase }}
    >
      <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[var(--text-tertiary)]">{label}</p>
      <p className="mt-2 text-lg font-semibold tracking-tight text-[var(--text-primary)]">{value}</p>
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
    <main className="min-h-screen bg-[var(--surface-0)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="relative border-b border-[var(--border-subtle)] px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div className="max-w-3xl">
              <motion.p
                className="text-xs uppercase tracking-[0.34em] text-[var(--accent)]"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.4, ease: entranceEase }}
              >
                Motion Discovery
              </motion.p>
              <motion.h1
                className="mt-4 max-w-4xl font-serif text-4xl tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl"
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
                className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg"
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
          className="sticky top-4 z-20 mt-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4"
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
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-tertiary)]"
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
                  className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--surface-2)] py-3 pl-12 pr-12 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-[border-color,box-shadow] duration-200 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)]"
                />
                <AnimatePresence initial={false}>
                  {query && (
                    <motion.button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded border border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
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
                <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-2)] px-4 py-2 text-sm text-[var(--text-secondary)]">
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
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                      {resultLabel}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {hasActiveControls && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-md border border-[var(--border-subtle)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--surface-3)] hover:text-[var(--text-primary)]"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2">
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
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
                      tone="zinc"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
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
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
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
              <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                Live Results
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.h2
                  key={`${resultLabel}-${selectionLabel}`}
                  className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
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

            <p className="max-w-xl text-sm leading-6 text-[var(--text-tertiary)]">{selectionLabel}</p>
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
                className="mt-10 rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--surface-1)] px-6 py-12 text-center"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.28,
                  ease: entranceEase,
                }}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded border border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--text-secondary)]">
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
                <h3 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">No matching demos</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-tertiary)]">
                  Broaden the search, remove a few filters, or reset the panel to scan the full
                  gallery again.
                </p>
                {hasActiveControls && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-6 rounded-md border border-[var(--border-subtle)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--surface-3)] hover:text-[var(--text-primary)]"
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
