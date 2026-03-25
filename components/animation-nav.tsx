"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getAllAnimations } from "@/lib/animation-registry";
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

export function AnimationNav() {
  const pathname = usePathname();
  const animations = getAllAnimations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Toggle navigation"
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
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.nav
              className="fixed top-20 left-5 z-50 flex flex-col gap-0.5 bg-zinc-900/90 backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-2xl shadow-black/50"
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {animations.map((animation, index) => {
                const isActive = isAnimationActive(pathname, animation);
                const colorClass = colorClasses[animation.color] || colorClasses.zinc;
                const activeClass = activeColorClasses[animation.color] || activeColorClasses.zinc;

                return (
                  <motion.div
                    key={animation.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                  >
                    <Link
                      href={animation.path}
                      className={`${isActive ? activeClass : colorClass} block px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/5 ${isActive ? "bg-white/5" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {animation.title}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
