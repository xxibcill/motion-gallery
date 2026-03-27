"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { reassemblyCards, riftSprings, type RiftSceneId } from "./dimensional-rift-presets";
import type { transitionLabDurations } from "@/lib/animation-presets";

interface ReassemblyProps {
  activeScene: {
    id: RiftSceneId;
    eyebrow: string;
    title: string;
    body: string;
    metrics: readonly string[];
    palette: {
      card: string;
      text: string;
      panel: string;
    };
  };
  isActive: boolean;
  prefersReducedMotion: boolean;
  durations: typeof transitionLabDurations;
}

function ReassemblyComponent({
  activeScene,
  isActive,
  prefersReducedMotion,
  durations,
}: ReassemblyProps) {
  return (
    <motion.div
      className="relative z-10 grid min-h-[30rem] gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)] lg:items-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <div className="grid gap-4 lg:grid-cols-2">
          {reassemblyCards.map((card, index) => (
            <motion.div
              key={card.id}
              className={`${card.className} ${
                card.id === "hero"
                  ? `${activeScene.palette.card} ${activeScene.palette.text}`
                  : activeScene.palette.panel
              }`}
              initial={{
                opacity: 0,
                x: prefersReducedMotion ? 0 : card.offset.x,
                y: prefersReducedMotion ? 0 : card.offset.y,
                scale: prefersReducedMotion ? 1 : 0.2,
                rotateX: prefersReducedMotion ? 0 : card.rotateX,
                rotateY: prefersReducedMotion ? 0 : card.rotateY,
              }}
              animate={{
                opacity: isActive ? 1 : 0,
                x: isActive ? 0 : card.offset.x,
                y: isActive ? 0 : card.offset.y,
                scale: isActive ? 1 : 0.2,
                rotateX: isActive ? 0 : card.rotateX,
                rotateY: isActive ? 0 : card.rotateY,
              }}
              transition={{
                type: prefersReducedMotion ? "tween" : "spring",
                duration: prefersReducedMotion ? durations.brisk : undefined,
                ...riftSprings.reassembly,
                delay: prefersReducedMotion
                  ? 0
                  : isActive
                    ? card.id === "hero"
                      ? 0
                      : 0.15
                    : 0,
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {card.id === "hero" ? (
                <>
                  <p className="text-xs uppercase tracking-[0.34em] text-white/46">
                    {activeScene.eyebrow}
                  </p>
                  <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-[0.94] md:text-6xl">
                    {activeScene.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-white/74 md:text-lg">
                    {activeScene.body}
                  </p>
                </>
              ) : card.id === "brief" ? (
                <>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                    Dimension breach
                  </p>
                  <p className="mt-4 text-sm leading-6 text-white/68">
                    The rift tears through spacetime in four distinct phases.
                    Each shard follows its own trajectory through the void before
                    snapping back into place with magnetic precision.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                    Rift metrics
                  </p>
                  <div className="mt-4 grid gap-3">
                    {activeScene.metrics.map((metric) => (
                      <div
                        key={metric}
                        className="rounded-[1.2rem] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white/66"
                      >
                        {metric}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.aside
        className="rounded-[1.75rem] border border-white/10 bg-black/24 p-5 text-sm text-white/66 backdrop-blur-md"
        initial={{
          opacity: 0,
          x: prefersReducedMotion ? 0 : 26,
        }}
        animate={{
          opacity: isActive ? 1 : 0,
          x: isActive ? 0 : 26,
        }}
        transition={{
          duration: prefersReducedMotion ? durations.brisk : durations.base,
          delay: prefersReducedMotion ? 0 : isActive ? 0.3 : 0,
        }}
      >
        <p className="text-xs uppercase tracking-[0.28em] text-white/40">
          Rift sequence
        </p>
        <ol className="mt-5 space-y-3 leading-6">
          <li>1. Reality fractures into floating 3D shards.</li>
          <li>2. Gravitational void pulls everything to center.</li>
          <li>3. Traverse the chromatic dimensional tunnel.</li>
          <li>4. Magnetic reassembly in the new dimension.</li>
        </ol>
      </motion.aside>
    </motion.div>
  );
}

export const Reassembly = memo(ReassemblyComponent);
