"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Gauge from "@/components/fear-greed/Gauge";
import { OptionPills, SliderControl } from "@/components/ui/controls";

type GaugeAnimationMode = "smooth-sweep" | "spring-overshoot" | "segmented-steps" | "pulse-settle";
type MarketPreset =
  | "extreme-fear"
  | "fear"
  | "neutral"
  | "greed"
  | "extreme-greed"
  | "custom";

const MARKET_PRESET_VALUES: Record<Exclude<MarketPreset, "custom">, number> = {
  "extreme-fear": 12.5,
  fear: 31.8,
  neutral: 52.4,
  greed: 73.2,
  "extreme-greed": 90.4,
};

const modeMeta: Record<
  GaugeAnimationMode,
  {
    label: string;
    caption: string;
    stageClass: string;
  }
> = {
  "smooth-sweep": {
    label: "Smooth Sweep",
    caption: "A confident ease-out sweep that lands cleanly on the target score.",
    stageClass:
      "bg-[radial-gradient(circle_at_20%_18%,rgba(14,116,144,0.26),transparent_48%),linear-gradient(180deg,rgba(2,6,23,0.9),rgba(8,47,73,0.65))]",
  },
  "spring-overshoot": {
    label: "Spring Overshoot",
    caption: "Adds a subtle overshoot before settling, useful when emphasizing momentum.",
    stageClass:
      "bg-[radial-gradient(circle_at_80%_14%,rgba(2,132,199,0.26),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,44,34,0.6))]",
  },
  "segmented-steps": {
    label: "Segmented Steps",
    caption: "Moves in discrete jumps to make threshold boundaries feel more explicit.",
    stageClass:
      "bg-[radial-gradient(circle_at_50%_6%,rgba(20,184,166,0.2),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(23,37,84,0.66))]",
  },
  "pulse-settle": {
    label: "Pulse Settle",
    caption: "Reaches the target quickly and adds a restrained pulse for final confirmation.",
    stageClass:
      "bg-[radial-gradient(circle_at_15%_8%,rgba(8,145,178,0.2),transparent_36%),linear-gradient(180deg,rgba(2,6,23,0.94),rgba(6,78,59,0.62))]",
  },
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function animateModeValue(
  mode: GaugeAnimationMode,
  from: number,
  to: number,
  progress: number
): number {
  const delta = to - from;

  if (mode === "smooth-sweep") {
    const eased = 1 - Math.pow(1 - progress, 4);
    return from + delta * eased;
  }

  if (mode === "spring-overshoot") {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    const eased = 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
    return from + delta * eased;
  }

  if (mode === "segmented-steps") {
    const steps = 12;
    const stepped = progress < 1 ? Math.floor(progress * steps) / steps : 1;
    return from + delta * stepped;
  }

  const eased = 1 - Math.pow(1 - progress, 5);
  const pulseTail = progress > 0.76 ? (progress - 0.76) / 0.24 : 0;
  const pulse = pulseTail > 0 ? Math.sin(pulseTail * Math.PI * 3) * (1 - pulseTail) * 2.6 : 0;
  return from + delta * eased + pulse;
}

export default function FearGreedGaugePage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [mode, setMode] = useState<GaugeAnimationMode>("smooth-sweep");
  const [marketPreset, setMarketPreset] = useState<MarketPreset>("neutral");
  const [customValue, setCustomValue] = useState(MARKET_PRESET_VALUES.neutral);
  const [duration, setDuration] = useState(1.4);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [replaySeed, setReplaySeed] = useState(0);
  const lastUpdated = useMemo(() => new Date().toISOString(), []);
  const targetValue =
    marketPreset === "custom" ? customValue : MARKET_PRESET_VALUES[marketPreset];

  useEffect(() => {
    let rafId = 0;

    if (prefersReducedMotion) {
      rafId = window.requestAnimationFrame(() => {
        setAnimatedValue(targetValue);
      });
      return () => window.cancelAnimationFrame(rafId);
    }

    const startValue = 0;
    const durationMs = Math.max(duration, 0.35) * 1000;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = clamp((now - startedAt) / durationMs, 0, 1);
      const nextValue = animateModeValue(mode, startValue, targetValue, progress);
      setAnimatedValue(clamp(nextValue, 0, 100));

      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      setAnimatedValue(targetValue);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [duration, mode, prefersReducedMotion, replaySeed, targetValue]);

  const activeMode = modeMeta[mode];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.18),transparent_38%),linear-gradient(180deg,#09090b,#0f172a)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/gallery"
            className="rounded-full border border-cyan-200/25 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition-colors hover:bg-cyan-300/18"
          >
            Open Gallery
          </Link>
          <Link
            href="/fear-greed-index"
            className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/12"
          >
            Fear &amp; Greed Story
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <motion.article
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[var(--mi-shadow-soft)] backdrop-blur-sm"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/75">Gauge Animation Lab</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Choose How The Gauge Moves
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              This route reuses the production gauge component and lets you swap between animation
              behaviors depending on how energetic or restrained the interaction should feel.
            </p>
            <div className="mt-7 rounded-2xl border border-cyan-200/10 bg-cyan-300/8 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/75">Active Mode</p>
              <p className="mt-2 text-lg font-medium text-cyan-50">{activeMode.label}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{activeMode.caption}</p>
            </div>
          </motion.article>

          <motion.aside
            initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[var(--mi-shadow-soft)]"
          >
            <OptionPills
              label="Animation Mode"
              value={mode}
              onChange={setMode}
              options={[
                { label: "Smooth Sweep", value: "smooth-sweep" },
                { label: "Spring Overshoot", value: "spring-overshoot" },
                { label: "Segmented Steps", value: "segmented-steps" },
                { label: "Pulse Settle", value: "pulse-settle" },
              ]}
            />

            <OptionPills
              label="Market Preset"
              value={marketPreset}
              onChange={setMarketPreset}
              options={[
                { label: "Extreme Fear", value: "extreme-fear" },
                { label: "Fear", value: "fear" },
                { label: "Neutral", value: "neutral" },
                { label: "Greed", value: "greed" },
                { label: "Extreme Greed", value: "extreme-greed" },
                { label: "Custom", value: "custom" },
              ]}
            />

            <SliderControl
              label="Target Value"
              min={0}
              max={100}
              step={0.1}
              value={targetValue}
              onChange={(value) => {
                setCustomValue(value);
                setMarketPreset("custom");
              }}
              valueLabel={targetValue.toFixed(2)}
            />

            <SliderControl
              label="Duration"
              min={0.6}
              max={2.8}
              step={0.1}
              value={duration}
              onChange={setDuration}
              valueLabel={`${duration.toFixed(1)}s`}
            />

            <button
              type="button"
              onClick={() => setReplaySeed((value) => value + 1)}
              className="rounded-2xl border border-cyan-200/16 bg-cyan-300/10 px-4 py-3 text-left text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-300/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/75 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Replay animation
            </button>

            <p className="text-xs leading-5 text-zinc-400">
              Reduced-motion users skip the transition and the gauge jumps directly to the final
              score.
            </p>
          </motion.aside>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[var(--mi-shadow-strong)]">
          <div className="border-b border-white/10 px-6 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Live Example</p>
          </div>
          <motion.div
            key={`${mode}-${replaySeed}-${targetValue.toFixed(1)}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`p-6 sm:p-8 ${activeMode.stageClass}`}
          >
            <div className="mx-auto w-full max-w-[760px] rounded-[1.8rem] border border-white/12 bg-black/35 p-6 sm:p-8">
              <Gauge value={animatedValue} lastUpdated={lastUpdated} />
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
