'use client'

import { motion } from "motion/react"
import type { SpringOptions } from "motion/react"
import { useState, useEffect, useRef } from "react"
import { Plus, Mic, ArrowUp } from "lucide-react"

export const CHAT_SPRING_PRESETS = {
  gentle: { stiffness: 200, damping: 25, mass: 1 } as SpringOptions,
  snappy: { stiffness: 300, damping: 30, mass: 0.8 } as SpringOptions,
}

type ChatBarDemoState = "idle" | "typing" | "holding"

interface ChatBarProps {
  placeholder?: string
  onSend?: (message: string) => void
  className?: string
}

export function ChatBar({
  placeholder = "Ask anything...",
  onSend,
  className = "",
}: ChatBarProps) {
  const [value, setValue] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = () => {
    if (value.trim() && onSend) {
      onSend(value)
      setValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...CHAT_SPRING_PRESETS.gentle }}
      className={`bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 ${className}`}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 transition-colors"
      >
        <Plus className="w-4 h-4" />
      </motion.button>

      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 text-zinc-800"
        />
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 transition-colors"
        >
          <Mic className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-zinc-800 transition-colors"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}
