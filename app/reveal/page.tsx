"use client";

import { useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useRef, ReactNode } from "react";
import { CodePanel, CodeToggle } from "@/components/code-panel";
import { maskRevealCode, circleRevealCode, gridRevealCode } from "./code";

// Mask reveal wrapper
interface MaskRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
}

function MaskReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.8,
}: MaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  const getInitialMask = () => {
    switch (direction) {
      case "up":
        return "inset(100% 0 0 0)";
      case "down":
        return "inset(0 0 100% 0)";
      case "left":
        return "inset(0 100% 0 0)";
      case "right":
        return "inset(0 0 0 100%)";
    }
  };

  const getAnimatedMask = () => {
    return "inset(0 0 0 0)";
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: getInitialMask() }}
        animate={isInView ? { clipPath: getAnimatedMask() } : {}}
        transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Image reveal with expanding circle mask
interface CircleRevealProps {
  src: string;
  alt: string;
  className?: string;
}

function CircleReveal({ src, alt, className = "" }: CircleRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={className}>
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={isInView ? { clipPath: "circle(100% at 50% 50%)" } : {}}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  );
}

// Wipe transition between two elements
interface WipeTransitionProps {
  children: ReactNode;
  overlay?: ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
}

function WipeTransition({
  children,
  overlay,
  className = "",
  direction = "left",
}: WipeTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });
  const prefersReducedMotion = useReducedMotion();

  const getTransform = () => {
    switch (direction) {
      case "left":
        return { x: "-100%" };
      case "right":
        return { x: "100%" };
      case "up":
        return { y: "-100%" };
      case "down":
        return { y: "100%" };
    }
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
      {!prefersReducedMotion && overlay && (
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ x: 0, y: 0 }}
          animate={isInView ? getTransform() : { x: 0, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {overlay}
        </motion.div>
      )}
    </div>
  );
}

// Split reveal - content splits in half
interface SplitRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "horizontal" | "vertical";
}

function SplitReveal({
  children,
  className = "",
  direction = "horizontal",
}: SplitRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {direction === "horizontal" ? (
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-zinc-900 z-10"
            initial={{ scaleX: 1 }}
            animate={isInView ? { scaleX: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: "left" }}
          />
          {children}
        </div>
      ) : (
        <div className="relative flex">
          <motion.div
            className="absolute inset-0 bg-zinc-900 z-10"
            initial={{ scaleY: 1 }}
            animate={isInView ? { scaleY: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: "top" }}
          />
          {children}
        </div>
      )}
    </div>
  );
}

// Staggered grid reveal
interface GridRevealProps {
  items: { id: string; content: ReactNode; className?: string }[];
  columns?: number;
  staggerDelay?: number;
}

function GridReveal({
  items,
  columns = 3,
  staggerDelay = 0.1,
}: GridRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          className={item.className}
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: prefersReducedMotion ? 0 : i * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {item.content}
        </motion.div>
      ))}
    </div>
  );
}

// Image with hover reveal
interface HoverRevealProps {
  image: string;
  overlay: ReactNode;
  className?: string;
}

function HoverReveal({ image, overlay, className = "" }: HoverRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`relative overflow-hidden cursor-pointer ${className}`}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={image}
        alt=""
        className="w-full h-full object-cover transition-transform duration-500"
      />
      <motion.div
        className="absolute inset-0 bg-black/80 flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {overlay}
      </motion.div>
    </motion.div>
  );
}

// Scroll-driven reveal section
function ScrollRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0.2, 0.5],
    ["inset(100% 0 0 0)", "inset(0 0 0 0)"]
  );

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh] bg-zinc-950"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950"
          style={{ clipPath }}
        >
          <div className="text-center">
            <h2 className="text-6xl font-bold text-white mb-4">
              Scroll Reveal
            </h2>
            <p className="text-emerald-200">
              This content reveals as you scroll
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Section wrapper
function Section({
  children,
  className = "",
  dark = true,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      className={`min-h-screen flex items-center justify-center p-8 md:p-16 ${dark ? "bg-zinc-950" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

export default function RevealPage() {
  const [codeOpen, setCodeOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(maskRevealCode);
  const [activeTitle, setActiveTitle] = useState("MaskReveal.tsx");

  const gridItems = [
    {
      id: "1",
      content: (
        <div className="h-40 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">01</span>
        </div>
      ),
    },
    {
      id: "2",
      content: (
        <div className="h-40 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-700 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">02</span>
        </div>
      ),
    },
    {
      id: "3",
      content: (
        <div className="h-40 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">03</span>
        </div>
      ),
    },
    {
      id: "4",
      content: (
        <div className="h-40 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">04</span>
        </div>
      ),
    },
    {
      id: "5",
      content: (
        <div className="h-40 rounded-xl bg-gradient-to-br from-rose-600 to-pink-700 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">05</span>
        </div>
      ),
    },
    {
      id: "6",
      content: (
        <div className="h-40 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">06</span>
        </div>
      ),
    },
  ];

  return (
    <main className="w-full bg-zinc-950">
      {/* Hero */}
      <Section className="bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="text-center">
          <MaskReveal direction="up" className="inline-block">
            <h1 className="text-6xl md:text-8xl font-bold text-white">
              Reveal Effects
            </h1>
          </MaskReveal>
          <MaskReveal direction="up" delay={0.2} className="mt-6">
            <p className="text-xl text-zinc-400">
              Scroll to see various reveal and mask animations
            </p>
          </MaskReveal>
        </div>
      </Section>

      {/* Direction reveals */}
      <Section className="bg-gradient-to-b from-zinc-900 to-indigo-950">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
          <div>
            <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-4">
              Reveal Up
            </h2>
            <MaskReveal direction="up">
              <h3 className="text-4xl font-bold text-white">
                Content From Below
              </h3>
            </MaskReveal>
          </div>
          <div>
            <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-4">
              Reveal Left
            </h2>
            <MaskReveal direction="left" delay={0.3}>
              <h3 className="text-4xl font-bold text-white">
                Sliding In Right
              </h3>
            </MaskReveal>
          </div>
          <div>
            <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-4">
              Reveal Down
            </h2>
            <MaskReveal direction="down" delay={0.6}>
              <h3 className="text-4xl font-bold text-white">
                Coming From Top
              </h3>
            </MaskReveal>
          </div>
          <div>
            <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-4">
              Reveal Right
            </h2>
            <MaskReveal direction="right" delay={0.9}>
              <h3 className="text-4xl font-bold text-white">
                Sliding In Left
              </h3>
            </MaskReveal>
          </div>
        </div>
      </Section>

      {/* Circle reveal */}
      <Section className="bg-gradient-to-b from-indigo-950 to-violet-950">
        <div className="text-center max-w-4xl">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-8">
            Circle Mask Reveal
          </h2>
          <CircleReveal
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop"
            alt="Abstract gradient"
            className="w-full h-80 md:h-96 rounded-3xl overflow-hidden"
          />
        </div>
      </Section>

      {/* Grid reveal */}
      <Section className="bg-gradient-to-b from-violet-950 to-purple-950">
        <div className="w-full max-w-4xl">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-8 text-center">
            Staggered Grid Reveal
          </h2>
          <GridReveal items={gridItems} columns={3} staggerDelay={0.1} />
        </div>
      </Section>

      {/* Split reveal */}
      <Section className="bg-gradient-to-b from-purple-950 to-fuchsia-950">
        <div className="text-center">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-8">
            Split Reveal
          </h2>
          <SplitReveal className="inline-block">
            <div className="px-12 py-8 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-2xl">
              <h3 className="text-4xl font-bold text-white">
                Revealed Content
              </h3>
            </div>
          </SplitReveal>
        </div>
      </Section>

      {/* Scroll-driven reveal */}
      <ScrollRevealSection />

      {/* Hover reveals */}
      <Section className="bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="w-full max-w-5xl">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-8 text-center">
            Hover to Reveal
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <HoverReveal
              image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop"
              overlay={<span className="text-white text-xl font-bold">Nature</span>}
              className="h-80 rounded-xl overflow-hidden"
            />
            <HoverReveal
              image="https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=500&fit=crop"
              overlay={<span className="text-white text-xl font-bold">Gradient</span>}
              className="h-80 rounded-xl overflow-hidden"
            />
            <HoverReveal
              image="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=500&fit=crop"
              overlay={<span className="text-white text-xl font-bold">Abstract</span>}
              className="h-80 rounded-xl overflow-hidden"
            />
          </div>
        </div>
      </Section>

      {/* Footer */}
      <Section>
        <div className="text-center">
          <MaskReveal direction="up">
            <h2 className="text-5xl font-bold text-white mb-4">
              Mask & Reveal
            </h2>
          </MaskReveal>
          <MaskReveal direction="up" delay={0.2}>
            <p className="text-zinc-400 max-w-md mx-auto">
              Reveal animations add drama and guide attention to content
              as users navigate through your experience.
            </p>
          </MaskReveal>
        </div>
      </Section>

      {/* Code Panel */}
      <CodeToggle onClick={() => setCodeOpen(true)} />
      <CodePanel
        code={activeCode}
        title={activeTitle}
        isOpen={codeOpen}
        onClose={() => setCodeOpen(false)}
      />
    </main>
  );
}
