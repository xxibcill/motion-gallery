"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { DemoToolbar } from "@/components/transition-lab/DemoToolbar";
import { GradientVeil } from "@/components/transition-lab/GradientVeil";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import { useTransitionDemo } from "@/components/transition-lab/useTransitionDemo";
import { transitionLabDurations } from "@/lib/animation-presets";
import { RealityFracture } from "@/components/transition-lab/DimensionalRift/RealityFracture";
import { VoidPull } from "@/components/transition-lab/DimensionalRift/VoidPull";
import { DimensionalTunnel } from "@/components/transition-lab/DimensionalRift/DimensionalTunnel";
import { Reassembly } from "@/components/transition-lab/DimensionalRift/Reassembly";
import {
  riftScenes,
  riftPhaseDurations,
  generateStars,
  type RiftSceneId,
  type RiftPhase,
} from "@/components/transition-lab/DimensionalRift/dimensional-rift-presets";

// Helper at module level
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function DimensionalRiftDemoPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeValue, replayKey, replay, selectValue } =
    useTransitionDemo<RiftSceneId>(riftScenes[0].id);

  const activeScene =
    riftScenes.find((scene) => scene.id === activeValue) ?? riftScenes[0];

  const [phase, setPhase] = useState<RiftPhase>("idle");
  const stars = useMemo(() => generateStars(80), []);
  const [shardCount, setShardCount] = useState(16);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setShardCount(12);
    }
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

  return (
    <main className="min-h-screen bg-[#08080c]">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-400/70">
            Transition Lab Demo
          </p>
          <h1 className="mt-2 font-serif text-4xl text-white md:text-5xl">
            Dimensional Rift
          </h1>
          <p className="mt-3 max-w-2xl text-white/60">
            A 4-phase dimensional tear with 3D shard physics, gravitational void,
            chromatic tunnel, and magnetic reassembly.
          </p>
        </div>
      </header>

      {/* Demo Section */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
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
            actionHint="Triggers the 4-phase dimensional tear"
          />

          <TransitionStage
            className="min-h-[30rem] sm:min-h-[34rem] lg:min-h-[36rem]"
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
            <motion.div
              key={stageKey}
              className="relative min-h-[30rem] overflow-hidden p-4 sm:min-h-[34rem] sm:p-5 md:p-7 lg:min-h-[36rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: prefersReducedMotion ? 0 : 0.2 }}
              transition={{ duration: transitionLabDurations.brisk }}
            >
              <RealityFracture
                shardCount={shardCount}
                palette={activeScene.palette}
                phase={phase}
                prefersReducedMotion={prefersReducedMotion}
              />

              <VoidPull
                palette={activeScene.palette}
                isActive={phase === "void"}
                prefersReducedMotion={prefersReducedMotion}
              />

              <DimensionalTunnel
                stars={stars}
                palette={activeScene.palette}
                isActive={phase === "tunnel"}
                prefersReducedMotion={prefersReducedMotion}
              />

              {phase === "reassembly" && (
                <Reassembly
                  activeScene={activeScene}
                  isActive={true}
                  prefersReducedMotion={prefersReducedMotion}
                  durations={transitionLabDurations}
                />
              )}

              {/* Initial state */}
              {replayKey === 0 && (
                <motion.div
                  className="relative z-10 flex min-h-[24rem] items-center justify-center sm:min-h-[26rem] lg:min-h-[32rem]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div
                    className={`w-full max-w-xl rounded-[1.75rem] border p-6 text-center sm:rounded-[2rem] sm:p-8 ${activeScene.palette.card} ${activeScene.palette.text}`}
                  >
                    <p className="text-xs uppercase tracking-[0.34em] text-white/46">
                      {activeScene.eyebrow}
                    </p>
                    <h2 className="mx-auto mt-5 max-w-xl font-serif text-[2.15rem] leading-[0.94] sm:text-3xl md:text-5xl">
                      Click &quot;Open rift&quot; to begin
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-base leading-7 text-white/74">
                      Experience a 4-phase dimensional transition
                    </p>
                    <motion.button
                      onClick={replay}
                      className="mt-6 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Initialize Rift Sequence
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </TransitionStage>

          {/* Phase indicator */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {["fracture", "void", "tunnel", "reassembly"].map((p, i) => (
              <div
                key={p}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  phase === p
                    ? "bg-fuchsia-500"
                    : phase !== "idle" && i < ["fracture", "void", "tunnel", "reassembly"].indexOf(phase)
                    ? "bg-fuchsia-500/40"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-white/40">
            {phase === "idle" ? "Ready" : `Phase: ${phase}`}
          </p>
        </div>
      </section>
    </main>
  );
}
