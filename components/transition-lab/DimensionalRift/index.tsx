"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DemoToolbar } from "@/components/transition-lab/DemoToolbar";
import { GradientVeil } from "@/components/transition-lab/GradientVeil";
import { SceneFrame } from "@/components/transition-lab/SceneFrame";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import { useTransitionDemo } from "@/components/transition-lab/useTransitionDemo";
import { transitionLabDurations } from "@/lib/animation-presets";
import { RealityFracture } from "./RealityFracture";
import { VoidPull } from "./VoidPull";
import { DimensionalTunnel } from "./DimensionalTunnel";
import { Reassembly } from "./Reassembly";
import {
  riftScenes,
  riftPhaseDurations,
  generateStars,
  type RiftSceneId,
  type RiftPhase,
} from "./dimensional-rift-presets";

interface DimensionalRiftProps {
  eyebrow?: string;
  title?: string;
  description?: string;
}

function DimensionalRiftComponent({
  eyebrow = "Task 13",
  title = "Dimensional Rift",
  description = "The most complex transition: a 4-phase dimensional tear combining 3D shard physics, gravitational void, chromatic tunnel, and magnetic reassembly.",
}: DimensionalRiftProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeValue, replayKey, replay, selectValue } =
    useTransitionDemo<RiftSceneId>(riftScenes[0].id);

  const activeScene =
    riftScenes.find((scene) => scene.id === activeValue) ?? riftScenes[0];

  const [phase, setPhase] = useState<RiftPhase>("idle");

  // Generate stars once
  const stars = useMemo(() => generateStars(80), []);

  // Adaptive counts for mobile
  const shardCount = useMemo(() => {
    if (typeof window === "undefined") return 16;
    return window.innerWidth < 768 ? 12 : 16;
  }, []);

  // Phase orchestration
  useEffect(() => {
    if (replayKey === 0) {
      setPhase("idle");
      return;
    }

    let cancelled = false;

    const runPhases = async () => {
      if (cancelled) return;
      setPhase("fracture");
      await delay(riftPhaseDurations.fracture * 1000);

      if (cancelled) return;
      setPhase("void");
      await delay(riftPhaseDurations.void * 1000);

      if (cancelled) return;
      setPhase("tunnel");
      await delay(riftPhaseDurations.tunnel * 1000);

      if (cancelled) return;
      setPhase("reassembly");
      await delay(riftPhaseDurations.reassembly * 1000);

      if (cancelled) return;
      setPhase("idle");
    };

    runPhases();

    return () => {
      cancelled = true;
    };
  }, [replayKey]);

  const stageKey = `${activeValue}-${replayKey}`;

  const showFracture = phase === "fracture" || phase === "void";
  const showVoid = phase === "void";
  const showTunnel = phase === "tunnel";
  const showReassembly = phase === "reassembly" || phase === "idle";

  return (
    <SceneFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      aside={
        <div className="space-y-4">
          <p className="text-sm leading-6 text-white/68">
            This transition combines the most advanced techniques from the entire
            transition lab: 3D transforms from paper-fold, fragment physics from
            magnetic-collapse, chromatic effects from glitch-scan, and portal
            effects from void-portal.
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
        eyebrow="Dimension Profiles"
        options={riftScenes.map((scene) => ({
          value: scene.id,
          label: scene.label,
        }))}
        activeValue={activeValue}
        onSelect={selectValue}
        actionLabel="Open rift"
        onAction={replay}
        actionHint="Triggers the 4-phase dimensional tear: fracture, void, tunnel, reassembly."
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
            {/* Phase 1 & 2: Reality Fracture with Void Pull */}
            <RealityFracture
              shardCount={shardCount}
              palette={activeScene.palette}
              phase={phase}
              prefersReducedMotion={prefersReducedMotion}
            />

            {/* Phase 2: Void Pull (attractor) */}
            <VoidPull
              palette={activeScene.palette}
              isActive={showVoid}
              prefersReducedMotion={prefersReducedMotion}
            />

            {/* Phase 3: Dimensional Tunnel */}
            <DimensionalTunnel
              stars={stars}
              palette={activeScene.palette}
              isActive={showTunnel}
              prefersReducedMotion={prefersReducedMotion}
            />

            {/* Phase 4: Reassembly */}
            {showReassembly && replayKey > 0 && (
              <Reassembly
                activeScene={activeScene}
                isActive={phase === "reassembly"}
                prefersReducedMotion={prefersReducedMotion}
                durations={transitionLabDurations}
              />
            )}

            {/* Initial state placeholder before first replay */}
            {replayKey === 0 && (
              <motion.div
                className="relative z-10 flex min-h-[30rem] items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  className={`rounded-[2rem] border p-8 ${activeScene.palette.card} ${activeScene.palette.text}`}
                >
                  <p className="text-xs uppercase tracking-[0.34em] text-white/46">
                    {activeScene.eyebrow}
                  </p>
                  <h2 className="mt-5 max-w-2xl font-serif text-3xl leading-[0.94] md:text-5xl">
                    Click &quot;Open rift&quot; to begin the dimensional transition
                  </h2>
                  <p className="mt-4 text-base leading-7 text-white/74">
                    This is the most complex animation in the gallery, combining
                    3D physics, gravitational simulation, chromatic effects, and
                    spring-based reassembly.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </TransitionStage>
    </SceneFrame>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const DimensionalRift = memo(DimensionalRiftComponent);
export { riftScenes, type RiftSceneId } from "./dimensional-rift-presets";
