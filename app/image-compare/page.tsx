"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { CodePanel, CodeToggle } from "@/components/code-panel";

const hoverVersionCode = `// Version 1: Hover to move divider
function ImageCompareHover({ beforeImage, afterImage }) {
  const containerRef = useRef(null);
  const x = useMotionValue(50);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const clipPath = useTransform(springX, (v) => \`inset(0 \${100 - v}% 0 0)\`);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((e.clientX - rect.left) / rect.width) * 100;
    x.set(Math.max(5, Math.min(95, pos)));
  };

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove}>
      <img src={afterImage} />
      <motion.div style={{ clipPath }}>
        <img src={beforeImage} />
      </motion.div>
      {/* Simple line, no handle */}
      <motion.div className="w-px bg-white" style={{ left: springX + "%" }} />
    </div>
  );
}`;

const dragVersionCode = `// Version 2: Drag the handle
function ImageCompareDrag({ beforeImage, afterImage }) {
  const containerRef = useRef(null);
  const x = useMotionValue(50);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const clipPath = useTransform(springX, (v) => \`inset(0 \${100 - v}% 0 0)\`);

  const handleDrag = (_, info) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newPos = ((info.point.x - rect.left) / rect.width) * 100;
    x.set(Math.max(5, Math.min(95, newPos)));
  };

  return (
    <div ref={containerRef}>
      <img src={afterImage} />
      <motion.div style={{ clipPath }}>
        <img src={beforeImage} />
      </motion.div>
      {/* Draggable handle */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDrag={handleDrag}
        className="w-12 h-12 bg-white rounded-full"
      />
    </div>
  );
}`;

// Demo images (using placeholder gradients for demo)
const beforeGradient = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea'/%3E%3Cstop offset='100%25' style='stop-color:%23764ba2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='800' height='600'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' fill='white' font-family='system-ui' font-size='32' font-weight='bold'%3EBefore%3C/text%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' fill='white/70' font-family='system-ui' font-size='18'%3EOriginal Design%3C/text%3E%3C/svg%3E";

const afterGradient = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f093fb'/%3E%3Cstop offset='100%25' style='stop-color:%23f5576c'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='800' height='600'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' fill='white' font-family='system-ui' font-size='32' font-weight='bold'%3EAfter%3C/text%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' fill='white/70' font-family='system-ui' font-size='18'%3EEnhanced Design%3C/text%3E%3C/svg%3E";

// Version 1: Hover only (no line at all)
interface ImageCompareHoverProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: string;
  className?: string;
}

function ImageCompareHover({
  beforeImage,
  afterImage,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  aspectRatio = "16/9",
  className = "",
}: ImageCompareHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(50);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const clipPath = useTransform(springX, (value) => `inset(0 ${100 - value}% 0 0)`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || prefersReducedMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    x.set(Math.max(0, Math.min(100, position)));
  };

  const handleMouseLeave = () => {
    if (!prefersReducedMotion) x.set(50);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl cursor-ew-resize select-none ${className}`}
      style={{ aspectRatio }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* After image (bottom layer) */}
      <div className="absolute inset-0">
        <img src={afterImage} alt={afterLabel} className="w-full h-full object-cover" draggable={false} />
      </div>
      {/* Before image (top layer with clip) - no line */}
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: prefersReducedMotion ? "inset(0 50% 0 0)" : clipPath }}
      >
        <img src={beforeImage} alt={beforeLabel} className="w-full h-full object-cover" draggable={false} />
      </motion.div>

      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-semibold uppercase tracking-wider">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-fuchsia-500/80 backdrop-blur-sm rounded-full text-white text-xs font-semibold uppercase tracking-wider">
        {afterLabel}
      </div>
    </div>
  );
}

// Version 2: Draggable handle with customizable UI
type DragHandleVariant = "circle" | "pill" | "arrows" | "minimal" | "glow";

interface ImageCompareDragProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: string;
  className?: string;
  handleVariant?: DragHandleVariant;
}

function ImageCompareDrag({
  beforeImage,
  afterImage,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  aspectRatio = "16/9",
  className = "",
  handleVariant = "circle",
}: ImageCompareDragProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  const clipPath = useTransform(springX, (value) => {
    if (!containerRef.current) return "inset(0 50% 0 0)";
    const percent = ((value + containerRef.current.offsetWidth / 2) / containerRef.current.offsetWidth) * 100;
    return `inset(0 ${100 - Math.max(0, Math.min(100, percent))}% 0 0)`;
  });

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setConstraints({ left: -width / 2, right: width / 2 });
      }
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  // Render different handle variants
  const renderHandle = () => {
    const baseClass = "cursor-grab active:cursor-grabbing";

    switch (handleVariant) {
      case "pill":
        return (
          <motion.div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-white rounded-full shadow-xl flex items-center gap-2 ${baseClass}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs font-semibold text-zinc-700">DRAG</span>
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        );

      case "arrows":
        return (
          <motion.div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-full shadow-xl flex items-center justify-center ${baseClass}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>
        );

      case "minimal":
        return (
          <motion.div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center ${baseClass}`}
            whileHover={{ scale: 1.2, backgroundColor: "rgba(255,255,255,1)" }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-1 h-4 bg-zinc-400 rounded-full" />
          </motion.div>
        );

      case "glow":
        return (
          <motion.div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-violet-600 rounded-full shadow-lg shadow-fuchsia-500/50 flex items-center justify-center ${baseClass}`}
            whileHover={{ scale: 1.15, boxShadow: "0 0 30px rgba(217, 70, 239, 0.6)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </motion.div>
        );

      case "circle":
      default:
        return (
          <motion.div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-fuchsia-500 ${baseClass}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </motion.div>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl select-none ${className}`}
      style={{ aspectRatio }}
    >
      <div className="absolute inset-0">
        <img src={afterImage} alt={afterLabel} className="w-full h-full object-cover" draggable={false} />
      </div>
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: prefersReducedMotion ? "inset(0 50% 0 0)" : clipPath }}
      >
        <img src={beforeImage} alt={beforeLabel} className="w-full h-full object-cover" draggable={false} />
      </motion.div>

      <motion.div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-sm cursor-ew-resize"
        style={{
          left: "50%",
          x: prefersReducedMotion ? 0 : springX,
        }}
        drag="x"
        dragConstraints={constraints}
        dragElastic={0}
        onDrag={(_, info) => {
          if (prefersReducedMotion) return;
          x.set(x.get() + info.delta.x);
        }}
      >
        {renderHandle()}
      </motion.div>

      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-semibold uppercase tracking-wider">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-fuchsia-500/80 backdrop-blur-sm rounded-full text-white text-xs font-semibold uppercase tracking-wider">
        {afterLabel}
      </div>
    </div>
  );
}

// Demo card content for before/after
function DemoCard({ variant }: { variant: "before" | "after" }) {
  const isAfter = variant === "after";

  return (
    <div
      className={`w-full h-full flex items-center justify-center p-8 ${
        isAfter
          ? "bg-gradient-to-br from-violet-900 via-fuchsia-900 to-rose-900"
          : "bg-gradient-to-br from-zinc-800 to-zinc-900"
      }`}
    >
      <div
        className={`w-full max-w-sm p-6 rounded-2xl ${
          isAfter
            ? "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
            : "bg-zinc-800 border border-zinc-700"
        }`}
      >
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-full ${
              isAfter
                ? "bg-gradient-to-br from-fuchsia-400 to-rose-500 ring-2 ring-white/30"
                : "bg-zinc-600"
            }`}
          />
          <div>
            <div className={`font-semibold ${isAfter ? "text-white" : "text-zinc-300"}`}>
              {isAfter ? "Welcome to Design" : "Welcome"}
            </div>
            <div className={`text-sm ${isAfter ? "text-white/60" : "text-zinc-500"}`}>
              {isAfter ? "Premium Experience" : "Basic"}
            </div>
          </div>
        </div>

        {/* Content */}
        <p className={`text-sm mb-4 ${isAfter ? "text-white/70 leading-relaxed" : "text-zinc-400"}`}>
          {isAfter
            ? "The best way to design needs a purpose. Create beautiful interfaces with intention."
            : "A simple card with basic styling."}
        </p>

        {/* Button */}
        <button
          className={`w-full py-2.5 rounded-xl font-medium ${
            isAfter
              ? "bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white shadow-lg shadow-fuchsia-500/30"
              : "bg-zinc-700 text-zinc-300"
          }`}
        >
          {isAfter ? "Get Started" : "Go"}
        </button>
      </div>
    </div>
  );
}

export default function ImageComparePage() {
  const [codeOpen, setCodeOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(hoverVersionCode);
  const [activeTitle, setActiveTitle] = useState("ImageCompareHover.tsx");

  // Generate SVG data URLs for demo cards
  const beforeSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect fill='%2318181b' width='800' height='500'/%3E%3Ctext x='50%25' y='40%25' text-anchor='middle' fill='%2371717a' font-family='system-ui' font-size='48' font-weight='bold'%3EBEFORE%3C/text%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' fill='%2352525b' font-family='system-ui' font-size='18'%3EBasic Design%3C/text%3E%3Crect x='300' y='280' width='200' height='50' rx='12' fill='%2327272a'/%3E%3Ctext x='400' y='312' text-anchor='middle' fill='%23a1a1aa' font-family='system-ui' font-size='16'%3ESimple Card%3C/text%3E%3C/svg%3E`;

  const afterSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234c1d95'/%3E%3Cstop offset='50%25' style='stop-color:%23831b8b'/%3E%3Cstop offset='100%25' style='stop-color:%2388133e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='800' height='500'/%3E%3Ctext x='50%25' y='40%25' text-anchor='middle' fill='white' font-family='system-ui' font-size='48' font-weight='bold'%3EAFTER%3C/text%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' fill='white/70' font-family='system-ui' font-size='18'%3EEnhanced Design%3C/text%3E%3Crect x='250' y='260' width='300' height='80' rx='16' fill='white/10' stroke='white/20'/%3E%3Ctext x='400' y='308' text-anchor='middle' fill='white' font-family='system-ui' font-size='16'%3EGlassmorphism Card%3C/text%3E%3C/svg%3E`;

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="py-16 px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Image Compare
          </h1>
          <p className="text-xl text-zinc-400">
            Two interaction modes: hover or drag
          </p>
        </motion.div>
      </section>

      {/* Version 1: Hover */}
      <section className="py-16 px-8 md:px-16 bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider rounded-full">
                Version 1
              </span>
              <h2 className="text-2xl font-bold text-white">Hover Mode</h2>
            </div>
            <p className="text-zinc-400">
              Move your cursor across the image to reveal the comparison. No handle needed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <ImageCompareHover
              beforeImage={beforeSvg}
              afterImage={afterSvg}
              aspectRatio="16/9"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => {
              setActiveCode(hoverVersionCode);
              setActiveTitle("ImageCompareHover.tsx");
              setCodeOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors"
          >
            View Code
          </motion.button>
        </div>
      </section>

      {/* Version 2: Drag */}
      <section className="py-16 px-8 md:px-16 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-fuchsia-500/20 text-fuchsia-400 text-xs font-semibold uppercase tracking-wider rounded-full">
                Version 2
              </span>
              <h2 className="text-2xl font-bold text-white">Drag Mode</h2>
            </div>
            <p className="text-zinc-400">
              Click and drag the handle to control the divider position.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <ImageCompareDrag
              beforeImage={beforeSvg}
              afterImage={afterSvg}
              aspectRatio="16/9"
              handleVariant="circle"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => {
              setActiveCode(dragVersionCode);
              setActiveTitle("ImageCompareDrag.tsx");
              setCodeOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors"
          >
            View Code
          </motion.button>
        </div>
      </section>

      {/* Handle Variants */}
      <section className="py-16 px-8 md:px-16 bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              Customize the Drag Handle
            </h2>
            <p className="text-zinc-400">
              Choose from different handle styles using the <code className="text-fuchsia-400">handleVariant</code> prop
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { variant: "circle" as const, name: "Circle", desc: "Classic round handle with border" },
              { variant: "pill" as const, name: "Pill", desc: "Horizontal pill with drag label" },
              { variant: "arrows" as const, name: "Arrows", desc: "Dark circle with arrow icons" },
              { variant: "minimal" as const, name: "Minimal", desc: "Subtle dot indicator" },
              { variant: "glow" as const, name: "Glow", desc: "Gradient with shadow glow effect" },
            ].map((item, index) => (
              <motion.div
                key={item.variant}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-3">
                  <span className="text-white font-semibold">{item.name}</span>
                  <span className="text-zinc-500 text-sm ml-2">— {item.desc}</span>
                </div>
                <ImageCompareDrag
                  beforeImage={beforeSvg}
                  afterImage={afterSvg}
                  aspectRatio="4/3"
                  handleVariant={item.variant}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Card Comparison */}
      <section className="py-16 px-8 md:px-16 bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              UI Card Comparison
            </h2>
            <p className="text-zinc-400">
              Drag the handle to compare card designs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{ aspectRatio: "16/9" }}
          >
            <ImageCompareSliderDrag />
          </motion.div>
        </div>
      </section>

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

// Interactive card comparison component with drag
function ImageCompareSliderDrag() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  const clipPath = useTransform(springX, (value) => {
    if (!containerRef.current) return "inset(0 50% 0 0)";
    const percent = ((value + containerRef.current.offsetWidth / 2) / containerRef.current.offsetWidth) * 100;
    return `inset(0 ${100 - Math.max(0, Math.min(100, percent))}% 0 0)`;
  });

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setConstraints({ left: -width / 2, right: width / 2 });
      }
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* After (bottom layer) */}
      <div className="absolute inset-0">
        <DemoCard variant="after" />
      </div>

      {/* Before (top layer with clip) */}
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: prefersReducedMotion ? "inset(0 50% 0 0)" : clipPath }}
      >
        <DemoCard variant="before" />
      </motion.div>

      {/* Draggable divider with handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 cursor-ew-resize"
        style={{
          left: "50%",
          x: prefersReducedMotion ? 0 : springX,
        }}
        drag="x"
        dragConstraints={constraints}
        dragElastic={0}
        onDrag={(_, info) => {
          if (prefersReducedMotion) return;
          x.set(x.get() + info.delta.x);
        }}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-fuchsia-500 cursor-grab active:cursor-grabbing"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-semibold uppercase tracking-wider">
        Before
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-fuchsia-500/80 backdrop-blur-sm rounded-full text-white text-xs font-semibold uppercase tracking-wider">
        After
      </div>
    </div>
  );
}
