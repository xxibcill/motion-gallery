"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type UploadPhase = "idle" | "drag" | "uploading" | "success" | "error";

export interface DropzonePulseUploadProps {
  phase?: UploadPhase;
  progress?: number;
}

export function DropzonePulseUpload({
  phase = "idle",
  progress = 48,
}: DropzonePulseUploadProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const title =
    phase === "drag"
      ? "Drop the file to upload"
      : phase === "uploading"
        ? "Uploading asset"
        : phase === "success"
          ? "Upload complete"
          : phase === "error"
            ? "Upload failed"
            : "Drop files here";

  const detail =
    phase === "drag"
      ? "Pulse and border contrast rise to advertise the drop target."
      : phase === "uploading"
        ? "Progress is separated from the drag-over pulse so state remains obvious."
        : phase === "success"
          ? "The surface resolves into a calmer confirmation state."
          : phase === "error"
            ? "Color and copy do the work without adding extra movement."
            : "Drag, browse, or simulate progress changes from the controls.";

  return (
    <motion.div
      className={`relative w-full max-w-2xl overflow-hidden rounded-[2rem] border p-6 ${
        phase === "error"
          ? "border-rose-300/26"
          : phase === "success"
            ? "border-emerald-300/26"
            : phase === "drag"
              ? "border-cyan-200/34"
              : "border-white/10"
      } bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))]`}
      initial={false}
      animate={{
        scale: phase === "drag" && !prefersReducedMotion ? 1.01 : 1,
        boxShadow:
          phase === "drag"
            ? "0 30px 62px -38px rgba(34,211,238,0.42)"
            : phase === "success"
              ? "0 30px 62px -38px rgba(52,211,153,0.38)"
              : phase === "error"
                ? "0 30px 62px -38px rgba(251,113,133,0.34)"
                : "0 20px 44px -32px rgba(2,6,23,0.94)",
      }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.24, ease: [0.16, 1, 0.3, 1] }}
    >
      {!prefersReducedMotion && phase === "drag" ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          animate={{
            opacity: [0.35, 0.9, 0.35],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{ duration: 1.15, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(34,211,238,0.22), transparent 52%)",
          }}
        />
      ) : null}

      <div className="relative z-10 flex min-h-[18rem] flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-white/12 bg-white/[0.02] px-6 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-white">
          <span className="text-2xl">{phase === "success" ? "✓" : phase === "error" ? "!" : "↑"}</span>
        </div>
        <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">{detail}</p>

        <AnimatePresence initial={false}>
          {phase === "uploading" ? (
            <motion.div
              key="progress"
              className="mt-6 w-full max-w-md"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-cyan-100/70">
                <span>Upload</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.95),rgba(103,232,249,0.78))]"
                  initial={false}
                  animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
