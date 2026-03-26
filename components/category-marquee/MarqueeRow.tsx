'use client'

import { useReducedMotion } from 'motion/react'
import { MarqueeChip, type Category } from './MarqueeChip'

interface MarqueeRowProps {
  categories: Category[]
  direction: 'left' | 'right'
  duration: number
}

export function MarqueeRow({ categories, direction, duration }: MarqueeRowProps) {
  const prefersReducedMotion = useReducedMotion()
  const duplicated = [...categories, ...categories]

  const animationStyle = prefersReducedMotion
    ? {}
    : {
        animation: `marquee-${direction} ${duration}s linear infinite`,
      }

  return (
    <div className="overflow-hidden">
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
      <div
        className="flex gap-6"
        style={{
          width: 'fit-content',
          ...animationStyle,
        }}
      >
        {duplicated.map((category, i) => (
          <MarqueeChip key={i} category={category} />
        ))}
      </div>
    </div>
  )
}
