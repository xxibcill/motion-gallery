"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DemoToolbar } from "@/components/transition-lab/DemoToolbar";
import { GradientVeil } from "@/components/transition-lab/GradientVeil";
import { SceneFrame } from "@/components/transition-lab/SceneFrame";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import { useTransitionDemo } from "@/components/transition-lab/useTransitionDemo";
import {
  transitionLabDurations,
  transitionLabEasings,
} from "@/lib/animation-presets";

const editorialScenes = [
  {
    id: "issue-one",
    label: "Issue One",
    kicker: "North Hall",
    eyebrow: "Edition 01",
    title: "Panels hit first. Copy lands after the impact.",
    body:
      "Oversized blocks slam across the stage like torn poster stock. The composition stays readable because each slab owns a clean lane.",
    quote: "Directional movement, hard contrast, zero hesitation.",
    stats: ["06 spreads", "84 bpm", "Editorial"],
    palette: {
      background: "bg-[#150b06]",
      from: "rgba(245, 158, 11, 0.26)",
      to: "rgba(41, 17, 5, 0.96)",
      accent: "rgba(253, 230, 138, 0.18)",
      slab: "bg-[#f5d7b4] text-[#120904]",
      rail: "bg-[#f97316]",
      card: "bg-[#2d1207]",
    },
  },
  {
    id: "issue-two",
    label: "Issue Two",
    kicker: "South Facade",
    eyebrow: "Edition 02",
    title: "Asymmetry makes the transition feel deliberate, not decorative.",
    body:
      "A second scene pushes the layout into a sharper diagonal rhythm. Motion still snaps into a legible grid instead of dissolving into noise.",
    quote: "Staggered depth keeps the page aggressive without becoming chaotic.",
    stats: ["04 columns", "2.6x overshoot", "Poster wall"],
    palette: {
      background: "bg-[#120d16]",
      from: "rgba(168, 85, 247, 0.24)",
      to: "rgba(24, 10, 34, 0.96)",
      accent: "rgba(233, 213, 255, 0.18)",
      slab: "bg-[#efe7ff] text-[#11091b]",
      rail: "bg-[#d946ef]",
      card: "bg-[#271033]",
    },
  },
] as const;

type EditorialSceneId = (typeof editorialScenes)[number]["id"];

function getDirectionalOffset(prefersReducedMotion: boolean, value: number) {
  return prefersReducedMotion ? 0 : value;
}

export default function KineticPanelsPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeValue, replayKey, replay, selectValue } =
    useTransitionDemo<EditorialSceneId>(editorialScenes[0].id);
  const activeScene =
    editorialScenes.find((scene) => scene.id === activeValue) ??
    editorialScenes[0];
  const stageKey = `${activeValue}-${replayKey}`;

  return (
    <SceneFrame
      eyebrow="Task 04"
      title="Kinetic Panels"
      description="A forceful editorial transition built from slab-like panels that enter on separate axes, overshoot their marks, and settle into a sharp reading rhythm."
      aside={
        <div className="space-y-4">
          <p className="text-sm leading-6 text-white/68">
            The motion pattern is intentionally hard-edged. Each panel arrives
            with its own direction, then locks into a crisp composition instead
            of drifting.
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
        eyebrow="Scene Selector"
        options={editorialScenes.map((scene) => ({
          value: scene.id,
          label: scene.label,
        }))}
        activeValue={activeValue}
        onSelect={selectValue}
        actionLabel="Replay impact"
        onAction={replay}
        actionHint="Replays the stagger without changing the active issue."
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
        chrome={
          <div className="flex h-full justify-between p-5 text-[0.65rem] uppercase tracking-[0.3em] text-white/35">
            <span>{activeScene.kicker}</span>
            <span>Poster Motion System</span>
          </div>
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stageKey}
            className="relative grid min-h-[33rem] gap-5 p-5 md:grid-cols-[minmax(0,1.25fr)_minmax(15rem,0.75fr)] md:grid-rows-[auto_1fr]"
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              className={`relative row-span-2 overflow-hidden rounded-[2rem] border border-black/10 p-6 md:p-8 ${activeScene.palette.slab}`}
              initial={{
                x: getDirectionalOffset(prefersReducedMotion, -240),
                y: getDirectionalOffset(prefersReducedMotion, 34),
                rotate: prefersReducedMotion ? 0 : -3,
                opacity: 0,
              }}
              animate={{
                x: 0,
                y: 0,
                rotate: 0,
                opacity: 1,
              }}
              exit={{
                x: getDirectionalOffset(prefersReducedMotion, 180),
                y: getDirectionalOffset(prefersReducedMotion, -24),
                opacity: prefersReducedMotion ? 0 : 0.18,
              }}
              transition={{
                duration: prefersReducedMotion
                  ? transitionLabDurations.brisk
                  : transitionLabDurations.base,
                ease: transitionLabEasings.emphasis,
              }}
            >
              <div className="pointer-events-none absolute -right-8 top-4 text-[7rem] font-semibold leading-none text-black/8 md:text-[9rem]">
                0{activeScene.label.at(-1)}
              </div>
              <div className="flex h-full flex-col justify-between gap-10">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.34em] text-black/45">
                    {activeScene.eyebrow}
                  </p>
                  <h2 className="max-w-2xl font-serif text-4xl leading-[0.92] md:text-6xl">
                    {activeScene.title}
                  </h2>
                  <p className="max-w-xl text-base leading-7 text-black/70 md:text-lg">
                    {activeScene.body}
                  </p>
                </div>
                <div className="flex items-end justify-between gap-6">
                  <p className="max-w-sm text-sm uppercase tracking-[0.24em] text-black/52">
                    {activeScene.quote}
                  </p>
                  <div className="h-28 w-px bg-black/12" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className={`rounded-[1.75rem] border border-white/10 p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] ${activeScene.palette.card}`}
              initial={{
                y: getDirectionalOffset(prefersReducedMotion, -160),
                x: getDirectionalOffset(prefersReducedMotion, 70),
                opacity: 0,
              }}
              animate={{ y: 0, x: 0, opacity: 1 }}
              exit={{
                y: getDirectionalOffset(prefersReducedMotion, 90),
                opacity: prefersReducedMotion ? 0 : 0.18,
              }}
              transition={{
                duration: prefersReducedMotion
                  ? transitionLabDurations.brisk
                  : transitionLabDurations.slow,
                delay: prefersReducedMotion ? 0 : 0.08,
                ease: transitionLabEasings.curtain,
              }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/42">
                Motion brief
              </p>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {activeScene.stats.map((stat) => (
                    <div
                      key={stat}
                      className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-sm text-white/72"
                    >
                      {stat}
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-6 text-white/68">
                  Panels share a grid, but not an origin. That mismatch is what
                  gives the transition its poster-wall aggression.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/35 p-5 text-white"
              initial={{
                x: getDirectionalOffset(prefersReducedMotion, 210),
                y: getDirectionalOffset(prefersReducedMotion, 48),
                opacity: 0,
              }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{
                x: getDirectionalOffset(prefersReducedMotion, -150),
                opacity: prefersReducedMotion ? 0 : 0.14,
              }}
              transition={{
                duration: prefersReducedMotion
                  ? transitionLabDurations.brisk
                  : transitionLabDurations.slow,
                delay: prefersReducedMotion ? 0 : 0.16,
                ease: transitionLabEasings.emphasis,
              }}
            >
              <div
                className={`absolute inset-y-0 right-0 w-3 ${activeScene.palette.rail}`}
              />
              <p className="text-xs uppercase tracking-[0.28em] text-white/38">
                Reading order
              </p>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-white/68">
                <li>1. Hero slab lands and establishes the headline.</li>
                <li>2. Upper brief drops in with extra velocity.</li>
                <li>3. Closing note sweeps laterally to complete the frame.</li>
              </ol>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </TransitionStage>
    </SceneFrame>
  );
}
