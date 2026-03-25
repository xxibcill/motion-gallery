'use client'

import { motion, useScroll, useTransform, useSpring, useReducedMotion, type MotionValue } from 'framer-motion'
import { useRef, useState, useEffect, ReactNode } from 'react'
import { ControlsPanel, ControlSlider } from '@/components/ControlsPanel'

// Sample logo colors - you can replace these with actual logos
const logoColors = [
  'bg-gradient-to-br from-blue-500 to-blue-700',
  'bg-gradient-to-br from-purple-500 to-purple-700',
  'bg-gradient-to-br from-pink-500 to-pink-700',
  'bg-gradient-to-br from-orange-500 to-orange-700',
  'bg-gradient-to-br from-green-500 to-green-700',
  'bg-gradient-to-br from-cyan-500 to-cyan-700',
  'bg-gradient-to-br from-rose-500 to-rose-700',
  'bg-gradient-to-br from-amber-500 to-amber-700',
  'bg-gradient-to-br from-indigo-500 to-indigo-700',
  'bg-gradient-to-br from-emerald-500 to-emerald-700',
  'bg-gradient-to-br from-violet-500 to-violet-700',
  'bg-gradient-to-br from-teal-500 to-teal-700',
]

interface FloatingLogoProps {
  color: string
  size: number
  initialX: number
  initialY: number
  floatDuration: number
  floatDistance: number
  rotationDuration: number
  delay: number
}

function FloatingLogo({
  color,
  size,
  initialX,
  initialY,
  floatDuration,
  floatDistance,
  rotationDuration,
  delay,
}: FloatingLogoProps) {
  return (
    <motion.div
      className={`absolute rounded-2xl ${color} shadow-lg`}
      style={{
        width: size,
        height: size,
        left: `${initialX}%`,
        top: `${initialY}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 0.9,
        scale: 1,
        y: [0, -floatDistance, 0, floatDistance, 0],
        x: [0, floatDistance * 0.5, 0, -floatDistance * 0.5, 0],
        rotate: [0, 5, 0, -5, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: {
          duration: floatDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
        x: {
          duration: floatDuration * 1.3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
        rotate: {
          duration: rotationDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
      }}
    />
  )
}

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

export default function FloatingLogosPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [floatSpeed, setFloatSpeed] = useState(6) // seconds for one cycle
  const [floatDistance, setFloatDistance] = useState(20) // pixels
  const [logoCount, setLogoCount] = useState(12)
  const [logos, setLogos] = useState<Array<{
    color: string
    size: number
    initialX: number
    initialY: number
    floatDuration: number
    floatDistance: number
    rotationDuration: number
    delay: number
  }>>([])

  // Scroll progress for the locked section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Generate logo configurations on client only to avoid hydration mismatch
  useEffect(() => {
    const newLogos = Array.from({ length: logoCount }, (_, i) => ({
      color: logoColors[i % logoColors.length],
      size: 40 + Math.random() * 40,
      initialX: 5 + i * (90 / logoCount) + Math.random() * 5,
      initialY: 10 + Math.random() * 80,
      floatDuration: floatSpeed + Math.random() * 2,
      floatDistance: floatDistance + Math.random() * 10,
      rotationDuration: floatSpeed * 2 + Math.random() * 4,
      delay: i * 0.1,
    }))
    setLogos(newLogos)
  }, [floatSpeed, floatDistance, logoCount])

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
          {/* Floating logos layer */}
          <div className="absolute inset-0 z-0">
            {logos.map((logo, i) => (
              <FloatingLogo key={i} {...logo} />
            ))}
          </div>

          {/* Center text with scroll reveal */}
          <div className="relative z-10 flex flex-col items-center justify-center h-screen gap-2">
            <ScrollRevealTextLine
              progress={scrollYProgress}
              startThreshold={0.15}
              endThreshold={0.35}
              className="text-white font-bold text-center leading-tight"
            >
              <span className="block" style={{ fontSize: 56 }}>
                Floating Logos
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

      {/* Controls panel */}
      <ControlsPanel title="Floating Controls" defaultOpen={false}>
        <ControlSlider
          label="Float Speed"
          value={floatSpeed}
          onChange={setFloatSpeed}
          min={2}
          max={15}
          step={0.5}
          unit="s"
        />
        <ControlSlider
          label="Float Distance"
          value={floatDistance}
          onChange={setFloatDistance}
          min={5}
          max={50}
          unit="px"
        />
        <ControlSlider
          label="Logo Count"
          value={logoCount}
          onChange={setLogoCount}
          min={4}
          max={20}
          unit=" logos"
        />
      </ControlsPanel>
    </main>
  )
}
