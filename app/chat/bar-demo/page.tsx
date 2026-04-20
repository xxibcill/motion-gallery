'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ChatBar } from '@/components/chat'
import { springPresets } from '@/lib/animation-presets'

type DemoState = 'idle' | 'typing' | 'holding' | 'deleting'

const demoTexts = [
  'Do a deep-dive research in crypto today',
  'What are the latest trends in AI?',
  'Explain quantum computing simply',
  'Write a Python script to analyze stocks',
]

const typingSpeed = 50
const holdDuration = 2000

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration))

export default function ChatBarDemoPage() {
  const [demoState, setDemoState] = useState<DemoState>('idle')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isCycling, setIsCycling] = useState(false)
  const runIdRef = useRef(0)
  const pendingCompletionRef = useRef<{ runId: number; resolve: () => void } | null>(null)

  const handleChatbarComplete = () => {
    const pending = pendingCompletionRef.current
    if (!pending || pending.runId !== runIdRef.current) return
    pendingCompletionRef.current = null
    pending.resolve()
  }

  useEffect(() => {
    if (!isCycling) return

    runIdRef.current += 1
    const currentRunId = runIdRef.current
    pendingCompletionRef.current = null

    let cancelled = false
    const isActiveRun = () => !cancelled && runIdRef.current === currentRunId

    const waitForChatbarCompletion = () =>
      new Promise<void>((resolve) => {
        pendingCompletionRef.current = { runId: currentRunId, resolve }
      })

    const runSequence = async () => {
      for (let i = 0; i < demoTexts.length; i++) {
        if (!isActiveRun()) return

        setActiveIndex(i)
        setDemoState('typing')

        await waitForChatbarCompletion()
        if (!isActiveRun()) return

        setDemoState('holding')
        await wait(holdDuration)
        if (!isActiveRun()) return

        setDemoState('deleting')
        await waitForChatbarCompletion()
      }
      setIsCycling(false)
      setDemoState('idle')
    }

    runSequence()
    return () => {
      cancelled = true
      if (pendingCompletionRef.current?.runId === currentRunId) {
        pendingCompletionRef.current = null
      }
    }
  }, [isCycling])

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 gap-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springPresets.gentle }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">ChatBar Animation</h1>
        <p className="text-zinc-400 text-lg">Pure animation demo — trigger each state below</p>
      </motion.div>

      {/* ChatBar */}
      <div className="w-full max-w-2xl">
        <ChatBar
          demoState={isCycling ? demoState : 'idle'}
          demoText={demoTexts[activeIndex]}
          demoTypingSpeed={typingSpeed}
          onDemoComplete={handleChatbarComplete}
          placeholder="Ask anything..."
        />
      </div>

      {/* Controls */}
      <div className="flex gap-4 flex-wrap justify-center">
        <DemoButton
          active={demoState === 'idle'}
          onClick={() => setDemoState('idle')}
          label="Idle"
          description="Placeholder visible"
        />
        <DemoButton
          active={demoState === 'typing'}
          onClick={() => setDemoState('typing')}
          label="Typing"
          description="Animated typing with cursor"
        />
        <DemoButton
          active={demoState === 'holding'}
          onClick={() => setDemoState('holding')}
          label="Holding"
          description="Full text, no cursor"
        />
        <DemoButton
          active={demoState === 'deleting'}
          onClick={() => setDemoState('deleting')}
          label="Deleting"
          description="Animated backspace"
        />
        <motion.button
          onClick={() => setIsCycling(!isCycling)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-6 py-4 rounded-xl text-left transition-colors ${
            isCycling
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          <div className="font-medium">{isCycling ? 'Stop' : 'Auto Cycle'}</div>
          <div className={`text-sm ${isCycling ? 'text-emerald-200' : 'text-zinc-500'}`}>
            Cycle through all texts
          </div>
        </motion.button>
      </div>
    </main>
  )
}

function DemoButton({
  active,
  onClick,
  label,
  description,
}: {
  active: boolean
  onClick: () => void
  label: string
  description: string
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-6 py-4 rounded-xl text-left transition-colors ${
        active
          ? 'bg-white text-zinc-900'
          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
      }`}
    >
      <div className="font-medium">{label}</div>
      <div className={`text-sm ${active ? 'text-zinc-600' : 'text-zinc-500'}`}>{description}</div>
    </motion.button>
  )
}
