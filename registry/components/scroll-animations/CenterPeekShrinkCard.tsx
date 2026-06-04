'use client'

/**
 * CenterPeekShrinkCard - A two-phase scroll-driven card animation
 *
 * Phase 1 (GROW):   Card expands from a small "peek" state to full viewport
 * Phase 2 (SHRINK): Card collapses to a compact header anchored at the top
 */

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

// =============================================================================
// SHARED CONFIG (inlined from peek-cards/configs.ts)
// =============================================================================

const CENTER_PEEK_SHRINK_CONFIG = {
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
  spring: {
    stiffness: 170,
    damping: 26,
    mass: 0.6,
  },
} as const

// Re-export config for consumers who reference it
export const CENTER_PEEK_SHRINK_CONFIG_EXPORT = CENTER_PEEK_SHRINK_CONFIG

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface CenterPeekShrinkCardProps {
  children: ReactNode
  className?: string
  shellClassName?: string
  cardClassName?: string
  padding?: number
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CenterPeekShrinkCard({
  children,
  className,
  shellClassName,
  cardClassName,
  padding = CENTER_PEEK_SHRINK_CONFIG.containerPadding,
}: CenterPeekShrinkCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const settledDimensions = useMemo(
    () => ({
      width: `calc(100vw - ${padding * 2}px)`,
      height: `calc(100vh - ${padding * 2}px)`,
      borderRadius: Math.max(36 - padding * 0.1, 16),
    }),
    [padding],
  )

  // Phase 1: GROW
  const growProgress = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold],
    [0, 1],
  )
  const smoothGrowProgress = useSpring(
    growProgress as MotionValue<number>,
    CENTER_PEEK_SHRINK_CONFIG.spring,
  )

  // Phase 2: SHRINK
  const shrinkProgress = useTransform(
    scrollYProgress,
    [CENTER_PEEK_SHRINK_CONFIG.settleThreshold, 0.5, 1],
    [0, 1, 1],
  )
  const smoothShrinkProgress = useSpring(
    shrinkProgress as MotionValue<number>,
    CENTER_PEEK_SHRINK_CONFIG.spring,
  )

  // Width (grow only)
  const width = useMotionTemplate`calc(${CENTER_PEEK_SHRINK_CONFIG.peek.width}px + (100vw - ${padding * 2}px - ${CENTER_PEEK_SHRINK_CONFIG.peek.width}px) * ${smoothGrowProgress})`

  // Height (two-phase: grow then shrink)
  const fullHeight = `calc(100vh - ${padding * 2}px)`
  const peekHeight = `${CENTER_PEEK_SHRINK_CONFIG.peek.height}vh`
  const collapsedHeight = `${CENTER_PEEK_SHRINK_CONFIG.shrink.targetHeight}px`
  const growHeight = useMotionTemplate`calc(${peekHeight} + (${fullHeight} - ${peekHeight}) * ${smoothGrowProgress})`
  const height = useMotionTemplate`calc(${growHeight} - (${fullHeight} - ${collapsedHeight}) * ${smoothShrinkProgress})`

  // Border radius
  const borderRadius = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold, 1],
    [
      CENTER_PEEK_SHRINK_CONFIG.peek.borderRadius,
      settledDimensions.borderRadius,
      CENTER_PEEK_SHRINK_CONFIG.shrink.targetBorderRadius,
    ],
  )

  // Y stays centered
  const y = useTransform(scrollYProgress, [0, 1], [0, 0])
  const scale = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold],
    [CENTER_PEEK_SHRINK_CONFIG.peek.scale, 1],
  )
  const opacity = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold],
    [CENTER_PEEK_SHRINK_CONFIG.peek.opacity, 1],
  )
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold, 1],
    [0.15, 0.42, 0.2],
  )

  const smoothY = useSpring(y as MotionValue<number>, CENTER_PEEK_SHRINK_CONFIG.spring)
  const smoothScale = useSpring(scale as MotionValue<number>, CENTER_PEEK_SHRINK_CONFIG.spring)
  const smoothOpacity = useSpring(opacity as MotionValue<number>, CENTER_PEEK_SHRINK_CONFIG.spring)
  const smoothGlowOpacity = useSpring(
    glowOpacity as MotionValue<number>,
    CENTER_PEEK_SHRINK_CONFIG.spring,
  )
  const smoothBorderRadius = useSpring(
    borderRadius as MotionValue<number>,
    CENTER_PEEK_SHRINK_CONFIG.spring,
  )

  if (prefersReducedMotion) {
    return (
      <section className={className}>
        <div
          className={`relative flex min-h-screen items-start justify-center overflow-hidden ${shellClassName ?? ''}`}
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
      data-testid="center-peek-shrink-card"
      className={className}
      style={{ height: `${CENTER_PEEK_SHRINK_CONFIG.scrollHeight * 100}vh` }}
    >
      <div
        className={`sticky top-0 flex h-screen items-start justify-center overflow-hidden ${shellClassName ?? ''}`}
        style={{ padding }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/30 blur-3xl"
          style={{ opacity: smoothGlowOpacity }}
        />
        <motion.div
          data-testid="center-peek-shrink-card-inner"
          className={`relative min-w-[18rem] overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.45)] ${cardClassName ?? ''}`}
          style={{
            width,
            height,
            borderRadius: smoothBorderRadius,
            y: smoothY,
            scale: smoothScale,
            opacity: smoothOpacity,
            originY: 0,
          }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
