"use client";

import {
  motion,
  useInView,
  useAnimation,
  useReducedMotion,
} from "motion/react";
import React, { useRef, useEffect, ReactNode } from "react";

// Split text into individual characters with staggered animation
interface SplitTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  staggerDuration?: number;
  animation?: "fadeUp" | "fadeIn" | "blur" | "scale";
}

function SplitText({
  text,
  className = "",
  charClassName = "",
  delay = 0,
  staggerDuration = 0.03,
  animation = "fadeUp",
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  const getAnimationVariants = () => {
    switch (animation) {
      case "fadeIn":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case "blur":
        return {
          hidden: { opacity: 0, filter: "blur(10px)" },
          visible: { opacity: 1, filter: "blur(0px)" },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.5 },
          visible: { opacity: 1, scale: 1 },
        };
      case "fadeUp":
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  if (prefersReducedMotion) {
    return (
      <div className={className}>
        <span className={charClassName}>{text}</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className={`inline-block ${charClassName}`}
          variants={getAnimationVariants()}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{
            duration: 0.5,
            delay: delay + i * staggerDuration,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}

// Split text into words with staggered animation
interface SplitWordsProps {
  text: string;
  className?: string;
  wordClassName?: string;
  staggerDuration?: number;
  animation?: "fadeUp" | "slideIn" | "bounce";
}

function SplitWords({
  text,
  className = "",
  wordClassName = "",
  staggerDuration = 0.1,
  animation = "fadeUp",
}: SplitWordsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  const getAnimationVariants = () => {
    switch (animation) {
      case "slideIn":
        return {
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0 },
        };
      case "bounce":
        return {
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0 },
        };
      case "fadeUp":
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  const words = text.split(" ");

  if (prefersReducedMotion) {
    return (
      <div className={className}>
        <span className={wordClassName}>{text}</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={`inline-block mr-4 ${wordClassName}`}
          variants={getAnimationVariants()}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{
            duration: 0.6,
            delay: i * staggerDuration,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

// Typewriter effect
interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  cursor?: boolean;
  cursorChar?: string;
  delay?: number;
}

function Typewriter({
  text,
  speed = 50,
  className = "",
  cursor = true,
  cursorChar = "|",
  delay = 0,
}: TypewriterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayedText, setDisplayedText] = React.useState("");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      if (prefersReducedMotion) setDisplayedText(text);
      return;
    }

    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, text, speed, delay, prefersReducedMotion]);

  return (
    <div ref={ref} className={`font-mono ${className}`}>
      <span>{displayedText}</span>
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block ml-0.5"
        >
          {cursorChar}
        </motion.span>
      )}
    </div>
  );
}

// Reveal text with mask
interface RevealTextProps {
  text: string;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
}

function RevealText({
  text,
  className = "",
  direction = "up",
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  const getClipPath = () => {
    switch (direction) {
      case "left":
        return ["inset(0 100% 0 0)", "inset(0 0% 0 0)"];
      case "right":
        return ["inset(0 0 0 100%)", "inset(0 0 0 0%)"];
      case "down":
        return ["inset(0 0 100% 0)", "inset(0 0 0% 0)"];
      case "up":
      default:
        return ["inset(100% 0 0 0)", "inset(0% 0 0 0)"];
    }
  };

  if (prefersReducedMotion) {
    return (
      <div className={className}>
        <span>{text}</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: getClipPath()[0] }}
        animate={isInView ? { clipPath: getClipPath()[1] } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {text}
      </motion.div>
    </div>
  );
}

// Gradient text animation
interface GradientTextProps {
  text: string;
  className?: string;
  colors?: string[];
}

function GradientText({
  text,
  className = "",
  colors = ["#f97316", "#ec4899", "#8b5cf6", "#06b6d4", "#f97316"],
}: GradientTextProps) {
  const gradientRef = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={gradientRef}
      className={`bg-clip-text text-transparent bg-gradient-to-r animate-gradient ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
        backgroundSize: "300% 100%",
      }}
    >
      {text}
    </span>
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
    <section className={`min-h-screen flex items-center justify-center p-8 ${className}`}>
      {children}
    </section>
  );
}

export default function TextRevealPage() {
  return (
    <main className="w-full bg-zinc-950">
      {/* Hero - Character fade up */}
      <Section className="bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="text-center">
          <SplitText
            text="Text Animations"
            className="text-6xl md:text-8xl font-bold mb-6"
            charClassName="text-white"
            staggerDuration={0.04}
            animation="fadeUp"
          />
          <SplitText
            text="Scroll to see different reveal techniques"
            className="text-xl"
            charClassName="text-zinc-400"
            delay={0.5}
            staggerDuration={0.02}
            animation="fadeIn"
          />
        </div>
      </Section>

      {/* Word stagger */}
      <Section className="bg-gradient-to-b from-zinc-900 to-indigo-950">
        <div className="max-w-4xl text-center">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-4">
            Word Stagger
          </h2>
          <SplitWords
            text="Each word appears independently with smooth easing"
            className="text-4xl md:text-5xl font-bold leading-tight"
            wordClassName="text-white"
            staggerDuration={0.12}
            animation="fadeUp"
          />
        </div>
      </Section>

      {/* Blur reveal */}
      <Section className="bg-gradient-to-b from-indigo-950 to-violet-950">
        <div className="text-center">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-4">
            Blur Effect
          </h2>
          <SplitText
            text="Coming Into Focus"
            className="text-6xl md:text-7xl font-bold mb-4"
            charClassName="text-white"
            staggerDuration={0.05}
            animation="blur"
          />
          <SplitText
            text="Characters reveal from a blur state"
            className="text-xl"
            charClassName="text-violet-300"
            delay={0.5}
            animation="blur"
          />
        </div>
      </Section>

      {/* Scale pop */}
      <Section className="bg-gradient-to-b from-violet-950 to-purple-950">
        <div className="text-center">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-4">
            Scale Pop
          </h2>
          <SplitText
            text="Bouncy Energy"
            className="text-6xl md:text-7xl font-bold mb-4"
            charClassName="text-white"
            staggerDuration={0.04}
            animation="scale"
          />
        </div>
      </Section>

      {/* Typewriter */}
      <Section className="bg-gradient-to-b from-purple-950 to-fuchsia-950">
        <div className="text-center max-w-2xl">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-8">
            Typewriter Effect
          </h2>
          <Typewriter
            text="Watch as each character appears one by one..."
            speed={60}
            className="text-3xl md:text-4xl font-mono text-white"
            delay={500}
          />
        </div>
      </Section>

      {/* Mask reveal */}
      <Section className="bg-gradient-to-b from-fuchsia-950 to-pink-950">
        <div className="text-center">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-8">
            Mask Reveal
          </h2>
          <RevealText
            text="Revealing From Below"
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            direction="up"
          />
          <RevealText
            text="Sliding In From Left"
            className="text-3xl md:text-4xl font-bold text-pink-200"
            direction="left"
          />
        </div>
      </Section>

      {/* Gradient text */}
      <Section className="bg-gradient-to-b from-pink-950 to-rose-950">
        <div className="text-center">
          <h2 className="text-zinc-500 text-sm uppercase tracking-widest mb-8">
            Animated Gradient
          </h2>
          <GradientText
            text="Rainbow Flow"
            className="text-6xl md:text-8xl font-bold"
          />
        </div>
      </Section>

      {/* Combined showcase */}
      <Section className="bg-gradient-to-b from-rose-950 to-zinc-950">
        <div className="text-center max-w-4xl">
          <SplitWords
            text="Combine techniques for stunning results"
            className="text-4xl md:text-5xl font-bold mb-8"
            wordClassName="text-white"
            staggerDuration={0.1}
            animation="bounce"
          />
          <SplitText
            text="Mix and match to create unique animations that fit your brand."
            className="text-xl"
            charClassName="text-zinc-400"
            delay={0.3}
            staggerDuration={0.015}
            animation="fadeIn"
          />
        </div>
      </Section>
    </main>
  );
}
