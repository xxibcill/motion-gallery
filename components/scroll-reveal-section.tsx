"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, type ReactNode } from "react";

const SCROLL_REVEAL_HEIGHT = "400vh";

const OPACITY_SPRING = {
  stiffness: 100,
  damping: 30,
};

const POSITION_SPRING = {
  stiffness: 80,
  damping: 20,
};

interface RevealItemProps {
  children: ReactNode;
  progress: MotionValue<number>;
  start: number;
  end: number;
  className?: string;
}

function RevealItem({
  children,
  progress,
  start,
  end,
  className,
}: RevealItemProps) {
  const prefersReducedMotion = useReducedMotion();

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const translateY = useTransform(progress, [start, end], [60, 0]);
  const scale = useTransform(progress, [start, end], [0.9, 1]);

  const smoothOpacity = useSpring(opacity, OPACITY_SPRING);
  const smoothTranslateY = useSpring(translateY, POSITION_SPRING);
  const smoothScale = useSpring(scale, OPACITY_SPRING);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={{
        opacity: smoothOpacity,
        y: smoothTranslateY,
        scale: smoothScale,
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={containerRef} className="relative bg-zinc-950" style={{ height: SCROLL_REVEAL_HEIGHT }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_38%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.12),_transparent_34%)]" />
        <div className="relative z-10 flex h-screen flex-col items-center justify-center gap-2 px-6 text-center">
          <RevealItem
            progress={scrollYProgress}
            start={0.08}
            end={0.24}
            className="text-white font-bold leading-tight"
          >
            <span className="block text-[3rem] md:text-[3.5rem]">
              Scroll Reveal
            </span>
          </RevealItem>

          <RevealItem
            progress={scrollYProgress}
            start={0.26}
            end={0.44}
            className="leading-tight"
          >
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-[3rem] text-transparent md:text-[3.5rem]">
              Animation Demo
            </span>
          </RevealItem>

          <RevealItem
            progress={scrollYProgress}
            start={0.5}
            end={0.68}
            className="mt-6"
          >
            <button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl">
              Get Started
            </button>
          </RevealItem>
        </div>
      </div>
    </section>
  );
}
