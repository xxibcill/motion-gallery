"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface CommandPaletteItem {
  id: string;
  title: string;
  detail: string;
  shortcut: string;
}

export interface CommandPaletteHighlightProps {
  items: CommandPaletteItem[];
  density?: "compact" | "comfortable";
  loading?: boolean;
}

export function CommandPaletteHighlight({
  items,
  density = "comfortable",
  loading = false,
}: CommandPaletteHighlightProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicator, setIndicator] = useState({ top: 0, height: density === "compact" ? 56 : 72 });

  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmed) ||
        item.detail.toLowerCase().includes(trimmed) ||
        item.shortcut.toLowerCase().includes(trimmed)
    );
  }, [items, query]);

  useEffect(() => {
    const row = rowRefs.current[activeIndex];
    const list = listRef.current;
    if (!row || !list) return;

    const rowRect = row.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    setIndicator({
      top: rowRect.top - listRect.top,
      height: rowRect.height,
    });
  }, [activeIndex, filteredItems, density]);

  const rowPadding = density === "compact" ? "px-4 py-3" : "px-4 py-4";

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] shadow-[0_28px_60px_-40px_rgba(2,6,23,0.95)]">
      <div className="border-b border-white/10 px-4 py-4">
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={(event) => {
            if (!filteredItems.length) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((value) => (value + 1) % filteredItems.length);
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((value) => (value - 1 + filteredItems.length) % filteredItems.length);
            }
          }}
          placeholder="Search commands, files, and demos"
          className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-zinc-500"
        />
      </div>

      <div ref={listRef} className="relative p-3">
        {!prefersReducedMotion && filteredItems.length > 0 ? (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-3 right-3 rounded-[1.25rem] border border-cyan-200/18 bg-[linear-gradient(90deg,rgba(34,211,238,0.18),rgba(255,255,255,0.03))]"
            animate={{ top: indicator.top + 12, height: indicator.height }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : null}

        {loading ? (
          <div className="px-4 py-10 text-sm text-zinc-400">Loading results…</div>
        ) : filteredItems.length === 0 ? (
          <div className="px-4 py-10 text-sm text-zinc-400">No commands match the current query.</div>
        ) : (
          <div role="listbox" aria-label="Command results" className="relative z-10 flex flex-col gap-1">
            {filteredItems.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    rowRefs.current[index] = node;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onPointerEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className={`flex items-center justify-between gap-4 rounded-[1.25rem] text-left focus-visible:outline-none ${rowPadding} ${prefersReducedMotion && isActive ? "bg-cyan-300/10" : ""}`}
                >
                  <div>
                    <p className={`font-medium ${isActive ? "text-white" : "text-zinc-200"}`}>{item.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{item.detail}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
                    {item.shortcut}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
