"use client";

import type { HTMLAttributes } from "react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export interface AccordionItem {
  id: string;
  title: string;
  body: string;
}

export interface ChevronAccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  spacing?: number;
  defaultOpenId?: string;
  disabled?: boolean;
}

export function ChevronAccordion({
  items,
  spacing = 14,
  defaultOpenId,
  disabled = false,
  className = "",
  ...props
}: ChevronAccordionProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const initialItem = useMemo(
    () => defaultOpenId ?? items[0]?.id ?? "",
    [defaultOpenId, items]
  );
  const [openId, setOpenId] = useState(initialItem);

  return (
    <div className={`flex flex-col ${className}`} style={{ gap: spacing }} {...props}>
      {items.map((item) => {
        const isOpen = item.id === openId;
        const panelId = `${item.id}-panel`;

        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03]"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              disabled={disabled}
              onClick={() => setOpenId((current) => (current === item.id ? "" : item.id))}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-zinc-100 transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80 focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-45"
            >
              <motion.span
                animate={{
                  x: isOpen && !prefersReducedMotion ? 4 : 0,
                  opacity: isOpen ? 1 : 0.86,
                }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
                className="text-base font-medium"
              >
                {item.title}
              </motion.span>
              <motion.span
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300"
                animate={{ rotate: prefersReducedMotion ? 0 : isOpen ? 90 : 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                ›
              </motion.span>
            </button>

            {prefersReducedMotion ? (
              isOpen ? (
                <div id={panelId} className="px-5 pb-5 text-sm leading-7 text-zinc-300">
                  {item.body}
                </div>
              ) : null
            ) : (
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={panelId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.18 },
                    }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ clipPath: "inset(0 0 100% 0)", y: -8 }}
                      animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
                      exit={{ clipPath: "inset(0 0 100% 0)", y: -8 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      className="px-5 pb-5 text-sm leading-7 text-zinc-300"
                    >
                      {item.body}
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </div>
  );
}
