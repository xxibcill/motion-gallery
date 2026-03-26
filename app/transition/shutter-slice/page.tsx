"use client";

import { startTransition, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DemoToolbar } from "@/components/transition-lab/DemoToolbar";
import { GradientVeil } from "@/components/transition-lab/GradientVeil";
import { SceneFrame } from "@/components/transition-lab/SceneFrame";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import { useTransitionDemo } from "@/components/transition-lab/useTransitionDemo";
import {
  transitionLabDurations,
  transitionLabEasings,
} from "@/lib/animation-presets";

const sliceScenes = [
  {
    id: "signal",
    label: "Signal",
    eyebrow: "Mechanical Wipe",
    title: "Segmented shutters peel back in offset bursts.",
    body:
      "Each strip travels a different distance, so the transition feels machined rather than flat. The content stays readable because the underlying scene never leaves its lane.",
    palette: {
      background: "bg-[#07090d]",
      from: "rgba(161, 161, 170, 0.14)",
      to: "rgba(9, 9, 11, 0.96)",
      accent: "rgba(244, 244, 245, 0.14)",
      line: "bg-white/70",
    },
    stats: ["08 shutters", "Bidirectional", "Offset travel"],
  },
  {
    id: "breaker",
    label: "Breaker",
    eyebrow: "Reverse Sweep",
    title: "The same slices reverse course and expose a sharper scene.",
    body:
      "Instead of relying on 3D, the motion sells depth through offset timing, alternating directions, and crisp mechanical cadence.",
    palette: {
      background: "bg-[#100807]",
      from: "rgba(248, 113, 113, 0.2)",
      to: "rgba(24, 6, 6, 0.96)",
      accent: "rgba(254, 202, 202, 0.16)",
      line: "bg-rose-200/80",
    },
    stats: ["Hard stop", "Reverse proof", "Strip engine"],
  },
] as const;

const sliceCount = 8;
const slices = Array.from({ length: sliceCount }, (_, index) => index);

type SliceSceneId = (typeof sliceScenes)[number]["id"];

function getTravelDistance(index: number, prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return 0;
  }

  return 70 + index * 22;
}

export default function ShutterSlicePage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeValue, replayKey, replay, selectValue } =
    useTransitionDemo<SliceSceneId>(sliceScenes[0].id);
  const [wipeDirection, setWipeDirection] = useState<1 | -1>(1);
  const activeScene =
    sliceScenes.find((scene) => scene.id === activeValue) ?? sliceScenes[0];
  const stageKey = `${activeValue}-${replayKey}-${wipeDirection}`;

  function reverseWipe() {
    startTransition(() => {
      setWipeDirection((value) => (value === 1 ? -1 : 1));
    });
    replay();
  }

  return (
    <SceneFrame
      eyebrow="Task 06"
      title="Shutter Slice"
      description="A segmented wipe that breaks the stage into independent shutters, varies the distance per strip, and proves the effect works in both directions."
      aside={
        <div className="space-y-4">
          <p className="text-sm leading-6 text-white/68">
            The demo keeps the geometry procedural. Slice widths come from the
            strip index, so the effect stays maintainable instead of relying on
            brittle one-off positions.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {activeScene.stats.map((stat) => (
              <div
                key={stat}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center text-xs uppercase tracking-[0.24em] text-white/50"
              >
                {stat}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <DemoToolbar
        eyebrow="Shutter States"
        options={sliceScenes.map((scene) => ({
          value: scene.id,
          label: scene.label,
        }))}
        activeValue={activeValue}
        onSelect={selectValue}
        actionLabel="Reverse wipe"
        onAction={reverseWipe}
        actionHint="Flips the travel direction and replays the strip motion."
      />

      <TransitionStage
        className="min-h-[33rem]"
        backgroundClassName={activeScene.palette.background}
        overlays={
          <GradientVeil
            from={activeScene.palette.from}
            to={activeScene.palette.to}
            accent={activeScene.palette.accent}
          />
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stageKey}
            className="relative min-h-[33rem] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 0 : 0.3 }}
            transition={{ duration: transitionLabDurations.brisk }}
          >
            <div className="absolute inset-0 px-4 py-5 md:px-6 md:py-6">
              {slices.map((index) => {
                const width = 100 / sliceCount;
                const left = width * index;
                const travel = getTravelDistance(index, prefersReducedMotion);
                const direction = index % 2 === 0 ? -1 : 1;

                return (
                  <motion.div
                    key={index}
                    className="absolute inset-y-6 overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/70"
                    style={{
                      left: `${left}%`,
                      width: `${width + 0.35}%`,
                    }}
                    initial={{ x: 0, opacity: 1 }}
                    animate={{
                      x: wipeDirection * direction * travel,
                      opacity: prefersReducedMotion ? 0.15 : 0.85,
                    }}
                    transition={{
                      duration: prefersReducedMotion
                        ? transitionLabDurations.brisk
                        : transitionLabDurations.base + index * 0.03,
                      delay: prefersReducedMotion ? 0 : index * 0.04,
                      ease: transitionLabEasings.curtain,
                    }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_28%,rgba(255,255,255,0.05))]" />
                  </motion.div>
                );
              })}
            </div>

            <div className="relative grid min-h-[33rem] gap-6 p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-end lg:p-8">
              <motion.div
                className="rounded-[2rem] border border-white/10 bg-black/30 p-6 backdrop-blur-sm md:p-8"
                initial={{
                  y: prefersReducedMotion ? 0 : 20,
                  opacity: 0,
                }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.slow,
                  delay: prefersReducedMotion ? 0 : 0.15,
                  ease: transitionLabEasings.emphasis,
                }}
              >
                <p className="text-xs uppercase tracking-[0.32em] text-white/40">
                  {activeScene.eyebrow}
                </p>
                <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-[0.95] text-white md:text-6xl">
                  {activeScene.title}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/72 md:text-lg">
                  {activeScene.body}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {activeScene.stats.map((stat) => (
                    <span
                      key={stat}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/54"
                    >
                      {stat}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5 text-white"
                initial={{
                  x: prefersReducedMotion ? 0 : 42,
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.base,
                  delay: prefersReducedMotion ? 0 : 0.24,
                  ease: transitionLabEasings.emphasis,
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/38">
                    Slice logic
                  </p>
                  <span
                    className={`h-2.5 w-16 rounded-full ${activeScene.palette.line}`}
                  />
                </div>
                <div className="mt-5 space-y-4 text-sm leading-6 text-white/68">
                  <p>Alternating strips shift left and right.</p>
                  <p>Later slices travel farther, so the wipe feels layered.</p>
                  <p>The same layout works for both forward and reverse reads.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </TransitionStage>
    </SceneFrame>
  );
}
