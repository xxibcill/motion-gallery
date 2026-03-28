/**
 * @fileoverview Shared configuration and types for peek card animations
 */

import { peekCardSprings } from "@/lib/design-tokens";

// =============================================================================
// SPRING PRESETS
// =============================================================================

/** Default spring for peek card animations */
export const PEEK_SPRING_GENTLE = peekCardSprings.gentle;

/** Smooth spring for larger peek card animations */
export const PEEK_SPRING_SMOOTH = peekCardSprings.smooth;

/** Snappy spring for quick peek card animations */
export const PEEK_SPRING_SNAPPY = peekCardSprings.snappy;

// =============================================================================
// BOTTOM PEEK CARD V1 CONFIG
// =============================================================================

export const BOTTOM_PEEK_V1_CONFIG = {
  scrollHeight: 2,
  expandThreshold: 0.4,
  peek: {
    width: 0.5,
    borderRadius: 24,
    translateY: 0,
    scale: 0.98,
    opacity: 1,
  },
  full: {
    width: 1,
    borderRadius: 0,
    translateY: 0,
    scale: 1,
    opacity: 1,
  },
  spring: PEEK_SPRING_GENTLE,
} as const;

// =============================================================================
// BOTTOM PEEK CARD V2 CONFIG
// =============================================================================

export const BOTTOM_PEEK_V2_CONFIG = {
  scrollHeight: 2.2,
  settleThreshold: 0.42,
  peek: {
    translateY: 220,
    scale: 0.975,
    borderRadius: 32,
    opacity: 0.84,
  },
  settled: {
    translateY: 0,
    scale: 1,
    borderRadius: 0,
    opacity: 1,
  },
  content: {
    start: 0.18,
    end: 0.54,
    translateY: 56,
    scale: 0.985,
  },
  spring: PEEK_SPRING_SMOOTH,
} as const;

// =============================================================================
// CENTER PEEK CARD CONFIG
// =============================================================================

export const CENTER_PEEK_CONFIG = {
  scrollHeight: 2.4,
  settleThreshold: 0.42,
  containerPadding: 40,
  peek: {
    width: 760,
    height: 48,
    borderRadius: 32,
    translateY: 180,
    scale: 0.94,
    opacity: 0.75,
  },
  spring: PEEK_SPRING_SMOOTH,
} as const;

// =============================================================================
// CENTER PEEK SHRINK CARD CONFIG
// =============================================================================

export const CENTER_PEEK_SHRINK_CONFIG = {
  scrollHeight: 10.5,
  settleThreshold: 0.22,
  shrinkThreshold: 0.22,
  containerPadding: 40,
  peek: {
    width: 760,
    height: 48,
    borderRadius: 32,
    translateY: 180,
    scale: 0.94,
    opacity: 0.75,
  },
  shrink: {
    targetHeight: 300,
    targetBorderRadius: 20,
  },
  spring: PEEK_SPRING_SMOOTH,
} as const;

// =============================================================================
// SHARED TYPES
// =============================================================================

export interface PeekSpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export interface BasePeekConfig {
  scrollHeight: number;
  spring: PeekSpringConfig;
}

export interface BottomPeekV1Config extends BasePeekConfig {
  expandThreshold: number;
  peek: {
    width: number;
    borderRadius: number;
    translateY: number;
    scale: number;
    opacity: number;
  };
  full: {
    width: number;
    borderRadius: number;
    translateY: number;
    scale: number;
    opacity: number;
  };
}

export interface BottomPeekV2Config extends BasePeekConfig {
  settleThreshold: number;
  peek: {
    translateY: number;
    scale: number;
    borderRadius: number;
    opacity: number;
  };
  settled: {
    translateY: number;
    scale: number;
    borderRadius: number;
    opacity: number;
  };
  content: {
    start: number;
    end: number;
    translateY: number;
    scale: number;
  };
}

export interface CenterPeekConfig extends BasePeekConfig {
  settleThreshold: number;
  containerPadding: number;
  peek: {
    width: number;
    height: number;
    borderRadius: number;
    translateY: number;
    scale: number;
    opacity: number;
  };
}

export interface CenterPeekShrinkConfig extends CenterPeekConfig {
  shrinkThreshold: number;
  shrink: {
    targetHeight: number;
    targetBorderRadius: number;
  };
}
