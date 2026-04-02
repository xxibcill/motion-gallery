"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";

// --- Config ---
const CONFIG = {
  scrollHeight: 6,
  enterEnd: 0.12,
  gaugeComplete: 0.30,
  cardsRevealed: 0.55,
  exitStart: 0.85,
} as const;

// --- Data ---
const sentimentColors: Record<string, string> = {
  "Extreme Fear": "bg-rose-200 text-rose-700",
  Fear: "bg-orange-200 text-orange-700",
  Neutral: "bg-yellow-200 text-yellow-700",
  Greed: "bg-green-200 text-green-700",
  "Extreme Greed": "bg-emerald-200 text-emerald-700",
};

interface CryptoItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  sentiment: string;
  value: number;
  color: string;
}

const cryptoData: CryptoItem[] = [
  {
    id: "crypto",
    name: "Crypto",
    icon: (
      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
        <span className="text-white text-sm font-bold">C</span>
      </div>
    ),
    sentiment: "Fear",
    value: 30,
    color: "#8b5cf6",
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    icon: (
      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
        <span className="text-white text-sm font-bold">₿</span>
      </div>
    ),
    sentiment: "Greed",
    value: 72,
    color: "#f97316",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: (
      <div className="w-8 h-8 rounded-md bg-zinc-900 flex items-center justify-center">
        <span className="text-white text-xs font-bold">ETH</span>
      </div>
    ),
    sentiment: "Neutral",
    value: 50,
    color: "#71717a",
  },
  {
    id: "solana",
    name: "Solana",
    icon: (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-purple-600 flex items-center justify-center">
        <span className="text-white text-xs font-bold">S</span>
      </div>
    ),
    sentiment: "Extreme Fear",
    value: 12,
    color: "#14b8a6",
  },
];

// --- SVG Arc Helpers ---
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

// --- Gauge Segments ---
const SEGMENTS = [
  { label: "Extreme Fear", color: "#ef4444", startDeg: 0, endDeg: 36 },
  { label: "Fear", color: "#f97316", startDeg: 36, endDeg: 72 },
  { label: "Neutral", color: "#eab308", startDeg: 72, endDeg: 108 },
  { label: "Greed", color: "#84cc16", startDeg: 108, endDeg: 144 },
  { label: "Extreme Greed", color: "#22c55e", startDeg: 144, endDeg: 180 },
];

function getActiveSegmentIndex(value: number): number {
  const seg = Math.floor((value / 100) * 5);
  return Math.min(seg, 4);
}

// --- Count-up Hook ---
function useCountUp(target: number, active: boolean, duration = 1200) {
  const [count, setCount] = useState(0);
  const prefersReducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (!active || prefersReducedMotion) {
      return;
    }

    let start: number | null = null;
    let raf: number;

    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(parseFloat((target * easeOutQuint(progress)).toFixed(2)));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, prefersReducedMotion]);

  return prefersReducedMotion && active ? target : count;
}

// --- Segmented Gauge ---
function SegmentedGauge({
  value,
  needleRotation,
}: {
  value: number;
  needleRotation: MotionValue<number>;
}) {
  const activeIdx = getActiveSegmentIndex(value);

  return (
    <div className="relative w-64 h-36 mx-auto">
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          {SEGMENTS.map((seg, i) => (
            <filter key={`glow-${i}`} id={`glow-${i}`}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Segment arcs */}
        {SEGMENTS.map((seg, i) => (
          <g key={i}>
            {/* Dim background segment */}
            <path
              d={describeArc(100, 105, 80, seg.startDeg, seg.endDeg)}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeLinecap="butt"
              opacity={0.15}
            />
            {/* Full color segment */}
            <path
              d={describeArc(100, 105, 80, seg.startDeg, seg.endDeg)}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeLinecap="butt"
              opacity={i <= activeIdx ? 0.8 : 0.25}
              style={{
                transition: "opacity 0.4s ease",
                filter: i === activeIdx ? `url(#glow-${i})` : "none",
              }}
            />
          </g>
        ))}

        {/* Needle */}
        <motion.line
          x1="100"
          y1="105"
          x2="100"
          y2="32"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            rotate: needleRotation,
            originX: "100px",
            originY: "105px",
          }}
        />

        {/* Center pivot */}
        <circle cx="100" cy="105" r="6" fill="white" />
        <circle cx="100" cy="105" r="3" fill="#27272a" />

        {/* Tick marks */}
        {SEGMENTS.map((_, i) => {
          const angle = i * 36;
          const p1 = polarToCartesian(100, 105, 72, angle);
          const p2 = polarToCartesian(100, 105, 90, angle);
          return (
            <line
              key={`tick-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#3f3f46"
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  );
}

// --- Mini Gauge ---
function MiniGauge({
  value,
  active,
}: {
  value: number;
  active: boolean;
}) {
  const rotation = -90 + (value / 100) * 180;
  const activeIdx = getActiveSegmentIndex(value);
  const miniSegments = [
    { color: "#ef4444", startDeg: 0, endDeg: 36 },
    { color: "#f97316", startDeg: 36, endDeg: 72 },
    { color: "#eab308", startDeg: 72, endDeg: 108 },
    { color: "#84cc16", startDeg: 108, endDeg: 144 },
    { color: "#22c55e", startDeg: 144, endDeg: 180 },
  ];

  return (
    <div className="relative w-24 h-14">
      <svg viewBox="0 0 80 50" className="w-full h-full">
        {/* Mini segments */}
        {miniSegments.map((seg, i) => (
          <path
            key={i}
            d={describeArc(40, 45, 32, seg.startDeg, seg.endDeg)}
            fill="none"
            stroke={seg.color}
            strokeWidth="6"
            strokeLinecap="butt"
            opacity={active ? (i <= activeIdx ? 0.7 : 0.15) : 0.1}
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

// --- Crypto Card ---
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
      className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4 border border-zinc-800/50"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={
        cardsVisible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 40, scale: 0.95 }
      }
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 22,
      }}
    >
      {item.icon}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white font-semibold text-sm">{item.name}</span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${sentimentColors[item.sentiment]}`}
          >
            {item.sentiment}
          </span>
        </div>
        <MiniGauge value={item.value} active={cardsVisible} />
      </div>
    </motion.div>
  );
}

// --- Main Page ---
export default function FearGreedIndexPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;

  const [cardsVisible, setCardsVisible] = useState(prefersReducedMotion);
  const [gaugeActive, setGaugeActive] = useState(prefersReducedMotion);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Phase transforms
  const enterOpacity = useTransform(
    scrollYProgress,
    [CONFIG.exitStart, 1],
    [1, 0]
  );
  const enterScale = useTransform(
    scrollYProgress,
    [0, CONFIG.enterEnd],
    [0.97, 1]
  );
  const enterY = useTransform(
    scrollYProgress,
    [0, CONFIG.enterEnd],
    [20, 0]
  );

  // Scroll indicator fade
  const scrollIndicatorOpacity = useTransform(
    scrollYProgress,
    [0, CONFIG.enterEnd * 0.8],
    [1, 0]
  );

  // Gauge needle rotation
  const mainValue = cryptoData[0].value;
  const targetRotation = -90 + (mainValue / 100) * 180;
  const rawNeedleRotation = useTransform(
    scrollYProgress,
    [CONFIG.enterEnd, CONFIG.gaugeComplete],
    [-90, targetRotation]
  );
  const needleRotation = useSpring(rawNeedleRotation, {
    stiffness: 60,
    damping: 20,
  });

  // Phase triggers
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= CONFIG.enterEnd) setGaugeActive(true);
    if (v >= CONFIG.gaugeComplete) setCardsVisible(true);
    if (v < CONFIG.gaugeComplete - 0.05) setCardsVisible(false);
  });

  // Count-up for main value
  const displayValue = useCountUp(mainValue, gaugeActive);

  // Reduced motion: render static version
  if (prefersReducedMotion) {
    return (
      <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          Membitt True Fear &amp; Greed Index
        </h1>
        <div className="w-72">
          <svg viewBox="0 0 200 120" className="w-full">
            {SEGMENTS.map((seg, i) => (
              <path
                key={i}
                d={describeArc(100, 105, 80, seg.startDeg, seg.endDeg)}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeLinecap="butt"
                opacity={i <= getActiveSegmentIndex(mainValue) ? 0.8 : 0.25}
              />
            ))}
            <line
              x1="100"
              y1="105"
              x2="100"
              y2="32"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(${targetRotation}, 100, 105)`}
            />
            <circle cx="100" cy="105" r="6" fill="white" />
            <circle cx="100" cy="105" r="3" fill="#27272a" />
          </svg>
          <p className="text-center mt-2 text-3xl font-bold text-white">
            {mainValue.toFixed(2)}
          </p>
        </div>
        <div className="w-full max-w-lg mt-8 grid gap-4">
          {cryptoData.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 rounded-2xl p-5 flex items-center gap-4"
            >
              {item.icon}
              <span className="text-white font-semibold text-sm">
                {item.name}
              </span>
              <span
                className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full ${sentimentColors[item.sentiment]}`}
              >
                {item.sentiment}
              </span>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <div ref={containerRef} className="bg-zinc-950" style={{ height: `${CONFIG.scrollHeight * 100}vh` }}>
      <motion.div
        className="sticky top-0 h-screen flex flex-col items-center justify-center px-6"
        style={{
          opacity: enterOpacity,
          scale: enterScale,
          y: enterY,
        }}
      >
        {/* Title */}
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-white mb-8 text-center tracking-tight"
        >
          Membitt True Fear &amp; Greed Index
        </motion.h1>

        {/* Main gauge card */}
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-3xl p-8 border border-zinc-800/50 w-full max-w-md">
          <div className="flex items-center gap-2 mb-2">
            {cryptoData[0].icon}
            <span className="text-white font-semibold text-sm">
              {cryptoData[0].name}
            </span>
            <span
              className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full ${sentimentColors[cryptoData[0].sentiment]}`}
            >
              {cryptoData[0].sentiment}
            </span>
          </div>

          <SegmentedGauge
            value={mainValue}
            needleRotation={needleRotation}
          />

          {/* Value display */}
          <div className="text-center -mt-1">
            <span className="text-4xl font-bold text-white tabular-nums">
              {displayValue.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Crypto cards grid */}
        <div className="w-full max-w-lg mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cryptoData.slice(1).map((item, i) => (
            <CryptoCard
              key={item.id}
              item={item}
              index={i}
              cardsVisible={cardsVisible}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-1"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <span className="text-zinc-500 text-xs tracking-widest uppercase">Scroll</span>
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M6 8l4 4 4-4" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </motion.svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
