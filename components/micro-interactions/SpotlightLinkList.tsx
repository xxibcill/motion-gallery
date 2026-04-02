"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface SpotlightLinkItem {
  title: string;
  meta: string;
  href?: string;
}

export interface SpotlightLinkListProps {
  items: SpotlightLinkItem[];
  spotlightSize?: number;
  feel?: "soft" | "crisp";
}

export function SpotlightLinkList({
  items,
  spotlightSize = 180,
  feel = "soft",
}: SpotlightLinkListProps) {
  const crispEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const softEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const prefersReducedMotion = useReducedMotion() ?? false;
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });
  const [pointer, setPointer] = useState({ x: 50, y: 16 });

  useEffect(() => {
    const row = rowRefs.current[activeIndex];
    const container = containerRef.current;
    if (!row || !container) return;

    const rowRect = row.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setIndicator({
      top: rowRect.top - containerRect.top,
      height: rowRect.height,
    });
  }, [activeIndex, items]);

  const transition =
    feel === "crisp"
      ? { duration: prefersReducedMotion ? 0.01 : 0.18, ease: crispEase }
      : { duration: prefersReducedMotion ? 0.01 : 0.28, ease: softEase };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.98))] p-3"
      onPointerMove={(event) => {
        if (prefersReducedMotion || !containerRef.current) {
          return;
        }

        const rect = containerRef.current.getBoundingClientRect();
        setPointer({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }}
    >
      {!prefersReducedMotion ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-90"
          animate={{ opacity: 1 }}
          style={{
            background: `radial-gradient(${spotlightSize}px circle at ${pointer.x}px ${pointer.y}px, rgba(125,211,252,0.18), transparent 48%)`,
          }}
        />
      ) : null}

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-3 right-3 rounded-[1.45rem] border border-cyan-200/18 bg-[linear-gradient(90deg,rgba(103,232,249,0.14),rgba(255,255,255,0.04))]"
        animate={{ top: indicator.top, height: indicator.height }}
        transition={transition}
      />

      <div className="relative z-10 flex flex-col">
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={item.title}
              ref={(node) => {
                rowRefs.current[index] = node;
              }}
              type="button"
              onPointerEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className="flex items-center justify-between gap-4 rounded-[1.45rem] px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <div>
                <p className={`text-base font-medium ${isActive ? "text-white" : "text-zinc-200"}`}>
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-zinc-400">{item.meta}</p>
              </div>
              <span className="text-sm text-zinc-500">{item.href ?? "Reusable"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
