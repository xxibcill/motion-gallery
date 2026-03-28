"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { useRef, ReactNode } from "react";
import { BOTTOM_PEEK_V1_CONFIG } from "@/components/peek-cards/configs";

// Re-export config for backward compatibility
export const BOTTOM_PEEK_CONFIG = BOTTOM_PEEK_V1_CONFIG;

// Props for the bottom peek card
export interface BottomPeekCardProps {
  children: ReactNode;
  className?: string;
  bgClass?: string;
}

export function BottomPeekCard({
  children,
  className,
  bgClass = "bg-zinc-900",
}: BottomPeekCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Width transitions from 50% to 100%
  const width = useTransform(
    scrollYProgress,
    [0, BOTTOM_PEEK_CONFIG.expandThreshold],
    [`${BOTTOM_PEEK_CONFIG.peek.width * 100}%`, "100%"]
  );

  // Border radius transitions from rounded to flat
  const borderRadius = useTransform(
    scrollYProgress,
    [0, BOTTOM_PEEK_CONFIG.expandThreshold],
    [BOTTOM_PEEK_CONFIG.peek.borderRadius, BOTTOM_PEEK_CONFIG.full.borderRadius]
  );

  // Scale slight zoom effect
  const scale = useTransform(
    scrollYProgress,
    [0, BOTTOM_PEEK_CONFIG.expandThreshold],
    [BOTTOM_PEEK_CONFIG.peek.scale, BOTTOM_PEEK_CONFIG.full.scale]
  );

  // Opacity fade in with spring smoothing
  const opacity = useTransform(
    scrollYProgress,
    [-0.1, 0.05],
    [0, 1]
  );
  const smoothOpacity = useSpring(opacity, {
    stiffness: BOTTOM_PEEK_CONFIG.spring.stiffness,
    damping: BOTTOM_PEEK_CONFIG.spring.damping,
    mass: BOTTOM_PEEK_CONFIG.spring.mass,
  });

  // Reduced motion fallback
  if (prefersReducedMotion) {
    return (
      <div
        ref={containerRef}
        className={`relative ${className}`}
        style={{ height: `${BOTTOM_PEEK_CONFIG.scrollHeight * 100}vh` }}
      >
        <div className={`sticky bottom-0 w-full h-screen ${bgClass}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: `${BOTTOM_PEEK_CONFIG.scrollHeight * 100}vh` }}
    >
      <motion.div
        data-testid="bottom-peek-card"
        className={`sticky bottom-0 h-screen ${bgClass} overflow-hidden shadow-2xl mx-auto`}
        style={{
          width: width,
          borderRadius: borderRadius,
          scale: scale,
          opacity: smoothOpacity,
          originY: 1, // Scale from bottom
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Convenience component for content with fade-up animation
export interface BottomPeekContentProps {
  title?: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
}

export function BottomPeekContent({
  title,
  subtitle,
  description,
  children,
}: BottomPeekContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(
    scrollYProgress,
    [0, BOTTOM_PEEK_CONFIG.expandThreshold],
    [40, 0]
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, BOTTOM_PEEK_CONFIG.expandThreshold * 0.5],
    [0, 1]
  );

  const smoothY = useSpring(contentY, BOTTOM_PEEK_CONFIG.spring);
  const smoothOpacity = useSpring(contentOpacity, BOTTOM_PEEK_CONFIG.spring);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <motion.div
        className="absolute inset-0 flex items-center justify-center px-8"
        style={{ y: smoothY, opacity: smoothOpacity }}
      >
        <div className="max-w-3xl text-center">
          {children ?? (
            <>
              {title && (
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && (
                <h3 className="text-lg md:text-xl text-zinc-300 mb-3">
                  {subtitle}
                </h3>
              )}
              {description && (
                <p className="text-base text-zinc-400 max-w-lg mx-auto">
                  {description}
                </p>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
