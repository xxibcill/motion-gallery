"use client";

import { memo } from "react";
import { motion } from "motion/react";
import type { ShardConfig } from "./dimensional-rift-presets";
import {
  riftPhaseDurations,
  riftEasings,
  riftSprings,
} from "./dimensional-rift-presets";

interface ShardProps {
  config: ShardConfig;
  gridCols: number;
  gridRows: number;
  palette: {
    shard: string;
    glow: string;
  };
  phase: "idle" | "fracture" | "void" | "tunnel" | "reassembly";
  prefersReducedMotion: boolean;
}

function ShardComponent({
  config,
  gridCols,
  gridRows,
  palette,
  phase,
  prefersReducedMotion,
}: ShardProps) {
  const isActive = phase === "fracture" || phase === "void";
  const cellWidth = 100 / gridCols;
  const cellHeight = 100 / gridRows;

  const left = config.col * cellWidth;
  const top = config.row * cellHeight;
  const width = cellWidth;
  const height = cellHeight;

  // Phase 1: Fracture - 3D rotation and separation
  const fractureAnimate = {
    rotateX: prefersReducedMotion ? 0 : config.rotateX,
    rotateY: prefersReducedMotion ? 0 : config.rotateY,
    rotateZ: prefersReducedMotion ? 0 : config.rotateZ,
    translateZ: prefersReducedMotion ? 0 : config.translateZ,
    scale: prefersReducedMotion ? 1 : 0.92,
    opacity: 1,
  };

  // Phase 2: Void - Pull toward center
  const voidAnimate = {
    x: prefersReducedMotion ? 0 : config.pullX,
    y: prefersReducedMotion ? 0 : config.pullY,
    scale: prefersReducedMotion ? 1 : [0.92, 0.15, 0],
    opacity: prefersReducedMotion ? 1 : [1, 0.7, 0],
    rotateX: prefersReducedMotion ? 0 : config.rotateX * 2,
    rotateY: prefersReducedMotion ? 0 : config.rotateY * 2,
    rotateZ: prefersReducedMotion ? 0 : config.rotateZ * 1.5,
  };

  const getPhaseAnimation = () => {
    if (phase === "idle") {
      return {
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        translateZ: 0,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 0.9,
      };
    }
    if (phase === "fracture") {
      return fractureAnimate;
    }
    if (phase === "void") {
      return voidAnimate;
    }
    // tunnel and reassembly - shards are gone
    return {
      opacity: 0,
      scale: 0,
    };
  };

  return (
    <motion.div
      aria-hidden="true"
      className={`absolute overflow-hidden rounded-xl border backdrop-blur-sm ${palette.shard}`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
        transformStyle: "preserve-3d",
      }}
      initial={{
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        translateZ: 0,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 0.9,
      }}
      animate={getPhaseAnimation()}
      transition={{
        duration: isActive
          ? phase === "fracture"
            ? riftPhaseDurations.fracture
            : riftPhaseDurations.void
          : riftPhaseDurations.fracture,
        delay: prefersReducedMotion ? 0 : config.delay,
        ease: riftEasings.fracture,
        type: phase === "void" ? "spring" : "tween",
        ...(phase === "void" && riftSprings.shard),
      }}
    >
      {/* Inner glow effect */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `linear-gradient(135deg, ${palette.glow}, transparent 60%)`,
        }}
      />

      {/* Content simulation lines */}
      <div className="absolute inset-x-3 top-3 h-px bg-white/20" />
      <div className="absolute inset-x-3 top-6 h-4 rounded-full bg-white/8" />
      <div className="absolute inset-x-3 top-12 h-2 w-3/4 rounded bg-white/6" />
      <div className="absolute inset-x-3 top-16 h-2 w-1/2 rounded bg-white/5" />
    </motion.div>
  );
}

export const Shard = memo(ShardComponent);
