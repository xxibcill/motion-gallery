'use client'

import { motion } from "motion/react"
import { useState, useEffect, useRef } from "react"

export const CHAT_SPRING_PRESETS = {
  gentle: { stiffness: 200, damping: 25, mass: 1 },
  snappy: { stiffness: 300, damping: 30, mass: 0.8 },
}

interface UserMessageProps {
  message: string
  className?: string
}

export function UserMessage({ message, className = "" }: UserMessageProps) {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      transition={{ ...CHAT_SPRING_PRESETS.snappy }}
      className={`flex justify-end ${className}`}
    >
      <motion.div
        className="bg-zinc-900 text-white px-4 py-2.5 rounded-2xl text-sm font-medium max-w-[80%]"
        whileHover={{ scale: 1.02 }}
      >
        {message}
      </motion.div>
    </motion.div>
  )
}

interface AIMessageProps {
  message: string
  subheader?: string
  isTyping?: boolean
  typingSpeed?: number
  onTypingComplete?: () => void
  className?: string
}

export function AIMessage({
  message,
  subheader = "AI Assistant",
  isTyping = false,
  typingSpeed = 30,
  onTypingComplete,
  className = "",
}: AIMessageProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(message)
      setIsComplete(true)
      return
    }

    setDisplayedText("")
    setIsComplete(false)
    let currentIndex = 0

    const typeNextChar = () => {
      if (currentIndex < message.length) {
        setDisplayedText(message.slice(0, currentIndex + 1))
        currentIndex++
        timeoutRef.current = setTimeout(typeNextChar, typingSpeed)
      } else {
        setIsComplete(true)
        onTypingComplete?.()
      }
    }

    timeoutRef.current = setTimeout(typeNextChar, typingSpeed)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [message, isTyping, typingSpeed, onTypingComplete])

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ...CHAT_SPRING_PRESETS.gentle }}
      className={`flex flex-col gap-1 ${className}`}
    >
      <span className="text-xs text-zinc-500">{subheader}</span>
      <div className="text-sm text-zinc-800 leading-relaxed">
        {displayedText}
        {isTyping && !isComplete && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-0.5 h-4 bg-zinc-800 ml-0.5 align-middle"
          />
        )}
      </div>
    </motion.div>
  )
}
