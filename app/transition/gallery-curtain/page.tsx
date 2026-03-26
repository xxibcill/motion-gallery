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

const curtainScenes = [
  {
    id: "velvet-gold",
    label: "Velvet Gold",
    eyebrow: "Curtain Cue 01",
    title: "Layered drapes part with drag, grain, and just enough light to feel expensive.",
    body:
      "The reveal uses multiple fabric-like sweeps instead of a single wipe. Heavy front curtains open first, translucent veils linger a beat longer, and the gallery scene arrives in a controlled theatrical sequence.",
    chips: ["Weighted sweep", "Fabric grain", "Theatrical reveal"],
    cues: ["Front drape", "Sheer veil", "Stage glow"],
    palette: {
      background: "bg-[#17070c]",
      from: "rgba(244, 63, 94, 0.18)",
      to: "rgba(56, 7, 16, 0.96)",
      accent: "rgba(251, 191, 36, 0.14)",
      shell: "border-amber-100/12 bg-[#261118]/78",
      panel: "border-white/10 bg-black/24",
      drapeLeft: "linear-gradient(180deg, rgba(122, 18, 39, 0.98), rgba(74, 7, 25, 0.98))",
      drapeRight: "linear-gradient(180deg, rgba(94, 15, 31, 0.98), rgba(54, 6, 19, 0.98))",
      veil: "linear-gradient(180deg, rgba(245, 208, 122, 0.42), rgba(191, 69, 93, 0.16))",
      glow: "rgba(251, 191, 36, 0.18)",
      titleClassName: "text-amber-50",
    },
  },
  {
    id: "plum-nocturne",
    label: "Plum Nocturne",
    eyebrow: "Curtain Cue 02",
    title: "Cooler silk veils glide open with slower drag and a colder gallery light.",
    body:
      "This version keeps the same staged reveal but changes the fabric direction. The curtains hold more of the frame for longer, so the scene underneath feels discovered rather than simply exposed.",
    chips: ["Layer depth", "Soft delay", "Luxury palette"],
    cues: ["Deep drape", "Silk scrim", "Cold spot"],
    palette: {
      background: "bg-[#110817]",
      from: "rgba(168, 85, 247, 0.18)",
      to: "rgba(34, 10, 52, 0.96)",
      accent: "rgba(191, 219, 254, 0.12)",
      shell: "border-fuchsia-100/12 bg-[#1b1028]/82",
      panel: "border-white/10 bg-[#0b0712]/34",
      drapeLeft: "linear-gradient(180deg, rgba(88, 27, 135, 0.98), rgba(45, 12, 68, 0.98))",
      drapeRight: "linear-gradient(180deg, rgba(67, 22, 120, 0.98), rgba(31, 9, 52, 0.98))",
      veil: "linear-gradient(180deg, rgba(196, 181, 253, 0.34), rgba(124, 58, 237, 0.12))",
      glow: "rgba(196, 181, 253, 0.14)",
      titleClassName: "text-fuchsia-50",
    },
  },
] as const;

type CurtainSceneId = (typeof curtainScenes)[number]["id"];

interface CurtainLayerProps {
  className: string;
  background: string;
  delay: number;
  xValues: [number, number, number];
  origin: "left" | "right";
  prefersReducedMotion: boolean;
}

function CurtainLayer({
  className,
  background,
  delay,
  xValues,
  origin,
  prefersReducedMotion,
}: CurtainLayerProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute ${className}`}
      style={{
        background,
        transformOrigin: origin === "left" ? "left center" : "right center",
        boxShadow:
          origin === "left"
            ? "20px 0 46px rgba(0,0,0,0.18)"
            : "-20px 0 46px rgba(0,0,0,0.18)",
      }}
      initial={{
        x: 0,
        scaleX: 1,
      }}
      animate={{
        x: prefersReducedMotion ? 0 : xValues,
        scaleX: prefersReducedMotion ? 1 : [1, 0.98, 0.92],
      }}
      transition={{
        duration: prefersReducedMotion
          ? transitionLabDurations.brisk
          : transitionLabDurations.linger,
        delay: prefersReducedMotion ? 0 : delay,
        ease: transitionLabEasings.curtain,
        times: prefersReducedMotion ? undefined : [0, 0.52, 1],
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.14),transparent_16%,transparent_78%,rgba(0,0,0,0.24)_100%)]" />
      <div className="absolute inset-x-[10%] top-0 h-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_28%)] opacity-40" />
      <div className="absolute inset-y-0 left-[14%] w-px bg-white/10" />
      <div className="absolute inset-y-0 right-[16%] w-px bg-black/12" />
    </motion.div>
  );
}

export default function GalleryCurtainPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeValue, replayKey, replay, selectValue } =
    useTransitionDemo<CurtainSceneId>(curtainScenes[0].id);
  const activeScene =
    curtainScenes.find((scene) => scene.id === activeValue) ?? curtainScenes[0];
  const stageKey = `${activeValue}-${replayKey}`;

  return (
    <SceneFrame
      eyebrow="Task 13"
      title="Gallery Curtain"
      description="A theatrical curtain transition that layers heavy drapes, translucent veils, grain, and controlled reveal timing so the stage feels luxurious instead of like a generic full-screen wipe."
      aside={
        <div className="space-y-4">
          <p className="text-sm leading-6 text-white/68">
            The reveal is sequenced like a stage cue. Dense front drapes move
            first, lighter veils lag behind, and the gallery content becomes
            readable only after the fabric weight has already sold the motion.
          </p>
          <div className="flex flex-wrap gap-2">
            {activeScene.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/52"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      }
    >
      <DemoToolbar
        eyebrow="Stage Treatments"
        options={curtainScenes.map((scene) => ({
          value: scene.id,
          label: scene.label,
        }))}
        activeValue={activeValue}
        onSelect={selectValue}
        actionLabel="Replay curtain"
        onAction={replay}
        actionHint="Replays the layered drape opening and staged reveal."
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
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 22px)",
              }}
            />
          </>
        }
        noiseOpacity={0.1}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stageKey}
            className="relative min-h-[34rem] overflow-hidden p-5 md:p-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 0 : 0.24 }}
            transition={{ duration: transitionLabDurations.brisk }}
          >
            <motion.div
              className="relative z-10 grid min-h-[30rem] gap-5 lg:grid-cols-[minmax(0,1.16fr)_minmax(18rem,0.84fr)] lg:items-end"
              initial={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : 18,
                scale: prefersReducedMotion ? 1 : 0.98,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: prefersReducedMotion
                  ? transitionLabDurations.brisk
                  : transitionLabDurations.base,
                delay: prefersReducedMotion ? 0 : 0.42,
                ease: transitionLabEasings.emphasis,
              }}
            >
              <div
                className={`rounded-[2rem] border p-6 shadow-[0_30px_90px_rgba(0,0,0,0.3)] md:p-8 ${activeScene.palette.shell}`}
              >
                <p className="text-xs uppercase tracking-[0.34em] text-white/42">
                  {activeScene.eyebrow}
                </p>
                <h2
                  className={`mt-5 max-w-3xl font-serif text-4xl leading-[0.94] md:text-6xl ${activeScene.palette.titleClassName}`}
                >
                  {activeScene.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                  {activeScene.body}
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {activeScene.cues.map((cue) => (
                    <div
                      key={cue}
                      className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4 text-sm text-white/64"
                    >
                      {cue}
                    </div>
                  ))}
                </div>
              </div>

              <motion.aside
                className={`rounded-[1.75rem] border p-5 text-sm text-white/66 backdrop-blur-md ${activeScene.palette.panel}`}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.base,
                  delay: prefersReducedMotion ? 0 : 0.52,
                }}
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                  Reveal timing
                </p>
                <ol className="mt-5 space-y-3 leading-6">
                  <li>1. Main drapes break apart with visible weight.</li>
                  <li>2. Sheer layers keep moving after the heavy cloth clears.</li>
                  <li>3. The stage glow settles last so the gallery feels lit.</li>
                </ol>
              </motion.aside>
            </motion.div>

            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0.12 }}
                animate={{
                  opacity: prefersReducedMotion ? 0.12 : [0.1, 0.22, 0.16],
                }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.slow,
                }}
                style={{
                  background: `radial-gradient(circle at 50% 38%, ${activeScene.palette.glow}, transparent 32%)`,
                }}
              />

              <CurtainLayer
                className="inset-y-[-2%] left-[-8%] w-[42%] rounded-r-[30%]"
                background={activeScene.palette.drapeLeft}
                delay={0}
                xValues={[0, -26, -240]}
                origin="left"
                prefersReducedMotion={prefersReducedMotion}
              />
              <CurtainLayer
                className="inset-y-[-2%] right-[-8%] w-[42%] rounded-l-[30%]"
                background={activeScene.palette.drapeRight}
                delay={0.06}
                xValues={[0, 26, 240]}
                origin="right"
                prefersReducedMotion={prefersReducedMotion}
              />

              <motion.div
                className="absolute inset-y-0 left-[20%] w-[22%] rounded-[45%] blur-md"
                style={{ background: activeScene.palette.veil }}
                initial={{ opacity: 0.9, x: 0 }}
                animate={{
                  opacity: prefersReducedMotion ? 0.2 : [0.9, 0.46, 0.08],
                  x: prefersReducedMotion ? 0 : [-8, -72, -138],
                }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.linger,
                  delay: prefersReducedMotion ? 0 : 0.14,
                  ease: transitionLabEasings.curtain,
                }}
              />
              <motion.div
                className="absolute inset-y-0 right-[20%] w-[22%] rounded-[45%] blur-md"
                style={{ background: activeScene.palette.veil }}
                initial={{ opacity: 0.88, x: 0 }}
                animate={{
                  opacity: prefersReducedMotion ? 0.2 : [0.88, 0.42, 0.08],
                  x: prefersReducedMotion ? 0 : [8, 72, 138],
                }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.linger,
                  delay: prefersReducedMotion ? 0 : 0.2,
                  ease: transitionLabEasings.curtain,
                }}
              />

              <motion.div
                className="absolute inset-x-[12%] top-0 h-[38%] rounded-b-[50%] bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent)]"
                initial={{ opacity: 0.32, y: 0 }}
                animate={{
                  opacity: prefersReducedMotion ? 0.18 : [0.32, 0.18, 0.04],
                  y: prefersReducedMotion ? 0 : [0, -10, -38],
                }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.slow,
                  delay: prefersReducedMotion ? 0 : 0.26,
                  ease: transitionLabEasings.fluid,
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </TransitionStage>
    </SceneFrame>
  );
}
