/**
 * @fileoverview Reusable animation primitives and presets for Framer Motion
 *
 * This module provides a curated collection of animation configurations that can be
 * reused across the gallery. Using these presets ensures visual consistency and
 * makes it easy to adjust timing/physics globally.
 *
 * @module animation-presets
 * @see lib/animation-registry.ts for animation metadata
 * @see lib/transition-lab.ts for transition-specific presets
 *
 * @example
 * import { springPresets, revealPresets } from "@/lib/animation-presets";
 *
 * // Use a spring preset in a motion component
 * <motion.div transition={{ ...springPresets.snappy }} />
 *
 * // Apply a reveal animation
 * <motion.div {...revealPresets.fadeUp} />
 */

import type { SpringOptions } from "motion/react";

/**
 * Spring physics presets for natural-feeling animations
 *
 * @description Each preset is tuned for a specific feel:
 * - gentle: Soft, relaxed motion for subtle feedback
 * - snappy: Quick response with controlled bounce
 * - bouncy: Playful, energetic with noticeable oscillation
 * - slow: Deliberate, weighted movement
 * - stiff: Minimal bounce, precise positioning
 * - soft: Smooth with gentle settling
 *
 * @example
 * <motion.div
 *   animate={{ scale: 1.1 }}
 *   transition={{ type: "spring", ...springPresets.snappy }}
 * />
 */
export const springPresets: Record<string, SpringOptions> = {
  gentle: { stiffness: 100, damping: 30 },
  snappy: { stiffness: 300, damping: 30 },
  bouncy: { stiffness: 400, damping: 10 },
  slow: { stiffness: 50, damping: 20 },
  stiff: { stiffness: 500, damping: 30 },
  soft: { stiffness: 80, damping: 25 },
};

/**
 * Entrance animation presets for content reveal effects
 *
 * @description Ready-to-use initial/animate pairs for Framer Motion components.
 * Spread these directly onto motion elements for quick implementation.
 *
 * @example
 * // Fade up from below
 * <motion.div {...revealPresets.fadeUp} transition={{ duration: 0.5 }} />
 *
 * // Scale in with opacity
 * <motion.div {...revealPresets.scaleUp} transition={{ duration: 0.4 }} />
 */
export const revealPresets = {
  fadeUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
  fadeDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
  fadeLeft: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
  fadeRight: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  },
  scaleUp: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  },
  blur: {
    initial: { filter: "blur(10px)", opacity: 0 },
    animate: { filter: "blur(0px)", opacity: 1 },
  },
} as const;

/**
 * Clip-path presets for mask reveal animations
 *
 * @description Provides initial/final clip-path value pairs for creating
 * masked reveal effects. Use with motion.div style.clipPath.
 *
 * @example
 * // Reveal from bottom to top
 * <motion.div
 *   initial={{ clipPath: clipPathPresets.revealUp[0] }}
 *   animate={{ clipPath: clipPathPresets.revealUp[1] }}
 * />
 *
 * // Circular reveal from center
 * <motion.div
 *   initial={{ clipPath: clipPathPresets.circle[0] }}
 *   animate={{ clipPath: clipPathPresets.circle[1] }}
 * />
 */
export const clipPathPresets = {
  revealUp: ["inset(100% 0 0 0)", "inset(0 0 0 0)"],
  revealDown: ["inset(0 0 100% 0)", "inset(0 0 0 0)"],
  revealLeft: ["inset(0 100% 0 0)", "inset(0 0 0 0)"],
  revealRight: ["inset(0 0 0 100%)", "inset(0 0 0 0)"],
  circle: ["circle(0% at 50% 50%)", "circle(100% at 50% 50%)"],
  circleTopLeft: ["circle(0% at 0% 0%)", "circle(150% at 0% 0%)"],
  circleBottomRight: ["circle(0% at 100% 100%)", "circle(150% at 100% 100%)"],
} as const;

/**
 * Duration and easing presets for transitions
 *
 * @description Curated timing configurations for consistent motion design.
 * The "smooth" and "slow" presets use a custom bezier curve optimized for
 * elegant deceleration.
 *
 * @example
 * <motion.div
 *   animate={{ opacity: 1 }}
 *   transition={transitionPresets.smooth}
 * />
 */
export const transitionPresets = {
  smooth: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  quick: { duration: 0.3, ease: "easeOut" },
  slow: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
  bounce: { type: "spring", stiffness: 300, damping: 10 },
  spring: { type: "spring", stiffness: 200, damping: 20 },
} as const;

/**
 * Named duration values for the Transition Lab section
 *
 * @description Provides semantic duration names for consistent timing
 * across all transition lab demos. Using named values makes it easier
 * to adjust timing globally and understand the intent of each duration.
 *
 * - instant: No perceptible delay (0s)
 * - brisk: Quick acknowledgment (0.35s)
 * - base: Standard transition time (0.65s)
 * - slow: Deliberate, dramatic movement (0.95s)
 * - linger: Extended, theatrical reveal (1.25s)
 */
export const transitionLabDurations = {
  instant: 0,
  brisk: 0.35,
  base: 0.65,
  slow: 0.95,
  linger: 1.25,
} as const;

/**
 * Custom easing curves for the Transition Lab section
 *
 * @description Each easing curve is designed for a specific motion character:
 * - emphasis: Strong deceleration for impactful reveals
 * - curtain: Smooth, theatrical motion for overlay effects
 * - fluid: Organic, natural movement for morphing effects
 *
 * These are cubic-bezier curves optimized for the gallery's motion style.
 */
export const transitionLabEasings = {
  emphasis: [0.16, 1, 0.3, 1],
  curtain: [0.77, 0, 0.18, 1],
  fluid: [0.22, 1, 0.36, 1],
} as const;

/**
 * Spring configurations for the Transition Lab section
 *
 * @description Pre-tuned spring physics for different use cases:
 * - stage: Main scene entrance animations
 * - sharedElement: Shared element transitions (layoutId)
 * - hover: Interactive hover and press states
 *
 * Each spring is tuned with mass, stiffness, and damping for the
 * specific interaction type.
 */
export const transitionLabSprings = {
  stage: { stiffness: 150, damping: 24, mass: 0.9 },
  sharedElement: { stiffness: 220, damping: 22, mass: 0.8 },
  hover: { stiffness: 260, damping: 20, mass: 0.7 },
} as const satisfies Record<string, SpringOptions>;

/**
 * Stagger timing presets for list animations
 *
 * @description Controls the delay between each child element animating.
 * Use in the parent container's transition prop.
 *
 * @example
 * <motion.ul
 *   initial="hidden"
 *   animate="visible"
 *   variants={{ visible: { transition: staggerPresets.normal } }}
 * >
 *   {items.map(item => <motion.li variants={itemVariants} />)}
 * </motion.ul>
 */
export const staggerPresets = {
  tight: { staggerChildren: 0.05 },
  normal: { staggerChildren: 0.1 },
  loose: { staggerChildren: 0.2 },
  slow: { staggerChildren: 0.3 },
} as const;

/**
 * Container animation variants for staggered list animations
 *
 * @description Use on the parent element to orchestrate child animations.
 * The "visible" state triggers staggered children animations.
 *
 * @example
 * <motion.div
 *   initial="hidden"
 *   animate="visible"
 *   variants={containerVariants}
 * >
 *   {children}
 * </motion.div>
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Item animation variants for staggered list children
 *
 * @description Pairs with containerVariants for staggered list animations.
 * Each child fades in and slides up as it enters.
 *
 * @example
 * <motion.ul variants={containerVariants} initial="hidden" animate="visible">
 *   {items.map(item => (
 *     <motion.li key={item.id} variants={itemVariants} />
 *   ))}
 * </motion.ul>
 */
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * Scroll-driven animation input/output ranges
 *
 * @description Pre-configured ranges for use with useTransform and scroll-based
 * animations. Each preset defines input scroll progress values and output
 * animation values.
 *
 * - fadeIn: Opacity from 0 to 1 over first 30% of scroll
 * - slideUp: Y position from 100 to 0 over first 30% of scroll
 * - slideIn: X position from -100 to 0 over first 30% of scroll
 * - scaleIn: Scale from 0.8 to 1 over first 30% of scroll
 *
 * @example
 * const { scrollYProgress } = useScroll();
 * const opacity = useTransform(
 *   scrollYProgress,
 *   scrollRanges.fadeIn.input,
 *   scrollRanges.fadeIn.output
 * );
 */
export const scrollRanges = {
  fadeIn: {
    input: [0, 0.3],
    output: [0, 1],
  },
  slideUp: {
    input: [0, 0.3],
    output: [100, 0],
  },
  slideIn: {
    input: [0, 0.3],
    output: [-100, 0],
  },
  scaleIn: {
    input: [0, 0.3],
    output: [0.8, 1],
  },
} as const;
