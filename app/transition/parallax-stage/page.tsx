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

const parallaxScenes = [
  {
    id: "canyon-run",
    label: "Canyon Run",
    eyebrow: "Scene 01",
    title: "Foreground rails sweep fast while the canyon wall and sky lag behind.",
    body:
      "This transition sells depth by letting each plane travel on its own ratio. The frame changes like a camera dolly move instead of a single card sliding across the page.",
    notes: ["03 depth planes", "Atmospheric haze", "Camera-like cadence"],
    direction: 1,
    palette: {
      background: "bg-[#07101d]",
      from: "rgba(56, 189, 248, 0.22)",
      to: "rgba(15, 23, 42, 0.96)",
      accent: "rgba(251, 191, 36, 0.14)",
      sky: "from-[#17355d] via-[#11233f] to-[#060b16]",
      glow: "rgba(251, 191, 36, 0.3)",
      ridge: "from-[#14263d] to-[#08111d]",
      monolith: "from-[#2a4d79] to-[#10233d]",
      foreground: "from-[#f59e0b] to-[#7c2d12]",
    },
    metrics: ["1x sky drift", "1.8x mid travel", "2.7x foreground cut"],
    captions: [
      "Sky shifts the least so the horizon feels far away.",
      "Mid structures carry the main scene change and depth read.",
      "Foreground silhouettes cross hardest to lock in the camera move.",
    ],
  },
  {
    id: "observatory-rise",
    label: "Observatory Rise",
    eyebrow: "Scene 02",
    title: "The scene resets into a colder observatory with the near plane arriving last.",
    body:
      "Independent exits keep the composition cinematic. Background light breathes first, the architecture follows, and the foreground frame lands only after the main read is already clear.",
    notes: ["Smaller-screen safe", "Separate layer exits", "No scroll dependency"],
    direction: -1,
    palette: {
      background: "bg-[#080a18]",
      from: "rgba(129, 140, 248, 0.24)",
      to: "rgba(17, 24, 39, 0.96)",
      accent: "rgba(34, 211, 238, 0.16)",
      sky: "from-[#1b2150] via-[#11173a] to-[#060915]",
      glow: "rgba(34, 211, 238, 0.26)",
      ridge: "from-[#181c39] to-[#090c1e]",
      monolith: "from-[#5b67b3] to-[#1a2146]",
      foreground: "from-[#67e8f9] to-[#155e75]",
    },
    metrics: ["1x sky drift", "1.9x structure move", "2.9x foreground sweep"],
    captions: [
      "Ambient glow establishes the next mood before the geometry arrives.",
      "Midground towers shift enough to feel structural, not decorative.",
      "The near plane comes in strongest, which makes the stage feel close to camera.",
    ],
  },
] as const;

type ParallaxSceneId = (typeof parallaxScenes)[number]["id"];

function getLayerTravel(prefersReducedMotion: boolean, value: number) {
  return prefersReducedMotion ? 0 : value;
}

export default function ParallaxStagePage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeValue, replayKey, replay, selectValue } =
    useTransitionDemo<ParallaxSceneId>(parallaxScenes[0].id);
  const activeScene =
    parallaxScenes.find((scene) => scene.id === activeValue) ??
    parallaxScenes[0];
  const stageKey = `${activeValue}-${replayKey}`;

  return (
    <SceneFrame
      eyebrow="Task 08"
      title="Parallax Stage"
      description="A scene-change demo built like a miniature set: background light, midground architecture, and foreground framing all travel on distinct ratios so the transition reads as cinematic depth instead of a scroll trick."
      aside={
        <div className="space-y-4">
          <p className="text-sm leading-6 text-white/68">
            The page avoids scroll-based parallax on purpose. Depth comes from
            route-scene choreography, atmospheric gradients, and different layer
            travel distances during the transition itself.
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
        eyebrow="Scene Selector"
        options={parallaxScenes.map((scene) => ({
          value: scene.id,
          label: scene.label,
        }))}
        activeValue={activeValue}
        onSelect={selectValue}
        actionLabel="Replay depth"
        onAction={replay}
        actionHint="Replays the multi-plane move without changing the selected stage."
      />

      <TransitionStage
        className="min-h-[33rem]"
        backgroundClassName={activeScene.palette.background}
        overlays={
          <>
            <GradientVeil
              from={activeScene.palette.from}
              to={activeScene.palette.to}
              accent={activeScene.palette.accent}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,transparent_45%,rgba(2,6,23,0.28)_100%)]" />
          </>
        }
        noiseOpacity={0.05}
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
            <div
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden"
              style={{ perspective: "1200px" }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{
                  x: getLayerTravel(
                    prefersReducedMotion,
                    activeScene.direction * 42
                  ),
                  y: getLayerTravel(prefersReducedMotion, 18),
                  scale: prefersReducedMotion ? 1 : 1.04,
                }}
                animate={{ x: 0, y: 0, scale: 1 }}
                exit={{
                  x: getLayerTravel(
                    prefersReducedMotion,
                    activeScene.direction * -28
                  ),
                  opacity: prefersReducedMotion ? 0 : 0.45,
                }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.linger,
                  ease: transitionLabEasings.fluid,
                }}
              >
                <div
                  className={`absolute inset-x-[-10%] top-[-8%] h-[70%] rounded-[50%] bg-gradient-to-b ${activeScene.palette.sky}`}
                />
                <div
                  className="absolute left-[16%] top-[12%] h-40 w-40 rounded-full blur-3xl"
                  style={{ background: activeScene.palette.glow }}
                />
                <div
                  className={`absolute inset-x-[-8%] bottom-[25%] h-[34%] rounded-[45%_55%_0_0/100%_100%_0_0] bg-gradient-to-b ${activeScene.palette.ridge}`}
                />
              </motion.div>

              <motion.div
                className="absolute inset-x-0 bottom-0 top-[22%]"
                initial={{
                  x: getLayerTravel(
                    prefersReducedMotion,
                    activeScene.direction * 88
                  ),
                  y: getLayerTravel(prefersReducedMotion, 30),
                  scale: prefersReducedMotion ? 1 : 1.08,
                }}
                animate={{ x: 0, y: 0, scale: 1 }}
                exit={{
                  x: getLayerTravel(
                    prefersReducedMotion,
                    activeScene.direction * -60
                  ),
                  y: getLayerTravel(prefersReducedMotion, -12),
                  opacity: prefersReducedMotion ? 0 : 0.28,
                }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.slow,
                  delay: prefersReducedMotion ? 0 : 0.08,
                  ease: transitionLabEasings.emphasis,
                }}
              >
                <div className="absolute inset-x-8 bottom-14 top-14 flex items-end gap-4 md:gap-6">
                  {[34, 52, 40, 62].map((height, index) => (
                    <div
                      key={`${activeScene.id}-tower-${height}`}
                      className={`flex-1 rounded-[1.8rem_1.8rem_0.6rem_0.6rem] bg-gradient-to-b ${activeScene.palette.monolith} border border-white/8 shadow-[0_22px_60px_rgba(0,0,0,0.25)]`}
                      style={{
                        height: `${height}%`,
                        transform:
                          index % 2 === 0
                            ? "translateY(0)"
                            : "translateY(8%)",
                      }}
                    />
                  ))}
                </div>
                <div className="absolute inset-x-0 bottom-[3.2rem] h-px bg-white/12" />
              </motion.div>

              <motion.div
                className="absolute inset-x-0 bottom-0 top-[42%]"
                initial={{
                  x: getLayerTravel(
                    prefersReducedMotion,
                    activeScene.direction * 154
                  ),
                  y: getLayerTravel(prefersReducedMotion, 52),
                  scale: prefersReducedMotion ? 1 : 1.12,
                }}
                animate={{ x: 0, y: 0, scale: 1 }}
                exit={{
                  x: getLayerTravel(
                    prefersReducedMotion,
                    activeScene.direction * -118
                  ),
                  y: getLayerTravel(prefersReducedMotion, -22),
                  opacity: prefersReducedMotion ? 0 : 0.18,
                }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.base,
                  delay: prefersReducedMotion ? 0 : 0.14,
                  ease: transitionLabEasings.curtain,
                }}
              >
                <div
                  className={`absolute inset-x-[-6%] bottom-[-12%] h-[54%] rounded-[20%_20%_0_0/100%_100%_0_0] bg-gradient-to-b ${activeScene.palette.foreground} opacity-80`}
                />
                <div className="absolute inset-x-4 bottom-8 flex items-end justify-between gap-4 md:inset-x-10">
                  {[18, 32, 26, 20].map((height, index) => (
                    <div
                      key={`${activeScene.id}-rail-${height}`}
                      className="flex-1 rounded-t-[1.5rem] border border-white/10 bg-black/45"
                      style={{
                        height: `${height}rem`,
                        maxHeight: index % 2 === 0 ? "10rem" : "13rem",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="relative grid min-h-[33rem] gap-6 p-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(18rem,0.82fr)] lg:items-end lg:p-8">
              <motion.div
                className="rounded-[2rem] border border-white/10 bg-black/28 p-6 backdrop-blur-md md:p-8"
                initial={{
                  y: prefersReducedMotion ? 0 : 28,
                  opacity: 0,
                }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.slow,
                  delay: prefersReducedMotion ? 0 : 0.18,
                  ease: transitionLabEasings.emphasis,
                }}
              >
                <p className="text-xs uppercase tracking-[0.32em] text-white/40">
                  {activeScene.eyebrow}
                </p>
                <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-[0.94] text-white md:text-6xl">
                  {activeScene.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                  {activeScene.body}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {activeScene.metrics.map((metric) => (
                    <span
                      key={metric}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/52"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.aside
                className="rounded-[1.75rem] border border-white/10 bg-black/32 p-5 text-white/68 backdrop-blur-md"
                initial={{
                  x: prefersReducedMotion ? 0 : 36,
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
                <p className="text-xs uppercase tracking-[0.28em] text-white/38">
                  Depth breakdown
                </p>
                <div className="mt-5 space-y-4 text-sm leading-6">
                  {activeScene.captions.map((caption) => (
                    <div
                      key={caption}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      {caption}
                    </div>
                  ))}
                </div>
              </motion.aside>
            </div>
          </motion.div>
        </AnimatePresence>
      </TransitionStage>
    </SceneFrame>
  );
}
