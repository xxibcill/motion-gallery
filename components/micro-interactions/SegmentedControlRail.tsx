"use client";

import type { HTMLAttributes } from "react";
import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface SegmentedControlRailProps extends HTMLAttributes<HTMLDivElement> {
  options: string[];
  defaultValue?: string;
  width?: number;
  disabled?: boolean;
}

export function SegmentedControlRail({
  options,
  defaultValue,
  width = 420,
  disabled = false,
  className = "",
  ...props
}: SegmentedControlRailProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const initialValue = useMemo(
    () => defaultValue ?? options[0] ?? "",
    [defaultValue, options]
  );
  const [selected, setSelected] = useState(initialValue);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option === selected)
  );

  const move = (nextIndex: number) => {
    const clampedIndex = (nextIndex + options.length) % options.length;
    setSelected(options[clampedIndex]);
    buttonsRef.current[clampedIndex]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || options.length === 0) {
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      move(selectedIndex + 1);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      move(selectedIndex - 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      move(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      move(options.length - 1);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Segmented control"
      onKeyDown={handleKeyDown}
      className={`rounded-[1.6rem] border border-white/10 bg-slate-950/90 p-1.5 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.85)] ${className}`}
      style={{ width }}
      {...props}
    >
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((option, index) => {
          const active = option === selected;

          return (
            <button
              key={option}
              ref={(node) => {
                buttonsRef.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              disabled={disabled}
              onClick={() => setSelected(option)}
              className={`relative rounded-[1.1rem] px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                active ? "text-slate-950" : "text-zinc-300 hover:text-white"
              }`}
            >
              {active ? (
                prefersReducedMotion ? (
                  <span className="absolute inset-0 rounded-[1.1rem] bg-cyan-200" />
                ) : (
                  <motion.span
                    layoutId="segmented-control-rail"
                    className="absolute inset-0 rounded-[1.1rem] bg-[linear-gradient(135deg,#cffafe,#67e8f9_45%,#93c5fd)]"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )
              ) : null}
              <span className="relative z-10">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
