"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export interface TabUnderlineItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabUnderlineFollowerProps extends HTMLAttributes<HTMLDivElement> {
  tabs: TabUnderlineItem[];
  underlineStyle?: "line" | "pill";
  defaultTabId?: string;
  disabled?: boolean;
}

export function TabUnderlineFollower({
  tabs,
  underlineStyle = "line",
  defaultTabId,
  disabled = false,
  className = "",
  ...props
}: TabUnderlineFollowerProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const initialTab = useMemo(
    () => defaultTabId ?? tabs[0]?.id ?? "",
    [defaultTabId, tabs]
  );
  const [activeTab, setActiveTab] = useState(initialTab);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab)
  );
  const activeItem = tabs[activeIndex];

  const focusTab = (index: number) => {
    const nextIndex = (index + tabs.length) % tabs.length;
    setActiveTab(tabs[nextIndex].id);
    tabsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || tabs.length === 0) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(activeIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(activeIndex - 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      focusTab(tabs.length - 1);
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      <div
        role="tablist"
        aria-label="Tab underline follower"
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-2 rounded-[1.6rem] border border-white/10 bg-slate-950/85 p-2"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabsRef.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${tab.id}-tab`}
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              tabIndex={isActive ? 0 : -1}
              disabled={disabled}
              onClick={() => setActiveTab(tab.id)}
              className={`relative rounded-full px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                isActive ? "text-white" : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {isActive ? (
                underlineStyle === "pill" ? (
                  prefersReducedMotion ? (
                    <span className="absolute inset-0 rounded-full bg-white/10" />
                  ) : (
                    <motion.span
                      layoutId="tab-underline-pill"
                      className="absolute inset-0 rounded-full bg-white/10"
                      transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    />
                  )
                ) : prefersReducedMotion ? (
                  <span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-cyan-200" />
                ) : (
                  <motion.span
                    layoutId="tab-underline-line"
                    className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-cyan-200"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )
              ) : null}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="min-h-44 rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6">
        {prefersReducedMotion ? (
          <div
            role="tabpanel"
            id={`${activeItem?.id ?? "tab"}-panel`}
            aria-labelledby={`${activeItem?.id ?? "tab"}-tab`}
            className="text-sm leading-7 text-zinc-300"
          >
            {activeItem?.content}
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeItem?.id}
              role="tabpanel"
              id={`${activeItem?.id ?? "tab"}-panel`}
              aria-labelledby={`${activeItem?.id ?? "tab"}-tab`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm leading-7 text-zinc-300"
            >
              {activeItem?.content}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
