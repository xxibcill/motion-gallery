"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  getAllAnimations,
  getAnimationsByGroup,
  type AnimationMeta,
  type AnimationCategory,
} from "@/lib/animation-registry";
import { isAnimationActive } from "@/lib/route-matching";

const colorClasses: Record<string, string> = {
  zinc: "text-zinc-400 hover:text-zinc-300",
  slate: "text-slate-400 hover:text-slate-300",
  indigo: "text-indigo-400 hover:text-indigo-300",
  violet: "text-violet-400 hover:text-violet-300",
  fuchsia: "text-fuchsia-400 hover:text-fuchsia-300",
  emerald: "text-emerald-400 hover:text-emerald-300",
  rose: "text-rose-400 hover:text-rose-300",
  amber: "text-amber-400 hover:text-amber-300",
  cyan: "text-cyan-400 hover:text-cyan-300",
};

const activeColorClasses: Record<string, string> = {
  zinc: "text-zinc-200",
  slate: "text-slate-200",
  indigo: "text-indigo-200",
  violet: "text-violet-200",
  fuchsia: "text-fuchsia-200",
  emerald: "text-emerald-200",
  rose: "text-rose-200",
  amber: "text-amber-200",
  cyan: "text-cyan-200",
};

const categoryIcons: Record<AnimationCategory, string> = {
  "scroll-based": "↕",
  "text-effects": "Aa",
  "hover-interactions": "◎",
  "3d-transforms": "◇",
  "page-transitions": "▶",
  "layout-animations": "▦",
};

const categoryLabels: Record<AnimationCategory, string> = {
  "scroll-based": "Scroll",
  "text-effects": "Text",
  "hover-interactions": "Hover",
  "3d-transforms": "3D",
  "page-transitions": "Page",
  "layout-animations": "Layout",
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
      <div className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
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
              className={`${isActive ? activeClass : colorClass} flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:bg-white/5 ${isActive ? "bg-white/5" : ""}`}
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
        className="fixed top-5 left-5 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
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
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Navigation Panel */}
            <motion.nav
              id="animation-nav-panel"
              className="fixed top-20 left-5 z-50 w-72 max-h-[calc(100vh-6rem)] overflow-y-auto bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50"
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Search */}
              <div className="p-3 border-b border-white/5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search animations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 pl-9 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
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
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 border-b border-white/5 mb-2">
                    <span className="text-cyan-400">◆</span>
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
                  <div className="border-t border-white/5 pt-3">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 border-b border-white/5 mb-2">
                      <span className="text-violet-400">◈</span>
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
                            className={`${isActive ? activeClass : colorClass} flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:bg-white/5 ${isActive ? "bg-white/5" : ""}`}
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
