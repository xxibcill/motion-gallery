"use client";

import { memo } from "react";
import { motion } from "motion/react";
import type { StarConfig } from "./dimensional-rift-presets";
import { riftPhaseDurations } from "./dimensional-rift-presets";

interface StarFieldProps {
  stars: StarConfig[];
  palette: {
    star: string;
    tunnel: string;
  };
  isVisible: boolean;
  prefersReducedMotion: boolean;
}

function StarFieldComponent({
  stars,
  palette,
  isVisible,
  prefersReducedMotion,
}: StarFieldProps) {
  if (!isVisible || prefersReducedMotion) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{ perspective: "800px" }}
    >
      {/* Central glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: palette.tunnel }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.2, 1], opacity: [0, 0.8, 0.6] }}
        transition={{
          duration: riftPhaseDurations.tunnel,
          ease: "easeOut",
        }}
      />

      {/* Stars expanding from center (tunnel effect) */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            width: star.size,
            height: star.size,
            background: palette.star,
            boxShadow: `0 0 ${star.size * 2}px ${palette.star}`,
            left: `calc(50% + ${Math.cos(star.angle) * star.distance * 0.3}px)`,
            top: `calc(50% + ${Math.sin(star.angle) * star.distance * 0.3}px)`,
          }}
          initial={{
            scale: 0.1,
            opacity: 0,
          }}
          animate={{
            scale: [0.1, 0.5, 8],
            opacity: [0, 1, 0],
            left: [
              `calc(50% + ${Math.cos(star.angle) * star.distance * 0.3}px)`,
              `calc(50% + ${Math.cos(star.angle) * star.distance * 0.6}px)`,
              `calc(50% + ${Math.cos(star.angle) * star.distance * 2}px)`,
            ],
            top: [
              `calc(50% + ${Math.sin(star.angle) * star.distance * 0.3}px)`,
              `calc(50% + ${Math.sin(star.angle) * star.distance * 0.6}px)`,
              `calc(50% + ${Math.sin(star.angle) * star.distance * 2}px)`,
            ],
          }}
          transition={{
            duration: riftPhaseDurations.tunnel,
            delay: star.delay,
            ease: "linear",
            times: [0, 0.4, 1],
          }}
        />
      ))}

      {/* Chromatic aberration layers */}
      <motion.div
        className="absolute inset-0"
        style={{
          filter: "hue-rotate(-15deg)",
          transform: "translateX(-8px)",
          mixBlendMode: "screen",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0.2, 0] }}
        transition={{
          duration: riftPhaseDurations.tunnel,
          times: [0, 0.2, 0.8, 1],
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          filter: "hue-rotate(15deg)",
          transform: "translateX(8px)",
          mixBlendMode: "screen",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.25, 0.15, 0] }}
        transition={{
          duration: riftPhaseDurations.tunnel,
          delay: 0.05,
          times: [0, 0.2, 0.8, 1],
        }}
      />

      {/* Radial vignette */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.9) 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.8] }}
        transition={{
          duration: riftPhaseDurations.tunnel,
          ease: "easeIn",
        }}
      />
    </motion.div>
  );
}

export const StarField = memo(StarFieldComponent);
