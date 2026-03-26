"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DemoToolbar } from "@/components/transition-lab/DemoToolbar";
import { SceneFrame } from "@/components/transition-lab/SceneFrame";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import { useTransitionDemo } from "@/components/transition-lab/useTransitionDemo";
import {
  transitionLabDurations,
  transitionLabEasings,
} from "@/lib/animation-presets";

const liquidScenes = [
  {
    id: "lagoon",
    label: "Lagoon",
    eyebrow: "Elastic Mask",
    title: "Color arrives in waves instead of one hard wipe.",
    body:
      "Multiple blob layers expand with offset timing, so the next scene feels poured onto the stage rather than simply faded in.",
    notes: ["Soft bloom", "Layered mask", "Low-cost blur"],
    palette: {
      background:
        "bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.24),transparent_34%),linear-gradient(145deg,#060b18,#11091b_52%,#03151b)]",
      shell: "border-cyan-200/15 bg-white/[0.08]",
      glowA: "rgba(34, 211, 238, 0.42)",
      glowB: "rgba(168, 85, 247, 0.32)",
      glowC: "rgba(244, 114, 182, 0.24)",
      text: "text-cyan-50",
    },
  },
  {
    id: "bloom",
    label: "Bloom",
    eyebrow: "Diffused Reveal",
    title: "The scene unfolds like ink dispersing across frosted glass.",
    body:
      "The reveal trades rigid edges for translucent diffusion. Shapes overlap, stretch, and keep moving after the main content appears.",
    notes: ["Organic edges", "Glass depth", "Bloom halo"],
    palette: {
      background:
        "bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.18),transparent_30%),linear-gradient(140deg,#120711,#1a0b21_48%,#1d1608)]",
      shell: "border-fuchsia-200/15 bg-white/[0.09]",
      glowA: "rgba(236, 72, 153, 0.42)",
      glowB: "rgba(251, 146, 60, 0.3)",
      glowC: "rgba(192, 132, 252, 0.28)",
      text: "text-fuchsia-50",
    },
  },
] as const;

type LiquidSceneId = (typeof liquidScenes)[number]["id"];

interface BlobLayerProps {
  color: string;
  size: string;
  className: string;
  delay: number;
  prefersReducedMotion: boolean;
}

function BlobLayer({
  color,
  size,
  className,
  delay,
  prefersReducedMotion,
}: BlobLayerProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute rounded-[44%_56%_60%_40%/44%_38%_62%_56%] blur-2xl ${className}`}
      style={{ background: color, width: size, height: size }}
      initial={{
        scale: prefersReducedMotion ? 1 : 0.25,
        opacity: prefersReducedMotion ? 0.55 : 0,
        rotate: prefersReducedMotion ? 0 : -14,
      }}
      animate={{
        scale: 1,
        opacity: 0.88,
        rotate: prefersReducedMotion ? 0 : 0,
      }}
      transition={{
        duration: prefersReducedMotion
          ? transitionLabDurations.brisk
          : transitionLabDurations.linger,
        delay: prefersReducedMotion ? 0 : delay,
        ease: transitionLabEasings.fluid,
      }}
    />
  );
}

export default function LiquidRevealPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeValue, replayKey, replay, selectValue } =
    useTransitionDemo<LiquidSceneId>(liquidScenes[0].id);
  const activeScene =
    liquidScenes.find((scene) => scene.id === activeValue) ?? liquidScenes[0];
  const stageKey = `${activeValue}-${replayKey}`;

  return (
    <SceneFrame
      eyebrow="Task 05"
      title="Liquid Reveal"
      description="An organic reveal that uses layered blob masks, bloom-heavy gradients, and frosted depth so the stage feels poured open instead of mechanically wiped."
      aside={
        <div className="space-y-4">
          <p className="text-sm leading-6 text-white/68">
            High-cost filters stay localized to the blob layers. The content
            panel stays clean so the page remains legible while the reveal stays
            fluid.
          </p>
          <div className="flex flex-wrap gap-2">
            {activeScene.notes.map((note) => (
              <span
                key={note}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/52"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      }
    >
      <DemoToolbar
        eyebrow="Fluid Moods"
        options={liquidScenes.map((scene) => ({
          value: scene.id,
          label: scene.label,
        }))}
        activeValue={activeValue}
        onSelect={selectValue}
        actionLabel="Replay reveal"
        onAction={replay}
        actionHint="Restarts the layered blobs without swapping the scene."
      />

      <TransitionStage
        className="min-h-[33rem]"
        backgroundClassName={activeScene.palette.background}
        noiseOpacity={0.08}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stageKey}
            className="relative min-h-[33rem] overflow-hidden p-5 md:p-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 0 : 0.4 }}
            transition={{
              duration: prefersReducedMotion
                ? transitionLabDurations.brisk
                : transitionLabDurations.base,
            }}
          >
            <BlobLayer
              color={activeScene.palette.glowA}
              size="23rem"
              className="-left-16 top-16"
              delay={0}
              prefersReducedMotion={prefersReducedMotion}
            />
            <BlobLayer
              color={activeScene.palette.glowB}
              size="19rem"
              className="right-6 top-8"
              delay={0.12}
              prefersReducedMotion={prefersReducedMotion}
            />
            <BlobLayer
              color={activeScene.palette.glowC}
              size="25rem"
              className="bottom-[-6rem] left-1/3"
              delay={0.22}
              prefersReducedMotion={prefersReducedMotion}
            />

            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              initial={{
                opacity: prefersReducedMotion ? 0.3 : 0,
                backdropFilter: prefersReducedMotion ? "blur(0px)" : "blur(16px)",
              }}
              animate={{
                opacity: 1,
                backdropFilter: "blur(0px)",
              }}
              transition={{
                duration: prefersReducedMotion
                  ? transitionLabDurations.brisk
                  : transitionLabDurations.linger,
                ease: transitionLabEasings.fluid,
              }}
            />

            <div className="relative grid min-h-[29rem] gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-end">
              <motion.div
                className={`${activeScene.palette.shell} rounded-[2rem] border p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl md:p-8`}
                initial={{
                  y: prefersReducedMotion ? 0 : 28,
                  opacity: 0,
                  scale: prefersReducedMotion ? 1 : 0.96,
                }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.slow,
                  delay: prefersReducedMotion ? 0 : 0.18,
                  ease: transitionLabEasings.fluid,
                }}
              >
                <p className="text-xs uppercase tracking-[0.34em] text-white/44">
                  {activeScene.eyebrow}
                </p>
                <div className={`mt-5 space-y-4 ${activeScene.palette.text}`}>
                  <h2 className="max-w-2xl font-serif text-4xl leading-[0.94] md:text-6xl">
                    {activeScene.title}
                  </h2>
                  <p className="max-w-xl text-base leading-7 text-white/76 md:text-lg">
                    {activeScene.body}
                  </p>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {activeScene.notes.map((note) => (
                    <div
                      key={note}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/68"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5 backdrop-blur-md"
                initial={{
                  x: prefersReducedMotion ? 0 : 38,
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.base,
                  delay: prefersReducedMotion ? 0 : 0.28,
                  ease: transitionLabEasings.emphasis,
                }}
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                  Wave sequence
                </p>
                <div className="mt-5 space-y-4 text-sm leading-6 text-white/68">
                  <p>Blob one establishes the main aperture.</p>
                  <p>Blob two broadens the reveal and softens the edge.</p>
                  <p>Blob three lingers to keep the scene feeling alive.</p>
                </div>
                <div className="mt-6 h-32 rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_25%_35%,rgba(255,255,255,0.24),transparent_22%),radial-gradient(circle_at_62%_52%,rgba(255,255,255,0.18),transparent_18%),linear-gradient(135deg,rgba(255,255,255,0.14),transparent)]" />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </TransitionStage>
    </SceneFrame>
  );
}
