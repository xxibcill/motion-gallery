'use client'

import {
  type MotionValue,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import type { ReactNode } from 'react'
import { useMemo, useRef } from 'react'

export const CENTER_PEEK_CONFIG = {
  scrollHeight: 2.4,
  settleThreshold: 0.42,
  containerPadding: 40, // Adjustable padding in pixels
  peek: {
    width: 760, // Starting width in pixels
    height: 48,
    borderRadius: 32,
    translateY: 180,
    scale: 0.94,
    opacity: 0.75,
  },
  spring: {
    stiffness: 110,
    damping: 28,
    mass: 0.9,
  },
} as const

export interface CenterPeekCardProps {
  children: ReactNode
  className?: string
  shellClassName?: string
  cardClassName?: string
  /** Padding around the card in pixels when settled. Defaults to 40. */
  padding?: number
}

export function CenterPeekCard({
  children,
  className,
  shellClassName,
  cardClassName,
  padding = CENTER_PEEK_CONFIG.containerPadding,
}: CenterPeekCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate settled dimensions based on padding
  const settledDimensions = useMemo(
    () => ({
      width: `calc(100vw - ${padding * 2}px)`,
      height: `calc(100vh - ${padding * 2}px)`,
      borderRadius: Math.max(36 - padding * 0.1, 16), // Slightly reduce border radius with larger padding
    }),
    [padding],
  )

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Progress value for width/height interpolation (0 = peek, 1 = settled)
  const sizeProgress = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_CONFIG.settleThreshold],
    [0, 1],
  )
  const smoothSizeProgress = useSpring(sizeProgress as MotionValue<number>, CENTER_PEEK_CONFIG.spring)

  // Use motion template to properly interpolate between fixed and viewport units
  const width = useMotionTemplate`calc(${CENTER_PEEK_CONFIG.peek.width}px + (100vw - ${padding * 2}px - ${CENTER_PEEK_CONFIG.peek.width}px) * ${smoothSizeProgress})`
  const height = useMotionTemplate`calc(${CENTER_PEEK_CONFIG.peek.height}vh + (100vh - ${padding * 2}px - ${CENTER_PEEK_CONFIG.peek.height}vh) * ${smoothSizeProgress})`

  const borderRadius = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_CONFIG.settleThreshold],
    [CENTER_PEEK_CONFIG.peek.borderRadius, settledDimensions.borderRadius],
  )

  const y = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_CONFIG.settleThreshold],
    [CENTER_PEEK_CONFIG.peek.translateY, 0],
  )

  const scale = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_CONFIG.settleThreshold],
    [CENTER_PEEK_CONFIG.peek.scale, 1],
  )

  const opacity = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_CONFIG.settleThreshold],
    [CENTER_PEEK_CONFIG.peek.opacity, 1],
  )

  const glowOpacity = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_CONFIG.settleThreshold],
    [0.15, 0.42],
  )

  const smoothY = useSpring(y as MotionValue<number>, CENTER_PEEK_CONFIG.spring)
  const smoothScale = useSpring(scale as MotionValue<number>, CENTER_PEEK_CONFIG.spring)
  const smoothOpacity = useSpring(opacity as MotionValue<number>, CENTER_PEEK_CONFIG.spring)
  const smoothGlowOpacity = useSpring(glowOpacity as MotionValue<number>, CENTER_PEEK_CONFIG.spring)

  if (prefersReducedMotion) {
    return (
      <section className={className}>
        <div
          className={`relative flex min-h-screen items-center justify-center overflow-hidden ${shellClassName ?? ''}`}
          style={{ padding }}
        >
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/20 blur-3xl" />
          <div
            className={`relative min-h-[24rem] min-w-[18rem] overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.45)] ${cardClassName ?? ''}`}
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
    )
  }

  return (
    <section
      ref={containerRef}
      className={className}
      style={{ height: `${CENTER_PEEK_CONFIG.scrollHeight * 100}vh` }}
    >
      <div
        className={`sticky top-0 flex h-screen items-center justify-center overflow-hidden ${shellClassName ?? ''}`}
        style={{ padding }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/30 blur-3xl"
          style={{ opacity: smoothGlowOpacity }}
        />

        <motion.div
          className={`relative min-w-[18rem] overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.45)] ${cardClassName ?? ''}`}
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
  )
}
