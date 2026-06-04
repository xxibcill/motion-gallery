'use client'

import type { LucideIcon } from 'lucide-react'
import { useReducedMotion } from 'motion/react'

export interface Category {
  name: string
  color: string
  icon: LucideIcon
}

export function MarqueeChip({ category }: { category: Category }) {
  const Icon = category.icon
  return (
    <div className="flex items-center gap-2 bg-white rounded-full px-2 py-2.5 shrink-0">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: category.color }}
      >
        <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
      </div>
      <span className="font-medium text-[#202327] text-lg whitespace-nowrap pr-2">
        {category.name}
      </span>
    </div>
  )
}

interface MarqueeRowProps {
  categories: Category[]
  direction: 'left' | 'right'
  duration: number
}

export function MarqueeRow({ categories, direction, duration }: MarqueeRowProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const duplicated = [...categories, ...categories]

  if (prefersReducedMotion) {
    return (
      <div className="flex gap-6 overflow-hidden">
        {categories.map((category, i) => (
          <MarqueeChip key={i} category={category} />
        ))}
      </div>
    )
  }

  const keyframes = direction === 'left'
    ? '@keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }'
    : '@keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }'

  return (
    <>
      <style>{`
        ${keyframes}
      `}</style>
      <div className="overflow-hidden">
        <div
          className="flex gap-6"
          style={{
            width: 'fit-content',
            animation: `marquee-${direction} ${duration}s linear infinite`,
          }}
        >
          {duplicated.map((category, i) => (
            <MarqueeChip key={i} category={category} />
          ))}
        </div>
      </div>
    </>
  )
}
