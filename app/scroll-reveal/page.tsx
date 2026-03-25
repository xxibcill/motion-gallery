/**
 * Scroll Reveal Animation Page
 *
 * This page demonstrates a scroll-triggered text reveal animation where text lines animate in
 * sequentially as the user scrolls down. The animation uses a sticky container that creates
 * a long scrollable area while keeping the content fixed in view.
 *
 * Key Features:
 * - Progressive text reveal based on scroll position
 * - Smooth spring physics for natural motion
 * - Accessibility support (respects prefers-reduced-motion)
 * - Gradient text effects and interactive button
 *
 * How it works:
 * 1. A 400vh tall container creates scroll distance
 * 2. A sticky inner container keeps content visible during scroll
 * 3. Each text line has its own scroll threshold range
 * 4. As user scrolls, lines animate from invisible/offset to visible/centered
 */

'use client'

import { motion, useScroll, useTransform, useSpring, useReducedMotion, type MotionValue } from 'framer-motion'
import { useRef, ReactNode } from 'react'

/**
 * Props for ScrollRevealTextLine component
 * @param children - The content to be animated (typically text or inline elements)
 * @param progress - A MotionValue<number> that tracks scroll progress (0 to 1)
 * @param startThreshold - Scroll progress value (0-1) where animation begins (e.g., 0.15 = 15% scroll)
 * @param endThreshold - Scroll progress value (0-1) where animation completes (e.g., 0.35 = 35% scroll)
 * @param className - Optional CSS classes for styling
 */
interface ScrollRevealTextLineProps {
  children: ReactNode
  progress: MotionValue<number>
  startThreshold: number
  endThreshold: number
  className?: string
}

/**
 * ScrollRevealTextLine Component
 *
 * A component that animates its children based on scroll position. When the user scrolls
 * through the specified threshold range, the content fades in, moves up, and scales up.
 *
 * How the animation works:
 * 1. useTransform maps scroll progress to animation values (opacity, y position, scale)
 * 2. useSpring adds smooth physics-based easing to prevent jerky movements
 * 3. motion.div applies these animated values as inline styles
 *
 * Animation values:
 * - Opacity: 0 → 1 (fade in)
 * - Y position: 60px → 0px (slide up from below)
 * - Scale: 0.9 → 1.0 (grow to full size)
 *
 * Accessibility: Respects user's prefers-reduced-motion setting by disabling animations
 */
function ScrollRevealTextLine({
  children,
  progress,
  startThreshold,
  endThreshold,
  className = '',
}: ScrollRevealTextLineProps) {
  // Detect if user prefers reduced motion for accessibility
  const prefersReducedMotion = useReducedMotion()

  // Map scroll progress to opacity: from startThreshold to endThreshold, go from 0 to 1
  const opacity = useTransform(progress, [startThreshold, endThreshold], [0, 1])

  // Map scroll progress to Y position: slide up from 60px to 0px
  const y = useTransform(progress, [startThreshold, endThreshold], [60, 0])

  // Map scroll progress to scale: grow from 90% to 100% size
  const scale = useTransform(progress, [startThreshold, endThreshold], [0.9, 1])

  // Add spring physics for smooth, natural motion (prevents jittery scrolling)
  // Stiffness: how quickly it responds to changes (higher = snappier)
  // Damping: how much it resists oscillation (higher = less bouncy)
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })
  const smoothY = useSpring(y, { stiffness: 80, damping: 20 })
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 25 })

  // If user prefers reduced motion, show static content without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  // Apply the animated values to a motion.div
  return (
    <motion.div
      style={{ opacity: smoothOpacity, y: smoothY, scale: smoothScale }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Main Scroll Reveal Page Component
 *
 * Creates a scroll-based reveal animation with multiple text lines appearing sequentially.
 *
 * Architecture:
 * 1. Container reference: Used by useScroll to track when this element is in view
 * 2. useScroll hook: Creates a scrollYProgress MotionValue that goes from 0 to 1
 *    as the user scrolls through the container
 * 3. Sticky layout: The outer container is 400vh tall (4x viewport height) to create
 *    scroll distance, while the inner container is sticky (positioned at top: 0)
 * 4. Sequential animations: Each ScrollRevealTextLine has different threshold values,
 *    causing them to animate in at different scroll positions
 *
 * Threshold values explained (0-1 scale representing % of container scrolled):
 * - 0.15 → 0.35: First line appears when 15-35% scrolled
 * - 0.40 → 0.60: Second line appears when 40-60% scrolled
 * - 0.65 → 0.85: Button appears when 65-85% scrolled
 */
export default function ScrollRevealPage() {
  // Reference to the scroll container element
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * useScroll hook tracks scroll position relative to the container
   * target: The element to track scroll within
   * offset: ['start start', 'end end'] means:
   *   - Animation starts when container top reaches viewport top (0%)
   *   - Animation ends when container bottom reaches viewport bottom (100%)
   */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <main className="bg-zinc-950">
      {/* Placeholder content before locked section */}
      <div className="h-screen flex items-center justify-center">
        <p className="text-zinc-500 text-lg">Scroll down to see the animation</p>
      </div>

      {/* Tall scroll container for locked section */}
      {/* Height of 400vh creates 4 viewport heights of scroll distance */}
      <div ref={containerRef} className="relative h-[400vh]">
        {/* Sticky inner container */}
        {/* Stays fixed at top-0 while user scrolls through the outer container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-zinc-950">
          {/* Center text with scroll reveal */}
          <div className="relative z-10 flex flex-col items-center justify-center h-screen gap-2">
            {/* First text line: "Scroll Reveal" */}
            {/* Animates in when scroll progress reaches 15-35% */}
            <ScrollRevealTextLine
              progress={scrollYProgress}
              startThreshold={0.15}
              endThreshold={0.35}
              className="text-white font-bold text-center leading-tight"
            >
              <span className="block" style={{ fontSize: 56 }}>
                Scroll Reveal
              </span>
            </ScrollRevealTextLine>

            {/* Second text line: "Animation Demo" with gradient */}
            {/* Animates in when scroll progress reaches 40-60% */}
            {/* Uses bg-gradient-to-r for rainbow text effect */}
            {/* bg-clip-text makes the background color only apply to text */}
            {/* text-transparent makes the actual text transparent so gradient shows through */}
            <ScrollRevealTextLine
              progress={scrollYProgress}
              startThreshold={0.40}
              endThreshold={0.60}
              className="text-center leading-tight"
            >
              <span
                className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                style={{ fontSize: 56 }}
              >
                Animation Demo
              </span>
            </ScrollRevealTextLine>

            {/* Call-to-action button */}
            {/* Animates in when scroll progress reaches 65-85% */}
            {/* Includes hover effects: scale, shadow, and color shift */}
            <ScrollRevealTextLine
              progress={scrollYProgress}
              startThreshold={0.65}
              endThreshold={0.85}
              className="mt-6"
            >
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                Get Started
              </button>
            </ScrollRevealTextLine>
          </div>
        </div>
      </div>
    </main>
  )
}
