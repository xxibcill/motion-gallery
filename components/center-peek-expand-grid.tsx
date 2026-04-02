'use client'

import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useRef, useState } from 'react'
import { CENTER_PEEK_SHRINK_CONFIG } from '@/components/peek-cards/configs'

interface MarketCard {
  id: string
  name: string
  status: string
  icon: 'bitcoin' | 'ethereum' | 'solana'
}

const GRID_STAGE_CONFIG = {
  revealStart: 0.22,
  revealEnd: 0.36,
  expandTrigger: 0.42,
  cardSpring: {
    stiffness: 120,
    damping: 24,
    mass: 0.8,
  },
} as const

const heroCopy = {
  title: 'Membit Insight',
  description:
    'The Ultimate Market Insight Dashboard. Includes sentiment indicators and trending narrative detection.',
  cta: 'Try Membit Insight',
}

const marketCards: MarketCard[] = [
  { id: 'bitcoin', name: 'Bitcoin', status: 'Greed', icon: 'bitcoin' },
  { id: 'ethereum', name: 'Ethereum', status: 'Neutral', icon: 'ethereum' },
  { id: 'solana', name: 'Solana', status: 'Extreme Fear', icon: 'solana' },
]

const statusStyles: Record<string, { background: string; text: string }> = {
  Fear: {
    background: 'rgba(250, 141, 33, 0.5)',
    text: '#202327',
  },
  Greed: {
    background: 'rgba(148, 217, 3, 0.5)',
    text: '#202327',
  },
  Neutral: {
    background: 'rgba(243, 212, 47, 0.5)',
    text: '#202327',
  },
  'Extreme Fear': {
    background: 'rgba(255, 125, 110, 0.5)',
    text: '#202327',
  },
} as const

function StatusPill({ label }: { label: string }) {
  const styles = statusStyles[label]

  return (
    <span
      className="inline-flex h-8 items-center justify-center rounded-2xl px-4 text-sm font-medium tracking-[-0.01em]"
      style={{
        backgroundColor: styles.background,
        color: styles.text,
      }}
    >
      {label}
    </span>
  )
}

function CryptoIcon() {
  return (
    <div className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#6b6bff]">
      <div className="absolute inset-[14px] rounded-full border-[3px] border-white" />
      <div className="h-3.5 w-3.5 rounded-full bg-white" />
      <div className="absolute h-2.5 w-1 rounded-full bg-white/95" style={{ top: 8 }} />
      <div className="absolute h-2.5 w-1 rounded-full bg-white/95" style={{ bottom: 8 }} />
    </div>
  )
}

function TokenIcon({ kind }: { kind: MarketCard['icon'] }) {
  if (kind === 'bitcoin') {
    return (
      <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#f7931a] text-[2rem] font-semibold leading-none text-white">
        ₿
      </div>
    )
  }

  if (kind === 'ethereum') {
    return (
      <div className="relative flex h-[60px] w-[60px] items-center justify-center">
        <div className="absolute top-[7px] h-0 w-0 border-b-[22px] border-l-[12px] border-r-[12px] border-b-[#454545] border-l-transparent border-r-transparent" />
        <div className="absolute top-[30px] h-0 w-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-[#2c2c2c]" />
        <div className="absolute top-[22px] h-0 w-0 border-b-[12px] border-l-[8px] border-r-[8px] border-b-[#8b8b8b] border-l-transparent border-r-transparent" />
        <div className="absolute top-[35px] h-0 w-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-[#6a6a6a]" />
      </div>
    )
  }

  return (
    <div className="relative flex h-[60px] w-[60px] items-center justify-center">
      <div className="absolute top-[12px] h-2.5 w-10 -skew-x-[28deg] rounded-full bg-gradient-to-r from-[#43e9c5] via-[#6fe7ff] to-[#9f67ff]" />
      <div className="absolute top-[26px] h-2.5 w-10 -skew-x-[28deg] rounded-full bg-gradient-to-r from-[#66ffe0] via-[#7ee5ff] to-[#7b5cff]" />
      <div className="absolute top-[40px] h-2.5 w-10 -skew-x-[28deg] rounded-full bg-gradient-to-r from-[#69f8c8] via-[#8a75ff] to-[#d851ff]" />
    </div>
  )
}

function FearGreedGauge({ value, expanded }: { value: number; expanded: boolean }) {
  const radius = 74
  const centerX = 100
  const centerY = 100
  const angle = Math.PI - (Math.PI * value) / 100
  const knobX = centerX + radius * Math.cos(angle)
  const knobY = centerY - radius * Math.sin(angle)
  const needleX = centerX + radius * 0.88 * Math.cos(angle)
  const needleY = centerY - radius * 0.88 * Math.sin(angle)

  return (
    <motion.div
      animate={{
        opacity: expanded ? 1 : 0,
        y: expanded ? 0 : 24,
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="pt-6"
    >
      <div className="mx-auto w-full max-w-[17.5rem]">
        <svg viewBox="0 0 200 128" className="h-auto w-full overflow-visible">
          <defs>
            <linearGradient id="fearGreedArc" x1="22" y1="100" x2="178" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff6b64" />
              <stop offset="18%" stopColor="#ff8f3f" />
              <stop offset="42%" stopColor="#ffcb1f" />
              <stop offset="68%" stopColor="#91d700" />
              <stop offset="100%" stopColor="#1fc964" />
            </linearGradient>
          </defs>
          <path
            d="M 26 100 A 74 74 0 0 1 174 100"
            fill="none"
            stroke="url(#fearGreedArc)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <motion.line
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            initial={false}
            animate={{
              opacity: expanded ? 1 : 0,
              pathLength: expanded ? 1 : 0.2,
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.circle
            cx={knobX}
            cy={knobY}
            r="12"
            fill="#ffffff"
            stroke="#d1d5db"
            strokeWidth="2"
            initial={false}
            animate={{
              opacity: expanded ? 1 : 0,
              scale: expanded ? 1 : 0.7,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: `${knobX}px ${knobY}px` }}
          />
        </svg>
        <motion.p
          initial={false}
          animate={{
            opacity: expanded ? 1 : 0,
            y: expanded ? 0 : 16,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: expanded ? 0.06 : 0 }}
          className="mt-0 text-center text-[2rem] font-medium leading-none text-[#202327]"
        >
          {value.toFixed(2)}
        </motion.p>
      </div>
    </motion.div>
  )
}

function MarketIndexCard({ expanded }: { expanded: boolean }) {
  return (
    <motion.article
      animate={{
        height: expanded ? 388 : 108,
      }}
      transition={{ type: 'spring', ...GRID_STAGE_CONFIG.cardSpring }}
      className="overflow-hidden rounded-2xl bg-white px-6 py-6 shadow-[0_18px_36px_rgba(32,35,39,0.08)]"
    >
      <div className="flex items-center gap-4">
        <CryptoIcon />
        <p className="text-lg font-medium leading-[1.45] tracking-[-0.01em] text-[#202327]">Crypto</p>
        <div className="ml-auto">
          <StatusPill label="Fear" />
        </div>
      </div>

      <div
        className="grid overflow-hidden transition-[grid-template-rows] duration-500"
        style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
      >
        <div className="min-h-0">
          <FearGreedGauge value={30} expanded={expanded} />
        </div>
      </div>
    </motion.article>
  )
}

function MarketStatusCard({
  card,
  expanded,
  index,
}: {
  card: MarketCard
  expanded: boolean
  index: number
}) {
  return (
    <motion.article
      animate={{
        opacity: expanded ? 1 : 0.82,
        y: expanded ? 0 : 16,
        scale: expanded ? 1 : 0.97,
      }}
      transition={{
        duration: 0.42,
        delay: expanded ? 0.04 * index : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="rounded-2xl bg-white px-6 py-6 shadow-[0_18px_36px_rgba(32,35,39,0.08)]"
    >
      <div className="flex items-center gap-4">
        <TokenIcon kind={card.icon} />
        <p className="text-lg font-medium leading-[1.45] tracking-[-0.01em] text-[#202327]">{card.name}</p>
        <div className="ml-auto">
          <StatusPill label={card.status} />
        </div>
      </div>
    </motion.article>
  )
}

function StaticDashboard() {
  return (
    <div className="mx-auto w-full max-w-[55rem] px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-[#202327] px-8 py-12 text-center text-white shadow-[0_24px_72px_rgba(32,35,39,0.24)] sm:px-12">
        <p className="text-[1.5rem] font-medium tracking-[-0.02em]">{heroCopy.title}</p>
        <p className="mx-auto mt-5 max-w-[34rem] text-base leading-6 text-[#d1d5db]">{heroCopy.description}</p>
        <div className="mt-5">
          <span className="inline-flex h-[52px] items-center rounded-full border border-[#9096a2] px-6 text-base font-medium text-white">
            {heroCopy.cta}
          </span>
        </div>
      </div>

      <div className="pt-16">
        <p className="text-center text-[1.25rem] font-medium leading-7 tracking-[-0.02em] text-[#202327]">
          Membit True Fear &amp; Greed Index
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <MarketIndexCard expanded />
          <div className="space-y-4">
            {marketCards.map((card, index) => (
              <MarketStatusCard key={card.id} card={card} expanded index={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function CenterPeekExpandGrid({
  className,
}: {
  className?: string
}) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [gridExpanded, setGridExpanded] = useState(false)

  const padding = CENTER_PEEK_SHRINK_CONFIG.containerPadding
  const collapsedHeight = 248
  const settledRadius = 16

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setGridExpanded(latest >= GRID_STAGE_CONFIG.expandTrigger)
  })

  const growProgress = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold],
    [0, 1],
  )
  const smoothGrowProgress = useSpring(growProgress, CENTER_PEEK_SHRINK_CONFIG.spring)

  const shrinkProgress = useTransform(
    scrollYProgress,
    [CENTER_PEEK_SHRINK_CONFIG.settleThreshold, 0.4, 1],
    [0, 1, 1],
  )
  const smoothShrinkProgress = useSpring(shrinkProgress, CENTER_PEEK_SHRINK_CONFIG.spring)

  const heroOffsetY = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold],
    [CENTER_PEEK_SHRINK_CONFIG.peek.translateY, 0],
  )
  const smoothHeroOffsetY = useSpring(heroOffsetY, CENTER_PEEK_SHRINK_CONFIG.spring)

  const width = useMotionTemplate`calc(${CENTER_PEEK_SHRINK_CONFIG.peek.width}px + (100vw - ${padding * 2}px - ${CENTER_PEEK_SHRINK_CONFIG.peek.width}px) * ${smoothGrowProgress})`
  const fullHeight = `calc(100vh - ${padding * 2}px)`
  const peekHeight = `${CENTER_PEEK_SHRINK_CONFIG.peek.height}vh`
  const collapsedCardHeight = `${collapsedHeight}px`
  const growHeight = useMotionTemplate`calc(${peekHeight} + (${fullHeight} - ${peekHeight}) * ${smoothGrowProgress})`
  const height = useMotionTemplate`calc(${growHeight} - (${fullHeight} - ${collapsedCardHeight}) * ${smoothShrinkProgress})`

  const borderRadius = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold, 1],
    [CENTER_PEEK_SHRINK_CONFIG.peek.borderRadius, settledRadius, 16],
  )
  const scale = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold],
    [CENTER_PEEK_SHRINK_CONFIG.peek.scale, 1],
  )
  const opacity = useTransform(
    scrollYProgress,
    [0, CENTER_PEEK_SHRINK_CONFIG.settleThreshold],
    [CENTER_PEEK_SHRINK_CONFIG.peek.opacity, 1],
  )

  const revealProgress = useTransform(
    scrollYProgress,
    [0, GRID_STAGE_CONFIG.revealStart, GRID_STAGE_CONFIG.revealEnd, 1],
    [0, 0, 1, 1],
  )
  const revealY = useTransform(revealProgress, [0, 1], [72, 0])
  const revealOpacity = useTransform(revealProgress, [0, 1], [0, 1])
  const revealScale = useTransform(revealProgress, [0, 1], [0.985, 1])
  const revealInset = useTransform(revealProgress, [0, 1], [100, 0])
  const revealClipPath = useMotionTemplate`inset(${revealInset}% 0% 0% 0% round 16px)`

  const heroTitleOpacity = useTransform(growProgress, [0, 0.4, 1], [0.18, 0.55, 1])
  const heroDetailOpacity = useTransform(growProgress, [0, 0.6, 1], [0, 0.35, 1])
  const heroScale = useTransform(smoothShrinkProgress, [0, 1], [1, 0.975])
  const heroY = useTransform(smoothShrinkProgress, [0, 1], [0, -8])

  const smoothBorderRadius = useSpring(borderRadius, CENTER_PEEK_SHRINK_CONFIG.spring)
  const smoothScale = useSpring(scale, CENTER_PEEK_SHRINK_CONFIG.spring)
  const smoothOpacity = useSpring(opacity, CENTER_PEEK_SHRINK_CONFIG.spring)
  const smoothRevealY = useSpring(revealY, CENTER_PEEK_SHRINK_CONFIG.spring)
  const smoothRevealOpacity = useSpring(revealOpacity, CENTER_PEEK_SHRINK_CONFIG.spring)
  const smoothRevealScale = useSpring(revealScale, CENTER_PEEK_SHRINK_CONFIG.spring)
  const smoothHeroScale = useSpring(heroScale, CENTER_PEEK_SHRINK_CONFIG.spring)
  const smoothHeroY = useSpring(heroY, CENTER_PEEK_SHRINK_CONFIG.spring)
  const smoothHeroTitleOpacity = useSpring(heroTitleOpacity, CENTER_PEEK_SHRINK_CONFIG.spring)
  const smoothHeroDetailOpacity = useSpring(heroDetailOpacity, CENTER_PEEK_SHRINK_CONFIG.spring)

  if (prefersReducedMotion) {
    return (
      <section className={`bg-[#f3f4f6] ${className ?? ''}`}>
        <StaticDashboard />
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className={className}
      style={{ height: `${CENTER_PEEK_SHRINK_CONFIG.scrollHeight * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[#f3f4f6]">
        <div className="relative h-full w-full p-4 pt-6 sm:p-6 sm:pt-8 lg:p-10">
          <motion.div
            className="absolute inset-x-0 top-0"
            style={{
              opacity: smoothRevealOpacity,
              y: smoothRevealY,
              scale: smoothRevealScale,
              clipPath: revealClipPath,
              transformOrigin: 'center top',
            }}
          >
            <div
              className="mx-auto w-full max-w-[55rem] px-4 sm:px-6 lg:px-0"
              style={{ paddingTop: collapsedHeight + 88 }}
            >
              <motion.p
                style={{ opacity: smoothRevealOpacity }}
                className="text-center text-[1.25rem] font-medium leading-7 tracking-[-0.02em] text-[#202327]"
              >
                Membit True Fear &amp; Greed Index
              </motion.p>

              <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <MarketIndexCard expanded={gridExpanded} />

                <div className="space-y-4">
                  {marketCards.map((card, index) => (
                    <MarketStatusCard
                      key={card.id}
                      card={card}
                      expanded={gridExpanded}
                      index={index + 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="relative flex h-full items-start justify-center">
            <motion.div
              className="relative z-10 min-w-[18rem] overflow-hidden bg-[#202327] text-white shadow-[0_24px_72px_rgba(32,35,39,0.24)]"
              style={{
                width,
                height,
                y: smoothHeroOffsetY,
                borderRadius: smoothBorderRadius,
                scale: smoothScale,
                opacity: smoothOpacity,
                originY: 0,
              }}
            >
              <motion.div
                className="relative flex h-full flex-col items-center justify-center gap-5 px-8 py-10 text-center sm:px-12"
                style={{
                  scale: smoothHeroScale,
                  y: smoothHeroY,
                  transformOrigin: 'center center',
                }}
              >
                <motion.p
                  style={{ opacity: smoothHeroTitleOpacity }}
                  className="text-[clamp(1.35rem,2vw,1.5rem)] font-medium tracking-[-0.02em]"
                >
                  {heroCopy.title}
                </motion.p>

                <motion.p
                  style={{ opacity: smoothHeroDetailOpacity }}
                  className="max-w-[33rem] text-[clamp(0.96rem,1.4vw,1rem)] leading-6 text-[#d1d5db]"
                >
                  {heroCopy.description}
                </motion.p>

                <motion.button
                  type="button"
                  style={{ opacity: smoothHeroDetailOpacity }}
                  className="inline-flex h-[52px] items-center rounded-full border border-[#9096a2] px-6 text-base font-medium text-white"
                >
                  {heroCopy.cta}
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
