"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export interface NotificationBellPeekProps {
  items: Array<{ title: string; detail: string }>;
  badgeCount?: number;
  trayWidth?: number;
}

export function NotificationBellPeek({
  items,
  badgeCount = 3,
  trayWidth = 360,
}: NotificationBellPeekProps) {
  const trayId = useId();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const shellRef = useRef<HTMLDivElement | null>(null);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!shellRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    firstItemRef.current?.focus();

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={shellRef} className="relative flex min-h-[24rem] items-start justify-center pt-8">
      <div className="relative">
        <motion.button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={trayId}
          onClick={() => setOpen((value) => !value)}
          className="relative flex h-18 w-18 items-center justify-center rounded-[1.8rem] border border-white/12 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),rgba(14,165,233,0.1)_36%,rgba(15,23,42,0.92))] text-white shadow-[0_28px_56px_-36px_rgba(2,6,23,0.96)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
          whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
            <path
              d="M12 4a4 4 0 0 0-4 4v1.3c0 .9-.3 1.78-.85 2.5L5.5 14.1a1 1 0 0 0 .8 1.6h11.4a1 1 0 0 0 .8-1.6l-1.65-2.3a4.1 4.1 0 0 1-.84-2.5V8a4 4 0 0 0-4-4Zm0 15a2.5 2.5 0 0 0 2.33-1.6H9.67A2.5 2.5 0 0 0 12 19Z"
              fill="currentColor"
            />
          </svg>

          {badgeCount > 0 ? (
            <motion.span
              className="absolute right-3 top-3 grid h-6 min-w-6 place-items-center rounded-full bg-rose-400 px-1.5 text-[11px] font-semibold text-slate-950"
              animate={
                prefersReducedMotion
                  ? { scale: 1 }
                  : { scale: [1, 1.12, 1], boxShadow: ["0 0 0 0 rgba(251,113,133,0.48)", "0 0 0 8px rgba(251,113,133,0)", "0 0 0 0 rgba(251,113,133,0)"] }
              }
              transition={{ duration: 1.9, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
            >
              {badgeCount}
            </motion.span>
          ) : null}
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              id={trayId}
              role="dialog"
              aria-label="Notifications"
              className="absolute right-0 top-[calc(100%+1rem)] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] shadow-[0_38px_80px_-42px_rgba(2,6,23,0.96)]"
              style={{ width: trayWidth }}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="border-b border-white/10 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">Anchored Tray</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Notification Bell Peek</h3>
              </div>

              <div className="flex flex-col gap-2 p-3">
                {items.map((item, index) => (
                  <motion.button
                    key={item.title}
                    ref={index === 0 ? firstItemRef : undefined}
                    type="button"
                    className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-left text-zinc-200 transition-colors hover:border-cyan-200/20 hover:bg-cyan-300/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0.01 : 0.2,
                      delay: prefersReducedMotion ? 0 : index * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{item.detail}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
