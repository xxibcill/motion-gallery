import type { SpringOptions } from "framer-motion";

// Spring physics presets
export const springPresets: Record<string, SpringOptions> = {
  gentle: { stiffness: 100, damping: 30 },
  snappy: { stiffness: 300, damping: 30 },
  bouncy: { stiffness: 400, damping: 10 },
  slow: { stiffness: 50, damping: 20 },
  stiff: { stiffness: 500, damping: 30 },
  soft: { stiffness: 80, damping: 25 },
};

// Reveal animation presets
export const revealPresets = {
  fadeUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
  fadeDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
  fadeLeft: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
  fadeRight: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  },
  scaleUp: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  },
  blur: {
    initial: { filter: "blur(10px)", opacity: 0 },
    animate: { filter: "blur(0px)", opacity: 1 },
  },
} as const;

// Clip path presets for mask reveals
export const clipPathPresets = {
  revealUp: ["inset(100% 0 0 0)", "inset(0 0 0 0)"],
  revealDown: ["inset(0 0 100% 0)", "inset(0 0 0 0)"],
  revealLeft: ["inset(0 100% 0 0)", "inset(0 0 0 0)"],
  revealRight: ["inset(0 0 0 100%)", "inset(0 0 0 0)"],
  circle: ["circle(0% at 50% 50%)", "circle(100% at 50% 50%)"],
  circleTopLeft: ["circle(0% at 0% 0%)", "circle(150% at 0% 0%)"],
  circleBottomRight: ["circle(0% at 100% 100%)", "circle(150% at 100% 100%)"],
} as const;

// Transition presets
export const transitionPresets = {
  smooth: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  quick: { duration: 0.3, ease: "easeOut" },
  slow: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
  bounce: { type: "spring", stiffness: 300, damping: 10 },
  spring: { type: "spring", stiffness: 200, damping: 20 },
} as const;

export const transitionLabDurations = {
  instant: 0,
  brisk: 0.35,
  base: 0.65,
  slow: 0.95,
  linger: 1.25,
} as const;

export const transitionLabEasings = {
  emphasis: [0.16, 1, 0.3, 1],
  curtain: [0.77, 0, 0.18, 1],
  fluid: [0.22, 1, 0.36, 1],
} as const;

export const transitionLabSprings = {
  stage: { stiffness: 150, damping: 24, mass: 0.9 },
  sharedElement: { stiffness: 220, damping: 22, mass: 0.8 },
  hover: { stiffness: 260, damping: 20, mass: 0.7 },
} as const satisfies Record<string, SpringOptions>;

// Stagger presets for lists
export const staggerPresets = {
  tight: { staggerChildren: 0.05 },
  normal: { staggerChildren: 0.1 },
  loose: { staggerChildren: 0.2 },
  slow: { staggerChildren: 0.3 },
} as const;

// Common animation variants
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Scroll-driven animation ranges
export const scrollRanges = {
  fadeIn: {
    input: [0, 0.3],
    output: [0, 1],
  },
  slideUp: {
    input: [0, 0.3],
    output: [100, 0],
  },
  slideIn: {
    input: [0, 0.3],
    output: [-100, 0],
  },
  scaleIn: {
    input: [0, 0.3],
    output: [0.8, 1],
  },
} as const;
