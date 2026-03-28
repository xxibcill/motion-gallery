/**
 * @fileoverview Peek card components and configuration
 *
 * This module provides reusable peek card animations with scroll-driven effects.
 * All spring configurations use centralized design tokens from @/lib/design-tokens.
 */

// Shared configuration
export {
  PEEK_SPRING_GENTLE,
  PEEK_SPRING_SMOOTH,
  PEEK_SPRING_SNAPPY,
  BOTTOM_PEEK_V1_CONFIG,
  BOTTOM_PEEK_V2_CONFIG,
  CENTER_PEEK_CONFIG,
  CENTER_PEEK_SHRINK_CONFIG,
  type PeekSpringConfig,
  type BasePeekConfig,
  type BottomPeekV1Config,
  type BottomPeekV2Config,
  type CenterPeekConfig,
  type CenterPeekShrinkConfig,
} from "./configs";

// Re-export components from their original locations for backward compatibility
// New imports should use: import { BottomPeekCard } from "@/components/bottom-peek-card"
// This module is primarily for shared configuration
