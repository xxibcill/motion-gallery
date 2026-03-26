/**
 * @fileoverview Noise texture overlay component for Transition Lab scenes
 *
 * Adds a subtle noise texture to transition lab scenes for visual depth.
 * Uses CSS gradients to create a procedural noise-like pattern without
 * requiring external image assets.
 *
 * @module transition-lab/NoiseOverlay
 */

"use client";

/**
 * Props for the NoiseOverlay component
 */
interface NoiseOverlayProps {
  className?: string;
  opacity?: number;
}

/**
 * NoiseOverlay - Procedural noise texture for scene backgrounds
 *
 * @description Renders a semi-transparent noise texture overlay using CSS gradients.
 * The noise adds visual texture and depth to solid color backgrounds in the
 * transition lab. Uses mix-blend-mode: soft-light for subtle integration.
 *
 * @component
 * @example
 * <TransitionStage>
 *   <NoiseOverlay opacity={0.14} />
 *   <div>Scene content</div>
 * </TransitionStage>
 *
 * @param props.className - Additional CSS classes
 * @param props.opacity - Opacity of the noise (default: 0.14)
 */
export function NoiseOverlay({
  className = "",
  opacity = 0.14,
}: NoiseOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 mix-blend-soft-light ${className}`}
      style={{
        opacity,
        backgroundImage: `
          linear-gradient(0deg, rgba(255,255,255,0.05) 50%, transparent 50%),
          linear-gradient(90deg, rgba(255,255,255,0.03) 50%, transparent 50%)
        `,
        backgroundSize: "3px 3px, 5px 5px",
      }}
    />
  );
}
