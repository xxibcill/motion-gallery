"use client";

import { startTransition, useState, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
} from "motion/react";
import { GradientVeil } from "@/components/transition-lab/GradientVeil";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import {
  showcaseModes,
  getDuration,
  getOverlayForMode,
  type ShowcaseMode,
  type MotionProfile,
  usePrefersReducedMotion,
} from "@/lib/transition-renderers";
import { transitionLabDurations } from "@/lib/animation-presets";

const galleryScene = {
  eyebrow: "Transition Gallery",
  title: "All transitions, one scroll.",
  body: "Scroll to trigger each transition. Compare every signature side by vertical side.",
};

const defaultMotionProfile: MotionProfile = {
  speed: { value: "studio", label: "Studio", durationMultiplier: 1 },
  intensity: { value: "balanced", label: "Balanced", distanceMultiplier: 1 },
};

interface TransitionSectionProps {
  mode: ShowcaseMode;
  index: number;
}

function TransitionSection({ mode, index }: TransitionSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [replayKey, setReplayKey] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.5 });
  const stageKey = `${mode.id}-${replayKey}-${isInView ? "in" : "out"}`;

  function handleReplay() {
    startTransition(() => {
      setReplayKey((k) => k + 1);
    });
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen flex-col justify-center px-4"
    >
      <TransitionStage
        className="flex-1 overflow-hidden"
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
          {isInView && (
            <motion.div
              key={stageKey}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: getDuration(prefersReducedMotion, transitionLabDurations.base, defaultMotionProfile),
              }}
              className="relative flex h-full flex-col items-center justify-center p-6"
            >
              {getOverlayForMode(mode.id, prefersReducedMotion, defaultMotionProfile)}

              {/* Centered content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`rounded-3xl border px-8 py-6 backdrop-blur-md ${mode.shellClassName}`}>
                  <span className="block text-xs uppercase tracking-[0.28em] text-white/48">
                    {String(index + 1).padStart(2, "0")} · {mode.stageLabel}
                  </span>
                  <h4 className="mt-2 text-3xl font-semibold text-white/92 sm:text-4xl">
                    {mode.label}
                  </h4>
                </div>

                <button
                  onClick={handleReplay}
                  className="mt-6 rounded-full border border-white/12 bg-white/[0.06] px-5 py-2 text-xs uppercase tracking-[0.2em] text-white/56 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white/80"
                >
                  Replay
                </button>
              </div>
            </motion.div>
          )}
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

      {/* Transition sections - full page each */}
      <div className="space-y-6">
        {showcaseModes.map((mode, index) => (
          <TransitionSection key={mode.id} mode={mode} index={index} />
        ))}
      </div>
    </div>
  );
}
