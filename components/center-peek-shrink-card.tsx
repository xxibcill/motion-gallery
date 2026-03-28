'use client'

/**
 * CenterPeekShrinkCard - A two-phase scroll-driven card animation
 *
 * OVERVIEW
 * --------
 * This component creates a card that animates in two phases as the user scrolls:
 *
 *   Phase 1 (GROW):   Card expands from a small "peek" state to full viewport
 *   Phase 2 (SHRINK): Card collapses to a compact header anchored at the top
 *
 * SCROLL TIMELINE
 * ---------------
 *
 *   0% ─────────────── settleThreshold ───── shrinkThreshold ─────────────── 100%
 *   │        PHASE 1 (GROW)        │   PAUSE   │      PHASE 2 (SHRINK)      │
 *   │   peek → full viewport       │  (full)   │   full → collapsed header  │
 *
 *
 * CONFIGURATION GUIDE
 * -------------------
 * Adjust CENTER_PEEK_SHRINK_CONFIG to customize the animation:
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TIMING CONTROLS                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ scrollHeight      │ Total scroll container height in viewport units         │
 * │                   │ • Higher = more scroll distance                         │
 * │                   │ • Default: 3.2 (320vh)                                  │
 * │                   │ • Increase to extend collapsed state duration            │
 * │                   │   Example: 4.5 = 450vh = longer collapsed state         │
 * │                   │                                                          │
 * │ settleThreshold   │ When card reaches FULL SIZE (Phase 1 complete)          │
 * │                   │ • Range: 0.0 - 1.0 (fraction of scroll progress)         │
 * │                   │ • Lower = settles faster                                 │
 * │                   │ • Default: 0.32 (32% of scroll)                          │
 * │                   │                                                          │
 * │ shrinkThreshold   │ When SHRINK PHASE begins                                │
 * │                   │ • Range: settleThreshold - 1.0                           │
 * │                   │ • Higher = longer pause at full size                     │
 * │                   │ • Default: 0.55 (55% of scroll)                          │
 * │                   │                                                          │
 * │ TIP: Gap between settleThreshold and shrinkThreshold = time at full size   │
 * │      Example: settleThreshold: 0.25, shrinkThreshold: 0.75                 │
 * │      → Card stays full for 50% of scroll before shrinking                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ PEEK STATE (Initial appearance)                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ peek.width        │ Starting width in pixels          │ Default: 760       │
 * │ peek.height       │ Starting height in vh             │ Default: 48        │
 * │ peek.borderRadius │ Starting border radius in px      │ Default: 32        │
 * │ peek.translateY   │ Starting Y offset from center     │ Default: 180       │
 * │ peek.scale        │ Starting scale                    │ Default: 0.94      │
 * │ peek.opacity      │ Starting opacity                  │ Default: 0.75      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ SHRINK STATE (Collapsed header)                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ shrink.targetHeight     │ Final collapsed height in px  │ Default: 300     │
 * │ shrink.targetBorderRadius │ Final border radius in px  │ Default: 20      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ SPRING PHYSICS                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ spring.stiffness  │ Spring tension                    │ Default: 110       │
 * │                   │ • Higher = snappier, more responsive                  │
 * │                   │ • Lower = smoother, more gradual                       │
 * │                   │                                                          │
 * │ spring.damping    │ Friction/resistance               │ Default: 28        │
 * │                   │ • Higher = less oscillation       │
 * │                   │ • Lower = more bounce             │
 * │                   │                                                          │
 * │ spring.mass       │ Virtual mass of animated object   │ Default: 0.9       │
 * │                   │ • Higher = heavier, slower        │
 * │                   │ • Lower = lighter, faster         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ LAYOUT                                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ containerPadding  │ Space around card when settled    │ Default: 40        │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * COMMON ADJUSTMENTS
 * ------------------
 *
 * 1. LONGER COLLAPSED STATE (more scroll time after shrink):
 *    scrollHeight: 4.5, settleThreshold: 0.22, shrinkThreshold: 0.40
 *
 * 2. LONGER FULL-SIZE STATE (pause longer before shrinking):
 *    settleThreshold: 0.25, shrinkThreshold: 0.75
 *
 * 3. FASTER/SNAPPIER ANIMATION:
 *    spring: { stiffness: 200, damping: 25, mass: 0.5 }
 *
 * 4. SMOOTHER/GENTLER ANIMATION:
 *    spring: { stiffness: 80, damping: 35, mass: 1.2 }
 *
 * 5. LARGER COLLAPSED HEADER:
 *    shrink: { targetHeight: 400, targetBorderRadius: 24 }
 *
 * 6. SMALLER INITIAL PEEK:
 *    peek: { width: 500, height: 32, scale: 0.9, opacity: 0.6 }
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
import { CENTER_PEEK_SHRINK_CONFIG as SHARED_CONFIG } from '@/components/peek-cards/configs'

// Re-export config for backward compatibility
export const CENTER_PEEK_SHRINK_CONFIG = SHARED_CONFIG

// ============================================================================
// COMPONENT PROPS
// ============================================================================
export interface CenterPeekShrinkCardProps {
  /** Content to render inside the animated card */
  children: ReactNode
  /** CSS classes for the outer section element (scroll container) */
  className?: string
  /** CSS classes for the shell/viewport container (sticky wrapper) */
  shellClassName?: string
  /** CSS classes for the card itself */
  cardClassName?: string
  /** Padding around card when settled (overrides config.containerPadding) */
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
  // ---------------------------------------------------------------------------
  // ACCESSIBILITY: Respect user's reduced motion preference
  // ---------------------------------------------------------------------------
  // If user has enabled "Reduce Motion" in their OS, we skip animations
  // and render a static version of the card
  const prefersReducedMotion = useReducedMotion()

  // ---------------------------------------------------------------------------
  // REF: Track the scroll container element
  // ---------------------------------------------------------------------------
  // This ref is attached to the outer section and used by useScroll
  // to calculate scroll progress relative to this container
  const containerRef = useRef<HTMLDivElement>(null)

  // ---------------------------------------------------------------------------
  // SCROLL TRACKING: Get scroll progress (0 to 1)
  // ---------------------------------------------------------------------------
  // useScroll returns scrollYProgress which updates as user scrolls
  // - offset: ['start end', 'end start'] means:
  //   - Progress = 0 when container top enters viewport bottom
  //   - Progress = 1 when container bottom exits viewport top
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // ---------------------------------------------------------------------------
  // SETTLED DIMENSIONS: Calculate final full-size card dimensions
  // ---------------------------------------------------------------------------
  // These dimensions are used for:
  // 1. The target of Phase 1 (grow) animation
  // 2. The static fallback when reduced motion is enabled
  const settledDimensions = useMemo(
    () => ({
      // Full width minus padding on both sides
      width: `calc(100vw - ${padding * 2}px)`,
      // Full height minus padding on top and bottom
      height: `calc(100vh - ${padding * 2}px)`,
      // Border radius decreases slightly with more padding
      // Ensures minimum of 16px to maintain rounded appearance
      borderRadius: Math.max(36 - padding * 0.1, 16),
    }),
    [padding],
  )

  // ===========================================================================
  // PHASE 1: GROW PROGRESS
  // ===========================================================================
  // Maps scroll progress to a 0-1 value representing the grow animation
  //
  // How it works:
  // - At scroll 0%: growProgress = 0 (card is in peek state)
  // - At scroll settleThreshold (32%): growProgress = 1 (card is full size)
  // - After settleThreshold: growProgress stays at 1 (clamped)
  //
  // Example timeline with settleThreshold = 0.32:
  //   scroll:    0%    10%   20%   32%   50%   80%   100%
  //   progress:  0.00  0.31  0.62  1.00  1.00  1.00  1.00
  const growProgress = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold],
    [0, 1],
  )

  // Apply spring smoothing to growProgress for natural-feeling animation
  // Without this, the animation would feel mechanical/linear
  const smoothGrowProgress = useSpring(
    growProgress as MotionValue<number>,
    CENTER_PEEK_SHRINK_CONFIG.spring,
  )

  // ===========================================================================
  // PHASE 2: SHRINK PROGRESS
  // ===========================================================================
  // Maps scroll progress to a 0-1 value representing the shrink animation
  //
  // How it works:
  // - From 0% to shrinkThreshold: shrinkProgress = 0 (no shrinking yet)
  // - From shrinkThreshold to 100%: shrinkProgress goes 0 → 1
  //
  // The 3-point mapping [settleThreshold, shrinkThreshold, 1] → [0, 0, 1]
  // creates a "delay" where shrinkProgress stays at 0 between settle and shrink
  //
  // Example timeline with settleThreshold = 0.32, shrinkThreshold = 0.55:
  //   scroll:    0%    32%   40%   55%   70%   85%   100%
  //   progress:  0.00  0.00  0.00  0.00  0.33  0.67  1.00
  //                              ↑ shrink starts here
  //
  // NEW TIMELINE: Card shrinks from 22% to 50% scroll, then stays collapsed
  //   scroll:    0%    22%   30%   40%   50%   75%   100%
  //   progress:  0.00  0.00  0.19  0.44  1.00  1.00  1.00
  //                      ↑ shrink starts     ↑ shrink complete
  const shrinkProgress = useTransform(
    scrollYProgress,
    [CENTER_PEEK_SHRINK_CONFIG.settleThreshold, 0.5, 1],
    [0, 1, 1], // Shrinks from 0→1 between settleThreshold and 50%, stays at 1
  )

  // Apply spring smoothing to shrinkProgress
  const smoothShrinkProgress = useSpring(
    shrinkProgress as MotionValue<number>,
    CENTER_PEEK_SHRINK_CONFIG.spring,
  )

  // ===========================================================================
  // WIDTH ANIMATION
  // ===========================================================================
  // Width only grows during Phase 1, then stays constant during Phase 2
  //
  // Formula: startWidth + (endWidth - startWidth) * progress
  //
  // Visual timeline:
  //   scroll:   0%        32%       55%       100%
  //   width:   760px  →  full   →  full   →  full
  //            (peek)   (settled)  (stays same during shrink)
  const width = useMotionTemplate`calc(${CENTER_PEEK_SHRINK_CONFIG.peek.width}px + (100vw - ${padding * 2}px - ${CENTER_PEEK_SHRINK_CONFIG.peek.width}px) * ${smoothGrowProgress})`

  // ===========================================================================
  // HEIGHT ANIMATION (Two-Phase)
  // ===========================================================================
  // Height animates in both phases: grows first, then shrinks
  //
  // Phase 1 (grow):  48vh → full viewport height
  // Phase 2 (shrink): full viewport height → 300px
  //
  // Visual timeline:
  //   scroll:   0%        32%           55%          100%
  //   height:  48vh  →   full vh   →   full vh   →   300px
  //           (peek)    (settled)     (stays full)   (collapsed)

  // Define the three key height values
  const fullHeight = `calc(100vh - ${padding * 2}px)` // Full viewport minus padding
  const peekHeight = `${CENTER_PEEK_SHRINK_CONFIG.peek.height}vh` // Initial peek height
  const collapsedHeight = `${CENTER_PEEK_SHRINK_CONFIG.shrink.targetHeight}px` // Final collapsed

  // Step 1: Calculate height after grow phase
  // Interpolates from peekHeight to fullHeight based on growProgress
  const growHeight = useMotionTemplate`calc(${peekHeight} + (${fullHeight} - ${peekHeight}) * ${smoothGrowProgress})`

  // Step 2: Calculate height after shrink phase
  // Takes the grown height and subtracts the shrink amount
  // shrinkAmount = (fullHeight - collapsedHeight) * shrinkProgress
  const height = useMotionTemplate`calc(${growHeight} - (${fullHeight} - ${collapsedHeight}) * ${smoothShrinkProgress})`

  // ===========================================================================
  // BORDER RADIUS ANIMATION
  // ===========================================================================
  // Border radius decreases smoothly across both phases
  //
  // Visual timeline:
  //   scroll:   0%        32%        100%
  //   radius:  32px  →   ~32px  →   20px
  //           (peek)    (settled)   (collapsed)
  //
  // The middle value is calculated based on padding (see settledDimensions)
  const borderRadius = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold, 1],
    [
      CENTER_PEEK_SHRINK_CONFIG.peek.borderRadius,
      settledDimensions.borderRadius,
      CENTER_PEEK_SHRINK_CONFIG.shrink.targetBorderRadius,
    ],
  )

  // ===========================================================================
  // Y POSITION ANIMATION
  // ===========================================================================
  // Card stays centered on screen throughout all phases.
  // The shrink effect comes from height reduction + originY: 0 (top anchor),
  // which makes the card collapse from bottom to top while staying at the same Y.
  //
  // Visual timeline:
  //   scroll:   0%        22%        50%        100%
  //   Y:        0px   →    0px   →    0px   →    0px
  //         (always centered at top)
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 0],
  )

  // ===========================================================================
  // SCALE ANIMATION (Phase 1 only)
  // ===========================================================================
  // Scale creates a subtle zoom-in effect during grow phase
  //
  // Visual timeline:
  //   scroll:   0%        32%        100%
  //   scale:  0.94   →   1.0   →    1.0
  //          (peek)    (full)    (stays full)
  //
  // 0.94 to 1.0 is subtle but noticeable - creates depth perception
  const scale = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold],
    [CENTER_PEEK_SHRINK_CONFIG.peek.scale, 1],
  )

  // ===========================================================================
  // OPACITY ANIMATION (Phase 1 only)
  // ===========================================================================
  // Card fades in from slightly transparent to fully opaque
  //
  // Visual timeline:
  //   scroll:   0%        32%        100%
  //   opacity: 0.75  →   1.0   →    1.0
  //           (peek)    (full)    (stays full)
  //
  // 0.75 creates a subtle "hazy" initial state that clears as user scrolls
  const opacity = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold],
    [CENTER_PEEK_SHRINK_CONFIG.peek.opacity, 1],
  )

  // ===========================================================================
  // GLOW OPACITY ANIMATION (Background effect)
  // ===========================================================================
  // The orange glow behind the card has its own opacity animation
  //
  // Visual timeline:
  //   scroll:   0%        32%        100%
  //   glow:    0.15  →   0.42  →   0.20
  //          (subtle)  (bright)  (dimmed for collapsed)
  //
  // Glow is brightest when card is full, dims slightly when collapsed
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold, 1],
    [0.15, 0.42, 0.2],
  )

  // ===========================================================================
  // SPRING SMOOTHING: Apply physics to all animated values
  // ===========================================================================
  // Each animated property gets its own spring-smoothed motion value.
  // This is what makes the animation feel natural instead of robotic.
  //
  // Without spring smoothing:
  //   - Animations would follow exact scroll position (mechanical feel)
  //   - Stopping scroll would immediately stop animation (jarring)
  //
  // With spring smoothing:
  //   - Animations "chase" the target value with physics
  //   - Stopping scroll lets animation settle smoothly (natural feel)
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

  // ===========================================================================
  // REDUCED MOTION FALLBACK
  // ===========================================================================
  // When user prefers reduced motion, render a static card without animations.
  // This ensures accessibility while still showing the content.
  if (prefersReducedMotion) {
    return (
      <section className={className}>
        <div
          className={`relative flex min-h-screen items-start justify-center overflow-hidden ${shellClassName ?? ''}`}
          style={{ padding }}
        >
          {/* Static glow effect */}
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/20 blur-3xl" />
          {/* Static card at settled dimensions */}
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

  // ===========================================================================
  // MAIN RENDER: Animated scroll-driven card
  // ===========================================================================
  return (
    // ---------------------------------------------------------------------------
    // OUTER SECTION: The scroll container
    // ---------------------------------------------------------------------------
    // This section is very tall (scrollHeight * 100vh) to create scroll distance.
    // As user scrolls through this tall container, scrollYProgress goes 0 → 1.
    <section
      ref={containerRef}
      className={className}
      style={{ height: `${CENTER_PEEK_SHRINK_CONFIG.scrollHeight * 100}vh` }}
    >
      {/* ---------------------------------------------------------------------------
          INNER SHELL: Sticky viewport wrapper
          ---------------------------------------------------------------------------
          This div is sticky (position: sticky, top: 0), so it stays visible
          while the outer section scrolls past. This creates the "scroll within
          a fixed viewport" effect.

          - h-screen: Takes full viewport height
          - items-center justify-center: Centers the card (before shrinking)
          - overflow-hidden: Clips any content that exceeds bounds
          ---------------------------------------------------------------------------- */}
      <div
        className={`sticky top-0 flex h-screen items-start justify-center overflow-hidden ${shellClassName ?? ''}`}
        style={{ padding }}
      >
        {/* ---------------------------------------------------------------------------
            BACKGROUND GLOW: Decorative ambient light effect
            ---------------------------------------------------------------------------
            A large, blurred orange circle behind the card that creates depth.
            Opacity animates with scroll via smoothGlowOpacity.
            ---------------------------------------------------------------------------- */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/30 blur-3xl"
          style={{ opacity: smoothGlowOpacity }}
        />

        {/* ---------------------------------------------------------------------------
            THE CARD: Main animated element
            ---------------------------------------------------------------------------
            This is the visible card that grows, settles, and shrinks.
            All animated properties are applied via the style prop using
            motion values that update with scroll progress.

            Properties animated:
            - width: Grows during Phase 1
            - height: Grows in Phase 1, shrinks in Phase 2
            - borderRadius: Decreases across both phases
            - y: Rises up, then anchors to top
            - scale: Zooms in during Phase 1
            - opacity: Fades in during Phase 1
            - originY: 0 = transform origin at top (shrinks from bottom to top)
            ---------------------------------------------------------------------------- */}
        <motion.div
          data-testid="center-peek-card"
          className={`relative min-w-[18rem] overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.45)] ${cardClassName ?? ''}`}
          style={{
            width,
            height,
            borderRadius: smoothBorderRadius,
            y: smoothY,
            scale: smoothScale,
            opacity: smoothOpacity,
            originY: 0, // Transform origin at top, so card shrinks from bottom to top
          }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
