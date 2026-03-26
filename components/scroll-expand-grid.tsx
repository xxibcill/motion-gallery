'use client'

/**
 * ScrollExpandGrid - A 3-phase scroll-driven grid card animation
 *
 * OVERVIEW
 * --------
 * This component creates a grid of cards that animates in three phases as the user scrolls:
 *
 *   Phase 1 (ENTER):   Grid enters viewport, fades in, and anchors (sticky)
 *   Phase 2 (EXPAND):  At trigger point, specified cards expand (scroll-triggered, not linked)
 *   Phase 3 (STAY/EXIT): Grid stays visible, then fades out as scroll continues
 *
 * SCROLL TIMELINE
 * ---------------
 *
 *   0% ───── enterEnd ──── expandTrigger ────────────── exitStart ─────── 100%
 *   │    ENTER      │          STAY           │         STAY        │  EXIT  │
 *   │   fade in     │    (cards expand here)  │    (stay visible)   │ fade out│
 *
 * HOW TO CONFIGURE WHICH CARDS EXPAND
 * ------------------------------------
 * Pass the `expandableCardIds` prop with an array of card IDs that should expand.
 * Each ID must match one of the card IDs in the data arrays.
 * Cards with a `description` property will show that text when expanded.
 *
 * USAGE EXAMPLES
 * --------------
 *
 * // Default: Bitcoin card expands
 * <ScrollExpandGrid />
 *
 * // Expand multiple cards (Bitcoin and NVDA)
 * <ScrollExpandGrid expandableCardIds={['bitcoin', 'nvda']} />
 *
 * // Expand all cards with descriptions
 * <ScrollExpandGrid expandableCardIds={['bitcoin', 'ethereum', 'nvda', 'msft']} />
 *
 * // Disable expansion entirely
 * <ScrollExpandGrid expandableCardIds={[]} />
 *
 * AVAILABLE CARD IDs
 * ------------------
 * TradFi:  'aapl', 'msft', 'nvda'
 * Crypto:  'bitcoin', 'ethereum', 'solana'
 *
 * CONFIGURATION
 * -------------
 * Adjust CONFIG object to customize animation timing and physics:
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TIMING CONTROLS                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ scrollHeight      │ Total scroll container height in viewport units         │
 * │                   │ • Default: 5 (500vh)                                    │
 * │                   │ • Higher = more scroll distance for each phase          │
 * │                   │                                                          │
 * │ enterEnd          │ When enter animation completes (Phase 1 end)            │
 * │                   │ • Default: 0.15 (15% of scroll)                          │
 * │                   │                                                          │
 * │ expandTrigger     │ When card expansion triggers (Phase 2 start)            │
 * │                   │ • Default: 0.35 (35% of scroll)                          │
 * │                   │ • Cards expand instantly when scroll reaches this point  │
 * │                   │                                                          │
 * │ exitStart         │ When exit animation begins (Phase 3)                    │
 * │                   │ • Default: 0.85 (85% of scroll)                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ CARD DIMENSIONS                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ cardCollapsedHeight │ Height of collapsed card in px  │ Default: 108       │
 * │ cardExpandedHeight  │ Height of expanded card in px   │ Default: 368       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ SPRING PHYSICS                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ spring.stiffness  │ Spring tension (higher = snappier) │ Default: 100       │
 * │ spring.damping    │ Friction (higher = less bounce)    │ Default: 30        │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

import { motion, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent } from 'motion/react'
import { useRef, useState } from 'react'

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  // Total scroll container height in viewport units (500vh = 5x screen height)
  scrollHeight: 5,

  // Trigger points (0-1 representing scroll progress)
  enterEnd: 0.15, // When enter animation completes
  expandTrigger: 0.35, // When card expansion triggers
  exitStart: 0.85, // When exit animation begins

  // Spring physics for smooth animations
  spring: {
    stiffness: 100,
    damping: 30,
  },

  // Card dimensions
  cardCollapsedHeight: 108,
  cardExpandedHeight: 368,
} as const

// ============================================================================
// DATA
// ============================================================================
interface CardData {
  id: string
  name: string
  badge: {
    label: string
    color: string
  }
  /** Description text shown when card is expanded. If omitted, card won't show description. */
  description?: string
}

const statusColors: Record<string, string> = {
  Bullish: 'rgba(25, 199, 98, 0.5)',
  Neutral: 'rgba(243, 212, 47, 0.5)',
  Bearish: 'rgba(255, 125, 110, 0.5)',
  Optimistic: 'rgba(148, 217, 3, 0.5)',
  Cautious: 'rgba(250, 141, 33, 0.5)',
}

const tradFiCards: CardData[] = [
  { id: 'aapl', name: 'AAPL', badge: { label: 'Cautious', color: 'orange' } },
  {
    id: 'msft',
    name: 'MSFT',
    badge: { label: 'Neutral', color: 'yellow' },
    description:
      'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
  },
  {
    id: 'nvda',
    name: 'NVDA',
    badge: { label: 'Optimistic', color: 'lime' },
    description:
      'NVIDIA Corporation provides graphics, and compute and networking solutions in the United States and internationally.',
  },
]

const cryptoCards: CardData[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    badge: { label: 'Bullish', color: 'green' },
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    badge: { label: 'Neutral', color: 'yellow' },
    description:
      'Ethereum is a decentralized, open-source blockchain with smart contract functionality.',
  },
  { id: 'solana', name: 'Solana', badge: { label: 'Bearish', color: 'red' } },
]

// ============================================================================
// CARD COMPONENT
// ============================================================================
interface CardProps {
  card: CardData
  isExpanded: boolean
}

function Card({ card, isExpanded }: CardProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] bg-zinc-200 rounded-full flex-shrink-0" />
          <p className="text-[#202327] font-medium text-lg">{card.name}</p>
          <div
            className="ml-auto px-4 py-2 rounded-2xl flex items-center gap-2"
            style={{ backgroundColor: statusColors[card.badge.label] }}
          >
            <span className="text-[#202327] text-sm font-medium">{card.badge.label}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        height: isExpanded && card.description ? CONFIG.cardExpandedHeight : CONFIG.cardCollapsedHeight,
      }}
      transition={{ type: 'spring', ...CONFIG.spring }}
      className="bg-white rounded-2xl p-6 overflow-hidden"
    >
      <div className="flex items-center gap-4">
        <div className="w-[60px] h-[60px] bg-zinc-200 rounded-full flex-shrink-0" />
        <p className="text-[#202327] font-medium text-lg">{card.name}</p>
        <div
          className="ml-auto px-4 py-2 rounded-2xl flex items-center gap-2"
          style={{ backgroundColor: statusColors[card.badge.label] }}
        >
          <span className="text-[#202327] text-sm font-medium">{card.badge.label}</span>
        </div>
      </div>

      {card.description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ type: 'spring', ...CONFIG.spring }}
          className="text-[#323a43] text-sm mt-6 leading-relaxed"
        >
          {card.description}
        </motion.p>
      )}
    </motion.div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export interface ScrollExpandGridProps {
  /** CSS classes for the outer section element */
  className?: string
  /**
   * Array of card IDs that should expand when scroll reaches expandTrigger
   * - TradFi IDs: 'aapl', 'msft', 'nvda'
   * - Crypto IDs: 'bitcoin', 'ethereum', 'solana'
   * - Pass empty array to disable expansion
   * - Note: Cards without a description will expand but show no additional content
   * @default ['bitcoin']
   */
  expandableCardIds?: string[]
}

export function ScrollExpandGrid({
  className = '',
  expandableCardIds = ['bitcoin'],
}: ScrollExpandGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isExpanded, setIsExpanded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Listen for scroll progress and trigger expansion at threshold
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setIsExpanded(latest >= CONFIG.expandTrigger)
  })

  // Grid opacity: enter → stay → exit
  const gridOpacity = useTransform(
    scrollYProgress,
    [0, CONFIG.enterEnd, CONFIG.exitStart, 1],
    [0, 1, 1, 0]
  )
  const smoothGridOpacity = useSpring(gridOpacity, CONFIG.spring)

  // Grid scale: subtle scale up on enter
  const gridScale = useTransform(
    scrollYProgress,
    [0, CONFIG.enterEnd],
    [0.95, 1]
  )
  const smoothGridScale = useSpring(gridScale, CONFIG.spring)

  // Grid Y: slide up on enter
  const gridY = useTransform(
    scrollYProgress,
    [0, CONFIG.enterEnd],
    [40, 0]
  )
  const smoothGridY = useSpring(gridY, CONFIG.spring)

  // Helper to check if a card should expand
  const shouldExpand = (cardId: string) =>
    isExpanded && expandableCardIds.includes(cardId)

  if (prefersReducedMotion) {
    return (
      <section ref={containerRef} className={`py-20 ${className}`}>
        <div className="max-w-4xl mx-auto px-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-[#202327] text-xl font-medium text-center mb-8">TradFi</h3>
              {tradFiCards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  isExpanded={expandableCardIds.includes(card.id)}
                />
              ))}
            </div>
            <div className="space-y-6">
              <h3 className="text-[#202327] text-xl font-medium text-center mb-8">Crypto</h3>
              {cryptoCards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  isExpanded={expandableCardIds.includes(card.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className={className}
      style={{ height: `${CONFIG.scrollHeight * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-zinc-100">
        <motion.div
          style={{
            opacity: smoothGridOpacity,
            scale: smoothGridScale,
            y: smoothGridY,
          }}
          className="max-w-4xl w-full px-8"
        >
          <div className="grid grid-cols-2 gap-8">
            {/* TradFi Column */}
            <div className="space-y-6">
              <h3 className="text-[#202327] text-xl font-medium text-center mb-8">TradFi</h3>
              {tradFiCards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  isExpanded={shouldExpand(card.id)}
                />
              ))}
            </div>

            {/* Crypto Column */}
            <div className="space-y-6">
              <h3 className="text-[#202327] text-xl font-medium text-center mb-8">Crypto</h3>
              {cryptoCards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  isExpanded={shouldExpand(card.id)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
