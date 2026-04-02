"use client";

import { memo, useMemo } from "react";
import { motion } from "motion/react";
import { StarField } from "./StarField";
import type { StarConfig } from "./dimensional-rift-presets";
import { riftPhaseDurations } from "./dimensional-rift-presets";

interface DimensionalTunnelProps {
  stars: StarConfig[];
  palette: {
    star: string;
    tunnel: string;
    glow: string;
  };
  isActive: boolean;
  prefersReducedMotion: boolean;
}

function DimensionalTunnelComponent({
  stars,
  palette,
  isActive,
  prefersReducedMotion,
}: DimensionalTunnelProps) {
  const speedLines = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        angle: (i / 12) * Math.PI * 2,
        distance: 30 + ((i * 11) % 5) * 4,
        id: `speed-line-${i}`,
      })),
    []
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30"
    >
      {/* Star field with tunnel effect */}
      <StarField
        stars={stars}
        palette={palette}
        isVisible={isActive}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* Reduced motion fallback - simple fade transition */}
      {isActive && prefersReducedMotion && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, ${palette.tunnel.replace("0.36", "0.4")}, transparent 50%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: riftPhaseDurations.tunnel,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Central white flash at peak */}
      {isActive && !prefersReducedMotion && (
        <motion.div
          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 20%, transparent 50%)",
          }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0, 0.8, 0], scale: [0.3, 0.5, 1.5, 2] }}
          transition={{
            duration: riftPhaseDurations.tunnel,
            times: [0, 0.5, 0.7, 1],
            ease: "easeOut",
          }}
        />
      )}

      {/* Speed lines */}
      {isActive &&
        !prefersReducedMotion &&
        speedLines.map(({ angle, distance, id }, i) => {
          return (
            <motion.div
              key={id}
              className="absolute h-px"
              style={{
                left: `calc(50% + ${Math.cos(angle) * distance}%)`,
                top: `calc(50% + ${Math.sin(angle) * distance}%)`,
                width: "100px",
                background: `linear-gradient(90deg, transparent, ${palette.star}, transparent)`,
                transformOrigin: "center center",
                transform: `rotate(${(angle * 180) / Math.PI + 90}deg)`,
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                scaleY: [0, 1, 0.5],
                y: [0, -200],
              }}
              transition={{
                duration: riftPhaseDurations.tunnel * 0.6,
                delay: i * 0.05,
                ease: "easeOut",
              }}
            />
          );
        })}
    </div>
  );
}

export const DimensionalTunnel = memo(DimensionalTunnelComponent);
