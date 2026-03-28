"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTime,
  useTransform,
} from "motion/react";

type PhaseId = "dormant" | "ignite" | "fracture" | "eclipse" | "bloom";

interface PhaseConfig {
  id: PhaseId;
  label: string;
  title: string;
  description: string;
  accent: string;
  edge: string;
  surface: string;
  coreScale: number;
  coreRotate: number;
  shardPush: number;
  shardRotate: number;
  ringScale: number;
  beamScale: number;
  copy: string[];
}

interface ShardConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  driftX: number;
  driftY: number;
  twist: number;
}

interface OrbitParticle {
  top: number;
  left: number;
  size: number;
  drift: number;
  lift: number;
  duration: number;
  delay: number;
  tint: string;
}

const phases: PhaseConfig[] = [
  {
    id: "dormant",
    label: "Dormant",
    title: "A sealed machine under tension",
    description:
      "The stage stays compressed and observant. Rings breathe, the field drifts, and the center holds energy without releasing it.",
    accent: "rgba(255, 214, 153, 0.95)",
    edge: "rgba(252, 168, 116, 0.5)",
    surface: "linear-gradient(135deg, rgba(31, 21, 16, 0.95), rgba(7, 11, 18, 0.72))",
    coreScale: 0.92,
    coreRotate: 0,
    shardPush: 0,
    shardRotate: 0,
    ringScale: 0.92,
    beamScale: 0.82,
    copy: ["Field pressure stable", "No fracture", "Signal latent"],
  },
  {
    id: "ignite",
    label: "Ignite",
    title: "The chamber takes a breath before rupture",
    description:
      "A warm charge spills across the shell, beams wake up, and the center begins to overexpose the surrounding geometry.",
    accent: "rgba(255, 175, 97, 0.96)",
    edge: "rgba(255, 226, 170, 0.54)",
    surface: "linear-gradient(135deg, rgba(54, 24, 10, 0.98), rgba(10, 16, 25, 0.7))",
    coreScale: 1.02,
    coreRotate: 18,
    shardPush: 18,
    shardRotate: 6,
    ringScale: 1.02,
    beamScale: 1.1,
    copy: ["Heat bloom", "Panel charge", "Orbit widening"],
  },
  {
    id: "fracture",
    label: "Fracture",
    title: "The shell peels outward into floating plates",
    description:
      "The geometry separates into offset shards, tilt amplifies, and the center turns into a hot seam rather than a contained object.",
    accent: "rgba(251, 130, 104, 0.98)",
    edge: "rgba(255, 203, 160, 0.42)",
    surface: "linear-gradient(135deg, rgba(66, 17, 14, 0.98), rgba(10, 11, 18, 0.72))",
    coreScale: 1.12,
    coreRotate: 44,
    shardPush: 66,
    shardRotate: 26,
    ringScale: 1.14,
    beamScale: 1.22,
    copy: ["Hull separation", "Vector divergence", "Lattice exposed"],
  },
  {
    id: "eclipse",
    label: "Eclipse",
    title: "Everything collapses into a compressed horizon",
    description:
      "The center darkens, the halo turns surgical, and the outer field becomes a gravitational diagram instead of a bloom.",
    accent: "rgba(139, 221, 216, 0.98)",
    edge: "rgba(138, 233, 218, 0.46)",
    surface: "linear-gradient(135deg, rgba(5, 29, 31, 0.98), rgba(5, 8, 15, 0.82))",
    coreScale: 0.78,
    coreRotate: 98,
    shardPush: 34,
    shardRotate: -18,
    ringScale: 0.84,
    beamScale: 0.74,
    copy: ["Gravity inversion", "Edge sharpening", "Atmosphere stripped"],
  },
  {
    id: "bloom",
    label: "Bloom",
    title: "The machine resolves as a luminous garden",
    description:
      "The shards settle into a calm constellation, the halo opens back up, and the chamber turns radiant rather than violent.",
    accent: "rgba(161, 255, 231, 0.98)",
    edge: "rgba(255, 242, 188, 0.42)",
    surface: "linear-gradient(135deg, rgba(12, 34, 30, 0.98), rgba(11, 16, 25, 0.72))",
    coreScale: 1,
    coreRotate: 138,
    shardPush: 14,
    shardRotate: 10,
    ringScale: 1.06,
    beamScale: 0.96,
    copy: ["Reassembly complete", "Petal field online", "Horizon softened"],
  },
];

const shards: ShardConfig[] = [
  { x: -32, y: -28, width: 28, height: 18, rotate: -18, driftX: -1.1, driftY: -1, twist: -1 },
  { x: 0, y: -32, width: 18, height: 14, rotate: 4, driftX: 0, driftY: -1.4, twist: 1.2 },
  { x: 30, y: -26, width: 24, height: 16, rotate: 18, driftX: 1.15, driftY: -1.1, twist: 1.1 },
  { x: -38, y: 2, width: 20, height: 22, rotate: -10, driftX: -1.35, driftY: -0.1, twist: -0.9 },
  { x: 36, y: 3, width: 20, height: 24, rotate: 10, driftX: 1.35, driftY: 0.08, twist: 0.95 },
  { x: -28, y: 28, width: 25, height: 18, rotate: -12, driftX: -1.05, driftY: 1.1, twist: -1 },
  { x: 0, y: 34, width: 18, height: 14, rotate: 0, driftX: 0.1, driftY: 1.32, twist: 1.4 },
  { x: 28, y: 30, width: 24, height: 18, rotate: 14, driftX: 1.05, driftY: 1.12, twist: 0.88 },
  { x: -14, y: -8, width: 20, height: 12, rotate: -22, driftX: -0.6, driftY: -0.42, twist: -1.3 },
  { x: 15, y: -4, width: 20, height: 12, rotate: 22, driftX: 0.62, driftY: -0.18, twist: 1.35 },
  { x: -12, y: 14, width: 16, height: 12, rotate: -8, driftX: -0.48, driftY: 0.54, twist: -0.75 },
  { x: 14, y: 14, width: 16, height: 12, rotate: 8, driftX: 0.48, driftY: 0.52, twist: 0.75 },
];

const beamAngles = [0, 45, 90, 135];

const phaseMetrics = [
  { label: "Layers", value: "42" },
  { label: "Loops", value: "9" },
  { label: "Depth", value: "Pointer + scroll" },
];

function buildParticles(count: number): OrbitParticle[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = index + 1;
    const radialBand = seed % 3;
    return {
      top: 16 + ((seed * 17) % 68),
      left: 14 + ((seed * 23) % 72),
      size: 4 + (seed % 4) * 3 + radialBand,
      drift: 14 + (seed % 7) * 7,
      lift: 20 + (seed % 6) * 8,
      duration: 7 + (seed % 5) * 1.25,
      delay: (seed % 9) * 0.24,
      tint:
        radialBand === 0
          ? "rgba(255, 225, 172, 0.72)"
          : radialBand === 1
            ? "rgba(141, 230, 220, 0.7)"
            : "rgba(255, 145, 115, 0.68)",
    };
  });
}

function PhasePill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.28em] transition-colors ${
        active
          ? "border-white/40 bg-white/14 text-[#fff2d0]"
          : "border-white/10 bg-white/[0.04] text-white/50 hover:border-white/20 hover:text-white/80"
      }`}
    >
      {label}
    </button>
  );
}

export default function CombinedAnimationPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [activePhase, setActivePhase] = useState(prefersReducedMotion ? phases.length - 1 : 0);
  const particles = useMemo(
    () => buildParticles(prefersReducedMotion ? 16 : 28),
    [prefersReducedMotion]
  );

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const pointerX = useSpring(0, { stiffness: 120, damping: 18, mass: 0.4 });
  const pointerY = useSpring(0, { stiffness: 120, damping: 18, mass: 0.4 });
  const heroTranslateX = useTransform(pointerX, [-1, 1], prefersReducedMotion ? [0, 0] : [-16, 16]);
  const heroTranslateY = useTransform(pointerY, [-1, 1], prefersReducedMotion ? [0, 0] : [-12, 12]);
  const heroRotateX = useTransform(pointerY, [-1, 1], prefersReducedMotion ? [0, 0] : [8, -8]);
  const heroRotateY = useTransform(pointerX, [-1, 1], prefersReducedMotion ? [0, 0] : [-10, 10]);

  const stageScale = useSpring(useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.94, 0.86]), {
    stiffness: 140,
    damping: 24,
    mass: 0.6,
  });
  const stageY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "36%"]);
  const detailY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const time = useTime();
  const slowSpin = useTransform(time, (value) => value / 120);
  const reverseSpin = useTransform(time, (value) => -value / 180);
  const pulseScale = useTransform(time, (value) => 1 + Math.sin(value / 800) * 0.035);
  const haloBreath = useTransform(time, (value) => 0.5 + Math.sin(value / 900) * 0.1);

  const glowX = useTransform(pointerX, [-1, 1], [38, 62]);
  const glowY = useTransform(pointerY, [-1, 1], [36, 64]);
  const pointerGlow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 240, 201, 0.18), transparent 24%)`;

  const phase = phases[activePhase];
  const progressWidth = `${((activePhase + 1) / phases.length) * 100}%`;

  useEffect(() => {
    if (prefersReducedMotion) {
      setActivePhase(phases.length - 1);
      return;
    }

    const interval = window.setInterval(() => {
      setActivePhase((current) => (current + 1) % phases.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    pointerX.set((x - 0.5) * 2);
    pointerY.set((y - 0.5) * 2);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <main className="relative overflow-x-hidden bg-[#05030a] text-[#f5efdc]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,185,124,0.16),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(109,222,210,0.14),transparent_24%),linear-gradient(180deg,#05030a_0%,#080c13_34%,#05030a_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-[0.1]" />
      </div>

      <div ref={sceneRef} className="relative h-[220vh]">
        <section
          className="sticky top-0 h-screen overflow-hidden"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              scale: stageScale,
              y: stageY,
              backgroundImage: pointerGlow,
            }}
          />

          <div className="absolute inset-0">
            <motion.div
              className="absolute left-1/2 top-[10%] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full blur-3xl"
              style={{
                scale: pulseScale,
                opacity: prefersReducedMotion ? 0.22 : 0.42,
                background:
                  "radial-gradient(circle, rgba(255,181,123,0.34), rgba(255,181,123,0.08) 42%, transparent 70%)",
              }}
            />
            <motion.div
              className="absolute inset-x-[8%] top-[18%] h-[65vh] rounded-[3rem] border border-white/10"
              style={{
                rotate: slowSpin,
                opacity: prefersReducedMotion ? 0.1 : haloBreath,
              }}
            />
            <motion.div
              className="absolute inset-x-[16%] top-[24%] h-[52vh] rounded-[3rem] border border-[#8fe3d6]/15"
              style={{ rotate: reverseSpin }}
            />
          </div>

          <div className="relative z-10 mx-auto grid h-full max-w-7xl items-center gap-10 px-6 py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(22rem,1fr)_minmax(0,0.78fr)] lg:px-10">
            <motion.div className="space-y-8 lg:pr-6" style={{ y: copyY }}>
              <div className="space-y-3">
                <p className="text-[0.7rem] uppercase tracking-[0.38em] text-[#f2c78f]/78">
                  Combined Animation
                </p>
                <h1 className="max-w-xl font-serif text-[clamp(3rem,7vw,6.8rem)] leading-[0.9] text-[#fff8e9]">
                  Abyssal
                  <br />
                  Convergence
                </h1>
                <p className="max-w-lg text-base leading-7 text-white/68 md:text-lg">
                  A deliberately overbuilt motion page: phase cycling, pointer depth, scroll-linked
                  compression, rotating field geometry, and a reconfiguring center rig.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {phaseMetrics.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-sm"
                  >
                    <p className="text-[0.62rem] uppercase tracking-[0.26em] text-white/38">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm text-[#fff0cb]">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="h-px w-full bg-white/10" />
                <p className="text-sm leading-6 text-white/60">
                  Reduced motion freezes the auto-cycle on the final composition while keeping the
                  same atmosphere, palette, and scene structure intact.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative mx-auto flex aspect-square w-full max-w-[40rem] items-center justify-center"
              style={{
                x: heroTranslateX,
                y: heroTranslateY,
                rotateX: heroRotateX,
                rotateY: heroRotateY,
                transformPerspective: 1600,
                transformStyle: "preserve-3d",
              }}
            >
              <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
                <defs>
                  <filter id="abyssal-distortion">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.012"
                      numOctaves="2"
                      seed="17"
                      result="noise"
                    />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" />
                  </filter>
                </defs>
              </svg>

              <motion.div
                className="absolute inset-[9%] rounded-full border border-white/12"
                style={{ rotate: slowSpin, scale: phase.ringScale }}
              />
              <motion.div
                className="absolute inset-[18%] rounded-full border border-[#9dece0]/18"
                style={{ rotate: reverseSpin, scale: pulseScale }}
                animate={{ scale: phase.ringScale }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
              />

              {beamAngles.map((angle) => (
                <motion.div
                  key={angle}
                  className="absolute left-1/2 top-1/2 h-[1px] w-[78%] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    rotate: angle,
                    scaleX: phase.beamScale,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255, 247, 228, 0.85), transparent)",
                    opacity: prefersReducedMotion ? 0.18 : phase.id === "eclipse" ? 0.32 : 0.58,
                  }}
                />
              ))}

              <motion.div
                className="absolute inset-[21%] rounded-[2.7rem] border backdrop-blur-md"
                animate={{
                  rotate: phase.coreRotate,
                  scale: phase.ringScale,
                  borderColor: phase.edge,
                  background: phase.surface,
                }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
              />

              {shards.map((shard, index) => (
                <motion.div
                  key={`${shard.x}-${shard.y}-${index}`}
                  className="absolute rounded-[1.4rem] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02))] shadow-[0_20px_40px_-28px_rgba(0,0,0,0.9)]"
                  style={{
                    left: `calc(50% + ${shard.x}%)`,
                    top: `calc(50% + ${shard.y}%)`,
                    width: `${shard.width}%`,
                    height: `${shard.height}%`,
                    x: "-50%",
                    y: "-50%",
                    filter: phase.id === "fracture" && !prefersReducedMotion ? "url(#abyssal-distortion)" : "none",
                  }}
                  animate={{
                    x: `calc(-50% + ${phase.shardPush * shard.driftX}px)`,
                    y: `calc(-50% + ${phase.shardPush * shard.driftY}px)`,
                    rotate: shard.rotate + phase.shardRotate * shard.twist,
                    scale: phase.id === "eclipse" ? 0.94 : phase.id === "fracture" ? 1.06 : 1,
                    opacity:
                      phase.id === "eclipse"
                        ? 0.48
                        : phase.id === "fracture"
                          ? 0.88
                          : prefersReducedMotion
                            ? 0.48
                            : 0.68,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0.12 : 0.8,
                    delay: prefersReducedMotion ? 0 : index * 0.02,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_45%)]" />
                </motion.div>
              ))}

              {particles.map((particle, index) => (
                <motion.span
                  key={`${particle.top}-${particle.left}-${index}`}
                  className="absolute rounded-full"
                  style={{
                    top: `${particle.top}%`,
                    left: `${particle.left}%`,
                    width: particle.size,
                    height: particle.size,
                    background: particle.tint,
                    boxShadow: `0 0 ${particle.size * 2}px ${particle.tint}`,
                  }}
                  animate={
                    prefersReducedMotion
                      ? { opacity: 0.48, scale: 1 }
                      : {
                          x: [0, particle.drift, 0, -particle.drift * 0.45, 0],
                          y: [0, -particle.lift, -particle.lift * 0.35, particle.lift * 0.2, 0],
                          opacity: [0.1, 0.8, 0.45, 0.72, 0.18],
                          scale: [0.7, 1.15, 0.92, 1, 0.75],
                        }
                  }
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              <motion.div
                className="absolute inset-[29%] rounded-full"
                animate={{
                  rotate: phase.coreRotate,
                  scale: phase.coreScale,
                  background:
                    phase.id === "eclipse"
                      ? "radial-gradient(circle, rgba(5, 8, 12, 1) 0%, rgba(7, 20, 24, 0.9) 46%, rgba(107, 215, 206, 0.28) 74%, transparent 100%)"
                      : `radial-gradient(circle, ${phase.accent} 0%, rgba(255,255,255,0.72) 18%, rgba(255,214,153,0.26) 42%, rgba(7,12,18,0) 76%)`,
                }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 1, ease: [0.22, 1, 0.36, 1] }}
              />

              <motion.div
                className="absolute inset-[34%] rounded-full border"
                animate={{
                  borderColor: phase.edge,
                  scale: phase.id === "fracture" ? 1.16 : phase.id === "eclipse" ? 0.82 : 1,
                  rotate: phase.coreRotate * -0.6,
                }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
              />

              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phase.id}
                    className="max-w-[14rem] rounded-[1.7rem] border border-white/12 bg-black/20 px-5 py-4 text-center backdrop-blur-md"
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -18 }}
                    transition={{ duration: prefersReducedMotion ? 0.12 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="text-[0.62rem] uppercase tracking-[0.32em] text-white/40">
                      Phase
                    </p>
                    <p className="mt-2 text-xl text-[#fff4d4]">{phase.label}</p>
                    <p className="mt-2 text-sm leading-6 text-white/58">{phase.copy[0]}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div className="space-y-6 lg:pl-4" style={{ y: detailY }}>
              <div className="rounded-[2rem] border border-white/10 bg-black/18 p-6 backdrop-blur-md">
                <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/40">
                  Active direction
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
                    transition={{ duration: prefersReducedMotion ? 0.12 : 0.35 }}
                  >
                    <h2 className="mt-3 font-serif text-3xl text-[#fff7e6]">{phase.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/64">{phase.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {phase.copy.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/58"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between text-[0.62rem] uppercase tracking-[0.28em] text-white/40">
                  <span>Cycle</span>
                  <span>{activePhase + 1}/5</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#f8c47e,#8de6d5)]"
                    animate={{ width: progressWidth }}
                    transition={{ duration: prefersReducedMotion ? 0.12 : 0.55 }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {phases.map((item, index) => (
                    <PhasePill
                      key={item.id}
                      active={index === activePhase}
                      label={item.label}
                      onClick={() => setActivePhase(index)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <section className="relative z-10 border-t border-white/10 bg-[linear-gradient(180deg,rgba(6,8,14,0.94),rgba(4,3,10,1))] px-6 pb-24 pt-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-7">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[#f2c78f]/76">
              Construction Notes
            </p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl text-[#fff7e2]">
              One hero moment, multiple motion systems.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/64">
              The page stacks three kinds of movement instead of relying on a single gimmick:
              autonomous phase choreography, cursor-linked parallax and tilt, and a scroll-bound
              stage compression that makes the whole machine feel mounted in physical space.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/42">
                Motion stack
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-white/62">
                <li>Phase loop reconfigures shards, rings, beams, and copy every 2.4 seconds.</li>
                <li>Pointer tracking feeds tilt, drift, and a dynamic radial light field.</li>
                <li>Scroll progress compresses the entire hero so the page exits like a machine retracting.</li>
              </ul>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/42">
                Accessibility
              </p>
              <p className="mt-4 text-sm leading-7 text-white/62">
                `prefers-reduced-motion` disables the auto-cycle and pointer travel, then lands the
                page in the resolved bloom phase with the same typography, hierarchy, and color
                treatment still intact.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
