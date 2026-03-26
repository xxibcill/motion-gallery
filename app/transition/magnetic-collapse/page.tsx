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
  transitionLabSprings,
} from "@/lib/animation-presets";

const magneticScenes = [
  {
    id: "north-core",
    label: "North Core",
    eyebrow: "Attractor Field 01",
    title: "Fragments rush toward a live center before the next scene snaps back out.",
    body:
      "The collapse is spatial rather than scalar. Pieces travel on curved lines toward a dangerous focal point, then the rebuilt scene springs out with enough restraint to stay readable.",
    chips: ["Central pull", "Fragment grid", "Spring rebuild"],
    metrics: ["09 fragments", "02-stage handoff", "Single attractor"],
    palette: {
      background: "bg-[#150816]",
      from: "rgba(236, 72, 153, 0.22)",
      to: "rgba(24, 8, 27, 0.96)",
      accent: "rgba(244, 114, 182, 0.16)",
      hero: "border-fuchsia-100/14 bg-[#2f1033]",
      panel: "border-white/10 bg-black/24",
      glow: "rgba(244, 114, 182, 0.42)",
      beam: "rgba(232, 121, 249, 0.24)",
      text: "text-fuchsia-50",
    },
  },
  {
    id: "signal-well",
    label: "Signal Well",
    eyebrow: "Attractor Field 02",
    title: "A colder magnetic well crushes the old layout and reforms it with sharper edges.",
    body:
      "The second state shifts away from organic pull and into controlled field lines. The attractor still owns the collapse, but the rebuilt scene lands like engineered hardware instead of vapor.",
    chips: ["Field lines", "Harder settle", "Center-weighted staging"],
    metrics: ["09 fragments", "68 px overshoot", "Readable rebuild"],
    palette: {
      background: "bg-[#07101a]",
      from: "rgba(34, 211, 238, 0.18)",
      to: "rgba(7, 18, 27, 0.96)",
      accent: "rgba(103, 232, 249, 0.14)",
      hero: "border-cyan-100/14 bg-[#0b2430]",
      panel: "border-white/10 bg-[#020b12]/44",
      glow: "rgba(34, 211, 238, 0.34)",
      beam: "rgba(125, 211, 252, 0.18)",
      text: "text-cyan-50",
    },
  },
] as const;

const collapseFragments = [
  { id: "f1", className: "left-[5%] top-[10%] h-[16%] w-[23%]", x: 220, y: 130 },
  { id: "f2", className: "left-[31%] top-[11%] h-[12%] w-[18%]", x: 96, y: 128 },
  { id: "f3", className: "right-[7%] top-[12%] h-[18%] w-[21%]", x: -208, y: 128 },
  { id: "f4", className: "left-[8%] top-[34%] h-[20%] w-[16%]", x: 202, y: 34 },
  { id: "f5", className: "left-[27%] top-[35%] h-[18%] w-[20%]", x: 92, y: 22 },
  { id: "f6", className: "right-[15%] top-[34%] h-[22%] w-[26%]", x: -164, y: 28 },
  { id: "f7", className: "left-[11%] bottom-[10%] h-[16%] w-[24%]", x: 180, y: -118 },
  { id: "f8", className: "left-[39%] bottom-[9%] h-[13%] w-[16%]", x: 52, y: -112 },
  { id: "f9", className: "right-[8%] bottom-[8%] h-[17%] w-[22%]", x: -198, y: -116 },
] as const;

const rebuiltCards = [
  {
    id: "hero",
    className:
      "lg:col-span-2 rounded-[2rem] border p-6 shadow-[0_28px_90px_rgba(0,0,0,0.24)] md:p-8",
    offset: { x: -110, y: 36 },
  },
  {
    id: "brief",
    className: "rounded-[1.6rem] border p-5",
    offset: { x: 118, y: -64 },
  },
  {
    id: "metrics",
    className: "rounded-[1.6rem] border p-5",
    offset: { x: 142, y: 64 },
  },
] as const;

type MagneticSceneId = (typeof magneticScenes)[number]["id"];

function getMotionOffset(prefersReducedMotion: boolean, value: number) {
  return prefersReducedMotion ? 0 : value;
}

export default function MagneticCollapsePage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeValue, replayKey, replay, selectValue } =
    useTransitionDemo<MagneticSceneId>(magneticScenes[0].id);
  const activeScene =
    magneticScenes.find((scene) => scene.id === activeValue) ??
    magneticScenes[0];
  const stageKey = `${activeValue}-${replayKey}`;

  return (
    <SceneFrame
      eyebrow="Task 11"
      title="Magnetic Collapse"
      description="A focal-point transition where the outgoing frame breaks into fragments, gets pulled into a magnetic center, and then reassembles as the next state with controlled spring energy."
      aside={
        <div className="space-y-4">
          <p className="text-sm leading-6 text-white/68">
            The center attractor is the only true origin in the scene. Every
            fragment and rebuilt card references that same point, which keeps
            the collapse and reassembly legible instead of chaotic.
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
        eyebrow="Field Profiles"
        options={magneticScenes.map((scene) => ({
          value: scene.id,
          label: scene.label,
        }))}
        activeValue={activeValue}
        onSelect={selectValue}
        actionLabel="Trigger field"
        onAction={replay}
        actionHint="Replays the collapse toward the attractor and the outward rebuild."
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
                  "radial-gradient(circle at center, rgba(255,255,255,0.08) 0, transparent 18%), linear-gradient(180deg, transparent 46%, rgba(0,0,0,0.26) 100%)",
              }}
            />
          </>
        }
        noiseOpacity={0.08}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stageKey}
            className="relative min-h-[34rem] overflow-hidden p-5 md:p-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 0 : 0.2 }}
            transition={{ duration: transitionLabDurations.brisk }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <motion.div
                className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{ background: activeScene.palette.glow }}
                initial={{ scale: prefersReducedMotion ? 1 : 0.3, opacity: 0 }}
                animate={{
                  scale: prefersReducedMotion ? 1 : [0.3, 1.18, 0.92],
                  opacity: prefersReducedMotion ? 0.28 : [0, 0.85, 0.46],
                }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.slow,
                  ease: transitionLabEasings.emphasis,
                }}
              />
              {[0, 1, 2].map((ring) => (
                <motion.div
                  key={`ring-${ring}`}
                  className="absolute left-1/2 top-1/2 rounded-full border border-white/10"
                  style={{
                    width: `${8 + ring * 7}rem`,
                    height: `${8 + ring * 7}rem`,
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                  initial={{
                    scale: prefersReducedMotion ? 1 : 0.2,
                    opacity: 0,
                  }}
                  animate={{
                    scale: prefersReducedMotion ? 1 : [0.2, 1.08],
                    opacity: prefersReducedMotion ? 0.16 : [0, 0.28, 0.06],
                  }}
                  transition={{
                    duration: prefersReducedMotion
                      ? transitionLabDurations.brisk
                      : transitionLabDurations.linger,
                    delay: prefersReducedMotion ? 0 : ring * 0.06,
                    ease: transitionLabEasings.fluid,
                  }}
                />
              ))}
            </div>

            <div className="grid min-h-[30rem] gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)] lg:items-end">
              <div className="relative">
                <div className="grid gap-4 lg:grid-cols-2">
                  {rebuiltCards.map((card) => (
                    <motion.div
                      key={card.id}
                      className={`${card.className} ${
                        card.id === "hero"
                          ? `${activeScene.palette.hero} ${activeScene.palette.text}`
                          : activeScene.palette.panel
                      }`}
                      initial={{
                        opacity: 0,
                        x: getMotionOffset(prefersReducedMotion, card.offset.x),
                        y: getMotionOffset(prefersReducedMotion, card.offset.y),
                        scale: prefersReducedMotion ? 1 : 0.2,
                      }}
                      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      transition={{
                        type: prefersReducedMotion ? "tween" : "spring",
                        duration: prefersReducedMotion
                          ? transitionLabDurations.brisk
                          : undefined,
                        stiffness: transitionLabSprings.stage.stiffness,
                        damping: transitionLabSprings.stage.damping,
                        mass: 0.72,
                        delay:
                          prefersReducedMotion || card.id === "hero" ? 0 : 0.42,
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
                            Collapse field
                          </p>
                          <p className="mt-4 text-sm leading-6 text-white/68">
                            Pieces do not shrink together. Each fragment takes
                            its own route into the field, which makes the scene
                            feel magnetized instead of simply scaled down.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                            Rebuild metrics
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
                  x: getMotionOffset(prefersReducedMotion, 26),
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.base,
                  delay: prefersReducedMotion ? 0 : 0.48,
                }}
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                  Choreography
                </p>
                <ol className="mt-5 space-y-3 leading-6">
                  <li>1. Fragments accelerate toward the shared center.</li>
                  <li>2. The attractor blooms as the old frame disappears.</li>
                  <li>3. The new layout springs back out on staggered lanes.</li>
                </ol>
              </motion.aside>
            </div>

            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {collapseFragments.map((fragment, index) => (
                <motion.div
                  key={fragment.id}
                  className={`absolute overflow-hidden rounded-[1.2rem] border border-white/10 bg-white/[0.07] backdrop-blur-sm ${fragment.className}`}
                  initial={{ opacity: 0.92, x: 0, y: 0, scale: 1 }}
                  animate={{
                    opacity: prefersReducedMotion ? 0 : [0.92, 0.78, 0],
                    x: getMotionOffset(prefersReducedMotion, fragment.x),
                    y: getMotionOffset(prefersReducedMotion, fragment.y),
                    scale: prefersReducedMotion ? 1 : [1, 0.28, 0.08],
                    rotate: prefersReducedMotion ? 0 : (index % 2 === 0 ? -18 : 18),
                  }}
                  transition={{
                    duration: prefersReducedMotion
                      ? transitionLabDurations.brisk
                      : transitionLabDurations.slow,
                    delay: prefersReducedMotion ? 0 : index * 0.03,
                    ease: transitionLabEasings.emphasis,
                    times: prefersReducedMotion ? undefined : [0, 0.7, 1],
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${activeScene.palette.beam}, transparent 62%)`,
                    }}
                  />
                  <div className="absolute inset-x-4 top-4 h-px bg-white/20" />
                  <div className="absolute inset-x-4 top-8 h-8 rounded-full bg-white/8" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </TransitionStage>
    </SceneFrame>
  );
}
