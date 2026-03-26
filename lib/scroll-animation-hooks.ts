/**
 * @fileoverview Custom React hooks for scroll-driven animations
 *
 * This module provides reusable hooks that encapsulate common scroll-based
 * animation patterns using Framer Motion. All hooks respect the user's
 * reduced motion preference for accessibility.
 *
 * @module scroll-animation-hooks
 * @see lib/animation-presets.ts for animation configuration values
 *
 * @example
 * // Fade in on scroll
 * const { ref, opacity, y } = useFadeIn(0.3);
 * return <motion.div ref={ref} style={{ opacity, y }} />;
 */

import { useRef } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
  type SpringOptions,
  type UseScrollOptions,
} from "motion/react";

/**
 * Configuration options for the useScrollTransform hook
 */
interface UseScrollTransformOptions {
  offset?: UseScrollOptions["offset"];
  spring?: SpringOptions;
}

/**
 * Hook for scroll-driven value transformations with optional spring smoothing
 *
 * @description Consolidates the common pattern of useScroll + useTransform + useSpring
 * into a single hook with automatic reduced motion handling.
 *
 * @param inputRange - Scroll progress range [start, end] (default: [0, 1])
 * @param outputRange - Output value range [start, end] (default: [0, 1])
 * @param options - Configuration options
 * @param options.offset - Scroll offset for useScroll (default: ["start end", "end start"])
 * @param options.spring - Spring options for smoothing (omit for direct mapping)
 *
 * @returns Object with ref to attach to target element and transformed value
 *
 * @example
 * // Basic scroll-to-opacity mapping
 * const { ref, value } = useScrollTransform([0, 0.5], [0, 1]);
 * return <motion.div ref={ref} style={{ opacity: value }} />;
 *
 * @example
 * // With spring smoothing
 * const { ref, value } = useScrollTransform(
 *   [0, 1],
 *   [0, 360],
 *   { spring: { stiffness: 100, damping: 20 } }
 * );
 * return <motion.div ref={ref} style={{ rotate: value }} />;
 */
export function useScrollTransform(
  inputRange: [number, number] = [0, 1],
  outputRange: [number, number] = [0, 1],
  options: UseScrollTransformOptions = {}
) {
  const { offset = ["start end", "end start"], spring } = options;
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const transform = useTransform(scrollYProgress, inputRange, outputRange);
  const smoothValue = useSpring(
    transform,
    spring ?? { stiffness: 100, damping: 30 }
  );

  if (prefersReducedMotion) {
    return { ref, value: outputRange[1] };
  }

  if (spring) {
    return { ref, value: smoothValue };
  }

  return { ref, value: transform };
}

/**
 * Hook for parallax scroll effects with configurable speed
 *
 * @description Creates a parallax effect where the element moves at a different
 * rate than the scroll. Positive speed moves in the direction of scroll,
 * negative moves opposite.
 *
 * @param speed - Parallax intensity (0-1 for subtle, >1 for dramatic)
 * @param direction - Axis of movement ("vertical" or "horizontal")
 *
 * @returns Object with ref and spring-smoothed value for transform
 *
 * @example
 * // Subtle vertical parallax
 * const { ref, value } = useParallaxEffect(0.3);
 * return <motion.div ref={ref} style={{ y: value }} />;
 *
 * @example
 * // Horizontal parallax
 * const { ref, value } = useParallaxEffect(0.5, "horizontal");
 * return <motion.div ref={ref} style={{ x: value }} />;
 */
export function useParallaxEffect(
  speed: number = 0.5,
  direction: "vertical" | "horizontal" = "vertical"
) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const distance = speed * 100;

  const value = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "vertical" ? [-distance, distance] : [-distance, distance]
  );

  const smoothValue = useSpring(value, { stiffness: 100, damping: 30 });

  if (prefersReducedMotion) {
    return { ref, value: 0 };
  }

  return { ref, value: smoothValue };
}

/**
 * Hook for fade-in animations triggered by scroll
 *
 * @description Animates opacity and vertical position as the element
 * enters the viewport. The threshold determines how much of the element
 * must be visible before the animation completes.
 *
 * @param threshold - Scroll progress at which animation finishes (0-1)
 *
 * @returns Object with ref, opacity, and y values for motion components
 *
 * @example
 * const { ref, opacity, y } = useFadeIn(0.4);
 * return <motion.div ref={ref} style={{ opacity, y }} />;
 */
export function useFadeIn(threshold: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, threshold], [0, 1]);
  const y = useTransform(scrollYProgress, [0, threshold], [50, 0]);

  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  if (prefersReducedMotion) {
    return { ref, opacity: 1, y: 0 };
  }

  return { ref, opacity: smoothOpacity, y: smoothY };
}

/**
 * Hook for tracking scroll progress through an element
 *
 * @description Returns a smooth progress value (0-1) as the user scrolls
 * through the element. Useful for progress bars and timeline indicators.
 *
 * @returns Object with ref and spring-smoothed progress value
 *
 * @example
 * const { ref, progress } = useScrollProgress();
 * return (
 *   <div ref={ref}>
 *     <motion.div style={{ scaleX: progress }} />
 *   </div>
 * );
 */
export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
  });

  return { ref, progress: smoothProgress };
}

/**
 * Hook that returns animated or static value based on reduced motion preference
 *
 * @description Utility for conditionally using animated vs static values.
 * Returns the static value when the user prefers reduced motion.
 *
 * @param animatedValue - The MotionValue or animated value to use normally
 * @param staticValue - The static value to use when reduced motion is preferred
 * @returns Either the animated or static value based on user preference
 *
 * @example
 * const y = useReducedMotionSafe(motionValue, 0);
 * // y will be motionValue normally, or 0 with reduced motion
 */
export function useReducedMotionSafe<T>(
  animatedValue: MotionValue<T> | T,
  staticValue: T
): T | MotionValue<T> {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? staticValue : animatedValue;
}

/**
 * Hook for scale-on-scroll zoom effects
 *
 * @description Animates scale as the element enters the viewport.
 * Useful for zoom-in reveal effects on scroll.
 *
 * @param scaleRange - [startScale, endScale] (default: [0.8, 1])
 * @param threshold - Scroll progress at which animation completes (default: 0.5)
 *
 * @returns Object with ref and spring-smoothed scale value
 *
 * @example
 * const { ref, scale } = useScaleOnScroll([0.5, 1], 0.3);
 * return <motion.div ref={ref} style={{ scale }} />;
 */
export function useScaleOnScroll(
  scaleRange: [number, number] = [0.8, 1],
  threshold: number = 0.5
) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, threshold], scaleRange);
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  if (prefersReducedMotion) {
    return { ref, scale: 1 };
  }

  return { ref, scale: smoothScale };
}
