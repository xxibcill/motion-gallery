"use client";

import { useEffect, useState } from "react";
import { Reorder, motion, useReducedMotion } from "motion/react";

interface SortCard {
  id: string;
  title: string;
  detail: string;
}

export interface DragLiftSortCardsProps {
  cardCount?: number;
  axis?: "x" | "y";
}

function buildCards(cardCount: number): SortCard[] {
  return Array.from({ length: cardCount }, (_, index) => ({
    id: `card-${index + 1}`,
    title: ["Preview", "Layout", "Tokens", "Review", "Ship", "Archive"][index % 6],
    detail: ["Check motion", "Tune spacing", "Sync palette", "Resolve comments", "Publish route", "Keep notes"][index % 6],
  }));
}

export function DragLiftSortCards({
  cardCount = 4,
  axis = "y",
}: DragLiftSortCardsProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [items, setItems] = useState<SortCard[]>(() => buildCards(cardCount));

  useEffect(() => {
    setItems(buildCards(cardCount));
  }, [cardCount]);

  const directionLabel = axis === "y" ? "vertical" : "horizontal";

  return (
    <div className="flex w-full max-w-4xl flex-col gap-4">
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
        Drag or use the move buttons to reorder. The settle animation is calmer when reduced motion is enabled.
      </div>

      <Reorder.Group
        axis={axis}
        values={items}
        onReorder={setItems}
        className={
          axis === "y"
            ? "flex flex-col gap-3"
            : "flex flex-wrap items-start gap-3"
        }
      >
        {items.map((item, index) => (
          <Reorder.Item
            key={item.id}
            value={item}
            drag={!prefersReducedMotion}
            whileDrag={
              prefersReducedMotion
                ? undefined
                : {
                    scale: 1.02,
                    boxShadow: "0 28px 54px -34px rgba(34,211,238,0.45)",
                  }
            }
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className={axis === "y" ? "list-none" : "list-none w-[min(18rem,100%)]"}
          >
            <motion.article
              layout
              aria-label={`${item.title}: ${item.detail}. Position ${index + 1} of ${items.length}. Drag to reorder.`}
              className="rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.98))] p-4 shadow-[0_24px_48px_-34px_rgba(2,6,23,0.94)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">
                    {directionLabel}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{item.detail}</p>
                </div>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-400">
                  {index + 1}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Move ${item.title} ${axis === "y" ? "up" : "left"}`}
                  onClick={() => {
                    if (index === 0) return;
                    setItems((current) => {
                      const next = [...current];
                      [next[index - 1], next[index]] = [next[index], next[index - 1]];
                      return next;
                    });
                  }}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                >
                  {axis === "y" ? "Up" : "Left"}
                </button>
                <button
                  type="button"
                  aria-label={`Move ${item.title} ${axis === "y" ? "down" : "right"}`}
                  onClick={() => {
                    if (index === items.length - 1) return;
                    setItems((current) => {
                      const next = [...current];
                      [next[index], next[index + 1]] = [next[index + 1], next[index]];
                      return next;
                    });
                  }}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                >
                  {axis === "y" ? "Down" : "Right"}
                </button>
              </div>
            </motion.article>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
