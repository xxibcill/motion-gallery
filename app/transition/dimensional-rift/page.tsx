"use client";

import { motion, useReducedMotion } from "motion/react";
import { DemoToolbar } from "@/components/transition-lab/DemoToolbar";
import { GradientVeil } from "@/components/transition-lab/GradientVeil";
import { SceneFrame } from "@/components/transition-lab/SceneFrame";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import { useTransitionDemo } from "@/components/transition-lab/useTransitionDemo";
import { transitionLabDurations, transitionLabEasings } from "@/lib/animation-presets";
import { RealityFracture } from "@/components/transition-lab/DimensionalRift/RealityFracture";
import { VoidPull } from "@/components/transition-lab/DimensionalRift/VoidPull";
import { DimensionalTunnel } from "@/components/transition-lab/DimensionalRift/DimensionalTunnel";
import { Reassembly } from "@/components/transition-lab/DimensionalRift/Reassembly";
import {
  riftScenes,
  riftPhaseDurations,
  riftSprings,
  generateStars,
  type RiftSceneId,
  type RiftPhase,
} from "@/components/transition-lab/DimensionalRift/dimensional-rift-presets";

const phaseDetails = [
  {
    phase: "fracture",
    title: "Phase 1: Reality Fracture",
    duration: "1.2s",
    description: "Content cracks into 16 individual 3D shards, each with unique rotation physics.",
    techniques: ["3D transforms (rotateX/Y/Z)", "Staggered delays (0.04s per shard)", "Perspective depth", "Spring physics per shard"],
    icon: "◇",
  },
  {
    phase: "void",
    title: "Phase 2: Void Pull",
    duration: "0.8s",
    description: "A gravitational singularity pulls all shards toward the center with bloom effects.",
    techniques: ["Central attractor", "Gravitational acceleration", "Field lines", "Radial bloom"],
    icon: "◉",
  },
  {
    phase: "tunnel",
    title: "Phase 3: Dimensional Tunnel",
    duration: "1.4s",
    description: "Traverse through a chromatic tunnel with 80 expanding stars.",
    techniques: ["Particle system (80 stars)", "Chromatic aberration", "Speed lines", "Central white flash"],
    icon: "◈",
  },
  {
    phase: "reassembly",
    title: "Phase 4: Reassembly",
    duration: "1.0s",
    description: "Content cards snap back into place with magnetic spring physics.",
    techniques: ["Spring-based landing", "3D entry rotation", "Overshoot & settle", "Staggered timing"],
    icon: "◆",
  },
];

const techSpecs = [
  { label: "Total Duration", value: "4.4 seconds" },
  { label: "Shard Count", value: "16 (12 on mobile)" },
  { label: "Star Count", value: "80 particles" },
  { label: "Animation Phases", value: "4 phases" },
  { label: "3D Transforms", value: "rotateX/Y/Z, translateZ" },
  { label: "Spring Config", value: "stiffness: 280, damping: 24" },
];

export default function DimensionalRiftPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeValue, replayKey, replay, selectValue } =
    useTransitionDemo<RiftSceneId>(riftScenes[0].id);

  const activeScene =
    riftScenes.find((scene) => scene.id === activeValue) ?? riftScenes[0];

  const [phase, setPhase] = useState<RiftPhase>("idle");
  const stars = useMemo(() => generateStars(80), []);
  const [shardCount] = useState(16);

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <SceneFrame
        eyebrow="Task 13"
        title="Dimensional Rift"
        description="The most complex animation in the gallery: a 4-phase dimensional tear combining 3D shard physics, gravitational void, chromatic tunnel, and magnetic reassembly."
        aside={
          <div className="space-y-4">
            <p className="text-sm leading-6 text-white/68">
              This transition combines advanced techniques from the entire transition lab:
              3D transforms, fragment physics, chromatic effects, and portal systems.
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
          actionHint="Triggers the 4-phase dimensional tear"
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
          <motion.div
            key={stageKey}
            className="relative min-h-[34rem] overflow-hidden p-5 md:p-7"
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
                className="relative z-10 flex min-h-[30rem] items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  className={`rounded-[2rem] border p-8 text-center ${activeScene.palette.card} ${activeScene.palette.text}`}
                >
                  <p className="text-xs uppercase tracking-[0.34em] text-white/46">
                    {activeScene.eyebrow}
                  </p>
                  <h2 className="mx-auto mt-5 max-w-xl font-serif text-3xl leading-[0.94] md:text-5xl">
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
      </SceneFrame>

      {/* Phase Breakdown Section */}
      <section className="border-t border-white/10 bg-[#0a0a0f] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-400/70">
              Animation Breakdown
            </p>
            <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">
              Four Distinct Phases
            </h2>
            <p className="mt-4 max-w-2xl text-white/60">
              The dimensional rift transitions through four carefully choreographed phases,
              each with its own physics, timing, and visual language.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {phaseDetails.map((phaseInfo, index) => (
              <motion.div
                key={phaseInfo.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 text-2xl text-fuchsia-300">
                    {phaseInfo.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-lg text-white">
                        {phaseInfo.title}
                      </h3>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                        {phaseInfo.duration}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/60">
                      {phaseInfo.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {phaseInfo.techniques.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="border-t border-white/10 bg-[#08080c] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/70">
              Technical Details
            </p>
            <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">
              Specifications
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techSpecs.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                  {spec.label}
                </p>
                <p className="mt-2 font-mono text-lg text-white/90">
                  {spec.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="border-t border-white/10 bg-[#0a0a0f] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/70">
              Implementation
            </p>
            <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">
              Phase State Machine
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-xl border border-white/10 bg-[#0c0c12]"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-white/40">phase-orchestration.ts</span>
            </div>
            <pre className="overflow-x-auto p-5 text-sm text-white/80">
              <code>{`const phaseDurations = {
  fracture: 1.2,   // 3D shards crack apart
  void: 0.8,       // Gravitational pull to center
  tunnel: 1.4,     // Chromatic star field
  reassembly: 1.0, // Magnetic snap rebuild
}; // Total: 4.4 seconds

// Phase orchestration with async timing
useEffect(() => {
  const runPhases = async () => {
    setPhase('fracture');
    await delay(phaseDurations.fracture * 1000);

    setPhase('void');
    await delay(phaseDurations.void * 1000);

    setPhase('tunnel');
    await delay(phaseDurations.tunnel * 1000);

    setPhase('reassembly');
    await delay(phaseDurations.reassembly * 1000);

    setPhase('idle');
  };

  runPhases();
}, [replayKey]);`}</code>
            </pre>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Helper at module level
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Import useState and useMemo
import { useState, useEffect, useMemo } from "react";
