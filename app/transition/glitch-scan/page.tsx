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

const glitchScenes = [
  {
    id: "broadcast-lock",
    label: "Broadcast Lock",
    eyebrow: "Signal Stable",
    title: "Scan bands punch through the frame, then the feed snaps into focus.",
    body:
      "The distortion is temporary and designed. RGB separation, frame jitter, and broadcast bars only appear during the handoff, so the route keeps its sharp editorial read once the scene settles.",
    chips: ["Short burst", "RGB split", "Usable controls"],
    diagnostics: ["02 scan passes", "9-frame jitter", "No continuous filters"],
    palette: {
      background: "bg-[#09060f]",
      from: "rgba(244, 63, 94, 0.2)",
      to: "rgba(15, 23, 42, 0.96)",
      accent: "rgba(34, 211, 238, 0.16)",
      panel: "border-rose-300/15 bg-black/42",
      grid: "rgba(251, 113, 133, 0.14)",
      scan: "rgba(34, 211, 238, 0.28)",
      signal: "rgba(244, 63, 94, 0.48)",
      title: "text-rose-50",
    },
  },
  {
    id: "ghost-channel",
    label: "Ghost Channel",
    eyebrow: "Signal Drift",
    title: "A colder feed fractures for a moment before the channel resolves clean.",
    body:
      "The second state leans into surveillance hardware instead of cyberpunk noise. Distortion still arrives as a controlled event: fast, directional, and gone before it can damage legibility.",
    chips: ["Controlled corruption", "Precision timing", "Scan-led wipe"],
    diagnostics: ["03 offset bars", "Subtle chroma echo", "Readable after settle"],
    palette: {
      background: "bg-[#060b11]",
      from: "rgba(34, 211, 238, 0.18)",
      to: "rgba(6, 24, 38, 0.96)",
      accent: "rgba(167, 139, 250, 0.16)",
      panel: "border-cyan-200/15 bg-[#04131f]/72",
      grid: "rgba(103, 232, 249, 0.12)",
      scan: "rgba(167, 139, 250, 0.24)",
      signal: "rgba(34, 211, 238, 0.42)",
      title: "text-cyan-50",
    },
  },
] as const;

type GlitchSceneId = (typeof glitchScenes)[number]["id"];

interface ScanBandProps {
  delay: number;
  color: string;
  prefersReducedMotion: boolean;
}

function ScanBand({ delay, color, prefersReducedMotion }: ScanBandProps) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.16),transparent)] mix-blend-screen"
      style={{ top: "14%", boxShadow: `0 0 34px ${color}` }}
      initial={{
        y: prefersReducedMotion ? 0 : -120,
        opacity: 0,
        scaleX: prefersReducedMotion ? 1 : 0.92,
      }}
      animate={{
        y: prefersReducedMotion ? 0 : [0, 140, 320],
        opacity: prefersReducedMotion ? 0.18 : [0, 0.9, 0],
        scaleX: prefersReducedMotion ? 1 : [0.92, 1, 1.04],
      }}
      transition={{
        duration: prefersReducedMotion
          ? transitionLabDurations.brisk
          : 0.72,
        delay,
        ease: transitionLabEasings.curtain,
        times: prefersReducedMotion ? undefined : [0, 0.45, 1],
      }}
    />
  );
}

interface RgbEchoTitleProps {
  title: string;
  titleClassName: string;
  prefersReducedMotion: boolean;
}

function RgbEchoTitle({
  title,
  titleClassName,
  prefersReducedMotion,
}: RgbEchoTitleProps) {
  return (
    <div className="relative">
      <motion.h2
        className={`relative z-10 max-w-3xl font-mono text-4xl uppercase leading-[0.92] tracking-[0.08em] md:text-6xl ${titleClassName}`}
        initial={{
          opacity: 0,
          y: prefersReducedMotion ? 0 : 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: prefersReducedMotion
            ? transitionLabDurations.brisk
            : transitionLabDurations.base,
          ease: transitionLabEasings.emphasis,
        }}
      >
        {title}
      </motion.h2>

      {prefersReducedMotion ? null : (
        <>
          <motion.h2
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 max-w-3xl font-mono text-4xl uppercase leading-[0.92] tracking-[0.08em] text-cyan-300/34 md:text-6xl"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: [0, 0.72, 0], x: [-16, -6, 0] }}
            transition={{ duration: 0.44, ease: transitionLabEasings.curtain }}
          >
            {title}
          </motion.h2>
          <motion.h2
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 max-w-3xl font-mono text-4xl uppercase leading-[0.92] tracking-[0.08em] text-rose-400/32 md:text-6xl"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: [0, 0.68, 0], x: [16, 7, 0] }}
            transition={{
              duration: 0.48,
              ease: transitionLabEasings.curtain,
              delay: 0.02,
            }}
          >
            {title}
          </motion.h2>
        </>
      )}
    </div>
  );
}

export default function GlitchScanPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeValue, replayKey, replay, selectValue } =
    useTransitionDemo<GlitchSceneId>(glitchScenes[0].id);
  const activeScene =
    glitchScenes.find((scene) => scene.id === activeValue) ?? glitchScenes[0];
  const stageKey = `${activeValue}-${replayKey}`;

  return (
    <SceneFrame
      eyebrow="Task 09"
      title="Glitch Scan"
      description="A broadcast-style transition that uses scan passes, short chroma splits, and deliberate frame jumps without letting the distortion linger long enough to feel broken."
      aside={
        <div className="space-y-4">
          <p className="text-sm leading-6 text-white/68">
            The demo keeps expensive effects out of the steady state. Most of
            the glitch language comes from transforms, opacity, layered text,
            and gradient bands that animate once per transition.
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
        eyebrow="Signal Profiles"
        options={glitchScenes.map((scene) => ({
          value: scene.id,
          label: scene.label,
        }))}
        activeValue={activeValue}
        onSelect={selectValue}
        actionLabel="Trigger scan"
        onAction={replay}
        actionHint="Replays the distortion burst and scan pass for the active channel."
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
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-55"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 4px)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent 0%, ${activeScene.palette.grid} 48%, transparent 100%)`,
              }}
            />
          </>
        }
        noiseOpacity={0.08}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stageKey}
            className="relative min-h-[33rem] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 0 : 0.24 }}
            transition={{ duration: transitionLabDurations.brisk }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <ScanBand
                delay={0}
                color={activeScene.palette.scan}
                prefersReducedMotion={prefersReducedMotion}
              />
              <ScanBand
                delay={prefersReducedMotion ? 0 : 0.14}
                color={activeScene.palette.signal}
                prefersReducedMotion={prefersReducedMotion}
              />

              <motion.div
                className="absolute inset-x-0 top-[24%] h-10 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.24),transparent)] mix-blend-screen"
                initial={{
                  opacity: 0,
                  x: prefersReducedMotion ? 0 : -80,
                  skewX: prefersReducedMotion ? 0 : -18,
                }}
                animate={{
                  opacity: prefersReducedMotion ? 0.12 : [0, 0.8, 0],
                  x: prefersReducedMotion ? 0 : [-80, 40, 160],
                  skewX: prefersReducedMotion ? 0 : [-18, -8, 0],
                }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : 0.52,
                  ease: transitionLabEasings.curtain,
                }}
              />
            </div>

            <motion.div
              className="relative grid min-h-[33rem] gap-6 p-6 lg:grid-cols-[minmax(0,1.14fr)_minmax(18rem,0.86fr)] lg:items-end lg:p-8"
              initial={{
                x: prefersReducedMotion ? 0 : -10,
                y: prefersReducedMotion ? 0 : 8,
              }}
              animate={{
                x: prefersReducedMotion ? 0 : [0, -10, 6, -3, 0],
                y: prefersReducedMotion ? 0 : [0, 6, -4, 2, 0],
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.42,
                ease: transitionLabEasings.curtain,
                times: prefersReducedMotion
                  ? undefined
                  : [0, 0.22, 0.48, 0.72, 1],
              }}
            >
              <motion.div
                className={`rounded-[2rem] border p-6 backdrop-blur-md md:p-8 ${activeScene.palette.panel}`}
                initial={{
                  opacity: 0,
                  scale: prefersReducedMotion ? 1 : 0.97,
                }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.base,
                  delay: prefersReducedMotion ? 0 : 0.1,
                  ease: transitionLabEasings.emphasis,
                }}
              >
                <p className="text-xs uppercase tracking-[0.34em] text-white/40">
                  {activeScene.eyebrow}
                </p>
                <div className="mt-5">
                  <RgbEchoTitle
                    title={activeScene.title}
                    titleClassName={activeScene.palette.title}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                </div>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                  {activeScene.body}
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {activeScene.diagnostics.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/68"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.aside
                className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5 text-white/68 backdrop-blur-md"
                initial={{
                  x: prefersReducedMotion ? 0 : 34,
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.base,
                  delay: prefersReducedMotion ? 0 : 0.2,
                  ease: transitionLabEasings.emphasis,
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/38">
                    Scan order
                  </p>
                  <span className="h-2.5 w-16 rounded-full bg-white/18" />
                </div>
                <div className="mt-5 space-y-4 text-sm leading-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    Scan band establishes direction and masks the scene change.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    RGB echoes and jitter spikes briefly, then clear out.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    Final state remains crisp so text and controls stay usable.
                  </div>
                </div>
              </motion.aside>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </TransitionStage>
    </SceneFrame>
  );
}
