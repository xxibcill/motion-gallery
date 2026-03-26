"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";

const BottomPeekProgressContext = createContext<MotionValue<number> | null>(null);

export const BOTTOM_PEEK_CONFIG = {
  scrollHeight: 2.2,
  settleThreshold: 0.42,
  peek: {
    translateY: 220,
    scale: 0.975,
    borderRadius: 32,
    opacity: 0.84,
  },
  settled: {
    translateY: 0,
    scale: 1,
    borderRadius: 0,
    opacity: 1,
  },
  content: {
    start: 0.18,
    end: 0.54,
    translateY: 56,
    scale: 0.985,
  },
  spring: {
    stiffness: 110,
    damping: 28,
    mass: 0.95,
  },
} as const;

export interface BottomPeekCardProps {
  children: ReactNode;
  className?: string;
  bgClass?: string;
  panelClassName?: string;
}

export function BottomPeekCard({
  children,
  className,
  bgClass = "bg-zinc-950",
  panelClassName,
}: BottomPeekCardProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const panelY = useTransform(
    scrollYProgress,
    [0, BOTTOM_PEEK_CONFIG.settleThreshold],
    [BOTTOM_PEEK_CONFIG.peek.translateY, BOTTOM_PEEK_CONFIG.settled.translateY]
  );
  const panelScale = useTransform(
    scrollYProgress,
    [0, BOTTOM_PEEK_CONFIG.settleThreshold],
    [BOTTOM_PEEK_CONFIG.peek.scale, BOTTOM_PEEK_CONFIG.settled.scale]
  );
  const panelOpacity = useTransform(
    scrollYProgress,
    [0, 0.16],
    [BOTTOM_PEEK_CONFIG.peek.opacity, BOTTOM_PEEK_CONFIG.settled.opacity]
  );
  const panelRadius = useTransform(
    scrollYProgress,
    [0, BOTTOM_PEEK_CONFIG.settleThreshold],
    [BOTTOM_PEEK_CONFIG.peek.borderRadius, BOTTOM_PEEK_CONFIG.settled.borderRadius]
  );
  const dividerOpacity = useTransform(
    scrollYProgress,
    [0, BOTTOM_PEEK_CONFIG.settleThreshold],
    [0.72, 0.18]
  );
  const highlightOpacity = useTransform(
    scrollYProgress,
    [0, BOTTOM_PEEK_CONFIG.settleThreshold],
    [0.28, 0.08]
  );
  const shadowOpacity = useTransform(
    scrollYProgress,
    [0, BOTTOM_PEEK_CONFIG.settleThreshold],
    [0.32, 0.12]
  );

  const smoothPanelY = useSpring(
    panelY as MotionValue<number>,
    BOTTOM_PEEK_CONFIG.spring
  );
  const smoothPanelScale = useSpring(
    panelScale as MotionValue<number>,
    BOTTOM_PEEK_CONFIG.spring
  );
  const smoothPanelOpacity = useSpring(
    panelOpacity as MotionValue<number>,
    BOTTOM_PEEK_CONFIG.spring
  );
  const smoothPanelRadius = useSpring(
    panelRadius as MotionValue<number>,
    BOTTOM_PEEK_CONFIG.spring
  );
  const smoothDividerOpacity = useSpring(
    dividerOpacity as MotionValue<number>,
    BOTTOM_PEEK_CONFIG.spring
  );
  const smoothHighlightOpacity = useSpring(
    highlightOpacity as MotionValue<number>,
    BOTTOM_PEEK_CONFIG.spring
  );
  const smoothShadowOpacity = useSpring(
    shadowOpacity as MotionValue<number>,
    BOTTOM_PEEK_CONFIG.spring
  );

  if (prefersReducedMotion) {
    return (
      <section className={`relative ${className ?? ""}`}>
        <div
          className={`relative min-h-screen overflow-hidden ${bgClass} ${panelClassName ?? ""}`}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/15" />
          <div className="relative h-full">
            <BottomPeekProgressContext.Provider value={null}>
              {children}
            </BottomPeekProgressContext.Provider>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className={`relative ${className ?? ""}`}
      style={{ height: `${BOTTOM_PEEK_CONFIG.scrollHeight * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <BottomPeekProgressContext.Provider value={scrollYProgress}>
          <motion.section
            className={`absolute inset-x-0 top-0 h-screen overflow-hidden ${bgClass} ${panelClassName ?? ""}`}
            style={{
              y: smoothPanelY,
              scale: smoothPanelScale,
              opacity: smoothPanelOpacity,
              borderTopLeftRadius: smoothPanelRadius,
              borderTopRightRadius: smoothPanelRadius,
              originY: 1,
            }}
          >
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/40"
              style={{ opacity: smoothDividerOpacity }}
            />
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,_rgba(255,255,255,0.16)_0%,_rgba(255,255,255,0)_100%)]"
              style={{ opacity: smoothHighlightOpacity }}
            />
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,_rgba(0,0,0,0.38)_0%,_rgba(0,0,0,0)_100%)]"
              style={{ opacity: smoothShadowOpacity }}
            />
            <div className="relative h-full">{children}</div>
          </motion.section>
        </BottomPeekProgressContext.Provider>
      </div>
    </section>
  );
}

export interface BottomPeekContentProps {
  title?: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function BottomPeekContent({
  title,
  subtitle,
  description,
  children,
  className,
}: BottomPeekContentProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const progress = useContext(BottomPeekProgressContext);
  const fallbackProgress = useMotionValue(1);
  const activeProgress = progress ?? fallbackProgress;

  const contentY = useTransform(
    activeProgress,
    [BOTTOM_PEEK_CONFIG.content.start, BOTTOM_PEEK_CONFIG.content.end],
    [BOTTOM_PEEK_CONFIG.content.translateY, 0]
  );
  const contentOpacity = useTransform(
    activeProgress,
    [BOTTOM_PEEK_CONFIG.content.start - 0.08, BOTTOM_PEEK_CONFIG.content.end],
    [0, 1]
  );
  const contentScale = useTransform(
    activeProgress,
    [BOTTOM_PEEK_CONFIG.content.start, BOTTOM_PEEK_CONFIG.content.end],
    [BOTTOM_PEEK_CONFIG.content.scale, 1]
  );

  const smoothContentY = useSpring(
    contentY as MotionValue<number>,
    BOTTOM_PEEK_CONFIG.spring
  );
  const smoothContentOpacity = useSpring(
    contentOpacity as MotionValue<number>,
    BOTTOM_PEEK_CONFIG.spring
  );
  const smoothContentScale = useSpring(
    contentScale as MotionValue<number>,
    BOTTOM_PEEK_CONFIG.spring
  );

  const content = children ?? (
    <div className="relative mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-end">
      <div className="max-w-3xl">
        {subtitle ? (
          <p className="mb-5 text-xs uppercase tracking-[0.34em] text-white/55">
            {subtitle}
          </p>
        ) : null}
        {title ? (
          <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 md:text-lg">
            {description}
          </p>
        ) : null}
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-5 text-sm leading-6 text-white/70 backdrop-blur-md">
        The incoming section rises as one continuous surface, so it can hand off
        directly from the previous scene without reading like a separate card.
      </div>
    </div>
  );

  const containerClassName = `relative flex min-h-screen items-end px-6 py-10 md:px-10 md:py-12 lg:px-14 ${className ?? ""}`;

  if (prefersReducedMotion || !progress) {
    return (
      <div className={containerClassName}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_36%)]" />
        <div className="relative w-full">{content}</div>
      </div>
    );
  }

  return (
    <motion.div
      className={containerClassName}
      style={{
        y: smoothContentY,
        opacity: smoothContentOpacity,
        scale: smoothContentScale,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_36%)]" />
      <div className="relative w-full">{content}</div>
    </motion.div>
  );
}
