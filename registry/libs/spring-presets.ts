/**
 * @fileoverview Reusable spring physics configurations for Framer Motion
 *
 * Portable spring presets that can be copied into any project using
 * Framer Motion / Motion One.
 *
 * @module registry/libs/spring-presets
 *
 * @example
 * import { springPresets } from "@/registry/libs/spring-presets";
 *
 * <motion.div transition={{ type: "spring", ...springPresets.snappy }} />
 */

import type { SpringOptions } from "motion/react";

/**
 * Spring physics presets for natural-feeling animations
 *
 * Each preset is tuned for a specific feel:
 * - gentle: Soft, relaxed motion for subtle feedback
 * - snappy: Quick response with controlled bounce
 * - bouncy: Playful, energetic with noticeable oscillation
 * - slow: Deliberate, weighted movement
 * - stiff: Minimal bounce, precise positioning
 * - soft: Smooth with gentle settling
 */
export const springPresets: Record<string, SpringOptions> = {
  gentle: { stiffness: 100, damping: 30 },
  snappy: { stiffness: 300, damping: 30 },
  bouncy: { stiffness: 400, damping: 10 },
  slow: { stiffness: 50, damping: 20 },
  stiff: { stiffness: 500, damping: 30 },
  soft: { stiffness: 80, damping: 25 },
};
