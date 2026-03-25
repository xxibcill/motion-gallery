"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useRef, ReactNode } from "react";

// 3D Card with perspective transform
interface Card3DProps {
  children: ReactNode;
  className?: string;
  rotateAmount?: number;
}

function Card3D({
  children,
  className = "",
  rotateAmount = 15,
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [rotateAmount, -rotateAmount]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-rotateAmount, rotateAmount]);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReducedMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
}

// Floating cube animation
function FloatingCube() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="w-24 h-24 bg-cyan-500 rounded-lg" />
    );
  }

  return (
    <motion.div
      className="w-24 h-24 relative"
      style={{ transformStyle: "preserve-3d" }}
      animate={{
        rotateX: [0, 360],
        rotateY: [0, 360],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {/* Front */}
      <div className="absolute w-24 h-24 bg-cyan-500/80 border border-cyan-300 rounded-lg flex items-center justify-center"
        style={{ transform: "translateZ(48px)" }}>
        <span className="text-white font-bold">1</span>
      </div>
      {/* Back */}
      <div className="absolute w-24 h-24 bg-cyan-600/80 border border-cyan-400 rounded-lg flex items-center justify-center"
        style={{ transform: "translateZ(-48px) rotateY(180deg)" }}>
        <span className="text-white font-bold">6</span>
      </div>
      {/* Left */}
      <div className="absolute w-24 h-24 bg-cyan-400/80 border border-cyan-200 rounded-lg flex items-center justify-center"
        style={{ transform: "translateX(-48px) rotateY(-90deg)" }}>
        <span className="text-white font-bold">3</span>
      </div>
      {/* Right */}
      <div className="absolute w-24 h-24 bg-cyan-700/80 border border-cyan-500 rounded-lg flex items-center justify-center"
        style={{ transform: "translateX(48px) rotateY(90deg)" }}>
        <span className="text-white font-bold">4</span>
      </div>
      {/* Top */}
      <div className="absolute w-24 h-24 bg-cyan-300/80 border border-cyan-100 rounded-lg flex items-center justify-center"
        style={{ transform: "translateY(-48px) rotateX(90deg)" }}>
        <span className="text-cyan-900 font-bold">2</span>
      </div>
      {/* Bottom */}
      <div className="absolute w-24 h-24 bg-cyan-800/80 border border-cyan-600 rounded-lg flex items-center justify-center"
        style={{ transform: "translateY(48px) rotateX(-90deg)" }}>
        <span className="text-white font-bold">5</span>
      </div>
    </motion.div>
  );
}

// 3D Flip card
interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

function FlipCard({ front, back, className = "" }: FlipCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const rotateY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReducedMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    if (e.clientX < centerX) {
      rotateY.set(-15);
    } else {
      rotateY.set(15);
    }
  };

  const handleMouseLeave = () => {
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative cursor-pointer ${className}`}
      style={{
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
    >
      <div
        className="backface-hidden"
        style={{ backfaceVisibility: "hidden" }}
      >
        {front}
      </div>
    </motion.div>
  );
}

// 3D Stack effect
function CardStack() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={ref} className="relative h-[150vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="relative" style={{ perspective: 1000 }}>
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className="absolute w-64 h-40 rounded-2xl shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${
                  ["#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63"][index]
                }, ${
                  ["#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a"][index]
                })`,
                transformStyle: "preserve-3d",
              }}
              initial={{
                rotateX: -15,
                rotateY: index * 5 - 10,
                y: index * 20,
                z: index * -50,
                opacity: 1 - index * 0.1,
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                Card {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3D Gallery
function Gallery3D() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-32 h-40 bg-cyan-600 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="flex gap-4"
      style={{ perspective: 1000 }}
      initial={{ rotateY: -15 }}
      whileInView={{ rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      {[1, 2, 3, 4, 5].map((i, index) => (
        <motion.div
          key={i}
          className="w-32 h-40 rounded-xl overflow-hidden shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${
              ["#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63"][index]
            }, #000)`,
            transformStyle: "preserve-3d",
          }}
          initial={{ rotateY: 45, x: -50, opacity: 0 }}
          whileInView={{ rotateY: 0, x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          whileHover={{
            rotateY: -10,
            rotateX: 5,
            z: 50,
            scale: 1.1,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">{i}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Section wrapper
function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-h-screen flex items-center justify-center p-8 md:p-16 ${className}`}
    >
      {children}
    </section>
  );
}

export default function ThreeDPage() {
  return (
    <main className="w-full bg-zinc-950">
      {/* Hero */}
      <Section className="bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="text-center" style={{ perspective: 1000 }}>
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-white"
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            3D Effects
          </motion.h1>
          <motion.p
            className="mt-6 text-xl text-zinc-400"
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            Interactive 3D transforms and perspective effects
          </motion.p>
        </div>
      </Section>

      {/* Floating Cube */}
      <Section className="bg-gradient-to-b from-zinc-900 to-cyan-950">
        <div className="text-center">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-12">
            Rotating Cube
          </h2>
          <div style={{ perspective: 500 }}>
            <FloatingCube />
          </div>
        </div>
      </Section>

      {/* 3D Cards */}
      <Section className="bg-gradient-to-b from-cyan-950 to-teal-950">
        <div className="text-center">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-12">
            Perspective Cards
          </h2>
          <div className="flex flex-wrap gap-8 justify-center" style={{ perspective: 1000 }}>
            <Card3D className="w-64 h-80 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 shadow-xl shadow-cyan-500/20">
              <div className="w-full h-full flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/20 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Card One</h3>
                <p className="text-cyan-100 text-sm text-center">
                  Hover to see 3D perspective effect
                </p>
              </div>
            </Card3D>
            <Card3D className="w-64 h-80 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/20">
              <div className="w-full h-full flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/20 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Card Two</h3>
                <p className="text-teal-100 text-sm text-center">
                  Move your cursor around
                </p>
              </div>
            </Card3D>
            <Card3D className="w-64 h-80 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-xl shadow-emerald-500/20">
              <div className="w-full h-full flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/20 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Card Three</h3>
                <p className="text-emerald-100 text-sm text-center">
                  Smooth spring physics
                </p>
              </div>
            </Card3D>
          </div>
        </div>
      </Section>

      {/* 3D Gallery */}
      <Section className="bg-gradient-to-b from-teal-950 to-emerald-950">
        <div className="text-center">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-12">
            3D Gallery
          </h2>
          <Gallery3D />
        </div>
      </Section>

      {/* Card Stack */}
      <CardStack />

      {/* Footer */}
      <Section className="bg-gradient-to-b from-emerald-950 to-zinc-950">
        <div className="text-center" style={{ perspective: 1000 }}>
          <motion.div
            initial={{ rotateX: 90, opacity: 0 }}
            whileInView={{ rotateX: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              3D Transforms
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto">
              Add depth and dimension to your interfaces with perspective transforms
              and interactive 3D effects.
            </p>
          </motion.div>
        </div>
      </Section>
    </main>
  );
}
