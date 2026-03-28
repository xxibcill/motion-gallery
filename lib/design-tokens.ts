/**
 * @fileoverview Centralized design tokens for consistent styling
 * across the motion gallery components.
 */

// =============================================================================
// Border Tokens
// =============================================================================

export const borders = {
  subtle: "border-white/10",
  muted: "border-white/8",
  faint: "border-white/6",
} as const;

// =============================================================================
// Background Tokens
// =============================================================================

export const backgrounds = {
  surface: "bg-white/[0.03]",
  elevated: "bg-white/[0.04]",
  overlay: "bg-white/[0.05]",
} as const;

// =============================================================================
// Border Radius Tokens
// =============================================================================

export const radii = {
  card: "rounded-[2rem]",
  cardSmall: "rounded-[1.75rem]",
  compact: "rounded-[1.6rem]",
  button: "rounded-full",
  input: "rounded-2xl",
} as const;

// =============================================================================
// Shadow Tokens
// =============================================================================

export const shadows = {
  soft: "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
  medium: "shadow-[0_16px_64px_rgba(0,0,0,0.2)]",
  strong: "shadow-[0_32px_120px_rgba(0,0,0,0.45)]",
} as const;

// =============================================================================
// Spring Presets for Peek Cards
// =============================================================================

export const peekCardSprings = {
  gentle: { stiffness: 100, damping: 30, mass: 1 },
  smooth: { stiffness: 110, damping: 28, mass: 0.9 },
  snappy: { stiffness: 150, damping: 24, mass: 0.85 },
} as const;

// =============================================================================
// Typography Tokens
// =============================================================================

export const typography = {
  label: "text-xs uppercase tracking-[0.24em]",
  labelMuted: "text-xs uppercase tracking-[0.24em] text-zinc-500",
  body: "text-sm text-zinc-400",
  heading: "text-lg font-medium text-zinc-100",
} as const;
