"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { riftPhaseDurations, riftEasings } from "./dimensional-rift-presets";

interface VoidPullProps {
  palette: {
    glow: string;
    background: string;
  };
  isActive: boolean;
  prefersReducedMotion: boolean;
}

function VoidPullComponent({
  palette,
  isActive,
  prefersReducedMotion,
}: VoidPullProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20"
    >
      {/* Central singularity glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.9) 20%, ${palette.glow} 45%, transparent 70%)`,
          boxShadow: `0 0 100px ${palette.glow}, 0 0 200px ${palette.glow}`,
        }}
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{
          scale: isActive
            ? prefersReducedMotion
              ? 1
              : [0.1, 0.6, 1.2, 1.5]
            : 0.1,
          opacity: isActive ? [0, 0.9, 0.7, 0.5] : 0,
        }}
        transition={{
          duration: riftPhaseDurations.void,
          ease: riftEasings.void,
          times: prefersReducedMotion ? undefined : [0, 0.4, 0.7, 1],
        }}
      />

      {/* Attractor rings */}
      {[0, 1, 2].map((ring) => (
        <motion.div
          key={`ring-${ring}`}
          className="absolute left-1/2 top-1/2 rounded-full border"
          style={{
            width: `${10 + ring * 6}rem`,
            height: `${10 + ring * 6}rem`,
            translateX: "-50%",
            translateY: "-50%",
            borderColor: palette.glow.replace("0.48", "0.2"),
            boxShadow: `0 0 30px ${palette.glow.replace("0.48", "0.15")}`,
          }}
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{
            scale: isActive
              ? prefersReducedMotion
                ? 1
                : [0.2, 1.1, 0.9]
              : 0.2,
            opacity: isActive ? [0, 0.4, 0.15] : 0,
            rotate: isActive ? (ring % 2 === 0 ? 20 : -20) : 0,
          }}
          transition={{
            duration: riftPhaseDurations.void,
            delay: isActive && !prefersReducedMotion ? ring * 0.08 : 0,
            ease: riftEasings.void,
          }}
        />
      ))}

      {/* Gravitational field lines */}
      {isActive &&
        !prefersReducedMotion &&
        Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const startX = 50 + Math.cos(angle) * 45;
          const startY = 50 + Math.sin(angle) * 45;

          return (
            <motion.div
              key={`field-line-${i}`}
              className="absolute h-px"
              style={{
                left: `${startX}%`,
                top: `${startY}%`,
                width: "200px",
                background: `linear-gradient(90deg, ${palette.glow.replace("0.48", "0.3")}, transparent)`,
                transformOrigin: "left center",
                transform: `rotate(${(angle * 180) / Math.PI}deg)`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: [0, 1, 0.3],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: riftPhaseDurations.void,
                delay: i * 0.04,
                ease: riftEasings.void,
              }}
            />
          );
        })}
    </div>
  );
}

export const VoidPull = memo(VoidPullComponent);
