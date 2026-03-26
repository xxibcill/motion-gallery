"use client";

import type { ReactNode } from "react";
import { startTransition, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
} from "motion/react";
import { GradientVeil } from "@/components/transition-lab/GradientVeil";
import { SceneFrame } from "@/components/transition-lab/SceneFrame";
import { ShowcaseController } from "@/components/transition-lab/ShowcaseController";
import { SharedElementShell } from "@/components/transition-lab/SharedElementShell";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import {
  transitionLabDurations,
  transitionLabEasings,
} from "@/lib/animation-presets";

const showcaseScene = {
  eyebrow: "Shared Scene Contract",
  title: "One scene. Ten transition signatures.",
  body:
    "The content stays fixed while the transition system changes around it. That makes timing, direction, and emotional weight easy to compare without resetting the stage.",
  chips: [
    "Single shell",
    "Replayable",
    "Reduced-motion ready",
  ] as const,
  metrics: [
    { label: "Modes", value: "10" },
    { label: "Replay", value: "Instant" },
    { label: "Contract", value: "Shared" },
  ] as const,
  sequence: [
    "Hold the scene structure steady.",
    "Swap the transition language, not the content.",
    "Replay at a different speed or intensity.",
  ] as const,
  detailChips: ["Control rail", "Stable content", "Route-linked demos"] as const,
};

const showcaseModes = [
  {
    id: "kinetic-panels",
    label: "Kinetic Panels",
    stageLabel: "Editorial Slam",
    summary: "Oversized slabs strike first, then the scene settles into a sharp reading order.",
    route: "/transition/kinetic-panels",
    backgroundClassName: "bg-[#130905]",
    shellClassName: "border-amber-100/12 bg-[#241108]/78",
    mediaClassName: "border-amber-100/10 bg-[#2c1409]/72",
    railClassName: "border-white/10 bg-black/28",
    gradient: {
      from: "rgba(245, 158, 11, 0.26)",
      to: "rgba(67, 29, 9, 0.96)",
      accent: "rgba(253, 230, 138, 0.18)",
    },
    mediaGlow:
      "radial-gradient(circle_at_25%_30%,rgba(255,255,255,0.34),transparent_16%),linear-gradient(180deg,rgba(245,158,11,0.26),rgba(67,29,9,0.96))",
  },
  {
    id: "liquid-reveal",
    label: "Liquid Reveal",
    stageLabel: "Elastic Bloom",
    summary: "Blurred color masses pour across the stage before the content finishes resolving.",
    route: "/transition/liquid-reveal",
    backgroundClassName:
      "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),linear-gradient(145deg,#060b18,#120919_48%,#04161c)]",
    shellClassName: "border-cyan-100/12 bg-white/[0.08]",
    mediaClassName: "border-cyan-100/12 bg-[#081521]/78",
    railClassName: "border-white/10 bg-black/24",
    gradient: {
      from: "rgba(34, 211, 238, 0.2)",
      to: "rgba(9, 20, 37, 0.96)",
      accent: "rgba(196, 181, 253, 0.16)",
    },
    mediaGlow:
      "radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.34),transparent_18%),linear-gradient(135deg,rgba(34,211,238,0.22),rgba(168,85,247,0.18),rgba(9,20,37,0.96))",
  },
  {
    id: "shutter-slice",
    label: "Shutter Slice",
    stageLabel: "Mechanical Wipe",
    summary: "The transition advances in segmented strips so the reveal feels engineered and deliberate.",
    route: "/transition/shutter-slice",
    backgroundClassName: "bg-[#0c0d12]",
    shellClassName: "border-white/12 bg-[#13151b]/88",
    mediaClassName: "border-white/12 bg-[#101319]/84",
    railClassName: "border-white/10 bg-black/28",
    gradient: {
      from: "rgba(148, 163, 184, 0.12)",
      to: "rgba(15, 23, 42, 0.96)",
      accent: "rgba(226, 232, 240, 0.12)",
    },
    mediaGlow:
      "linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.02)),linear-gradient(180deg,rgba(24,28,37,0.94),rgba(10,12,16,0.98))",
  },
  {
    id: "shared-element-spotlight",
    label: "Shared Element",
    stageLabel: "Continuity Anchor",
    summary: "A persistent hero shell survives the transition while the surrounding layout reorganizes.",
    route: "/transition/shared-element-spotlight",
    backgroundClassName: "bg-[#071018]",
    shellClassName: "border-emerald-100/12 bg-[#0f1b16]/76",
    mediaClassName: "border-emerald-100/12 bg-[#091912]/76",
    railClassName: "border-white/10 bg-black/26",
    gradient: {
      from: "rgba(16, 185, 129, 0.18)",
      to: "rgba(6, 78, 59, 0.94)",
      accent: "rgba(167, 243, 208, 0.14)",
    },
    mediaGlow:
      "radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.34),transparent_18%),linear-gradient(180deg,rgba(12,74,54,0.88),rgba(6,24,20,0.96))",
  },
  {
    id: "parallax-stage",
    label: "Parallax Stage",
    stageLabel: "Depth Shift",
    summary: "Foreground, midground, and background layers travel at different rates to imply cinematic depth.",
    route: "/transition/parallax-stage",
    backgroundClassName: "bg-[#080d1d]",
    shellClassName: "border-indigo-100/12 bg-[#121830]/76",
    mediaClassName: "border-indigo-100/10 bg-[#0d1224]/78",
    railClassName: "border-white/10 bg-black/24",
    gradient: {
      from: "rgba(99, 102, 241, 0.18)",
      to: "rgba(30, 27, 75, 0.95)",
      accent: "rgba(224, 231, 255, 0.14)",
    },
    mediaGlow:
      "radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.32),transparent_16%),linear-gradient(180deg,rgba(79,70,229,0.18),rgba(15,23,42,0.96))",
  },
  {
    id: "glitch-scan",
    label: "Glitch Scan",
    stageLabel: "Signal Break",
    summary: "Scan lines, RGB splits, and directional distortion make the reveal feel broadcast rather than soft.",
    route: "/transition/glitch-scan",
    backgroundClassName: "bg-[#15070d]",
    shellClassName: "border-rose-100/10 bg-[#240b14]/78",
    mediaClassName: "border-rose-100/10 bg-[#1b0810]/78",
    railClassName: "border-white/10 bg-black/28",
    gradient: {
      from: "rgba(244, 63, 94, 0.18)",
      to: "rgba(76, 5, 25, 0.96)",
      accent: "rgba(254, 205, 211, 0.14)",
    },
    mediaGlow:
      "radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.28),transparent_16%),linear-gradient(180deg,rgba(225,29,72,0.22),rgba(20,8,14,0.96))",
  },
  {
    id: "paper-fold",
    label: "Paper Fold",
    stageLabel: "Material Hinge",
    summary: "Physical fold planes create a tactile handoff instead of a purely digital dissolve.",
    route: "/transition/paper-fold",
    backgroundClassName: "bg-[#14100c]",
    shellClassName: "border-amber-100/10 bg-[#221912]/78",
    mediaClassName: "border-amber-100/10 bg-[#17120d]/78",
    railClassName: "border-white/10 bg-black/26",
    gradient: {
      from: "rgba(251, 191, 36, 0.14)",
      to: "rgba(69, 39, 15, 0.96)",
      accent: "rgba(254, 240, 138, 0.14)",
    },
    mediaGlow:
      "radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.32),transparent_16%),linear-gradient(180deg,rgba(250,204,21,0.18),rgba(33,24,18,0.98))",
  },
  {
    id: "magnetic-collapse",
    label: "Magnetic Collapse",
    stageLabel: "Attractor Field",
    summary: "Fragments pull into a focal point before the scene rebuilds around that same center of gravity.",
    route: "/transition/magnetic-collapse",
    backgroundClassName: "bg-[#15071a]",
    shellClassName: "border-fuchsia-100/10 bg-[#220b27]/78",
    mediaClassName: "border-fuchsia-100/10 bg-[#1a081f]/78",
    railClassName: "border-white/10 bg-black/28",
    gradient: {
      from: "rgba(217, 70, 239, 0.18)",
      to: "rgba(88, 28, 135, 0.96)",
      accent: "rgba(245, 208, 254, 0.14)",
    },
    mediaGlow:
      "radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.34),transparent_16%),linear-gradient(180deg,rgba(192,38,211,0.22),rgba(28,9,33,0.98))",
  },
  {
    id: "void-portal",
    label: "Void Portal",
    stageLabel: "Radial Consume",
    summary: "A central aperture compresses the current stage and lets the next scene appear through a controlled portal.",
    route: "/transition/void-portal",
    backgroundClassName: "bg-[#070a13]",
    shellClassName: "border-slate-100/10 bg-[#111827]/78",
    mediaClassName: "border-slate-100/10 bg-[#0c111d]/82",
    railClassName: "border-white/10 bg-black/26",
    gradient: {
      from: "rgba(148, 163, 184, 0.15)",
      to: "rgba(15, 23, 42, 0.96)",
      accent: "rgba(125, 211, 252, 0.12)",
    },
    mediaGlow:
      "radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.22),transparent_16%),linear-gradient(180deg,rgba(30,41,59,0.24),rgba(9,12,19,0.98))",
  },
  {
    id: "gallery-curtain",
    label: "Gallery Curtain",
    stageLabel: "Theatrical Sweep",
    summary: "Weighted curtains and translucent veils part in sequence so the reveal feels staged and expensive.",
    route: "/transition/gallery-curtain",
    backgroundClassName: "bg-[#15070c]",
    shellClassName: "border-amber-100/10 bg-[#221017]/78",
    mediaClassName: "border-amber-100/10 bg-[#180a10]/80",
    railClassName: "border-white/10 bg-black/28",
    gradient: {
      from: "rgba(244, 63, 94, 0.18)",
      to: "rgba(56, 7, 16, 0.96)",
      accent: "rgba(251, 191, 36, 0.14)",
    },
    mediaGlow:
      "radial-gradient(circle_at_32%_30%,rgba(255,255,255,0.32),transparent_16%),linear-gradient(180deg,rgba(122,18,39,0.34),rgba(32,10,16,0.98))",
  },
] as const;

const speedOptions = [
  {
    value: "measured",
    label: "Measured",
    durationMultiplier: 1.15,
  },
  {
    value: "studio",
    label: "Studio",
    durationMultiplier: 1,
  },
  {
    value: "rapid",
    label: "Rapid",
    durationMultiplier: 0.8,
  },
] as const;

const intensityOptions = [
  {
    value: "soft",
    label: "Soft",
    distanceMultiplier: 0.78,
  },
  {
    value: "balanced",
    label: "Balanced",
    distanceMultiplier: 1,
  },
  {
    value: "charged",
    label: "Charged",
    distanceMultiplier: 1.32,
  },
] as const;

type ShowcaseMode = (typeof showcaseModes)[number];
type ShowcaseModeId = ShowcaseMode["id"];
type SpeedOption = (typeof speedOptions)[number];
type SpeedId = SpeedOption["value"];
type IntensityOption = (typeof intensityOptions)[number];
type IntensityId = IntensityOption["value"];

interface MotionProfile {
  speed: SpeedOption;
  intensity: IntensityOption;
}

interface SurfaceMotion {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit?: TargetAndTransition;
  transition: Transition;
}

interface ShowcaseLayoutProps {
  mode: ShowcaseMode;
  motionProfile: MotionProfile;
  replayKey: number;
  heroMotion: SurfaceMotion;
  mediaMotion: SurfaceMotion;
  railMotion: SurfaceMotion;
  overlay?: ReactNode;
}

function getSpeedOption(value: SpeedId): SpeedOption {
  return speedOptions.find((option) => option.value === value) ?? speedOptions[1];
}

function getIntensityOption(value: IntensityId): IntensityOption {
  return (
    intensityOptions.find((option) => option.value === value) ??
    intensityOptions[1]
  );
}

function getDuration(
  prefersReducedMotion: boolean,
  value: number,
  motionProfile: MotionProfile
) {
  if (prefersReducedMotion) {
    return transitionLabDurations.brisk;
  }

  return value * motionProfile.speed.durationMultiplier;
}

function getDelay(
  prefersReducedMotion: boolean,
  value: number,
  motionProfile: MotionProfile
) {
  if (prefersReducedMotion) {
    return 0;
  }

  return value * motionProfile.speed.durationMultiplier;
}

function getDistance(
  prefersReducedMotion: boolean,
  value: number,
  motionProfile: MotionProfile
) {
  if (prefersReducedMotion) {
    return 0;
  }

  return value * motionProfile.intensity.distanceMultiplier;
}

function createSurfaceMotion(
  prefersReducedMotion: boolean,
  motionProfile: MotionProfile,
  config: {
    x?: number;
    y?: number;
    rotate?: number;
    scale?: number;
    delay?: number;
    duration?: number;
    ease?: Transition["ease"];
    exitX?: number;
    exitY?: number;
    exitRotate?: number;
    exitOpacity?: number;
  }
): SurfaceMotion {
  return {
    initial: {
      opacity: 0,
      x: getDistance(prefersReducedMotion, config.x ?? 0, motionProfile),
      y: getDistance(prefersReducedMotion, config.y ?? 0, motionProfile),
      rotate: prefersReducedMotion ? 0 : (config.rotate ?? 0),
      scale: prefersReducedMotion ? 1 : (config.scale ?? 0.98),
    },
    animate: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
    exit: {
      opacity: config.exitOpacity ?? (prefersReducedMotion ? 0 : 0.16),
      x: getDistance(prefersReducedMotion, config.exitX ?? 0, motionProfile),
      y: getDistance(prefersReducedMotion, config.exitY ?? 0, motionProfile),
      rotate: prefersReducedMotion ? 0 : (config.exitRotate ?? 0),
    },
    transition: {
      duration: getDuration(
        prefersReducedMotion,
        config.duration ?? transitionLabDurations.base,
        motionProfile
      ),
      delay: getDelay(prefersReducedMotion, config.delay ?? 0, motionProfile),
      ease: config.ease ?? transitionLabEasings.emphasis,
    },
  };
}

function ShowcaseLayout({
  mode,
  motionProfile,
  replayKey,
  heroMotion,
  mediaMotion,
  railMotion,
  overlay,
}: ShowcaseLayoutProps) {
  return (
    <LayoutGroup id={`showcase-${mode.id}-${replayKey}`}>
      <div className="relative min-h-[35rem] overflow-hidden p-4 sm:p-6 lg:p-7">
        {overlay}
        <div className="relative z-10 grid min-h-[31rem] gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(18rem,0.88fr)] xl:grid-rows-[auto_1fr]">
          <motion.div
            className="xl:row-span-2"
            initial={heroMotion.initial}
            animate={heroMotion.animate}
            exit={heroMotion.exit}
            transition={heroMotion.transition}
          >
            <SharedElementShell
              layoutId="transition-showcase-shell"
              label={showcaseScene.eyebrow}
              title={showcaseScene.title}
              className={`h-full ${mode.shellClassName}`}
            >
              <motion.div layoutId="transition-showcase-copy" className="space-y-5">
                <p className="max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                  {showcaseScene.body}
                </p>
                <div className="flex flex-wrap gap-2">
                  {showcaseScene.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/56"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {showcaseScene.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4"
                    >
                      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/42">
                        {metric.label}
                      </p>
                      <p className="mt-2 text-xl text-white">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </SharedElementShell>
          </motion.div>

          <motion.div
            className={`overflow-hidden rounded-[1.75rem] border p-5 backdrop-blur-md ${mode.mediaClassName}`}
            initial={mediaMotion.initial}
            animate={mediaMotion.animate}
            exit={mediaMotion.exit}
            transition={mediaMotion.transition}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full border border-white/12 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-white/56">
                {mode.stageLabel}
              </span>
              <span className="text-xs uppercase tracking-[0.22em] text-white/44">
                {motionProfile.speed.label} / {motionProfile.intensity.label}
              </span>
            </div>
            <motion.div
              layoutId="transition-showcase-media"
              className="mt-5 h-48 rounded-[1.6rem] border border-white/10"
              style={{ backgroundImage: mode.mediaGlow }}
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {showcaseScene.detailChips.map((chip) => (
                <div
                  key={chip}
                  className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-3 text-sm text-white/66"
                >
                  {chip}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.aside
            className={`rounded-[1.75rem] border p-5 text-sm text-white/66 backdrop-blur-md ${mode.railClassName}`}
            initial={railMotion.initial}
            animate={railMotion.animate}
            exit={railMotion.exit}
            transition={railMotion.transition}
          >
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">
              Mode brief
            </p>
            <p className="mt-4 leading-6 text-white/72">{mode.summary}</p>
            <ol className="mt-5 space-y-3 leading-6">
              {showcaseScene.sequence.map((item, index) => (
                <li key={item}>
                  {index + 1}. {item}
                </li>
              ))}
            </ol>
            <div className="mt-5 rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/42">
                Route pair
              </p>
              <p className="mt-2 text-white">{mode.route}</p>
            </div>
          </motion.aside>
        </div>
      </div>
    </LayoutGroup>
  );
}

function renderKineticPanels(
  mode: ShowcaseMode,
  motionProfile: MotionProfile,
  prefersReducedMotion: boolean,
  replayKey: number
) {
  return (
    <ShowcaseLayout
      mode={mode}
      motionProfile={motionProfile}
      replayKey={replayKey}
      heroMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: -220,
        y: 36,
        rotate: -3,
        duration: transitionLabDurations.base,
      })}
      mediaMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: 180,
        y: -80,
        delay: 0.08,
        duration: transitionLabDurations.slow,
        ease: transitionLabEasings.curtain,
      })}
      railMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: 210,
        y: 42,
        delay: 0.16,
        duration: transitionLabDurations.slow,
      })}
      overlay={
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {[
            "left-0 top-12 h-24 w-[28%] bg-[#f59e0b]",
            "right-[-4%] top-[32%] h-32 w-[35%] bg-[#f97316]",
            "left-[16%] bottom-0 h-24 w-[42%] bg-[#fb923c]",
          ].map((className, index) => (
            <motion.div
              key={className}
              className={`absolute rounded-[1.5rem] opacity-70 ${className}`}
              initial={{
                opacity: 0,
                x: getDistance(
                  prefersReducedMotion,
                  index === 0 ? -200 : index === 1 ? 220 : 0,
                  motionProfile
                ),
                y: getDistance(
                  prefersReducedMotion,
                  index === 2 ? 120 : index === 0 ? 20 : -40,
                  motionProfile
                ),
              }}
              animate={{ opacity: prefersReducedMotion ? 0.16 : 0.72, x: 0, y: 0 }}
              transition={{
                duration: getDuration(
                  prefersReducedMotion,
                  transitionLabDurations.base,
                  motionProfile
                ),
                delay: getDelay(prefersReducedMotion, index * 0.06, motionProfile),
                ease: transitionLabEasings.emphasis,
              }}
            />
          ))}
        </div>
      }
    />
  );
}

function renderLiquidReveal(
  mode: ShowcaseMode,
  motionProfile: MotionProfile,
  prefersReducedMotion: boolean,
  replayKey: number
) {
  const blobColors = [
    "rgba(34, 211, 238, 0.34)",
    "rgba(168, 85, 247, 0.26)",
    "rgba(244, 114, 182, 0.22)",
  ];

  return (
    <ShowcaseLayout
      mode={mode}
      motionProfile={motionProfile}
      replayKey={replayKey}
      heroMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: 30,
        scale: 0.96,
        delay: 0.12,
        duration: transitionLabDurations.slow,
        ease: transitionLabEasings.fluid,
      })}
      mediaMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: 34,
        delay: 0.24,
        duration: transitionLabDurations.base,
        ease: transitionLabEasings.fluid,
      })}
      railMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: 34,
        delay: 0.3,
        duration: transitionLabDurations.base,
      })}
      overlay={
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {blobColors.map((color, index) => (
            <motion.div
              key={color}
              className={`absolute rounded-[46%_54%_58%_42%/40%_36%_64%_60%] blur-3xl ${
                index === 0
                  ? "-left-16 top-12 h-64 w-64"
                  : index === 1
                    ? "right-10 top-10 h-56 w-56"
                    : "bottom-[-4rem] left-1/3 h-72 w-72"
              }`}
              style={{ background: color }}
              initial={{
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.25,
              }}
              animate={{
                opacity: prefersReducedMotion ? 0.18 : 0.9,
                scale: 1,
              }}
              transition={{
                duration: getDuration(
                  prefersReducedMotion,
                  transitionLabDurations.linger,
                  motionProfile
                ),
                delay: getDelay(prefersReducedMotion, index * 0.12, motionProfile),
                ease: transitionLabEasings.fluid,
              }}
            />
          ))}
        </div>
      }
    />
  );
}

function renderShutterSlice(
  mode: ShowcaseMode,
  motionProfile: MotionProfile,
  prefersReducedMotion: boolean,
  replayKey: number
) {
  return (
    <ShowcaseLayout
      mode={mode}
      motionProfile={motionProfile}
      replayKey={replayKey}
      heroMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: 18,
        duration: transitionLabDurations.base,
      })}
      mediaMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: 24,
        delay: 0.16,
        duration: transitionLabDurations.base,
      })}
      railMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: 18,
        delay: 0.22,
        duration: transitionLabDurations.base,
      })}
      overlay={
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex">
          {Array.from({ length: 7 }).map((_, index) => (
            <motion.div
              key={index}
              className="h-full flex-1 border-r border-white/6 bg-white/[0.06]"
              initial={{
                x: getDistance(
                  prefersReducedMotion,
                  index % 2 === 0 ? -140 : 140,
                  motionProfile
                ),
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: prefersReducedMotion ? 0.06 : 0.24,
              }}
              transition={{
                duration: getDuration(
                  prefersReducedMotion,
                  transitionLabDurations.base,
                  motionProfile
                ),
                delay: getDelay(prefersReducedMotion, index * 0.04, motionProfile),
                ease: transitionLabEasings.curtain,
              }}
            />
          ))}
        </div>
      }
    />
  );
}

function renderSharedElementSpotlight(
  mode: ShowcaseMode,
  motionProfile: MotionProfile,
  prefersReducedMotion: boolean,
  replayKey: number
) {
  return (
    <ShowcaseLayout
      mode={mode}
      motionProfile={motionProfile}
      replayKey={replayKey}
      heroMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: 18,
        duration: transitionLabDurations.base,
      })}
      mediaMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: 18,
        scale: 0.94,
        delay: 0.1,
        duration: transitionLabDurations.base,
        ease: transitionLabEasings.emphasis,
      })}
      railMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: 20,
        delay: 0.16,
        duration: transitionLabDurations.base,
      })}
      overlay={
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/10"
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.72 }}
          animate={{ opacity: prefersReducedMotion ? 0.08 : 0.28, scale: 1 }}
          transition={{
            duration: getDuration(
              prefersReducedMotion,
              transitionLabDurations.slow,
              motionProfile
            ),
            ease: transitionLabEasings.emphasis,
          }}
        />
      }
    />
  );
}

function renderParallaxStage(
  mode: ShowcaseMode,
  motionProfile: MotionProfile,
  prefersReducedMotion: boolean,
  replayKey: number
) {
  return (
    <ShowcaseLayout
      mode={mode}
      motionProfile={motionProfile}
      replayKey={replayKey}
      heroMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: 32,
        duration: transitionLabDurations.slow,
      })}
      mediaMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: 18,
        scale: 0.95,
        delay: 0.14,
        duration: transitionLabDurations.base,
      })}
      railMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: 10,
        delay: 0.2,
        duration: transitionLabDurations.base,
      })}
      overlay={
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute inset-x-[-6rem] top-[-4rem] h-44 rounded-full bg-indigo-400/16 blur-3xl"
            initial={{ y: getDistance(prefersReducedMotion, -40, motionProfile), opacity: 0 }}
            animate={{ y: 0, opacity: prefersReducedMotion ? 0.12 : 0.32 }}
            transition={{
              duration: getDuration(
                prefersReducedMotion,
                transitionLabDurations.linger,
                motionProfile
              ),
              ease: transitionLabEasings.fluid,
            }}
          />
          <motion.div
            className="absolute left-12 top-20 h-40 w-40 rounded-full bg-indigo-200/10 blur-2xl"
            initial={{ y: getDistance(prefersReducedMotion, -80, motionProfile), opacity: 0 }}
            animate={{ y: 0, opacity: prefersReducedMotion ? 0.08 : 0.22 }}
            transition={{
              duration: getDuration(
                prefersReducedMotion,
                transitionLabDurations.slow,
                motionProfile
              ),
              delay: getDelay(prefersReducedMotion, 0.06, motionProfile),
            }}
          />
          <motion.div
            className="absolute bottom-14 right-10 h-56 w-56 rounded-full bg-sky-300/10 blur-3xl"
            initial={{ y: getDistance(prefersReducedMotion, 90, motionProfile), opacity: 0 }}
            animate={{ y: 0, opacity: prefersReducedMotion ? 0.08 : 0.24 }}
            transition={{
              duration: getDuration(
                prefersReducedMotion,
                transitionLabDurations.linger,
                motionProfile
              ),
              delay: getDelay(prefersReducedMotion, 0.12, motionProfile),
            }}
          />
        </div>
      }
    />
  );
}

function renderGlitchScan(
  mode: ShowcaseMode,
  motionProfile: MotionProfile,
  prefersReducedMotion: boolean,
  replayKey: number
) {
  return (
    <ShowcaseLayout
      mode={mode}
      motionProfile={motionProfile}
      replayKey={replayKey}
      heroMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: -24,
        duration: transitionLabDurations.base,
      })}
      mediaMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: 38,
        delay: 0.12,
        duration: transitionLabDurations.base,
      })}
      railMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: 30,
        delay: 0.18,
        duration: transitionLabDurations.base,
      })}
      overlay={
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_9px)] opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: prefersReducedMotion ? 0.08 : 0.22 }}
            transition={{ duration: transitionLabDurations.brisk }}
          />
          {prefersReducedMotion ? null : (
            <>
              <motion.div
                className="absolute inset-x-0 top-[28%] h-8 bg-cyan-300/16 mix-blend-screen"
                initial={{ x: -160, opacity: 0 }}
                animate={{ x: 180, opacity: [0, 0.7, 0] }}
                transition={{
                  duration: getDuration(
                    false,
                    transitionLabDurations.base,
                    motionProfile
                  ),
                  ease: transitionLabEasings.emphasis,
                }}
              />
              <motion.div
                className="absolute inset-x-0 top-[44%] h-5 bg-rose-400/14 mix-blend-screen"
                initial={{ x: 160, opacity: 0 }}
                animate={{ x: -160, opacity: [0, 0.52, 0] }}
                transition={{
                  duration: getDuration(
                    false,
                    transitionLabDurations.base,
                    motionProfile
                  ),
                  delay: getDelay(false, 0.08, motionProfile),
                  ease: transitionLabEasings.emphasis,
                }}
              />
            </>
          )}
        </div>
      }
    />
  );
}

function renderPaperFold(
  mode: ShowcaseMode,
  motionProfile: MotionProfile,
  prefersReducedMotion: boolean,
  replayKey: number
) {
  return (
    <ShowcaseLayout
      mode={mode}
      motionProfile={motionProfile}
      replayKey={replayKey}
      heroMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: 24,
        rotate: -1.5,
        duration: transitionLabDurations.base,
      })}
      mediaMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: -18,
        rotate: 1.2,
        delay: 0.14,
        duration: transitionLabDurations.base,
      })}
      railMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: 22,
        delay: 0.2,
        duration: transitionLabDurations.base,
      })}
      overlay={
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute inset-x-12 top-0 h-1/2 origin-top rounded-b-[2rem] border border-white/6 bg-white/[0.05]"
            initial={{ rotateX: prefersReducedMotion ? 0 : -84, opacity: 0 }}
            animate={{ rotateX: 0, opacity: prefersReducedMotion ? 0.06 : 0.22 }}
            transition={{
              duration: getDuration(
                prefersReducedMotion,
                transitionLabDurations.base,
                motionProfile
              ),
              ease: transitionLabEasings.curtain,
            }}
          />
          <motion.div
            className="absolute inset-x-16 bottom-8 h-40 origin-bottom rounded-t-[1.75rem] border border-white/6 bg-black/20"
            initial={{ rotateX: prefersReducedMotion ? 0 : 88, opacity: 0 }}
            animate={{ rotateX: 0, opacity: prefersReducedMotion ? 0.05 : 0.18 }}
            transition={{
              duration: getDuration(
                prefersReducedMotion,
                transitionLabDurations.slow,
                motionProfile
              ),
              delay: getDelay(prefersReducedMotion, 0.08, motionProfile),
              ease: transitionLabEasings.curtain,
            }}
          />
        </div>
      }
    />
  );
}

function renderMagneticCollapse(
  mode: ShowcaseMode,
  motionProfile: MotionProfile,
  prefersReducedMotion: boolean,
  replayKey: number
) {
  const points = [
    { x: "12%", y: "20%", deltaX: 140, deltaY: 96 },
    { x: "24%", y: "72%", deltaX: 104, deltaY: -112 },
    { x: "38%", y: "28%", deltaX: 56, deltaY: 72 },
    { x: "52%", y: "78%", deltaX: -28, deltaY: -144 },
    { x: "66%", y: "18%", deltaX: -88, deltaY: 102 },
    { x: "78%", y: "62%", deltaX: -128, deltaY: -78 },
    { x: "88%", y: "34%", deltaX: -164, deltaY: 40 },
  ];

  return (
    <ShowcaseLayout
      mode={mode}
      motionProfile={motionProfile}
      replayKey={replayKey}
      heroMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        scale: 0.97,
        duration: transitionLabDurations.base,
      })}
      mediaMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: 24,
        delay: 0.12,
        duration: transitionLabDurations.base,
      })}
      railMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: 26,
        delay: 0.18,
        duration: transitionLabDurations.base,
      })}
      overlay={
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-300/12 blur-3xl"
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.3 }}
            animate={{ opacity: prefersReducedMotion ? 0.08 : 0.24, scale: 1 }}
            transition={{
              duration: getDuration(
                prefersReducedMotion,
                transitionLabDurations.base,
                motionProfile
              ),
            }}
          />
          {points.map((point, index) => (
            <motion.span
              key={`${point.x}-${point.y}`}
              className="absolute h-2.5 w-2.5 rounded-full bg-fuchsia-200/80"
              style={{ left: point.x, top: point.y }}
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
              }}
              animate={{
                x: getDistance(prefersReducedMotion, point.deltaX, motionProfile),
                y: getDistance(prefersReducedMotion, point.deltaY, motionProfile),
                opacity: prefersReducedMotion ? 0.08 : [0, 0.9, 0.15],
              }}
              transition={{
                duration: getDuration(
                  prefersReducedMotion,
                  transitionLabDurations.slow,
                  motionProfile
                ),
                delay: getDelay(prefersReducedMotion, index * 0.03, motionProfile),
                ease: transitionLabEasings.emphasis,
              }}
            />
          ))}
        </div>
      }
    />
  );
}

function renderVoidPortal(
  mode: ShowcaseMode,
  motionProfile: MotionProfile,
  prefersReducedMotion: boolean,
  replayKey: number
) {
  return (
    <ShowcaseLayout
      mode={mode}
      motionProfile={motionProfile}
      replayKey={replayKey}
      heroMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        scale: 0.94,
        duration: transitionLabDurations.base,
      })}
      mediaMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: 30,
        delay: 0.18,
        duration: transitionLabDurations.base,
      })}
      railMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: 30,
        delay: 0.24,
        duration: transitionLabDurations.base,
      })}
      overlay={
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/10"
            initial={{
              clipPath: prefersReducedMotion
                ? "circle(100% at 50% 50%)"
                : "circle(0% at 50% 50%)",
              opacity: 0,
            }}
            animate={{
              clipPath: "circle(100% at 50% 50%)",
              opacity: prefersReducedMotion ? 0.08 : 0.32,
            }}
            transition={{
              duration: getDuration(
                prefersReducedMotion,
                transitionLabDurations.linger,
                motionProfile
              ),
              ease: transitionLabEasings.curtain,
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-950"
            initial={{ scale: prefersReducedMotion ? 1 : 0.2, opacity: 0 }}
            animate={{
              scale: prefersReducedMotion ? 1 : [0.2, 0.92, 1.08, 1],
              opacity: prefersReducedMotion ? 0.12 : [0, 0.95, 0.72, 0.48],
            }}
            transition={{
              duration: getDuration(
                prefersReducedMotion,
                transitionLabDurations.slow,
                motionProfile
              ),
              ease: transitionLabEasings.emphasis,
            }}
          />
        </div>
      }
    />
  );
}

function renderGalleryCurtain(
  mode: ShowcaseMode,
  motionProfile: MotionProfile,
  prefersReducedMotion: boolean,
  replayKey: number
) {
  return (
    <ShowcaseLayout
      mode={mode}
      motionProfile={motionProfile}
      replayKey={replayKey}
      heroMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: 18,
        delay: 0.32,
        duration: transitionLabDurations.base,
      })}
      mediaMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        x: 24,
        delay: 0.42,
        duration: transitionLabDurations.base,
      })}
      railMotion={createSurfaceMotion(prefersReducedMotion, motionProfile, {
        y: 20,
        delay: 0.48,
        duration: transitionLabDurations.base,
      })}
      overlay={
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 w-[52%] bg-[linear-gradient(180deg,rgba(122,18,39,0.98),rgba(74,7,25,0.98))]"
            initial={{ x: 0 }}
            animate={{ x: getDistance(prefersReducedMotion, -220, motionProfile) }}
            transition={{
              duration: getDuration(
                prefersReducedMotion,
                transitionLabDurations.linger,
                motionProfile
              ),
              ease: transitionLabEasings.curtain,
            }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-[52%] bg-[linear-gradient(180deg,rgba(94,15,31,0.98),rgba(54,6,19,0.98))]"
            initial={{ x: 0 }}
            animate={{ x: getDistance(prefersReducedMotion, 220, motionProfile) }}
            transition={{
              duration: getDuration(
                prefersReducedMotion,
                transitionLabDurations.linger,
                motionProfile
              ),
              ease: transitionLabEasings.curtain,
            }}
          />
          <motion.div
            className="absolute inset-y-0 left-[18%] w-[64%] bg-[linear-gradient(180deg,rgba(245,208,122,0.22),rgba(191,69,93,0.06))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: prefersReducedMotion ? 0.05 : 0.22 }}
            transition={{
              duration: getDuration(
                prefersReducedMotion,
                transitionLabDurations.slow,
                motionProfile
              ),
              delay: getDelay(prefersReducedMotion, 0.08, motionProfile),
            }}
          />
        </div>
      }
    />
  );
}

function renderShowcaseMode(
  mode: ShowcaseMode,
  motionProfile: MotionProfile,
  prefersReducedMotion: boolean,
  replayKey: number
) {
  switch (mode.id) {
    case "kinetic-panels":
      return renderKineticPanels(mode, motionProfile, prefersReducedMotion, replayKey);
    case "liquid-reveal":
      return renderLiquidReveal(mode, motionProfile, prefersReducedMotion, replayKey);
    case "shutter-slice":
      return renderShutterSlice(mode, motionProfile, prefersReducedMotion, replayKey);
    case "shared-element-spotlight":
      return renderSharedElementSpotlight(
        mode,
        motionProfile,
        prefersReducedMotion,
        replayKey
      );
    case "parallax-stage":
      return renderParallaxStage(mode, motionProfile, prefersReducedMotion, replayKey);
    case "glitch-scan":
      return renderGlitchScan(mode, motionProfile, prefersReducedMotion, replayKey);
    case "paper-fold":
      return renderPaperFold(mode, motionProfile, prefersReducedMotion, replayKey);
    case "magnetic-collapse":
      return renderMagneticCollapse(mode, motionProfile, prefersReducedMotion, replayKey);
    case "void-portal":
      return renderVoidPortal(mode, motionProfile, prefersReducedMotion, replayKey);
    case "gallery-curtain":
      return renderGalleryCurtain(mode, motionProfile, prefersReducedMotion, replayKey);
    default:
      return null;
  }
}

export function TransitionShowcase() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [activeModeId, setActiveModeId] = useState<ShowcaseModeId>(showcaseModes[0].id);
  const [activeSpeedId, setActiveSpeedId] = useState<SpeedId>(speedOptions[1].value);
  const [activeIntensityId, setActiveIntensityId] = useState<IntensityId>(
    intensityOptions[1].value
  );
  const [replayKey, setReplayKey] = useState(0);

  const activeMode =
    showcaseModes.find((mode) => mode.id === activeModeId) ?? showcaseModes[0];
  const motionProfile: MotionProfile = {
    speed: getSpeedOption(activeSpeedId),
    intensity: getIntensityOption(activeIntensityId),
  };
  const stageKey = `${activeMode.id}-${activeSpeedId}-${activeIntensityId}-${replayKey}`;

  function restartScene() {
    startTransition(() => {
      setReplayKey((value) => value + 1);
    });
  }

  function selectMode(nextMode: ShowcaseModeId) {
    startTransition(() => {
      setActiveModeId(nextMode);
      setReplayKey((value) => value + 1);
    });
  }

  function selectSpeed(nextSpeed: SpeedId) {
    startTransition(() => {
      setActiveSpeedId(nextSpeed);
      setReplayKey((value) => value + 1);
    });
  }

  function selectIntensity(nextIntensity: IntensityId) {
    startTransition(() => {
      setActiveIntensityId(nextIntensity);
      setReplayKey((value) => value + 1);
    });
  }

  return (
    <SceneFrame
      eyebrow="Task 14"
      title="Transition Showcase"
      description="The flagship lab route keeps one scene architecture fixed and lets every transition mode take a turn around it. Use the shared controller to compare direction, drag, tempo, and atmosphere without navigating away."
      aside={
        <div className="space-y-4">
          <p className="text-sm leading-6 text-white/68">
            This route is the comparison bench for the section. The stage,
            controller, and content contract stay stable while the transition
            language changes.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "10 linked modes",
              "Replayable controls",
              "Reduced-motion fallback",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-3 text-center text-xs uppercase tracking-[0.22em] text-white/52"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <ShowcaseController
        modeOptions={showcaseModes.map((mode) => ({
          value: mode.id,
          label: mode.label,
        }))}
        activeMode={activeModeId}
        onModeSelect={selectMode}
        speedOptions={speedOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        activeSpeed={activeSpeedId}
        onSpeedSelect={selectSpeed}
        intensityOptions={intensityOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        activeIntensity={activeIntensityId}
        onIntensitySelect={selectIntensity}
        replayLabel="Replay stage"
        onReplay={restartScene}
        replayHint="Replays the current mode using the selected speed and intensity."
        reducedMotionEnabled={prefersReducedMotion}
        activeModeSummary={activeMode.summary}
      />

      <TransitionStage
        className="min-h-[35rem]"
        backgroundClassName={activeMode.backgroundClassName}
        overlays={
          <GradientVeil
            from={activeMode.gradient.from}
            to={activeMode.gradient.to}
            accent={activeMode.gradient.accent}
          />
        }
        chrome={
          <div className="flex h-full items-start justify-between gap-4 p-4 text-[0.65rem] uppercase tracking-[0.3em] text-white/36 sm:p-5">
            <span>{activeMode.stageLabel}</span>
            <span>{prefersReducedMotion ? "Fallback tuned" : activeMode.label}</span>
          </div>
        }
        noiseOpacity={0.08}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stageKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 0 : 0.18 }}
            transition={{
              duration: getDuration(
                prefersReducedMotion,
                transitionLabDurations.base,
                motionProfile
              ),
            }}
          >
            {renderShowcaseMode(
              activeMode,
              motionProfile,
              prefersReducedMotion,
              replayKey
            )}
          </motion.div>
        </AnimatePresence>
      </TransitionStage>
    </SceneFrame>
  );
}
