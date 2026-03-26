"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";

type AnchorAlign = "left" | "right" | "center";

interface AnchorElementConfig {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  notes: string[];
  anchorTop: string;
  trackStartVh: number;
  trackHeightVh: number;
  maxWidth: string;
  align: AnchorAlign;
  enter: [number, number];
  exit: [number, number];
  palette: {
    shell: string;
    glow: string;
    accent: string;
  };
}

const anchorElements: AnchorElementConfig[] = [
  {
    id: "signal",
    eyebrow: "Anchor 01",
    title: "Signal Stack",
    description:
      "Pins near the top rail, fades in early, then slips upward once the track completes.",
    notes: ["Top anchor", "Fast entry", "Long hold"],
    anchorTop: "14vh",
    trackStartVh: 8,
    trackHeightVh: 220,
    maxWidth: "30rem",
    align: "left",
    enter: [0.08, 0.24],
    exit: [0.68, 0.9],
    palette: {
      shell: "from-cyan-400/30 via-sky-400/12 to-transparent",
      glow: "bg-cyan-400/18",
      accent: "text-cyan-200",
    },
  },
  {
    id: "editorial",
    eyebrow: "Anchor 02",
    title: "Editorial Callout",
    description:
      "Arrives later and anchors around mid-screen so it can share the viewport with the first and third cards.",
    notes: ["Center rail", "Soft overlap", "Independent exit"],
    anchorTop: "38vh",
    trackStartVh: 72,
    trackHeightVh: 230,
    maxWidth: "28rem",
    align: "right",
    enter: [0.16, 0.34],
    exit: [0.62, 0.84],
    palette: {
      shell: "from-fuchsia-400/30 via-rose-400/12 to-transparent",
      glow: "bg-fuchsia-400/18",
      accent: "text-fuchsia-200",
    },
  },
  {
    id: "capsule",
    eyebrow: "Anchor 03",
    title: "Capsule Summary",
    description:
      "Sits low in the frame, enters last, and leaves quickly for a cleaner handoff into the outro.",
    notes: ["Lower rail", "Late entry", "Quick exit"],
    anchorTop: "62vh",
    trackStartVh: 134,
    trackHeightVh: 210,
    maxWidth: "26rem",
    align: "center",
    enter: [0.18, 0.36],
    exit: [0.58, 0.78],
    palette: {
      shell: "from-amber-300/30 via-orange-300/14 to-transparent",
      glow: "bg-amber-300/16",
      accent: "text-amber-100",
    },
  },
];

function alignmentClass(align: AnchorAlign) {
  if (align === "left") return "justify-start";
  if (align === "right") return "justify-end";
  return "justify-center";
}

function offsetForAlign(align: AnchorAlign) {
  if (align === "left") return -72;
  if (align === "right") return 72;
  return 0;
}

function AnchoredElementTrack({
  config,
}: {
  config: AnchorElementConfig;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "end start"],
  });

  const horizontalOffset = offsetForAlign(config.align);

  const opacityValue = useTransform(
    scrollYProgress,
    [0, config.enter[0], config.enter[1], config.exit[0], config.exit[1], 1],
    [0, 0, 1, 1, 0, 0]
  );
  const yValue = useTransform(
    scrollYProgress,
    [0, config.enter[0], config.enter[1], config.exit[0], config.exit[1], 1],
    [80, 80, 0, 0, -64, -112]
  );
  const xValue = useTransform(
    scrollYProgress,
    [0, config.enter[0], config.enter[1], config.exit[0], config.exit[1], 1],
    [horizontalOffset, horizontalOffset, 0, 0, horizontalOffset * 0.35, horizontalOffset * 0.5]
  );
  const scaleValue = useTransform(
    scrollYProgress,
    [0, config.enter[0], config.enter[1], config.exit[0], config.exit[1], 1],
    [0.92, 0.92, 1, 1, 0.975, 0.94]
  );
  const blurValue = useTransform(
    scrollYProgress,
    [0, config.enter[0], config.enter[1], config.exit[0], config.exit[1], 1],
    [10, 10, 0, 0, 5, 9]
  );

  const opacity = useSpring(opacityValue, { stiffness: 140, damping: 28 });
  const y = useSpring(yValue, { stiffness: 120, damping: 24 });
  const x = useSpring(xValue, { stiffness: 120, damping: 24 });
  const scale = useSpring(scaleValue, { stiffness: 150, damping: 24 });
  const blur = useSpring(blurValue, { stiffness: 120, damping: 26 });
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  const card = (
    <article
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white shadow-[0_24px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl md:p-7"
      style={{ width: "min(100%, calc(100vw - 2rem))", maxWidth: config.maxWidth }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${config.palette.shell}`} />
      <div className={`absolute -left-12 top-8 h-28 w-28 rounded-full blur-3xl ${config.palette.glow}`} />
      <div className="relative space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className={`text-[0.7rem] font-medium uppercase tracking-[0.28em] ${config.palette.accent}`}>
            {config.eyebrow}
          </span>
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-zinc-300">
            {Math.round(config.enter[0] * 100)}-{Math.round(config.exit[1] * 100)}%
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {config.title}
          </h2>
          <p className="max-w-md text-sm leading-6 text-zinc-200/80 md:text-[0.95rem]">
            {config.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {config.notes.map((note) => (
            <span
              key={note}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200"
            >
              {note}
            </span>
          ))}
        </div>
      </div>
    </article>
  );

  return (
    <section
      className="absolute inset-x-0"
      style={{
        top: `${config.trackStartVh}vh`,
        height: `${config.trackHeightVh}vh`,
      }}
    >
      <div ref={trackRef} className="relative h-full">
        <div className="sticky px-4 md:px-8" style={{ top: config.anchorTop }}>
          <div className={`flex ${alignmentClass(config.align)}`}>
            {prefersReducedMotion ? (
              card
            ) : (
              <motion.div
                style={{
                  opacity,
                  x,
                  y,
                  scale,
                  filter,
                }}
              >
                {card}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function AnchorGuides() {
  return (
    <div className="sticky top-0 h-screen pointer-events-none">
      {[
        { label: "Top anchor rail", top: "14vh" },
        { label: "Center anchor rail", top: "38vh" },
        { label: "Lower anchor rail", top: "62vh" },
      ].map((guide) => (
        <div
          key={guide.label}
          className="absolute inset-x-4 md:inset-x-8"
          style={{ top: guide.top }}
        >
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-zinc-400">
              {guide.label}
            </span>
            <div className="h-px flex-1 border-t border-dashed border-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnchorElementsDemo() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#050816] text-white">
      <section className="relative isolate flex min-h-screen items-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_36%),radial-gradient(circle_at_80%_20%,rgba(232,121,249,0.14),transparent_28%),linear-gradient(180deg,#050816_0%,#090d1f_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-24 md:px-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-cyan-200">
              Anchor Elements
            </span>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
                Sticky cards with their own enter, hold, and exit windows.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
                Each element pins to a different viewport rail, keeps its own
                in-out scroll points, and can overlap with the others while the
                page continues to move underneath.
              </p>
            </div>
          </div>

          <div className="grid max-w-sm gap-3 text-sm text-zinc-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              Three independent tracks are layered in one long scroll field so
              more than one anchored element can stay visible at once.
            </div>
            <Link
              href="/gallery"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
            >
              Browse all demos
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative h-[360vh] border-b border-white/10 bg-[linear-gradient(180deg,rgba(6,10,25,1)_0%,rgba(11,16,33,1)_52%,rgba(7,9,19,1)_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_24%),radial-gradient(circle_at_80%_32%,rgba(244,114,182,0.08),transparent_22%),radial-gradient(circle_at_45%_72%,rgba(251,191,36,0.08),transparent_24%)]" />
        <AnchorGuides />
        {anchorElements.map((element) => (
          <AnchoredElementTrack key={element.id} config={element} />
        ))}
      </section>

      <section className="relative flex min-h-screen items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.12),transparent_28%),linear-gradient(180deg,#080b17_0%,#050816_100%)]" />
        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-24 md:px-10">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.32em] text-zinc-500">
              What this example proves
            </p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              The anchor point and the animation window do not have to be the
              same thing.
            </h2>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            Each card uses sticky positioning for the anchor rail, while the
            entrance and exit are driven by its own scroll progress. That keeps
            the viewport position stable while still letting every element fade
            and drift in or out on its own timing.
          </p>
        </div>
      </section>
    </main>
  );
}
