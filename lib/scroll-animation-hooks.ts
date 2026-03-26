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

interface UseScrollTransformOptions {
  offset?: UseScrollOptions["offset"];
  spring?: SpringOptions;
}

/**
 * Hook for scroll-driven animations with optional spring smoothing
 * Consolidates the common pattern of useScroll + useTransform
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
 * Hook for parallax effects with configurable speed
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
 * Hook for fade-in on scroll with configurable threshold
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
 * Hook for scroll-based progress indicator
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
 */
export function useReducedMotionSafe<T>(
  animatedValue: MotionValue<T> | T,
  staticValue: T
): T | MotionValue<T> {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? staticValue : animatedValue;
}

/**
 * Hook for scale-on-scroll effect
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
