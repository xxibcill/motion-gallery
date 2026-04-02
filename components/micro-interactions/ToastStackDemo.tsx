"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface ToastItem {
  id: number;
  title: string;
  detail: string;
}

export interface ToastStackDemoProps {
  stackSize?: number;
  timeoutMs?: number;
}

function buildToasts(size: number): ToastItem[] {
  return Array.from({ length: size }, (_, index) => ({
    id: index + 1,
    title: ["Deployment ready", "Comment posted", "Changes synced", "Invite sent", "Preset saved"][index % 5],
    detail: ["All checks passed.", "Conversation updated.", "Motion tokens are aligned.", "Slack and email queued.", "Component registered."][index % 5],
  }));
}

export function ToastStackDemo({
  stackSize = 3,
  timeoutMs = 2600,
}: ToastStackDemoProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [toasts, setToasts] = useState<ToastItem[]>(() => buildToasts(stackSize));
  const [seed, setSeed] = useState(stackSize + 1);

  useEffect(() => {
    setToasts(buildToasts(stackSize));
    setSeed(stackSize + 1);
  }, [stackSize]);

  useEffect(() => {
    if (timeoutMs <= 0) return;

    const timers = toasts.map((toast, index) =>
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, timeoutMs + index * 180)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [timeoutMs, toasts]);

  const stacked = useMemo(() => [...toasts].reverse(), [toasts]);

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Toast Stack</p>
          <p className="mt-1 text-sm text-zinc-300">Auto-dismiss, swipe, and reflow stay readable.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setToasts((current) => [
              {
                id: seed,
                title: "Manual toast",
                detail: "Added back into the stack for another dismissal pass.",
              },
              ...current,
            ]);
            setSeed((value) => value + 1);
          }}
          className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1.5 text-sm text-cyan-50 transition-colors hover:bg-cyan-300/18"
        >
          Add Toast
        </button>
      </div>

      <div className="relative min-h-[18rem] rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.98))] p-4">
        <AnimatePresence initial={false}>
          {stacked.map((toast, index) => (
            <motion.div
              key={toast.id}
              layout
              drag={prefersReducedMotion ? false : "x"}
              dragElastic={0.15}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 110) {
                  setToasts((current) => current.filter((item) => item.id !== toast.id));
                }
              }}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 48, y: -18, scale: 0.96 }}
              animate={{
                opacity: 1,
                x: 0,
                y: index * 14,
                scale: 1 - index * 0.03,
              }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 80, scale: 0.92 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-4 top-4 rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_24px_48px_-28px_rgba(2,6,23,0.95)]"
              style={{ zIndex: 20 - index }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">{toast.title}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">{toast.detail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
