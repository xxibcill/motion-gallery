'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react'
import { ChatBar, TypingIndicator, UserMessage, AIMessage } from '@/components/chat'
import { springPresets } from '@/lib/animation-presets'
import { RotateCcw } from 'lucide-react'

const demoConversation = {
  userMessage: 'What is the current state of US politics?',
  aiResponse: `The current political landscape in the United States is characterized by significant polarization between the two major parties. Key issues dominating the discourse include economic policy, immigration reform, healthcare access, and climate change legislation. The administration continues to navigate complex domestic and international challenges while preparing for upcoming electoral cycles.`,
}

// Section wrapper component
function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`min-h-screen flex flex-col ${className}`}>
      {children}
    </section>
  )
}

// Chat demo component with scroll-triggered animation
function ChatDemo() {
  const [phase, setPhase] = useState<'idle' | 'typing-input' | 'user' | 'typing' | 'response'>(
    'idle',
  )
  const [hasAnimated, setHasAnimated] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-20%' })
  const prefersReducedMotion = useReducedMotion()

  const startDemo = () => {
    setPhase('idle')
    // Start typing in chatbar after brief delay
    setTimeout(() => setPhase('typing-input'), 300)
  }

  // When chatbar finishes typing, show user message then AI typing indicator
  const handleChatbarTypingComplete = () => {
    setPhase('user')
    // Show typing indicator after user message appears
    setTimeout(() => setPhase('typing'), 400)
    // Show AI response after typing indicator
    setTimeout(() => {
      setPhase('response')
      setHasAnimated(true)
    }, 1500)
  }

  useEffect(() => {
    if (isInView && !hasAnimated) {
      if (prefersReducedMotion) {
        setPhase('response')
        setHasAnimated(true)
      } else {
        startDemo()
      }
    }
  }, [isInView, hasAnimated, prefersReducedMotion])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ ...springPresets.gentle }}
      className="h-[515px] w-full max-w-2xl bg-zinc-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
    >
      {/* Replay button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startDemo}
        className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-zinc-600 text-sm font-medium hover:bg-white transition-colors shadow-sm"
      >
        <RotateCcw className="w-4 h-4" />
        Replay
      </motion.button>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pt-16">
        <div className="space-y-6">
          {/* User Message */}
          <AnimatePresence>
            {(phase === 'user' || phase === 'typing' || phase === 'response') && (
              <UserMessage message={demoConversation.userMessage} />
            )}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {phase === 'typing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pl-4"
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Response */}
          <AnimatePresence>
            {phase === 'response' && (
              <AIMessage
                message={demoConversation.aiResponse}
                isTyping={!prefersReducedMotion}
                typingSpeed={10}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ChatBar */}
      <div className="px-4 py-4 bg-zinc-100">
        <ChatBar
          isTyping={phase === 'typing-input'}
          typingText={demoConversation.userMessage}
          typingSpeed={20}
          onTypingComplete={handleChatbarTypingComplete}
          onSend={(message) => console.log('Sent:', message)}
        />
      </div>
    </motion.div>
  )
}

export default function ChatPage() {
  return (
    <main className="w-full bg-zinc-900">
      {/* Blank spacer section - 120vh for testing scroll trigger */}
      <Section className="h-[120vh] items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springPresets.gentle }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Scroll Down</h2>
            <p className="text-zinc-400 text-lg">
              Chat animation triggers when this section enters the viewport
            </p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-8"
          >
            <svg
              className="w-8 h-8 mx-auto text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </div>
      </Section>

      {/* Chat Section - centered */}
      <Section className="min-h-screen items-center justify-center bg-zinc-900" id="chat-demo">
        <ChatDemo />
      </Section>
    </main>
  )
}
