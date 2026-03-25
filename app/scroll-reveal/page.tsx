'use client'

import { motion, useScroll, useTransform, useSpring, useReducedMotion, type MotionValue } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface ScrollRevealTextLineProps {
  children: ReactNode
  progress: MotionValue<number>
  startThreshold: number
  endThreshold: number
  className?: string
}

function ScrollRevealTextLine({
  children,
  progress,
  startThreshold,
  endThreshold,
  className = '',
}: ScrollRevealTextLineProps) {
  const prefersReducedMotion = useReducedMotion()

  const opacity = useTransform(progress, [startThreshold, endThreshold], [0, 1])
  const y = useTransform(progress, [startThreshold, endThreshold], [60, 0])
  const scale = useTransform(progress, [startThreshold, endThreshold], [0.9, 1])

  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })
  const smoothY = useSpring(y, { stiffness: 80, damping: 20 })
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 25 })

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      style={{ opacity: smoothOpacity, y: smoothY, scale: smoothScale }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function ScrollRevealPage() {
  const containerRef = useRef<HTMLDivElement>(null)

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
      <div ref={containerRef} className="relative h-[400vh]">
        {/* Sticky inner container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-zinc-950">
          {/* Center text with scroll reveal */}
          <div className="relative z-10 flex flex-col items-center justify-center h-screen gap-2">
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
