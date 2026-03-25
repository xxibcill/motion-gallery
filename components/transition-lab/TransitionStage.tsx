"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getSceneEntrance, transitionLabLayers } from "@/lib/transition-lab";
import { NoiseOverlay } from "@/components/transition-lab/NoiseOverlay";

interface TransitionStageProps {
  children: ReactNode;
  className?: string;
  backgroundClassName?: string;
  chrome?: ReactNode;
  overlays?: ReactNode;
  noiseOpacity?: number;
}

export function TransitionStage({
  children,
  className = "",
  backgroundClassName = "bg-zinc-950/90",
  chrome,
  overlays,
  noiseOpacity,
}: TransitionStageProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const entrance = getSceneEntrance(prefersReducedMotion);

  return (
    <motion.div
      className={`relative isolate overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.45)] ${className}`}
      initial={entrance.initial}
      animate={entrance.animate}
      transition={entrance.transition}
    >
      <div className={`absolute inset-0 ${backgroundClassName}`} />
      <NoiseOverlay opacity={noiseOpacity} />
      {overlays}
      <div
        className="relative"
        style={{ zIndex: transitionLabLayers.content }}
      >
        {children}
      </div>
      {chrome ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ zIndex: transitionLabLayers.chrome }}
        >
          {chrome}
        </div>
      ) : null}
    </motion.div>
  );
}
