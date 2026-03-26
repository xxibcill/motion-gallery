"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useRef, useState } from "react";

// Parallax layer configuration
interface ParallaxLayer {
  speed: number; // -1 to 1, negative = faster scroll, positive = slower
  content: React.ReactNode;
  className?: string;
  zIndex?: number;
}

interface ParallaxSectionProps {
  layers: ParallaxLayer[];
  className?: string;
}

// Individual parallax layer
function ParallaxLayerComponent({
  layer,
  containerRef,
}: {
  layer: ParallaxLayer;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Calculate y offset based on speed
  const yOffset = useTransform(
    scrollYProgress,
    [0, 1],
    [layer.speed * -200, layer.speed * 200]
  );

  const smoothY = useSpring(yOffset, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        y: smoothY,
        zIndex: layer.zIndex ?? 0,
      }}
    >
      {layer.content}
    </motion.div>
  );
}

// Full parallax section with multiple layers
function ParallaxSection({ layers, className }: ParallaxSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={`relative h-screen ${className}`}>
      {layers.map((layer, i) => (
        <ParallaxLayerComponent
          key={i}
          layer={layer}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}

// Depth layers for hero section
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [stars] = useState(() =>
    Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      opacity: Math.random() * 0.8 + 0.2,
    }))
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const smoothY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const smoothY2 = useSpring(y2, { stiffness: 100, damping: 30 });
  const smoothY3 = useSpring(y3, { stiffness: 100, damping: 30 });

  if (prefersReducedMotion) {
    return (
      <section ref={containerRef} className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-900 to-violet-950" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <h1 className="text-7xl font-bold text-white">Parallax Depths</h1>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden"
    >
      {/* Background layer - slowest */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-900 to-violet-950"
        style={{ y: smoothY1 }}
      />

      {/* Stars layer */}
      <motion.div
        className="absolute inset-0"
        style={{ y: smoothY2, opacity }}
      >
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={star}
          />
        ))}
      </motion.div>

      {/* Floating shapes - medium speed */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: smoothY2 }}
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />
      </motion.div>

      {/* Content layer - fastest */}
      <motion.div
        className="relative z-10 flex h-full items-center justify-center"
        style={{ y: smoothY3, opacity }}
      >
        <div className="text-center">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-7xl md:text-8xl font-bold text-white tracking-tight"
          >
            Parallax Depths
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-6 text-xl text-violet-200"
          >
            Scroll to experience layered depth
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        style={{ opacity }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Multi-layer parallax cards
function ParallaxCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-50, -300]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen bg-zinc-950 overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="absolute w-64 h-80 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-2xl shadow-rose-500/30"
          style={{ y: y1, x: -200, rotate: -12 }}
        />
        <motion.div
          className="absolute w-72 h-96 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-2xl shadow-violet-500/30 z-10"
          style={{ y: y2 }}
        />
        <motion.div
          className="absolute w-64 h-80 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/30"
          style={{ y: y3, x: 200, rotate: 12 }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-4">Layered Cards</h2>
          <p className="text-zinc-400">Each card moves at a different speed</p>
        </div>
      </div>
    </section>
  );
}

// Horizontal parallax stripes
function ParallaxStripes() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen bg-emerald-950 overflow-hidden"
    >
      <motion.div
        className="absolute top-1/4 left-0 h-32 w-[200%] bg-gradient-to-r from-emerald-500/30 to-teal-500/30"
        style={{ x: x1 }}
      />
      <motion.div
        className="absolute top-1/2 left-0 h-24 w-[200%] bg-gradient-to-r from-teal-500/30 to-cyan-500/30"
        style={{ x: x2 }}
      />
      <motion.div
        className="absolute top-3/4 left-0 h-20 w-[200%] bg-gradient-to-r from-cyan-500/30 to-emerald-500/30"
        style={{ x: x3 }}
      />

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-4">Horizontal Drift</h2>
          <p className="text-emerald-200">Stripes move horizontally as you scroll vertically</p>
        </div>
      </div>
    </section>
  );
}

// Final section
function FinaleSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0.2, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen bg-zinc-950 flex items-center justify-center"
    >
      <motion.div
        className="text-center"
        style={{ scale, opacity }}
      >
        <h2 className="text-6xl font-bold text-white mb-6">Infinite Depth</h2>
        <p className="text-zinc-400 max-w-md mx-auto">
          Parallax creates a sense of depth by moving elements at different speeds
          relative to scroll position.
        </p>
      </motion.div>
    </section>
  );
}

export default function ParallaxPage() {
  return (
    <main className="w-full">
      <HeroSection />
      <ParallaxCards />
      <ParallaxStripes />
      <FinaleSection />
    </main>
  );
}
