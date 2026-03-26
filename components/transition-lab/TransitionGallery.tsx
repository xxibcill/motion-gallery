"use client";

import { startTransition, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
} from "motion/react";
import { GradientVeil } from "@/components/transition-lab/GradientVeil";
import { SharedElementShell } from "@/components/transition-lab/SharedElementShell";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import {
  showcaseModes,
  createSurfaceMotion,
  getDuration,
  getOverlayForMode,
  type ShowcaseMode,
  type MotionProfile,
  type ShowcaseModeId,
  usePrefersReducedMotion,
} from "@/lib/transition-renderers";
import { transitionLabDurations } from "@/lib/animation-presets";

const galleryScene = {
  eyebrow: "Transition Gallery",
  title: "All transitions, one scroll.",
  body: "Compare every transition signature side by vertical side. Each section has its own replay control.",
};

const defaultMotionProfile: MotionProfile = {
  speed: { value: "studio", label: "Studio", durationMultiplier: 1 },
  intensity: { value: "balanced", label: "Balanced", distanceMultiplier: 1 },
};

interface GalleryCardProps {
  mode: ShowcaseMode;
  motionProfile: MotionProfile;
  replayKey: number;
  index: number;
}

function GalleryCard({ mode, motionProfile, replayKey, index }: GalleryCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const heroMotion = createSurfaceMotion(prefersReducedMotion, motionProfile, {
    y: 30,
    scale: 0.96,
    delay: 0.05,
    duration: transitionLabDurations.base,
  });

  const mediaMotion = createSurfaceMotion(prefersReducedMotion, motionProfile, {
    y: 20,
    scale: 0.97,
    delay: 0.12,
    duration: transitionLabDurations.base,
  });

  return (
    <LayoutGroup id={`gallery-${mode.id}-${replayKey}`}>
      <div className="relative min-h-[24rem] overflow-hidden rounded-[1.75rem] p-4 sm:p-5">
        {getOverlayForMode(mode.id, prefersReducedMotion, motionProfile)}

        <div className="relative z-10 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <motion.div
            initial={heroMotion.initial}
            animate={heroMotion.animate}
            exit={heroMotion.exit}
            transition={heroMotion.transition}
          >
            <SharedElementShell
              layoutId={`gallery-shell-${mode.id}`}
              label={mode.stageLabel}
              title={mode.label}
              className={`h-full ${mode.shellClassName}`}
            >
              <p className="max-w-lg text-sm leading-6 text-white/72">
                {mode.summary}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/56">
                  #{index + 1}
                </span>
                <span className="text-xs text-white/44">{mode.route}</span>
              </div>
            </SharedElementShell>
          </motion.div>

          <motion.div
            className={`overflow-hidden rounded-[1.5rem] border p-4 backdrop-blur-md ${mode.mediaClassName}`}
            initial={mediaMotion.initial}
            animate={mediaMotion.animate}
            exit={mediaMotion.exit}
            transition={mediaMotion.transition}
          >
            <div
              className="h-36 rounded-[1.25rem] border border-white/10"
              style={{ backgroundImage: mode.mediaGlow }}
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2.5 text-center text-[0.65rem] uppercase tracking-[0.18em] text-white/48">
                {mode.stageLabel}
              </div>
              <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2.5 text-center text-[0.65rem] uppercase tracking-[0.18em] text-white/48">
                {prefersReducedMotion ? "Reduced" : "Full Motion"}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </LayoutGroup>
  );
}

interface TransitionSectionProps {
  mode: ShowcaseMode;
  index: number;
}

function TransitionSection({ mode, index }: TransitionSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [replayKey, setReplayKey] = useState(0);
  const stageKey = `${mode.id}-${replayKey}`;

  function handleReplay() {
    startTransition(() => {
      setReplayKey((k) => k + 1);
    });
  }

  return (
    <section className="relative">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-lg font-medium text-white/88">{mode.label}</h3>
        </div>
        <button
          onClick={handleReplay}
          className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-white/60 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white/80"
        >
          Replay
        </button>
      </div>

      <TransitionStage
        className="min-h-[24rem]"
        backgroundClassName={mode.backgroundClassName}
        overlays={
          <GradientVeil
            from={mode.gradient.from}
            to={mode.gradient.to}
            accent={mode.gradient.accent}
          />
        }
        noiseOpacity={0.06}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stageKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 0 : 0.18 }}
            transition={{
              duration: getDuration(prefersReducedMotion, transitionLabDurations.base, defaultMotionProfile),
            }}
          >
            <GalleryCard
              mode={mode}
              motionProfile={defaultMotionProfile}
              replayKey={replayKey}
              index={index}
            />
          </motion.div>
        </AnimatePresence>
      </TransitionStage>
    </section>
  );
}

export function TransitionGallery() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-cyan-200/16 bg-cyan-200/8 px-3 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200/72">
            {showcaseModes.length} Transitions
          </span>
          {prefersReducedMotion && (
            <span className="rounded-full border border-amber-200/16 bg-amber-200/8 px-3 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-amber-200/72">
              Reduced Motion
            </span>
          )}
        </div>
        <h1 className="text-2xl font-semibold text-white/92 sm:text-3xl">
          {galleryScene.title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-white/64">
          {galleryScene.body}
        </p>
      </header>

      {/* Transition sections */}
      <div className="space-y-12">
        {showcaseModes.map((mode, index) => (
          <TransitionSection key={mode.id} mode={mode} index={index} />
        ))}
      </div>
    </div>
  );
}
