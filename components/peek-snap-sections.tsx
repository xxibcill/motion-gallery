"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useRef, ReactNode } from "react";

// Tunable configuration for the peek-snap effect
export const PEEK_CONFIG = {
  // Viewport height multiplier per section for scroll distance
  // 1.5 = each section gets 50vh of scroll "room" for its transition
  scrollHeightPerSection: 1.5,

  // Scroll progress within a section's range where it becomes "committed" (0-1)
  commitThreshold: 0.35,

  // Initial transform values when section is peeking in
  initial: {
    translateY: 80,
    scale: 0.92,
    opacity: 0,
  },

  // Exit transform values when section is leaving
  exit: {
    translateY: -30,
    scale: 0.96,
    opacity: 0.4,
  },

  // Spring physics for smooth interpolation
  spring: {
    stiffness: 80,
    damping: 25,
    mass: 1,
  },

  // Show scroll progress indicator
  showProgressIndicator: true,

  // Show scroll hint on first section
  showScrollHint: true,
} as const;

// Section data interface
export interface SectionData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  bgClass?: string;
  content?: ReactNode;
}

// Props for individual scroll section
interface ScrollSectionProps {
  section: SectionData;
  index: number;
  totalSections: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

// Individual scroll-driven section
function ScrollSection({
  section,
  index,
  totalSections,
  containerRef,
}: ScrollSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  // Calculate this section's scroll range
  const sectionSize = 1 / totalSections;
  const start = index * sectionSize;
  const end = (index + 1) * sectionSize;
  const commitPoint = start + (end - start) * PEEK_CONFIG.commitThreshold;

  // Track overall scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform values driven by overall scroll progress
  const translateY = useTransform(
    scrollYProgress,
    [
      Math.max(0, start - 0.1),
      start,
      commitPoint,
      Math.min(1, end),
      Math.min(1, end + 0.1),
    ],
    [
      PEEK_CONFIG.initial.translateY * 1.5,
      PEEK_CONFIG.initial.translateY,
      0,
      PEEK_CONFIG.exit.translateY,
      PEEK_CONFIG.exit.translateY * 2,
    ]
  );

  const scale = useTransform(
    scrollYProgress,
    [
      Math.max(0, start - 0.1),
      start,
      commitPoint,
      Math.min(1, end),
      Math.min(1, end + 0.1),
    ],
    [
      PEEK_CONFIG.initial.scale - 0.05,
      PEEK_CONFIG.initial.scale,
      1,
      PEEK_CONFIG.exit.scale,
      PEEK_CONFIG.exit.scale - 0.05,
    ]
  );

  const opacity = useTransform(
    scrollYProgress,
    [
      Math.max(0, start - 0.08),
      start,
      commitPoint,
      Math.min(1, end - 0.05),
      Math.min(1, end + 0.05),
    ],
    [0, PEEK_CONFIG.initial.opacity, 1, 1, 0]
  );

  const zIndex = useTransform(
    scrollYProgress,
    [start, commitPoint, end],
    [index, totalSections, totalSections - index]
  );

  // Apply spring smoothing
  const smoothTranslateY = useSpring(translateY, PEEK_CONFIG.spring);
  const smoothScale = useSpring(scale, PEEK_CONFIG.spring);
  const smoothOpacity = useSpring(opacity, PEEK_CONFIG.spring);

  // Reduced motion fallback
  if (prefersReducedMotion) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: index }}
      >
        <SectionContent section={section} />
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        y: smoothTranslateY,
        scale: smoothScale,
        opacity: smoothOpacity,
        zIndex,
      }}
    >
      <SectionContent section={section} />
    </motion.div>
  );
}

// Internal content renderer
function SectionContent({ section }: { section: SectionData }) {
  const bgClass = section.bgClass ?? "bg-zinc-900";

  return (
    <div className={`w-full h-full flex items-center justify-center ${bgClass}`}>
      <div className="max-w-3xl px-8 text-center">
        {section.content ?? (
          <>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {section.title}
            </h2>
            {section.subtitle && (
              <h3 className="text-xl md:text-2xl text-zinc-300 mb-4">
                {section.subtitle}
              </h3>
            )}
            {section.description && (
              <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
                {section.description}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Scroll progress indicator
function ProgressIndicator({
  containerRef,
  totalSections,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  totalSections: number;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  if (!PEEK_CONFIG.showProgressIndicator) return null;

  return (
    <motion.div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      {Array.from({ length: totalSections }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 h-8 rounded-full bg-white/20 overflow-hidden"
        >
          <motion.div
            className="w-full bg-white/80 rounded-full"
            style={{
              height: useTransform(
                scrollYProgress,
                [i / totalSections, (i + 1) / totalSections],
                [0, 100]
              ),
            }}
          />
        </motion.div>
      ))}
      <motion.div
        className="absolute -left-8 top-0 w-1 h-full bg-white/10 rounded-full"
        style={{ scaleY: smoothProgress, transformOrigin: "top" }}
      />
    </motion.div>
  );
}

// Scroll hint for first section
function ScrollHint({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  if (!PEEK_CONFIG.showScrollHint) return null;

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
      style={{ opacity }}
    >
      <span className="text-white/60 text-sm tracking-wider uppercase">
        Scroll
      </span>
      <motion.div
        className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-white/60"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}

// Props for the container component
interface PeekSnapSectionsProps {
  sections: SectionData[];
  className?: string;
}

// Main container component
export function PeekSnapSections({
  sections,
  className,
}: PeekSnapSectionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Total scroll height based on number of sections
  const totalHeight = `${sections.length * PEEK_CONFIG.scrollHeightPerSection * 100}vh`;

  return (
    <div ref={containerRef} className={className} style={{ height: totalHeight }}>
      {/* Fixed viewport container for all sections */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {sections.map((section, index) => (
          <ScrollSection
            key={section.id}
            section={section}
            index={index}
            totalSections={sections.length}
            containerRef={containerRef}
          />
        ))}

        {/* Progress indicator */}
        <ProgressIndicator
          containerRef={containerRef}
          totalSections={sections.length}
        />

        {/* Scroll hint */}
        <ScrollHint containerRef={containerRef} />
      </div>
    </div>
  );
}

// Re-export for convenience
export { motion };
