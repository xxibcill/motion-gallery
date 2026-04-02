"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { AnimationMeta } from "@/lib/animation-registry";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import { GradientVeil } from "@/components/transition-lab/GradientVeil";

const cardTones: Record<string, { stage: string; from: string; to: string; accent: string }> = {
  cyan: {
    stage: "bg-[#04131d]",
    from: "rgba(14, 116, 144, 0.72)",
    to: "rgba(8, 47, 73, 0.96)",
    accent: "rgba(103, 232, 249, 0.18)",
  },
  amber: {
    stage: "bg-[#1a1106]",
    from: "rgba(217, 119, 6, 0.76)",
    to: "rgba(120, 53, 15, 0.96)",
    accent: "rgba(253, 230, 138, 0.18)",
  },
  violet: {
    stage: "bg-[#13081f]",
    from: "rgba(124, 58, 237, 0.68)",
    to: "rgba(59, 7, 100, 0.96)",
    accent: "rgba(221, 214, 254, 0.2)",
  },
  emerald: {
    stage: "bg-[#051912]",
    from: "rgba(5, 150, 105, 0.72)",
    to: "rgba(6, 78, 59, 0.96)",
    accent: "rgba(167, 243, 208, 0.2)",
  },
  indigo: {
    stage: "bg-[#0b1024]",
    from: "rgba(67, 56, 202, 0.7)",
    to: "rgba(30, 27, 75, 0.96)",
    accent: "rgba(199, 210, 254, 0.2)",
  },
  rose: {
    stage: "bg-[#1b0911]",
    from: "rgba(225, 29, 72, 0.72)",
    to: "rgba(76, 5, 25, 0.96)",
    accent: "rgba(254, 205, 211, 0.18)",
  },
  fuchsia: {
    stage: "bg-[#190718]",
    from: "rgba(192, 38, 211, 0.72)",
    to: "rgba(74, 4, 78, 0.96)",
    accent: "rgba(245, 208, 254, 0.2)",
  },
  slate: {
    stage: "bg-[#090d16]",
    from: "rgba(51, 65, 85, 0.76)",
    to: "rgba(15, 23, 42, 0.96)",
    accent: "rgba(226, 232, 240, 0.14)",
  },
  zinc: {
    stage: "bg-[#111111]",
    from: "rgba(63, 63, 70, 0.74)",
    to: "rgba(9, 9, 11, 0.96)",
    accent: "rgba(244, 244, 245, 0.12)",
  },
};

function getCardTone(color: string) {
  return cardTones[color] ?? cardTones.slate;
}

type PreviewSlug =
  | "kinetic-panels"
  | "liquid-reveal"
  | "shutter-slice"
  | "shared-element-spotlight"
  | "parallax-stage"
  | "glitch-scan"
  | "paper-fold"
  | "magnetic-collapse"
  | "void-portal"
  | "gallery-curtain"
  | "dimensional-rift";

function getPreviewSlug(path: string): PreviewSlug | null {
  const slug = path.split("/").at(-1);
  if (
    slug === "kinetic-panels" ||
    slug === "liquid-reveal" ||
    slug === "shutter-slice" ||
    slug === "shared-element-spotlight" ||
    slug === "parallax-stage" ||
    slug === "glitch-scan" ||
    slug === "paper-fold" ||
    slug === "magnetic-collapse" ||
    slug === "void-portal" ||
    slug === "gallery-curtain" ||
    slug === "dimensional-rift"
  ) {
    return slug;
  }
  return null;
}

function roundPreviewCoordinate(value: number) {
  return Math.round(value * 10_000) / 10_000;
}

interface TransitionPreviewProps {
  slug: PreviewSlug;
  isHovered: boolean;
  prefersReducedMotion: boolean;
}

function TransitionPreview({ slug, isHovered, prefersReducedMotion }: TransitionPreviewProps) {
  const noMotion = prefersReducedMotion;
  const active = isHovered && !noMotion;

  const base = "absolute inset-0 overflow-hidden rounded-[2rem]";

  switch (slug) {
    case "kinetic-panels":
      return (
        <div className={base}>
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-amber-500/20"
            initial={{ x: "-100%" }}
            animate={active ? { x: "0%" } : { x: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-amber-500/15"
            initial={{ x: "100%" }}
            animate={active ? { x: "0%" } : { x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          />
        </div>
      );

    case "liquid-reveal":
      return (
        <div className={base}>
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.35), transparent)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={active ? { scale: 1.6, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      );

    case "shutter-slice":
      return (
        <div className={`${base} flex flex-col`}>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="flex-1 bg-zinc-500/20"
              initial={{ scaleX: 0 }}
              animate={active ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.06,
              }}
              style={{ transformOrigin: "left" }}
            />
          ))}
        </div>
      );

    case "shared-element-spotlight":
      return (
        <div className={base}>
          <motion.div
            className="absolute left-1/2 top-1/2 h-12 w-16 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-emerald-500/25 border border-emerald-400/30"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={
              active
                ? { scale: [0.5, 1.2, 1], opacity: [0, 1, 1], x: [0, -20, 0], y: [0, 10, 0] }
                : { scale: 0.5, opacity: 0 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      );

    case "parallax-stage":
      return (
        <div className={base}>
          <motion.div
            className="absolute inset-0 bg-indigo-500/10"
            animate={active ? { x: -8 } : { x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 bg-indigo-500/15"
            animate={active ? { x: 16 } : { x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          />
          <motion.div
            className="absolute inset-0 bg-indigo-400/10"
            animate={active ? { x: 32 } : { x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          />
        </div>
      );

    case "glitch-scan":
      return (
        <div className={base}>
          {active && (
            <>
              <motion.div
                className="absolute inset-0 bg-rose-500/15"
                animate={{ x: [0, -3, 3, -2, 0] }}
                transition={{ duration: 0.3, repeat: 2 }}
              />
              <motion.div
                className="absolute inset-0 bg-cyan-500/10"
                animate={{ x: [0, 3, -3, 2, 0] }}
                transition={{ duration: 0.3, repeat: 2, delay: 0.02 }}
              />
            </>
          )}
        </div>
      );

    case "paper-fold":
      return (
        <div className={base}>
          <motion.div
            className="absolute inset-0 origin-left"
            style={{
              background:
                "linear-gradient(90deg, rgba(217,119,6,0.3), rgba(217,119,6,0.05))",
              perspective: 600,
            }}
            initial={{ rotateY: 0 }}
            animate={active ? { rotateY: -90 } : { rotateY: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      );

    case "magnetic-collapse":
      return (
        <div className={base}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2;
            const x = roundPreviewCoordinate(Math.cos(angle) * 50);
            const y = roundPreviewCoordinate(Math.sin(angle) * 50);
            return (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-fuchsia-500/30"
                initial={{ x, y, opacity: 1 }}
                animate={active ? { x: 0, y: 0, opacity: 0 } : { x, y, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.03 }}
              />
            );
          })}
        </div>
      );

    case "void-portal":
      return (
        <div className={base}>
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-500/20"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={
              active
                ? { width: 140, height: 140, opacity: 1 }
                : { width: 0, height: 0, opacity: 0 }
            }
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      );

    case "gallery-curtain":
      return (
        <div className={base}>
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-violet-500/20"
            initial={{ x: "-100%" }}
            animate={active ? { x: "0%" } : { x: "-100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-violet-400/15"
            initial={{ x: "100%" }}
            animate={active ? { x: "0%" } : { x: "100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          />
        </div>
      );

    case "dimensional-rift":
      return (
        <div className={base}>
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, rotate: 0 }}
            animate={
              active
                ? { scale: [0, 1.5, 2.5], rotate: [0, 45, 90] }
                : { scale: 0, rotate: 0 }
            }
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-20 w-20 rounded-sm bg-fuchsia-500/20 border border-fuchsia-400/20" />
          </motion.div>
        </div>
      );

    default:
      return null;
  }
}

interface TransitionPreviewCardProps {
  animation: AnimationMeta;
}

export function TransitionPreviewCard({ animation }: TransitionPreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const tone = getCardTone(animation.color);
  const slug = getPreviewSlug(animation.path);

  const handleHoverStart = useCallback(() => setIsHovered(true), []);
  const handleHoverEnd = useCallback(() => setIsHovered(false), []);

  return (
    <Link href={animation.path} className="block">
      <motion.div
        className="relative cursor-pointer"
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <TransitionStage
          className="h-full min-h-[16rem]"
          backgroundClassName={tone.stage}
          overlays={<GradientVeil from={tone.from} to={tone.to} accent={tone.accent} />}
          chrome={
            <div className="flex h-full items-start justify-end p-5">
              <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[0.65rem] uppercase tracking-[0.26em] text-white/60">
                {animation.status === "planned" ? "Planned" : "Live"}
              </span>
            </div>
          }
        >
          {slug && (
            <div className="pointer-events-none absolute inset-0" style={{ zIndex: 5 }}>
              <TransitionPreview
                slug={slug}
                isHovered={isHovered}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          )}
          <div className="relative flex h-full flex-col justify-between p-6">
            <div className="space-y-3">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/45">
                {animation.path.split("/").at(-1)}
              </p>
              <h2 className="font-serif text-3xl text-white">{animation.title}</h2>
              <p className="max-w-md text-sm leading-6 text-white/70">
                {animation.description}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm text-white/58">
              <span className="capitalize">{animation.difficulty}</span>
              <span className="flex items-center gap-1.5 text-white/50 transition-colors group-hover:text-white/70">
                Open demo
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="translate-x-0 transition-transform group-hover:translate-x-0.5"
                >
                  <path
                    d="M1 7h12M8 2l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </TransitionStage>
      </motion.div>
    </Link>
  );
}
