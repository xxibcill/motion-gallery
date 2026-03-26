'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
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

function generateLogos(
  floatSpeed: number,
  floatDistance: number,
  logoCount: number
): Array<FloatingLogoProps> {
  return Array.from({ length: logoCount }, (_, i) => ({
    color: logoColors[i % logoColors.length],
    size: 40 + Math.random() * 40,
    initialX: 5 + i * (90 / logoCount) + Math.random() * 5,
    initialY: 10 + Math.random() * 80,
    floatDuration: floatSpeed + Math.random() * 2,
    floatDistance: floatDistance + Math.random() * 10,
    rotationDuration: floatSpeed * 2 + Math.random() * 4,
    delay: i * 0.1,
  }))
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

export default function FloatingLogosPage() {
  const [floatSpeed, setFloatSpeed] = useState(6)
  const [floatDistance, setFloatDistance] = useState(20)
  const [logoCount, setLogoCount] = useState(12)
  const [logos, setLogos] = useState<Array<FloatingLogoProps>>(() =>
    generateLogos(6, 20, 12)
  )

  const updateFloatSpeed = (value: number) => {
    setFloatSpeed(value)
    setLogos(generateLogos(value, floatDistance, logoCount))
  }

  const updateFloatDistance = (value: number) => {
    setFloatDistance(value)
    setLogos(generateLogos(floatSpeed, value, logoCount))
  }

  const updateLogoCount = (value: number) => {
    setLogoCount(value)
    setLogos(generateLogos(floatSpeed, floatDistance, value))
  }

  return (
    <main className="min-h-screen bg-zinc-950 overflow-hidden relative">
      {/* Floating logos layer */}
      <div className="absolute inset-0 z-0">
        {logos.map((logo, i) => (
          <FloatingLogo key={i} {...logo} />
        ))}
      </div>

      {/* Center text */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <motion.h1
          className="text-white font-bold text-center leading-tight"
          style={{ fontSize: 56 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span className="block">Floating Logos</span>
          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Animation Demo
          </span>
        </motion.h1>
      </div>

      {/* Controls panel */}
      <ControlsPanel title="Floating Controls" defaultOpen={false}>
        <ControlSlider
          label="Float Speed"
          value={floatSpeed}
          onChange={updateFloatSpeed}
          min={2}
          max={15}
          step={0.5}
          unit="s"
        />
        <ControlSlider
          label="Float Distance"
          value={floatDistance}
          onChange={updateFloatDistance}
          min={5}
          max={50}
          unit="px"
        />
        <ControlSlider
          label="Logo Count"
          value={logoCount}
          onChange={updateLogoCount}
          min={4}
          max={20}
          unit=" logos"
        />
      </ControlsPanel>
    </main>
  )
}
