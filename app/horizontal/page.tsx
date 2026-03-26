"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { useRef, ReactNode } from "react";

// Horizontal scroll section configuration
interface HorizontalSection {
  id: string;
  title: string;
  description?: string;
  bgClass?: string;
  content?: ReactNode;
}

interface HorizontalScrollProps {
  sections: HorizontalSection[];
  className?: string;
}

function HorizontalProgressSegment({
  index,
  totalSections,
  progress,
}: {
  index: number;
  totalSections: number;
  progress: MotionValue<number>;
}) {
  const width = useTransform(
    progress,
    [index / totalSections, (index + 1) / totalSections],
    ["0%", "100%"]
  );

  return (
    <motion.div className="w-8 h-1 rounded-full bg-white/20 overflow-hidden">
      <motion.div className="h-full bg-white rounded-full" style={{ width }} />
    </motion.div>
  );
}

// Individual horizontal panel
function HorizontalPanel({
  section,
  index,
  totalSections,
  containerRef,
}: {
  section: HorizontalSection;
  index: number;
  totalSections: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const prefersReducedMotion = useReducedMotion();

  // Track scroll progress for parallax within each panel
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate when this panel should be visible
  const sectionStart = index / totalSections;
  const sectionEnd = (index + 1) / totalSections;

  // Content parallax effect
  const contentX = useTransform(
    scrollYProgress,
    [sectionStart, sectionEnd],
    [50, -50]
  );

  const smoothContentX = useSpring(contentX, {
    stiffness: 100,
    damping: 30,
  });

  const bgClass = section.bgClass ?? "bg-zinc-900";

  return (
    <div
      className={`flex-shrink-0 w-screen h-screen flex items-center justify-center ${bgClass}`}
    >
      <motion.div
        className="max-w-3xl px-8 text-center"
        style={prefersReducedMotion ? {} : { x: smoothContentX }}
      >
        {section.content ?? (
          <>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {section.title}
            </h2>
            {section.description && (
              <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto">
                {section.description}
              </p>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

// Main horizontal scroll container
function HorizontalScrollContainer({
  sections,
  className,
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform vertical scroll to horizontal movement
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(sections.length - 1) * 100}%`]
  );

  const smoothX = useSpring(x, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Calculate total scroll height needed
  const totalScrollHeight = `${(sections.length) * 100}vh`;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: totalScrollHeight }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Progress indicator */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          {sections.map((_, i) => (
            <HorizontalProgressSegment
              key={i}
              index={i}
              totalSections={sections.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        {/* Horizontal track */}
        <motion.div
          ref={wrapperRef}
          className="flex h-full"
          style={{
            x: prefersReducedMotion ? 0 : smoothX,
            width: `${sections.length * 100}%`,
          }}
        >
          {sections.map((section, index) => (
            <HorizontalPanel
              key={section.id}
              section={section}
              index={index}
              totalSections={sections.length}
              containerRef={containerRef}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Card showcase section
function CardShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-200%"]);

  const cards = [
    {
      title: "Design",
      description: "Beautiful interfaces",
      gradient: "from-violet-600 to-purple-600",
    },
    {
      title: "Develop",
      description: "Clean, maintainable code",
      gradient: "from-blue-600 to-cyan-600",
    },
    {
      title: "Deploy",
      description: "Fast, reliable hosting",
      gradient: "from-emerald-600 to-teal-600",
    },
    {
      title: "Scale",
      description: "Grow with confidence",
      gradient: "from-orange-600 to-amber-600",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative h-[400vh]"
    >
      <div className="sticky top-0 h-screen bg-zinc-950 flex items-center overflow-hidden">
        <motion.div
          className="flex gap-8 px-[50vw]"
          style={{ x }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-80 h-96 rounded-3xl bg-gradient-to-br ${card.gradient} p-8 flex flex-col justify-end shadow-2xl`}
            >
              <h3 className="text-4xl font-bold text-white mb-2">
                {card.title}
              </h3>
              <p className="text-white/80">{card.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Sample sections data
const horizontalSections: HorizontalSection[] = [
  {
    id: "intro",
    title: "Horizontal Scroll",
    description: "Scroll down to move horizontally through sections",
    bgClass: "bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900",
  },
  {
    id: "explore",
    title: "Explore",
    description: "A different way to navigate content",
    bgClass: "bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950",
  },
  {
    id: "discover",
    title: "Discover",
    description: "Each section reveals new information",
    bgClass: "bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950",
  },
  {
    id: "create",
    title: "Create",
    description: "Perfect for portfolios and showcases",
    bgClass: "bg-gradient-to-br from-fuchsia-950 via-pink-900 to-rose-950",
  },
  {
    id: "inspire",
    title: "Inspire",
    description: "Engage users with smooth transitions",
    bgClass: "bg-gradient-to-br from-rose-950 via-orange-900 to-amber-950",
  },
];

export default function HorizontalPage() {
  return (
    <main className="w-full bg-zinc-950">
      {/* Hero */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            Horizontal Scroll
          </h1>
          <p className="text-xl text-zinc-400">
            Scroll down to experience horizontal navigation
          </p>
          <motion.div
            className="mt-12"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg
              className="w-8 h-8 mx-auto text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Horizontal scroll sections */}
      <HorizontalScrollContainer sections={horizontalSections} />

      {/* Card showcase */}
      <CardShowcase />

      {/* Footer */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-4">
            End of Journey
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            Horizontal scrolling creates a unique narrative experience,
            perfect for storytelling and product showcases.
          </p>
        </div>
      </section>
    </main>
  );
}
