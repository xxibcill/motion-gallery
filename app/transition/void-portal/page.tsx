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

const portalScenes = [
  {
    id: "singularity-hall",
    label: "Singularity Hall",
    eyebrow: "Void Phase 01",
    title: "The current scene is swallowed into a dark aperture before the next chamber blooms out.",
    body:
      "This transition is intentionally two-part. First the old frame loses the fight against a central void. Only after that collapse completes does the next composition emerge through the same opening.",
    chips: ["Consume", "Aperture reveal", "Atmospheric depth"],
    telemetry: ["01 shared portal", "02 clear phases", "Repeat-safe"],
    palette: {
      background: "bg-[#04070f]",
      from: "rgba(99, 102, 241, 0.18)",
      to: "rgba(2, 6, 23, 0.98)",
      accent: "rgba(56, 189, 248, 0.12)",
      portal: "rgba(99, 102, 241, 0.36)",
      ring: "rgba(125, 211, 252, 0.34)",
      shell: "border-indigo-100/12 bg-[#11182c]/86",
      panel: "border-white/10 bg-black/26",
      titleClassName: "text-indigo-50",
    },
  },
  {
    id: "eclipse-well",
    label: "Eclipse Well",
    eyebrow: "Void Phase 02",
    title: "A deeper portal drags the frame inward, then releases a colder observatory through the breach.",
    body:
      "The second state keeps the same aperture logic but pushes harder on the tunnel feel. The portal is a place, not just a mask, so the reveal reads as spatial rather than graphic.",
    chips: ["Tunnel read", "Radial consume", "Cold highlights"],
    telemetry: ["Portal-led motion", "Center gravity", "Scene continuity"],
    palette: {
      background: "bg-[#03080b]",
      from: "rgba(34, 211, 238, 0.14)",
      to: "rgba(3, 7, 18, 0.98)",
      accent: "rgba(74, 222, 128, 0.08)",
      portal: "rgba(34, 211, 238, 0.28)",
      ring: "rgba(103, 232, 249, 0.22)",
      shell: "border-cyan-100/10 bg-[#0a1620]/84",
      panel: "border-white/10 bg-[#02070d]/44",
      titleClassName: "text-cyan-50",
    },
  },
] as const;

type PortalSceneId = (typeof portalScenes)[number]["id"];

function getPortalMotion(prefersReducedMotion: boolean, value: string) {
  return prefersReducedMotion ? "circle(100% at 50% 50%)" : value;
}

export default function VoidPortalPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeValue, replayKey, replay, selectValue } =
    useTransitionDemo<PortalSceneId>(portalScenes[0].id);
  const activeScene =
    portalScenes.find((scene) => scene.id === activeValue) ?? portalScenes[0];
  const stageKey = `${activeValue}-${replayKey}`;

  return (
    <SceneFrame
      eyebrow="Task 12"
      title="Void Portal"
      description="A dramatic portal transition with a real center of gravity: the outgoing scene gets consumed into a void, then the next chamber emerges through the same aperture on a distinct second beat."
      aside={
        <div className="space-y-4">
          <p className="text-sm leading-6 text-white/68">
            The portal stays anchored in the same place for both phases. That
            single shared aperture is what makes the consume and reveal read as
            one spatial event instead of two unrelated tricks.
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
        eyebrow="Portal Chambers"
        options={portalScenes.map((scene) => ({
          value: scene.id,
          label: scene.label,
        }))}
        activeValue={activeValue}
        onSelect={selectValue}
        actionLabel="Open portal"
        onAction={replay}
        actionHint="Replays the consume phase and the aperture-led reveal."
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
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 18%), radial-gradient(circle at center, rgba(2,6,23,0) 0, rgba(2,6,23,0.68) 72%)",
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
            exit={{ opacity: prefersReducedMotion ? 0 : 0.18 }}
            transition={{ duration: transitionLabDurations.brisk }}
          >
            <motion.div
              className="relative z-10 grid min-h-[30rem] gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end"
              initial={{
                clipPath: getPortalMotion(
                  prefersReducedMotion,
                  "circle(10% at 50% 50%)"
                ),
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.92,
              }}
              animate={{
                clipPath: "circle(100% at 50% 50%)",
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: prefersReducedMotion
                  ? transitionLabDurations.brisk
                  : transitionLabDurations.linger,
                delay: prefersReducedMotion ? 0 : 0.34,
                ease: transitionLabEasings.fluid,
              }}
            >
              <div
                className={`rounded-[2rem] border p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] md:p-8 ${activeScene.palette.shell}`}
              >
                <p className="text-xs uppercase tracking-[0.34em] text-white/42">
                  {activeScene.eyebrow}
                </p>
                <h2
                  className={`mt-5 max-w-3xl font-serif text-4xl leading-[0.94] md:text-6xl ${activeScene.palette.titleClassName}`}
                >
                  {activeScene.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                  {activeScene.body}
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {activeScene.telemetry.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4 text-sm text-white/64"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <motion.aside
                className={`rounded-[1.75rem] border p-5 text-sm text-white/66 backdrop-blur-md ${activeScene.palette.panel}`}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.base,
                  delay: prefersReducedMotion ? 0 : 0.5,
                }}
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                  Portal sequence
                </p>
                <ol className="mt-5 space-y-3 leading-6">
                  <li>1. Outer scene darkens and compresses inward.</li>
                  <li>2. The aperture swells into a visible tunnel.</li>
                  <li>3. New content resolves through the same opening.</li>
                </ol>
              </motion.aside>
            </motion.div>

            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 p-7"
              initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              animate={{
                opacity: prefersReducedMotion ? 0 : [1, 0.96, 0],
                scale: prefersReducedMotion ? 1 : [1, 0.82, 0.6],
                filter: prefersReducedMotion
                  ? "blur(0px)"
                  : ["blur(0px)", "blur(6px)", "blur(12px)"],
                clipPath: prefersReducedMotion
                  ? "circle(0% at 50% 50%)"
                  : [
                      "circle(140% at 50% 50%)",
                      "circle(28% at 50% 50%)",
                      "circle(0% at 50% 50%)",
                    ],
              }}
              transition={{
                duration: prefersReducedMotion
                  ? transitionLabDurations.brisk
                  : transitionLabDurations.slow,
                ease: transitionLabEasings.curtain,
                times: prefersReducedMotion ? undefined : [0, 0.72, 1],
              }}
            >
              <div className="grid h-full gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)]">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6">
                  <div className="h-full rounded-[1.7rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
                </div>
                <div className="grid gap-5">
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5" />
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5" />
                </div>
              </div>
            </motion.div>

            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30">
              <motion.div
                className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.88) 28%, ${activeScene.palette.portal} 48%, transparent 72%)`,
                  boxShadow: `0 0 80px ${activeScene.palette.ring}`,
                }}
                initial={{ scale: prefersReducedMotion ? 1 : 0.2, opacity: 0 }}
                animate={{
                  scale: prefersReducedMotion ? 1 : [0.2, 0.92, 1.08, 1],
                  opacity: prefersReducedMotion ? 0.4 : [0, 0.95, 0.72, 0.58],
                }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.linger,
                  ease: transitionLabEasings.fluid,
                }}
              />

              {[0, 1].map((ring) => (
                <motion.div
                  key={`portal-ring-${ring}`}
                  className="absolute left-1/2 top-1/2 rounded-full border border-white/12"
                  style={{
                    width: `${14 + ring * 5}rem`,
                    height: `${14 + ring * 5}rem`,
                    translateX: "-50%",
                    translateY: "-50%",
                    boxShadow: `0 0 40px ${activeScene.palette.ring}`,
                  }}
                  initial={{ scale: prefersReducedMotion ? 1 : 0.3, opacity: 0 }}
                  animate={{
                    scale: prefersReducedMotion ? 1 : [0.3, 1.06],
                    opacity: prefersReducedMotion ? 0.12 : [0, 0.24, 0.08],
                    rotate: prefersReducedMotion ? 0 : ring === 0 ? 16 : -16,
                  }}
                  transition={{
                    duration: prefersReducedMotion
                      ? transitionLabDurations.brisk
                      : transitionLabDurations.slow,
                    delay: prefersReducedMotion ? 0 : ring * 0.08,
                    ease: transitionLabEasings.emphasis,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </TransitionStage>
    </SceneFrame>
  );
}
