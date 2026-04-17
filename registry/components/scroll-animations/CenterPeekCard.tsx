"use client";

import type { HTMLAttributes, MotionValue, ReactNode } from "react";
import { useMemo, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

interface CenterPeekCardSpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

interface CenterPeekCardPeekConfig {
  width: number;
  height: number;
  borderRadius: number;
  translateY: number;
  scale: number;
  opacity: number;
}

export const CENTER_PEEK_CARD_DEFAULTS = {
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
  spring: {
    stiffness: 170,
    damping: 26,
    mass: 0.6,
  },
} as const;

export interface CenterPeekCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  children: ReactNode;
  shellClassName?: string;
  cardClassName?: string;
  glowClassName?: string;
  padding?: number;
  scrollHeight?: number;
  settleThreshold?: number;
  peek?: Partial<CenterPeekCardPeekConfig>;
  spring?: Partial<CenterPeekCardSpringConfig>;
}

export function CenterPeekCard({
  children,
  className,
  shellClassName,
  cardClassName,
  glowClassName,
  padding,
  scrollHeight,
  settleThreshold,
  peek,
  spring,
  style,
  ...props
}: CenterPeekCardProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLElement>(null);

  const resolvedPeek = useMemo(
    () => ({ ...CENTER_PEEK_CARD_DEFAULTS.peek, ...peek }),
    [peek]
  );
  const resolvedSpring = useMemo(
    () => ({ ...CENTER_PEEK_CARD_DEFAULTS.spring, ...spring }),
    [spring]
  );
  const resolvedPadding = padding ?? CENTER_PEEK_CARD_DEFAULTS.containerPadding;
  const resolvedScrollHeight = scrollHeight ?? CENTER_PEEK_CARD_DEFAULTS.scrollHeight;
  const rawSettleThreshold = settleThreshold ?? CENTER_PEEK_CARD_DEFAULTS.settleThreshold;
  const resolvedSettleThreshold = Math.min(Math.max(rawSettleThreshold, 0.05), 0.95);

  const settledDimensions = useMemo(
    () => ({
      width: `calc(100vw - ${resolvedPadding * 2}px)`,
      height: `calc(100vh - ${resolvedPadding * 2}px)`,
      borderRadius: Math.max(36 - resolvedPadding * 0.1, 16),
    }),
    [resolvedPadding]
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const sizeProgress = useTransform(
    scrollYProgress,
    [0, resolvedSettleThreshold],
    [0, 1]
  );
  const smoothSizeProgress = useSpring(sizeProgress as MotionValue<number>, resolvedSpring);

  const width = useMotionTemplate`calc(${resolvedPeek.width}px + (100vw - ${resolvedPadding * 2}px - ${resolvedPeek.width}px) * ${smoothSizeProgress})`;
  const height = useMotionTemplate`calc(${resolvedPeek.height}vh + (100vh - ${resolvedPadding * 2}px - ${resolvedPeek.height}vh) * ${smoothSizeProgress})`;

  const borderRadius = useTransform(
    scrollYProgress,
    [0, resolvedSettleThreshold],
    [resolvedPeek.borderRadius, settledDimensions.borderRadius]
  );

  const y = useTransform(
    scrollYProgress,
    [0, resolvedSettleThreshold],
    [resolvedPeek.translateY, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, resolvedSettleThreshold],
    [resolvedPeek.scale, 1]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, resolvedSettleThreshold],
    [resolvedPeek.opacity, 1]
  );

  const glowOpacity = useTransform(
    scrollYProgress,
    [0, resolvedSettleThreshold],
    [0.15, 0.42]
  );

  const smoothY = useSpring(y as MotionValue<number>, resolvedSpring);
  const smoothScale = useSpring(scale as MotionValue<number>, resolvedSpring);
  const smoothOpacity = useSpring(opacity as MotionValue<number>, resolvedSpring);
  const smoothGlowOpacity = useSpring(glowOpacity as MotionValue<number>, resolvedSpring);

  const sectionStyle = prefersReducedMotion
    ? style
    : { ...style, height: `${resolvedScrollHeight * 100}vh` };

  if (prefersReducedMotion) {
    return (
      <section className={className} style={sectionStyle} {...props}>
        <div
          className={cn(
            "relative flex min-h-screen items-center justify-center overflow-hidden",
            shellClassName
          )}
          style={{ padding: resolvedPadding }}
        >
          <div
            className={cn(
              "absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/25 blur-3xl",
              glowClassName
            )}
          />
          <div
            className={cn(
              "relative min-h-[24rem] min-w-[18rem] overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.45)]",
              cardClassName
            )}
            style={{
              width: settledDimensions.width,
              height: settledDimensions.height,
              borderRadius: settledDimensions.borderRadius,
            }}
          >
            {children}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className={className} style={sectionStyle} {...props}>
      <div
        className={cn(
          "sticky top-0 flex h-screen items-center justify-center overflow-hidden",
          shellClassName
        )}
        style={{ padding: resolvedPadding }}
      >
        <motion.div
          className={cn(
            "absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/30 blur-3xl",
            glowClassName
          )}
          style={{ opacity: smoothGlowOpacity }}
        />
        <motion.div
          className={cn(
            "relative min-w-[18rem] overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.45)]",
            cardClassName
          )}
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
