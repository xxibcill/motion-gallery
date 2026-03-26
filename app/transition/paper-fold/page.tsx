"use client";

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

const paperScenes = [
  {
    id: "atelier-sheet",
    label: "Atelier Sheet",
    eyebrow: "Fold Study 01",
    title: "Heavy stock hinges open so the next composition appears from underneath.",
    body:
      "The scene treats the old state like physical material. Panels crease, lift, and cast shadows while the next layout waits below instead of replacing the frame all at once.",
    notes: ["Triple hinge", "Cast shadow", "Under-scene reveal"],
    steps: ["Score", "Lift", "Settle"],
    palette: {
      background: "bg-[#140f0b]",
      from: "rgba(245, 158, 11, 0.18)",
      to: "rgba(41, 23, 14, 0.96)",
      accent: "rgba(254, 240, 138, 0.16)",
      shell: "border-amber-100/16 bg-[#f3e7d2] text-[#2b1b11]",
      detail: "border-amber-950/12 bg-[#ead7b8]",
      foldA: "linear-gradient(180deg, rgba(250, 241, 224, 0.98), rgba(221, 194, 154, 0.96))",
      foldB: "linear-gradient(180deg, rgba(244, 228, 199, 0.98), rgba(201, 165, 119, 0.96))",
      foldC: "linear-gradient(180deg, rgba(233, 214, 184, 0.98), rgba(177, 136, 91, 0.95))",
      glow: "rgba(245, 158, 11, 0.26)",
    },
  },
  {
    id: "archive-board",
    label: "Archive Board",
    eyebrow: "Fold Study 02",
    title: "A colder archive card peels in layers and reveals the plan beneath the cover.",
    body:
      "The second state leans darker and more architectural, but the same fold logic holds: scored surfaces move first, the hidden content catches light second, and the composition settles last.",
    notes: ["Perspective safe", "Layered grain", "Directional lighting"],
    steps: ["Brace", "Peel", "Reveal"],
    palette: {
      background: "bg-[#0e1118]",
      from: "rgba(148, 163, 184, 0.14)",
      to: "rgba(15, 23, 42, 0.96)",
      accent: "rgba(191, 219, 254, 0.12)",
      shell: "border-slate-200/12 bg-[#d9dde7] text-[#141b28]",
      detail: "border-slate-900/8 bg-[#c6ccd9]",
      foldA: "linear-gradient(180deg, rgba(236, 240, 247, 0.98), rgba(182, 190, 206, 0.96))",
      foldB: "linear-gradient(180deg, rgba(223, 229, 239, 0.98), rgba(155, 166, 186, 0.95))",
      foldC: "linear-gradient(180deg, rgba(206, 213, 227, 0.98), rgba(128, 140, 163, 0.95))",
      glow: "rgba(125, 211, 252, 0.2)",
    },
  },
] as const;

const underScenePillars = [
  "Subsurface layout",
  "Creased timing",
  "Material shadows",
] as const;

type PaperSceneId = (typeof paperScenes)[number]["id"];

function getFoldTravel(prefersReducedMotion: boolean, value: number) {
  return prefersReducedMotion ? 0 : value;
}

interface FoldPlaneProps {
  delay: number;
  className: string;
  gradient: string;
  shadow: string;
  initialRotate: { rotateX?: number; rotateY?: number };
  animateRotate: { rotateX?: number; rotateY?: number };
  prefersReducedMotion: boolean;
}

function FoldPlane({
  delay,
  className,
  gradient,
  shadow,
  initialRotate,
  animateRotate,
  prefersReducedMotion,
}: FoldPlaneProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute overflow-hidden border border-black/8 ${className}`}
      style={{
        background: gradient,
        boxShadow: shadow,
        transformStyle: "preserve-3d",
      }}
      initial={{
        opacity: 1,
        ...initialRotate,
      }}
      animate={{
        opacity: prefersReducedMotion ? 0.18 : [1, 1, 0.92],
        ...animateRotate,
      }}
      transition={{
        duration: prefersReducedMotion
          ? transitionLabDurations.brisk
          : transitionLabDurations.slow,
        delay: prefersReducedMotion ? 0 : delay,
        ease: transitionLabEasings.curtain,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_28%,rgba(0,0,0,0.14))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
      <div className="absolute inset-x-[8%] top-[28%] h-px bg-black/10" />
      <div className="absolute inset-x-[10%] top-[72%] h-px bg-black/10" />
    </motion.div>
  );
}

export default function PaperFoldPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeValue, replayKey, replay, selectValue } =
    useTransitionDemo<PaperSceneId>(paperScenes[0].id);
  const activeScene =
    paperScenes.find((scene) => scene.id === activeValue) ?? paperScenes[0];
  const stageKey = `${activeValue}-${replayKey}`;

  return (
    <SceneFrame
      eyebrow="Task 10"
      title="Paper Fold"
      description="A tactile transition built like scored card stock: fold planes hinge away, shadows drag across the surface, and the next scene is revealed from underneath instead of being swapped flat on top."
      aside={
        <div className="space-y-4">
          <p className="text-sm leading-6 text-white/68">
            The effect uses perspective, hinge origins, and timed shadow loss
            to read as material. The reveal remains stable on smaller screens
            because the fold planes are broad and the under-scene layout stays
            centered.
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
        eyebrow="Material Studies"
        options={paperScenes.map((scene) => ({
          value: scene.id,
          label: scene.label,
        }))}
        activeValue={activeValue}
        onSelect={selectValue}
        actionLabel="Replay fold"
        onAction={replay}
        actionHint="Replays the hinge sequence and under-scene reveal."
      />

      <TransitionStage
        className="min-h-[34rem]"
        backgroundClassName={activeScene.palette.background}
        overlays={
          <>
            <GradientVeil
              from={activeScene.palette.from}
              to={activeScene.palette.to}
              accent={activeScene.palette.accent}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_26%),linear-gradient(180deg,transparent_46%,rgba(0,0,0,0.22)_100%)]" />
          </>
        }
        noiseOpacity={0.05}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stageKey}
            className="relative min-h-[34rem] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 0 : 0.3 }}
            transition={{ duration: transitionLabDurations.brisk }}
          >
            <div className="absolute inset-0 p-5 md:p-7">
              <motion.div
                className="grid min-h-[30rem] gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-end"
                initial={{
                  opacity: 0,
                  y: getFoldTravel(prefersReducedMotion, 24),
                }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.base,
                  delay: prefersReducedMotion ? 0 : 0.34,
                  ease: transitionLabEasings.emphasis,
                }}
              >
                <div
                  className={`rounded-[2rem] border p-6 shadow-[0_28px_80px_rgba(0,0,0,0.28)] md:p-8 ${activeScene.palette.shell}`}
                >
                  <p className="text-xs uppercase tracking-[0.34em] text-black/44">
                    {activeScene.eyebrow}
                  </p>
                  <div className="mt-5 space-y-4">
                    <h2 className="max-w-3xl font-serif text-4xl leading-[0.94] md:text-6xl">
                      {activeScene.title}
                    </h2>
                    <p className="max-w-2xl text-base leading-7 text-black/68 md:text-lg">
                      {activeScene.body}
                    </p>
                  </div>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {underScenePillars.map((pillar) => (
                      <div
                        key={pillar}
                        className={`rounded-[1.35rem] border p-4 text-sm leading-6 ${activeScene.palette.detail}`}
                      >
                        {pillar}
                      </div>
                    ))}
                  </div>
                </div>

                <motion.aside
                  className="rounded-[1.75rem] border border-white/10 bg-black/18 p-5 text-white/72 backdrop-blur-md"
                  initial={{
                    opacity: 0,
                    x: getFoldTravel(prefersReducedMotion, 28),
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: prefersReducedMotion
                      ? transitionLabDurations.brisk
                      : transitionLabDurations.base,
                    delay: prefersReducedMotion ? 0 : 0.44,
                    ease: transitionLabEasings.emphasis,
                  }}
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                    Hinge order
                  </p>
                  <div className="mt-5 space-y-3">
                    {activeScene.steps.map((step, index) => (
                      <div
                        key={step}
                        className="flex items-center justify-between rounded-[1.3rem] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm"
                      >
                        <span>{step}</span>
                        <span className="text-white/40">0{index + 1}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-6 text-white/62">
                    The reveal works because the content below gains contrast as
                    the folds lose light and thickness.
                  </p>
                </motion.aside>
              </motion.div>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ perspective: "1600px" }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0.42 }}
                animate={{ opacity: prefersReducedMotion ? 0.08 : [0.45, 0.2, 0.08] }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.slow,
                  ease: transitionLabEasings.curtain,
                }}
                style={{
                  background: `radial-gradient(circle at 50% 40%, transparent 0%, transparent 28%, rgba(0, 0, 0, 0.42) 100%), radial-gradient(circle at 50% 45%, ${activeScene.palette.glow}, transparent 38%)`,
                }}
              />

              <FoldPlane
                delay={0}
                className="left-[3%] right-[3%] top-[3%] h-[48%] origin-top rounded-[2rem_2rem_1.25rem_1.25rem]"
                gradient={activeScene.palette.foldA}
                shadow="0 26px 50px rgba(20, 10, 4, 0.24)"
                initialRotate={{ rotateX: 0 }}
                animateRotate={{ rotateX: prefersReducedMotion ? 0 : -96 }}
                prefersReducedMotion={prefersReducedMotion}
              />
              <FoldPlane
                delay={0.08}
                className="bottom-[3%] left-[3%] right-[22%] h-[44%] origin-bottom rounded-[1.25rem_1.25rem_2rem_2rem]"
                gradient={activeScene.palette.foldB}
                shadow="0 -20px 44px rgba(20, 10, 4, 0.2)"
                initialRotate={{ rotateX: 0 }}
                animateRotate={{ rotateX: prefersReducedMotion ? 0 : 88 }}
                prefersReducedMotion={prefersReducedMotion}
              />
              <FoldPlane
                delay={0.16}
                className="bottom-[3%] right-[3%] top-[18%] w-[20%] origin-right rounded-[1.4rem]"
                gradient={activeScene.palette.foldC}
                shadow="-18px 0 44px rgba(20, 10, 4, 0.22)"
                initialRotate={{ rotateY: 0 }}
                animateRotate={{ rotateY: prefersReducedMotion ? 0 : 92 }}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </TransitionStage>
    </SceneFrame>
  );
}
