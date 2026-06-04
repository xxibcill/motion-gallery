'use client'

import { motion } from "motion/react"
import { useState, useEffect } from "react"

const LOGO_COLORS = [
  "bg-gradient-to-br from-blue-500 to-blue-700",
  "bg-gradient-to-br from-purple-500 to-purple-700",
  "bg-gradient-to-br from-pink-500 to-pink-700",
  "bg-gradient-to-br from-orange-500 to-orange-700",
  "bg-gradient-to-br from-green-500 to-green-700",
  "bg-gradient-to-br from-cyan-500 to-cyan-700",
  "bg-gradient-to-br from-rose-500 to-rose-700",
  "bg-gradient-to-br from-amber-500 to-amber-700",
  "bg-gradient-to-br from-indigo-500 to-indigo-700",
  "bg-gradient-to-br from-emerald-500 to-emerald-700",
  "bg-gradient-to-br from-violet-500 to-violet-700",
  "bg-gradient-to-br from-teal-500 to-teal-700",
]

interface FloatingLogoData {
  src?: string
  color?: string
  size: number
  initialX: number
  initialY: number
  floatDuration: number
  floatDistance: number
  delay: number
}

interface FloatingLogosProps {
  logoCount?: number
  floatSpeed?: number
  floatDistance?: number
  className?: string
  logos?: FloatingLogoData[]
}

function generateLogos(
  count: number,
  floatSpeed: number,
  floatDist: number
): FloatingLogoData[] {
  return Array.from({ length: count }, (_, i) => ({
    color: LOGO_COLORS[i % LOGO_COLORS.length],
    size: 40 + Math.random() * 40,
    initialX: 5 + i * (90 / count) + Math.random() * 5,
    initialY: 10 + Math.random() * 80,
    floatDuration: floatSpeed + Math.random() * 2,
    floatDistance: floatDist + Math.random() * 10,
    delay: i * 0.1,
  }))
}

function FloatingLogo({
  src,
  color,
  size,
  initialX,
  initialY,
  floatDuration,
  floatDistance,
  delay,
}: FloatingLogoData) {
  return (
    <motion.div
      className={`absolute rounded-2xl ${src ? '' : color} shadow-lg overflow-hidden`}
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
          ease: "easeInOut",
          delay,
        },
        x: {
          duration: floatDuration * 1.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
        rotate: {
          duration: floatDuration * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
    >
      {src && <img src={src} alt="" className="w-full h-full object-cover" />}
    </motion.div>
  )
}

export function FloatingLogos({
  logoCount = 12,
  floatSpeed = 6,
  floatDistance = 20,
  className = "",
  logos: customLogos,
}: FloatingLogosProps) {
  const [logos, setLogos] = useState<FloatingLogoData[]>([])

  useEffect(() => {
    const nextLogos = customLogos ?? generateLogos(logoCount, floatSpeed, floatDistance)
    const frameId = window.requestAnimationFrame(() => {
      setLogos(nextLogos)
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [logoCount, floatSpeed, floatDistance, customLogos])

  if (logos.length === 0) return null

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: '100%', height: '100%' }}>
      <div className="absolute inset-0 z-0">
        {logos.map((logo, i) => (
          <FloatingLogo key={i} {...logo} />
        ))}
      </div>
    </div>
  )
}
