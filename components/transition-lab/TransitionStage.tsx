/**
 * @fileoverview Primary scene container for Transition Lab demos
 *
 * TransitionStage is the main wrapper component for all transition lab scenes.
 * It provides consistent styling, entrance animations, and layer management
 * using the z-index system from transitionLabLayers.
 *
 * @module transition-lab/TransitionStage
 * @see lib/transition-lab.ts for z-index layers and entrance animations
 */

"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { getSceneEntrance, transitionLabLayers } from "@/lib/transition-lab";
import { NoiseOverlay } from "@/components/transition-lab/NoiseOverlay";

/**
 * Props for the TransitionStage component
 */
interface TransitionStageProps {
  children: ReactNode;
  className?: string;
  backgroundClassName?: string;
  chrome?: ReactNode;
  overlays?: ReactNode;
  noiseOpacity?: number;
}

/**
 * TransitionStage - Main container for transition lab scenes
 *
 * @description A full-featured scene container that provides:
 * - Consistent rounded border and shadow styling
 * - Automatic entrance animation with reduced motion support
 * - Layered structure (background, noise, overlays, content, chrome)
 * - Flexible slot composition for custom content
 *
 * @component
 * @example
 * // Basic usage
 * <TransitionStage>
 *   <div>Scene content</div>
 * </TransitionStage>
 *
 * @example
 * // With custom background and overlay
 * <TransitionStage
 *   backgroundClassName="bg-indigo-950"
 *   overlays={<GradientVeil from="..." to="..." />}
 *   chrome={<span>Stage label</span>}
 *   noiseOpacity={0.08}
 * >
 *   <div>Scene content</div>
 * </TransitionStage>
 *
 * @param props.children - Main scene content
 * @param props.className - Additional CSS classes for the container
 * @param props.backgroundClassName - Classes for the background layer
 * @param props.chrome - UI elements positioned above content
 * @param props.overlays - Visual layers between background and content
 * @param props.noiseOpacity - Opacity of the noise texture
 */
export function TransitionStage({
  children,
  className = "",
  backgroundClassName = "bg-zinc-950/90",
  chrome,
  overlays,
  noiseOpacity,
}: TransitionStageProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const entrance = getSceneEntrance(prefersReducedMotion);

  return (
    <motion.div
      className={`relative isolate overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.45)] ${className}`}
      initial={entrance.initial}
      animate={entrance.animate}
      transition={entrance.transition}
    >
      <div className={`absolute inset-0 ${backgroundClassName}`} />
      <NoiseOverlay opacity={noiseOpacity} />
      {overlays}
      <div
        className="relative"
        style={{ zIndex: transitionLabLayers.content }}
      >
        {children}
      </div>
      {chrome ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ zIndex: transitionLabLayers.chrome }}
        >
          {chrome}
        </div>
      ) : null}
    </motion.div>
  );
}
