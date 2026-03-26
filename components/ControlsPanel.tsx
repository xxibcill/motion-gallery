'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface ControlSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  unit?: string
}

export function ControlSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
}: ControlSliderProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-zinc-400 text-sm">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-32 accent-purple-500"
      />
      <span className="text-zinc-500 text-xs">
        {value}
        {unit}
      </span>
    </div>
  )
}

interface ControlsPanelProps {
  title?: string
  children: ReactNode
  defaultOpen?: boolean
}

export function ControlsPanel({
  title = 'Controls',
  children,
  defaultOpen = false,
}: ControlsPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 bg-zinc-800/90 backdrop-blur-sm rounded-2xl border border-zinc-700 overflow-hidden"
      initial={{ opacity: 0, y: 20, width: 'auto' }}
      animate={{ opacity: 1, y: 0, width: isOpen ? 'auto' : 'auto' }}
      transition={{
        opacity: { delay: 1, duration: 0.3 },
        y: { delay: 1, type: 'spring', stiffness: 300, damping: 30 },
        width: { type: 'spring', stiffness: 300, damping: 30 }
      }}
    >
      {/* Header toggle */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-3 flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
        layout
      >
        <span className="font-medium mr-1">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Collapsible content */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.15 }
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 flex flex-wrap gap-6 items-center border-t border-zinc-700/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
