"use client";

import { useState, type MouseEvent } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type AccentTone = "rose" | "amber" | "cyan";

const accentStyles: Record<
  AccentTone,
  {
    shell: string;
    text: string;
    iconSurface: string;
    outline: string;
    fill: string;
    particle: string;
    glow: string;
    ring: string;
  }
> = {
  rose: {
    shell:
      "border-rose-200/18 bg-[linear-gradient(135deg,rgba(251,113,133,0.22),rgba(15,23,42,0.88))]",
    text: "text-rose-50",
    iconSurface:
      "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.26),rgba(244,63,94,0.2)_54%,rgba(15,23,42,0.85))]",
    outline: "rgba(255,228,230,0.88)",
    fill: "#fb7185",
    particle: "rgba(251,113,133,0.95)",
    glow: "rgba(251,113,133,0.38)",
    ring: "rgba(255,228,230,0.26)",
  },
  amber: {
    shell:
      "border-amber-200/18 bg-[linear-gradient(135deg,rgba(251,191,36,0.2),rgba(15,23,42,0.88))]",
    text: "text-amber-50",
    iconSurface:
      "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),rgba(245,158,11,0.2)_56%,rgba(15,23,42,0.85))]",
    outline: "rgba(254,243,199,0.9)",
    fill: "#f59e0b",
    particle: "rgba(251,191,36,0.95)",
    glow: "rgba(245,158,11,0.34)",
    ring: "rgba(253,230,138,0.24)",
  },
  cyan: {
    shell:
      "border-cyan-200/18 bg-[linear-gradient(135deg,rgba(34,211,238,0.2),rgba(15,23,42,0.9))]",
    text: "text-cyan-50",
    iconSurface:
      "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),rgba(14,165,233,0.2)_56%,rgba(15,23,42,0.86))]",
    outline: "rgba(224,242,254,0.88)",
    fill: "#22d3ee",
    particle: "rgba(103,232,249,0.96)",
    glow: "rgba(34,211,238,0.34)",
    ring: "rgba(186,230,253,0.22)",
  },
};

const heartPath =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

export interface LikeBurstButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  idleLabel?: string;
  likedLabel?: string;
  defaultLiked?: boolean;
  burstDensity?: number;
  accent?: AccentTone;
}

function createParticles(burstDensity: number) {
  const count = Math.max(6, Math.round(burstDensity));

  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
    const lane = index % 3;
    const distance = 24 + lane * 10;
    const streak = index % 4 === 0;

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      width: streak ? 12 : lane === 0 ? 6 : 4,
      height: streak ? 3 : lane === 0 ? 6 : 4,
      delay: lane * 0.018 + (index % 2) * 0.012,
      rotate: (angle * 180) / Math.PI,
    };
  });
}

export function LikeBurstButton({
  idleLabel = "Save",
  likedLabel = "Saved",
  defaultLiked = false,
  burstDensity = 12,
  accent = "rose",
  disabled = false,
  className = "",
  onClick,
  ...props
}: LikeBurstButtonProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [liked, setLiked] = useState(defaultLiked);
  const [burstKey, setBurstKey] = useState(0);
  const [lastAction, setLastAction] = useState<"like" | "unlike">(
    defaultLiked ? "like" : "unlike"
  );
  const styles = accentStyles[accent];
  const particles = createParticles(burstDensity);

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    const nextLiked = !liked;
    setLiked(nextLiked);
    setLastAction(nextLiked ? "like" : "unlike");

    if (nextLiked && !prefersReducedMotion) {
      setBurstKey((value) => value + 1);
    }

    onClick?.(event);
  };

  const isActive = liked && !disabled;

  return (
    <motion.button
      {...props}
      type="button"
      aria-pressed={liked}
      disabled={disabled}
      onClick={handleToggle}
      className={`group relative inline-flex min-h-16 items-center gap-4 overflow-hidden rounded-full border px-4 py-3 text-left shadow-[0_24px_64px_-40px_rgba(15,23,42,0.9)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-45 ${styles.shell} ${styles.text} ${className}`}
      animate={{
        boxShadow: isActive
          ? `0 30px 72px -34px ${styles.glow}`
          : "0 24px 64px -40px rgba(15,23,42,0.9)",
        scale: disabled ? 1 : isActive ? 1.01 : 1,
      }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
    >
      <span
        className="absolute inset-0 opacity-80"
        style={{
          background: isActive
            ? `radial-gradient(circle at 20% 10%, ${styles.glow}, transparent 42%)`
            : "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.08), transparent 42%)",
        }}
      />

      <span className="relative z-10 flex items-center gap-4">
        <motion.span
          initial={false}
          animate={
            liked
              ? { scale: [1, 1.18, 1], rotate: [0, -8, 6, 0] }
              : lastAction === "unlike"
                ? { scale: [1, 0.94, 1], rotate: [0, 4, 0] }
                : { scale: 1, rotate: 0 }
          }
          transition={{
            duration: liked ? 0.42 : 0.28,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative grid h-11 w-11 place-items-center rounded-full border border-white/12"
        >
          <span className={`absolute inset-0 rounded-full ${styles.iconSurface}`} />
          <motion.span
            className="absolute inset-[-8px] rounded-full"
            initial={false}
            animate={{
              opacity: liked ? 1 : 0.45,
              scale: liked ? 1.08 : 0.92,
            }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{
              boxShadow: `0 0 0 1px ${styles.ring}`,
              background: prefersReducedMotion
                ? `radial-gradient(circle, ${styles.glow}, transparent 72%)`
                : `radial-gradient(circle, ${styles.glow}, transparent 66%)`,
            }}
          />

          {!prefersReducedMotion
            ? particles.map((particle, index) => (
                <motion.span
                  key={`${burstKey}-${index}`}
                  className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
                  style={{
                    width: particle.width,
                    height: particle.height,
                    backgroundColor: styles.particle,
                  }}
                  initial={{ x: -particle.width / 2, y: -particle.height / 2, opacity: 0, scale: 0.2 }}
                  animate={
                    liked
                      ? {
                          x: -particle.width / 2 + particle.x,
                          y: -particle.height / 2 + particle.y,
                          opacity: [0, 1, 0],
                          scale: [0.2, 1, 0.7],
                          rotate: particle.rotate,
                        }
                      : {
                          x: -particle.width / 2,
                          y: -particle.height / 2,
                          opacity: 0,
                          scale: 0.2,
                          rotate: particle.rotate,
                        }
                  }
                  transition={{
                    duration: 0.46,
                    delay: particle.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))
            : null}

          <motion.svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="relative z-10 h-5 w-5 overflow-visible"
            initial={false}
            animate={{ scale: liked ? 1.04 : 1 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.path
              d={heartPath}
              fill={styles.fill}
              initial={false}
              animate={{ opacity: liked ? 1 : 0.08, scale: liked ? 1 : 0.86 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "center" }}
            />
            <path
              d={heartPath}
              fill="none"
              stroke={styles.outline}
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.span>

        <span className="flex min-w-[7rem] flex-col">
          <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">
            Favorite
          </span>
          <span className="relative mt-1 h-6 overflow-hidden text-base font-semibold">
            {prefersReducedMotion ? (
              <span>{liked ? likedLabel : idleLabel}</span>
            ) : (
              <>
                <motion.span
                  className="absolute inset-0"
                  initial={false}
                  animate={{ y: liked ? "-120%" : "0%", opacity: liked ? 0 : 1 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {idleLabel}
                </motion.span>
                <motion.span
                  className="absolute inset-0"
                  initial={false}
                  animate={{ y: liked ? "0%" : "120%", opacity: liked ? 1 : 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {likedLabel}
                </motion.span>
              </>
            )}
          </span>
        </span>
      </span>
    </motion.button>
  );
}
