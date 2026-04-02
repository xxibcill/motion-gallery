"use client";

import { motion, useReducedMotion } from "motion/react";

export interface StepperProgressPulseProps {
  stepCount?: number;
  activeIndex?: number;
  pulseKey?: number;
}

export function StepperProgressPulse({
  stepCount = 4,
  activeIndex = 1,
  pulseKey = 0,
}: StepperProgressPulseProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <div className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] p-6 shadow-[0_24px_58px_-38px_rgba(2,6,23,0.95)]">
      <div className="grid gap-6 md:grid-cols-[repeat(var(--step-count),minmax(0,1fr))]" style={{ ["--step-count" as string]: stepCount }}>
        {Array.from({ length: stepCount }, (_, index) => {
          const state =
            index < activeIndex ? "complete" : index === activeIndex ? "active" : "upcoming";

          return (
            <div key={index} className="relative">
              <div className="flex items-center gap-4">
                <motion.div
                  className={`relative grid h-12 w-12 place-items-center rounded-full border text-sm font-semibold ${
                    state === "complete"
                      ? "border-emerald-300/30 text-emerald-50"
                      : state === "active"
                        ? "border-cyan-200/30 text-cyan-50"
                        : "border-white/10 text-zinc-400"
                  }`}
                  initial={false}
                  animate={{
                    scale: state === "active" && !prefersReducedMotion ? [1, 1.05, 1] : 1,
                    boxShadow:
                      state === "complete"
                        ? "0 18px 38px -24px rgba(52,211,153,0.42)"
                        : state === "active"
                          ? "0 18px 38px -24px rgba(34,211,238,0.35)"
                          : "0 0 0 0 rgba(0,0,0,0)",
                  }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {state === "complete" ? "✓" : index + 1}
                </motion.div>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Step {index + 1}</p>
                  <p className="mt-1 text-base font-medium text-white">
                    {state === "complete"
                      ? "Completed"
                      : state === "active"
                        ? "Current focus"
                        : "Upcoming"}
                  </p>
                </div>
              </div>

              {index < stepCount - 1 ? (
                <div className="relative ml-6 mt-4 h-2 rounded-full bg-white/8 md:ml-0 md:mt-6">
                  <motion.div
                    className={`h-full rounded-full ${
                      index < activeIndex ? "bg-emerald-300/90" : "bg-white/12"
                    }`}
                    initial={false}
                    animate={{ width: index < activeIndex ? "100%" : index === activeIndex ? "40%" : "0%" }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                  />
                  {!prefersReducedMotion && pulseKey > 0 && activeIndex > 0 && activeIndex - 1 === index ? (
                    <motion.span
                      key={pulseKey}
                      aria-hidden="true"
                      className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-cyan-100 shadow-[0_0_18px_rgba(103,232,249,0.95)]"
                      initial={{ left: "0%", opacity: 0.2 }}
                      animate={{ left: "100%", opacity: [0.25, 1, 0.2] }}
                      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
