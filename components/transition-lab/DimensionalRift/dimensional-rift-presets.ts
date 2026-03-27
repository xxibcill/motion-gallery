/**
 * @fileoverview Animation presets for the Dimensional Rift transition
 *
 * This module provides phase-specific configurations for the most complex
 * transition in the gallery: a 4-phase dimensional tear combining 3D shard
 * physics, gravitational void, chromatic tunnel, and magnetic reassembly.
 */

import type { SpringOptions } from "motion/react";
import { transitionLabEasings, transitionLabSprings } from "@/lib/animation-presets";

/**
 * Duration for each phase of the dimensional rift transition
 * Total animation time: 4.4 seconds
 */
export const riftPhaseDurations = {
  fracture: 1.2,
  void: 0.8,
  tunnel: 1.4,
  reassembly: 1.0,
  get total() {
    return this.fracture + this.void + this.tunnel + this.reassembly;
  },
} as const;

/**
 * Spring configurations for different animation contexts within the rift
 */
export const riftSprings: Record<string, SpringOptions> = {
  shard: { stiffness: 280, damping: 24, mass: 0.6 },
  attractor: { stiffness: 180, damping: 18, mass: 1.2 },
  reassembly: { ...transitionLabSprings.stage },
  tunnel: { stiffness: 120, damping: 20, mass: 0.8 },
} as const;

/**
 * Easing curves for each phase
 */
export const riftEasings = {
  fracture: transitionLabEasings.emphasis,
  void: transitionLabEasings.curtain,
  tunnel: "linear" as const,
  reassembly: transitionLabEasings.fluid,
} as const;

/**
 * Scene configurations with color palettes
 */
export const riftScenes = [
  {
    id: "quantum-breach",
    label: "Quantum Breach",
    eyebrow: "Dimension Alpha",
    title: "Reality fractures into drifting shards before being pulled through a chromatic void and reassembled in a parallel dimension.",
    body:
      "The transition treats space as breakable material. First the scene cracks into individual pieces, then gravity inverts toward a singularity, you traverse a light-speed tunnel, and finally everything snaps back together with magnetic precision.",
    chips: ["4-phase journey", "3D shard physics", "Chromatic tunnel"],
    metrics: ["16 shards", "80 tunnel stars", "4.4s duration"],
    palette: {
      background: "bg-[#0a0512]",
      from: "rgba(168, 85, 247, 0.28)",
      to: "rgba(10, 5, 18, 0.96)",
      accent: "rgba(236, 72, 153, 0.22)",
      shard: "border-fuchsia-200/18 bg-[#1a0a22]",
      glow: "rgba(168, 85, 247, 0.48)",
      tunnel: "rgba(236, 72, 153, 0.36)",
      star: "rgba(255, 255, 255, 0.9)",
      card: "border-fuchsia-100/14 bg-[#1f0a2a]",
      text: "text-fuchsia-50",
      panel: "border-white/10 bg-black/24",
    },
  },
  {
    id: "void-cascade",
    label: "Void Cascade",
    eyebrow: "Dimension Omega",
    title: "A colder dimensional breach tears through the frame with cyan energy and indigo shadows.",
    body:
      "The second state shifts toward a more technological rift. The shards behave like corrupted data, the void feels engineered rather than natural, and the reassembly has sharper edges.",
    chips: ["Cold spectrum", "Engineered void", "Data-like shards"],
    metrics: ["16 shards", "80 tunnel stars", "Precise rebuild"],
    palette: {
      background: "bg-[#020812]",
      from: "rgba(34, 211, 238, 0.24)",
      to: "rgba(2, 8, 18, 0.96)",
      accent: "rgba(99, 102, 241, 0.18)",
      shard: "border-cyan-200/16 bg-[#041018]",
      glow: "rgba(34, 211, 238, 0.44)",
      tunnel: "rgba(99, 102, 241, 0.32)",
      star: "rgba(103, 232, 249, 0.9)",
      card: "border-cyan-100/12 bg-[#061420]",
      text: "text-cyan-50",
      panel: "border-white/10 bg-[#020b12]/44",
    },
  },
] as const;

export type RiftSceneId = (typeof riftScenes)[number]["id"];

/**
 * Phase types for the dimensional rift state machine
 */
export type RiftPhase = "idle" | "fracture" | "void" | "tunnel" | "reassembly";

/**
 * Shard configuration for the fracture phase
 */
export interface ShardConfig {
  id: string;
  row: number;
  col: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  translateZ: number;
  delay: number;
  pullX: number;
  pullY: number;
}

/**
 * Star configuration for the tunnel phase
 */
export interface StarConfig {
  id: string;
  angle: number;
  distance: number;
  z: number;
  size: number;
  delay: number;
}

/**
 * Generate shard configurations for the fracture phase
 */
export function generateShards(count: number = 16): ShardConfig[] {
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);

  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;

    // Calculate pull direction toward center
    const centerCol = (cols - 1) / 2;
    const centerRow = (rows - 1) / 2;
    const pullStrength = 180 + Math.random() * 120;

    return {
      id: `shard-${i}`,
      row,
      col,
      rotateX: -45 + Math.random() * 90,
      rotateY: -45 + Math.random() * 90,
      rotateZ: -30 + Math.random() * 60,
      translateZ: 20 + Math.random() * 80,
      delay: i * 0.04,
      pullX: (col - centerCol) * pullStrength * -1,
      pullY: (row - centerRow) * pullStrength * -1,
    };
  });
}

/**
 * Generate star configurations for the tunnel phase
 */
export function generateStars(count: number = 80): StarConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const distance = 30 + Math.random() * 180;
    const z = Math.random() * 1000;

    return {
      id: `star-${i}`,
      angle,
      distance,
      z,
      size: 1 + Math.random() * 3,
      delay: (z / 1000) * riftPhaseDurations.tunnel,
    };
  });
}

/**
 * Card configurations for the reassembly phase
 */
export const reassemblyCards = [
  {
    id: "hero",
    className: "lg:col-span-2 rounded-[2rem] border p-6 shadow-[0_28px_90px_rgba(0,0,0,0.24)] md:p-8",
    offset: { x: -80, y: 40 },
    rotateX: -25,
    rotateY: 18,
  },
  {
    id: "brief",
    className: "rounded-[1.6rem] border p-5",
    offset: { x: 100, y: -50 },
    rotateX: 20,
    rotateY: -15,
  },
  {
    id: "metrics",
    className: "rounded-[1.6rem] border p-5",
    offset: { x: 120, y: 60 },
    rotateX: -15,
    rotateY: 22,
  },
] as const;
