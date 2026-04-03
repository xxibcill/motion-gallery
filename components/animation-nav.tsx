"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  getAnimationsByGroup,
  type AnimationMeta,
  type AnimationCategory,
} from "@/lib/animation-registry";
import { isAnimationActive } from "@/lib/route-matching";

const colorClasses: Record<string, string> = {
  zinc: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  slate: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  sky: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  orange: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  indigo: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  violet: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  fuchsia: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  emerald: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  rose: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  amber: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  cyan: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
};

const activeColorClasses: Record<string, string> = {
  zinc: "text-[var(--text-primary)]",
  slate: "text-[var(--text-primary)]",
  sky: "text-[var(--text-primary)]",
  orange: "text-[var(--text-primary)]",
  indigo: "text-[var(--text-primary)]",
  violet: "text-[var(--text-primary)]",
  fuchsia: "text-[var(--text-primary)]",
  emerald: "text-[var(--text-primary)]",
  rose: "text-[var(--text-primary)]",
  amber: "text-[var(--text-primary)]",
  cyan: "text-[var(--text-primary)]",
};

const categoryIcons: Record<AnimationCategory, string> = {
  "scroll-based": "↕",
  "text-effects": "Aa",
  "hover-interactions": "◎",
  "3d-transforms": "◇",
  "page-transitions": "▶",
  "layout-animations": "▦",
};

interface NavSectionProps {
  title: string;
  icon: string;
  items: AnimationMeta[];
  pathname: string;
  onItemClick: () => void;
}

function NavSection({ title, icon, items, pathname, onItemClick }: NavSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
        <span className="opacity-60">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map((animation) => {
          const isActive = isAnimationActive(pathname, animation);
          const colorClass = colorClasses[animation.color] || colorClasses.zinc;
          const activeClass = activeColorClasses[animation.color] || activeColorClasses.zinc;

          return (
            <Link
              key={animation.id}
              href={animation.path}
              aria-current={isActive ? "page" : undefined}
              className={`${isActive ? activeClass : colorClass} flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-all duration-200 hover:bg-[var(--surface-2)] ${isActive ? "bg-[var(--surface-2)]" : ""}`}
              onClick={onItemClick}
            >
              <span className="text-[10px] opacity-50 w-4">
                {categoryIcons[animation.category]}
              </span>
              <span>{animation.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AnimationNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const coreAnimations = useMemo(() => {
    const all = getAnimationsByGroup("core");
    const filtered = search
      ? all.filter(
          (a) =>
            a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
        )
      : all;

    // Group by category
    const groups: Record<AnimationCategory, AnimationMeta[]> = {
      "scroll-based": [],
      "text-effects": [],
      "hover-interactions": [],
      "3d-transforms": [],
      "page-transitions": [],
      "layout-animations": [],
    };

    filtered.forEach((a) => groups[a.category].push(a));
    return groups;
  }, [search]);

  const transitionLabAnimations = useMemo(() => {
    const all = getAnimationsByGroup("transition-lab");
    if (search) {
      return all.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
      );
    }
    return all;
  }, [search]);

  return (
    <>
      {/* Menu Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-50 w-10 h-10 flex items-center justify-center rounded-md bg-[var(--surface-1)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        aria-controls="animation-nav-panel"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"}
            initial={false}
            animate={{ pathLength: 1 }}
            key={isOpen ? "close" : "menu"}
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Navigation Panel */}
            <motion.nav
              id="animation-nav-panel"
              className="fixed top-20 left-5 z-50 w-72 max-h-[calc(100vh-6rem)] overflow-y-auto bg-[var(--surface-1)] rounded-lg border border-[var(--border-subtle)] shadow-lg shadow-black/40"
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Search */}
              <div className="p-3 border-b border-[var(--border-subtle)]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search animations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-md px-3 py-2 pl-9 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-muted)] focus:border-[var(--accent)]"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
              </div>

              <div className="p-2">
                {/* Core Gallery Section */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border-subtle)] mb-2">
                    <span className="text-[var(--accent)]">◆</span>
                    <span>Core Gallery</span>
                  </div>

                  <NavSection
                    title="Scroll"
                    icon="↕"
                    items={coreAnimations["scroll-based"]}
                    pathname={pathname}
                    onItemClick={() => setIsOpen(false)}
                  />
                  <NavSection
                    title="Text Effects"
                    icon="Aa"
                    items={coreAnimations["text-effects"]}
                    pathname={pathname}
                    onItemClick={() => setIsOpen(false)}
                  />
                  <NavSection
                    title="Hover & Interactions"
                    icon="◎"
                    items={coreAnimations["hover-interactions"]}
                    pathname={pathname}
                    onItemClick={() => setIsOpen(false)}
                  />
                  <NavSection
                    title="3D Transforms"
                    icon="◇"
                    items={coreAnimations["3d-transforms"]}
                    pathname={pathname}
                    onItemClick={() => setIsOpen(false)}
                  />
                  <NavSection
                    title="Layout"
                    icon="▦"
                    items={coreAnimations["layout-animations"]}
                    pathname={pathname}
                    onItemClick={() => setIsOpen(false)}
                  />
                </div>

                {/* Transition Lab Section */}
                {transitionLabAnimations.length > 0 && (
                  <div className="border-t border-[var(--border-subtle)] pt-3">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border-subtle)] mb-2">
                      <span className="text-[var(--accent)]">◈</span>
                      <span>Transition Lab</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {transitionLabAnimations.map((animation) => {
                        const isActive = isAnimationActive(pathname, animation);
                        const colorClass = colorClasses[animation.color] || colorClasses.zinc;
                        const activeClass =
                          activeColorClasses[animation.color] || activeColorClasses.zinc;

                        return (
                          <Link
                            key={animation.id}
                            href={animation.path}
                            aria-current={isActive ? "page" : undefined}
                            className={`${isActive ? activeClass : colorClass} flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-all duration-200 hover:bg-[var(--surface-2)] ${isActive ? "bg-[var(--surface-2)]" : ""}`}
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="text-[10px] opacity-50 w-4">
                              {animation.id === "transition" ? "◈" : "→"}
                            </span>
                            <span>{animation.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
