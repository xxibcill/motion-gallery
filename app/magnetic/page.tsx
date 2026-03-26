"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { useRef, ReactNode } from "react";
import { CodePanel, CodeToggle } from "@/components/code-panel";
import { magneticCode, magneticButtonCode } from "./code";

// Magnetic element that follows cursor with spring physics
interface MagneticElementProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

function MagneticElement({
  children,
  strength = 0.3,
  className = "",
}: MagneticElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReducedMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}

// Magnetic button with scale effect
interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  scale?: number;
}

function MagneticButton({
  children,
  className = "",
  strength = 0.4,
  scale = 1.1,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scaleValue = useMotionValue(1);

  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const springScale = useSpring(scaleValue, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReducedMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
    scaleValue.set(scale);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scaleValue.set(1);
  };

  return (
    <motion.div
      ref={ref}
      className={`cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, scale: springScale }}
    >
      {children}
    </motion.div>
  );
}

// Magnetic card with rotation
interface MagneticCardProps {
  title: string;
  description: string;
  color: string;
}

function MagneticCard({ title, description, color }: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReducedMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    x.set(deltaX * 0.2);
    y.set(deltaY * 0.2);
    rotateY.set((deltaX / rect.width) * 20);
    rotateX.set(-(deltaY / rect.height) * 20);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="relative w-64 h-80 rounded-2xl cursor-pointer perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className={`w-full h-full rounded-2xl ${color} flex flex-col items-center justify-center p-6 shadow-2xl`}
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
      >
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70 text-center text-sm">{description}</p>
      </div>
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

export default function MagneticPage() {
  const [codeOpen, setCodeOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(magneticCode);
  const [activeTitle, setActiveTitle] = useState("MagneticElement.tsx");

  const handleCodeToggle = () => {
    setCodeOpen(true);
  };

  return (
    <main className="w-full bg-zinc-950">
      {/* Hero */}
      <Section className="bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="text-center">
          <MagneticElement strength={0.2}>
            <h1 className="text-6xl md:text-8xl font-bold text-white">
              Magnetic
            </h1>
          </MagneticElement>
          <motion.p
            className="mt-6 text-xl text-zinc-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Hover over elements to see magnetic effects
          </motion.p>
        </div>
      </Section>

      {/* Magnetic Buttons */}
      <Section className="bg-gradient-to-b from-zinc-900 to-rose-950">
        <div className="text-center">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-12">
            Magnetic Buttons
          </h2>
          <div className="flex flex-wrap gap-6 justify-center">
            <MagneticButton className="px-8 py-4 bg-rose-500 rounded-full text-white font-semibold">
              Hover Me
            </MagneticButton>
            <MagneticButton className="px-8 py-4 bg-pink-500 rounded-full text-white font-semibold" strength={0.6}>
              Stronger Pull
            </MagneticButton>
            <MagneticButton className="px-8 py-4 bg-fuchsia-500 rounded-full text-white font-semibold" scale={1.2}>
              Bigger Scale
            </MagneticButton>
          </div>
        </div>
      </Section>

      {/* Magnetic Cards */}
      <Section className="bg-gradient-to-b from-rose-950 to-pink-950">
        <div className="text-center">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-12">
            3D Magnetic Cards
          </h2>
          <div className="flex flex-wrap gap-8 justify-center">
            <MagneticCard
              title="Design"
              description="Create beautiful interfaces with motion"
              color="bg-gradient-to-br from-rose-500 to-pink-600"
            />
            <MagneticCard
              title="Develop"
              description="Build interactive experiences"
              color="bg-gradient-to-br from-pink-500 to-fuchsia-600"
            />
            <MagneticCard
              title="Deploy"
              description="Ship with confidence"
              color="bg-gradient-to-br from-fuchsia-500 to-purple-600"
            />
          </div>
        </div>
      </Section>

      {/* Magnetic Text */}
      <Section className="bg-gradient-to-b from-pink-950 to-fuchsia-950">
        <div className="text-center">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-12">
            Magnetic Letters
          </h2>
          <div className="flex justify-center gap-2">
            {"MAGNETIC".split("").map((letter, i) => (
              <MagneticElement key={i} strength={0.3}>
                <span className="text-5xl md:text-7xl font-bold text-white hover:text-rose-300 transition-colors">
                  {letter}
                </span>
              </MagneticElement>
            ))}
          </div>
        </div>
      </Section>

      {/* Floating Magnetic Elements */}
      <Section className="bg-gradient-to-b from-fuchsia-950 to-violet-950">
        <div className="text-center">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-12">
            Interactive Shapes
          </h2>
          <div className="relative w-full max-w-2xl h-80">
            <MagneticElement strength={0.5} className="absolute top-0 left-1/4">
              <div className="w-20 h-20 bg-rose-400 rounded-full" />
            </MagneticElement>
            <MagneticElement strength={0.4} className="absolute top-1/2 right-1/4">
              <div className="w-16 h-16 bg-pink-400 rounded-lg rotate-45" />
            </MagneticElement>
            <MagneticElement strength={0.6} className="absolute bottom-0 left-1/3">
              <div className="w-24 h-24 bg-fuchsia-400 rounded-2xl" />
            </MagneticElement>
            <MagneticElement strength={0.3} className="absolute top-1/4 right-1/3">
              <div className="w-12 h-12 bg-violet-400 rounded-full" />
            </MagneticElement>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <Section className="bg-gradient-to-b from-violet-950 to-zinc-950">
        <div className="text-center">
          <MagneticButton
            className="px-12 py-6 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 rounded-full text-white text-xl font-bold shadow-lg shadow-rose-500/30"
            strength={0.5}
            scale={1.1}
          >
            Get Started
          </MagneticButton>
        </div>
      </Section>

      {/* Code Panel */}
      <CodeToggle onClick={handleCodeToggle} />
      <CodePanel
        code={activeCode}
        title={activeTitle}
        isOpen={codeOpen}
        onClose={() => setCodeOpen(false)}
      />
    </main>
  );
}
