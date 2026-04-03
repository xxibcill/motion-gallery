"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Gauge from "@/components/fear-greed/Gauge";
import { GAUGE_SEGMENTS, getScoreColor, getScoreLabel } from "@/lib/utils/fearGreed";

const CONFIG = {
  scrollHeight: 6,
  enterEnd: 0.12,
  gaugeComplete: 0.3,
  cardsRevealed: 0.48,
  exitStart: 0.85,
} as const;

type CryptoItem = {
  id: string;
  name: string;
  icon: ReactNode;
  value: number;
};

const CRYPTO_DATA: CryptoItem[] = [
  {
    id: "crypto",
    name: "Crypto",
    icon: (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600">
        <span className="text-sm font-bold text-white">C</span>
      </div>
    ),
    value: 30,
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    icon: (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
        <span className="text-sm font-bold text-white">₿</span>
      </div>
    ),
    value: 72,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: (
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900">
        <span className="text-xs font-bold text-white">ETH</span>
      </div>
    ),
    value: 50,
  },
  {
    id: "solana",
    name: "Solana",
    icon: (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-purple-600">
        <span className="text-xs font-bold text-white">S</span>
      </div>
    ),
    value: 12,
  },
];

const MINI_SEGMENTS = GAUGE_SEGMENTS.map((segment) => ({
  color: segment.color,
  startDeg: (segment.from / 100) * 180,
  endDeg: (segment.to / 100) * 180,
}));

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, end);
  const e = polarToCartesian(cx, cy, r, start);
  const largeArc = end - start <= 180 ? 0 : 1;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y}`;
}

function getActiveSegmentIndex(value: number): number {
  const idx = GAUGE_SEGMENTS.findIndex((segment) => value <= segment.to);
  return idx === -1 ? GAUGE_SEGMENTS.length - 1 : idx;
}

function MiniGauge({ value, active }: { value: number; active: boolean }) {
  const rotation = -90 + (clamp(value, 0, 100) / 100) * 180;
  const activeIdx = getActiveSegmentIndex(value);

  return (
    <div className="relative h-14 w-24">
      <svg viewBox="0 0 80 50" className="h-full w-full">
        {MINI_SEGMENTS.map((segment, idx) => (
          <path
            key={`${segment.color}-${idx}`}
            d={describeArc(40, 45, 32, segment.startDeg, segment.endDeg)}
            fill="none"
            stroke={segment.color}
            strokeWidth="6"
            strokeLinecap="butt"
            opacity={active ? (idx <= activeIdx ? 0.7 : 0.15) : 0.1}
            style={{ transition: "opacity 0.5s ease" }}
          />
        ))}
        <motion.line
          x1="40"
          y1="45"
          x2="40"
          y2="18"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ rotate: -90 }}
          animate={active ? { rotate: rotation } : { rotate: -90 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ originX: "40px", originY: "45px" }}
        />
        <circle cx="40" cy="45" r="2.5" fill="white" />
      </svg>
    </div>
  );
}

function SentimentChip({ value }: { value: number }) {
  return (
    <span
      className="rounded-md px-2.5 py-1 text-xs font-medium text-zinc-950"
      style={{ backgroundColor: getScoreColor(value) }}
    >
      {getScoreLabel(value)}
    </span>
  );
}

function CryptoCard({
  item,
  index,
  cardsVisible,
}: {
  item: CryptoItem;
  index: number;
  cardsVisible: boolean;
}) {
  return (
    <motion.div
      className="flex items-center gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] p-5"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={cardsVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 22,
      }}
    >
      {item.icon}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--text-primary)]">{item.name}</span>
          <SentimentChip value={item.value} />
        </div>
        <MiniGauge value={item.value} active={cardsVisible} />
      </div>
    </motion.div>
  );
}

export default function FearGreedIndexPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [cardsVisible, setCardsVisible] = useState(prefersReducedMotion);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const enterOpacity = useTransform(scrollYProgress, [CONFIG.exitStart, 1], [1, 0]);
  const enterScale = useTransform(scrollYProgress, [0, CONFIG.enterEnd], [0.97, 1]);
  const enterY = useTransform(scrollYProgress, [0, CONFIG.enterEnd], [20, 0]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, CONFIG.enterEnd * 0.8], [1, 0]);

  const mainTargetValue = CRYPTO_DATA[0].value;
  const gaugeProgress = useTransform(scrollYProgress, [CONFIG.enterEnd, CONFIG.gaugeComplete], [0, 1]);
  const easedGaugeProgress = useSpring(gaugeProgress, {
    stiffness: 95,
    damping: 22,
  });
  const [mainGaugeValue, setMainGaugeValue] = useState(prefersReducedMotion ? mainTargetValue : 0);
  const lastUpdated = useMemo(() => new Date().toISOString(), []);

  useMotionValueEvent(easedGaugeProgress, "change", (progress) => {
    if (prefersReducedMotion) return;
    const next = clamp(mainTargetValue * clamp(progress, 0, 1), 0, 100);
    setMainGaugeValue(next);
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (prefersReducedMotion) return;
    setCardsVisible(progress >= CONFIG.cardsRevealed);
  });

  if (prefersReducedMotion) {
    return (
      <main className="min-h-screen bg-[var(--surface-0)] p-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <h1 className="text-center text-2xl font-serif tracking-tight text-[var(--text-primary)] md:text-3xl">
            Membit True Fear &amp; Greed Index
          </h1>

          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] p-8">
            <div className="mb-4 flex items-center gap-2">
              {CRYPTO_DATA[0].icon}
              <span className="text-sm font-semibold text-[var(--text-primary)]">{CRYPTO_DATA[0].name}</span>
              <div className="ml-auto">
                <SentimentChip value={mainTargetValue} />
              </div>
            </div>
            <Gauge value={mainTargetValue} lastUpdated={lastUpdated} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {CRYPTO_DATA.slice(1).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] p-5"
              >
                {item.icon}
                <span className="text-sm font-semibold text-[var(--text-primary)]">{item.name}</span>
                <div className="ml-auto">
                  <SentimentChip value={item.value} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <div ref={containerRef} className="bg-[var(--surface-0)]" style={{ height: `${CONFIG.scrollHeight * 100}vh` }}>
      <motion.div
        className="sticky top-0 flex h-screen flex-col items-center justify-center px-6"
        style={{
          opacity: enterOpacity,
          scale: enterScale,
          y: enterY,
        }}
      >
        <div className="mb-6 flex w-full max-w-2xl items-center justify-between gap-4">
          <Link
            href="/gallery"
            className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-2)]"
          >
            Open Gallery
          </Link>
          <Link
            href="/fear-greed-gauge"
            className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-2)]"
          >
            Gauge Animation Lab
          </Link>
        </div>

        <motion.h1 className="mb-8 text-center text-2xl font-serif tracking-tight text-[var(--text-primary)] md:text-3xl">
          Membit True Fear &amp; Greed Index
        </motion.h1>

        <div className="w-full max-w-2xl rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] p-8">
          <div className="mb-4 flex items-center gap-2">
            {CRYPTO_DATA[0].icon}
            <span className="text-sm font-semibold text-[var(--text-primary)]">{CRYPTO_DATA[0].name}</span>
            <div className="ml-auto">
              <SentimentChip value={mainTargetValue} />
            </div>
          </div>

          <Gauge value={mainGaugeValue} lastUpdated={lastUpdated} />
        </div>

        <div className="mt-6 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
          {CRYPTO_DATA.slice(1).map((item, index) => (
            <CryptoCard key={item.id} item={item} index={index} cardsVisible={cardsVisible} />
          ))}
        </div>

        <motion.div className="mt-8 flex flex-col items-center gap-1" style={{ opacity: scrollIndicatorOpacity }}>
          <span className="text-xs uppercase tracking-widest text-zinc-500">Scroll</span>
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="#71717a"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </motion.svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
