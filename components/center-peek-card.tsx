"use client";

import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

export const CENTER_PEEK_CONFIG = {
  scrollHeight: 2.4,
  settleThreshold: 0.42,
  peek: {
    width: 56,
    height: 48,
    borderRadius: 32,
    translateY: 180,
    scale: 0.94,
    opacity: 0.75,
  },
  settled: {
    width: 82,
    height: 76,
    borderRadius: 36,
    translateY: 0,
    scale: 1,
    opacity: 1,
  },
  spring: {
    stiffness: 110,
    damping: 28,
    mass: 0.9,
  },
} as const;

export interface CenterPeekCardProps {
  children: ReactNode;
  className?: string;
  shellClassName?: string;
  cardClassName?: string;
}

export function CenterPeekCard({
  children,
  className,
  shellClassName,
  cardClassName,
}: CenterPeekCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const width = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_CONFIG.settleThreshold],
    [`${CENTER_PEEK_CONFIG.peek.width}%`, `${CENTER_PEEK_CONFIG.settled.width}%`]
  );

  const height = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_CONFIG.settleThreshold],
    [
      `${CENTER_PEEK_CONFIG.peek.height}vh`,
      `${CENTER_PEEK_CONFIG.settled.height}vh`,
    ]
  );

  const borderRadius = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_CONFIG.settleThreshold],
    [
      CENTER_PEEK_CONFIG.peek.borderRadius,
      CENTER_PEEK_CONFIG.settled.borderRadius,
    ]
  );

  const y = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_CONFIG.settleThreshold],
    [
      CENTER_PEEK_CONFIG.peek.translateY,
      CENTER_PEEK_CONFIG.settled.translateY,
    ]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_CONFIG.settleThreshold],
    [CENTER_PEEK_CONFIG.peek.scale, CENTER_PEEK_CONFIG.settled.scale]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_CONFIG.settleThreshold],
    [CENTER_PEEK_CONFIG.peek.opacity, CENTER_PEEK_CONFIG.settled.opacity]
  );

  const glowOpacity = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_CONFIG.settleThreshold],
    [0.15, 0.42]
  );

  const smoothY = useSpring(y as MotionValue<number>, CENTER_PEEK_CONFIG.spring);
  const smoothScale = useSpring(
    scale as MotionValue<number>,
    CENTER_PEEK_CONFIG.spring
  );
  const smoothOpacity = useSpring(
    opacity as MotionValue<number>,
    CENTER_PEEK_CONFIG.spring
  );
  const smoothGlowOpacity = useSpring(
    glowOpacity as MotionValue<number>,
    CENTER_PEEK_CONFIG.spring
  );

  if (prefersReducedMotion) {
    return (
      <section className={className}>
        <div
          className={`relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 md:px-8 ${shellClassName ?? ""}`}
        >
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/20 blur-3xl" />
          <div
            className={`relative h-[76vh] min-h-[24rem] w-[82%] min-w-[18rem] max-w-6xl overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.45)] ${cardClassName ?? ""}`}
          >
            {children}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className={className}
      style={{ height: `${CENTER_PEEK_CONFIG.scrollHeight * 100}vh` }}
    >
      <div
        className={`sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4 py-12 md:px-8 ${shellClassName ?? ""}`}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/30 blur-3xl"
          style={{ opacity: smoothGlowOpacity }}
        />

        <motion.div
          className={`relative min-w-[18rem] max-w-6xl overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.45)] ${cardClassName ?? ""}`}
          style={{
            width,
            height,
            borderRadius,
            y: smoothY,
            scale: smoothScale,
            opacity: smoothOpacity,
            originY: 1,
          }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
