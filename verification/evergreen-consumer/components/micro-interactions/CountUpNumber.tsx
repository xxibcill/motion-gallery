"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type Tone = "cyan" | "amber" | "rose";

const toneStyles: Record<
  Tone,
  {
    surface: string;
    eyebrow: string;
    value: string;
    line: string;
  }
> = {
  cyan: {
    surface: "from-cyan-300/14 via-sky-300/10 to-transparent",
    eyebrow: "text-cyan-100/78",
    value: "text-cyan-50",
    line: "from-cyan-200 via-sky-200/60 to-transparent",
  },
  amber: {
    surface: "from-amber-300/16 via-orange-300/10 to-transparent",
    eyebrow: "text-amber-100/78",
    value: "text-amber-50",
    line: "from-amber-200 via-orange-200/60 to-transparent",
  },
  rose: {
    surface: "from-rose-300/16 via-pink-300/10 to-transparent",
    eyebrow: "text-rose-100/78",
    value: "text-rose-50",
    line: "from-rose-200 via-pink-200/60 to-transparent",
  },
};

export interface CountUpNumberProps
  extends Omit<HTMLMotionProps<"section">, "children"> {
  value: number;
  label: string;
  caption?: string;
  eyebrow?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  delay?: number;
  tone?: Tone;
  compact?: boolean;
}

function easeOutQuint(progress: number) {
  return 1 - Math.pow(1 - progress, 5);
}

export function CountUpNumber({
  value,
  label,
  caption,
  eyebrow = "Count Up",
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.2,
  delay = 0,
  tone = "cyan",
  compact = false,
  className = "",
  ...props
}: CountUpNumberProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? value : 0);
  const styles = toneStyles[tone];

  useEffect(() => {
    let frameId = 0;
    let timeoutId = 0;
    let cancelled = false;

    if (prefersReducedMotion) {
      frameId = window.requestAnimationFrame(() => {
        setDisplayValue(value);
      });

      return () => {
        cancelled = true;
        window.cancelAnimationFrame(frameId);
      };
    }

    const startAnimation = () => {
      const startedAt = performance.now();

      const tick = (now: number) => {
        if (cancelled) {
          return;
        }

        const progress = Math.min((now - startedAt) / (Math.max(duration, 0.01) * 1000), 1);
        const eased = easeOutQuint(progress);
        setDisplayValue(value * eased);

        if (progress < 1) {
          frameId = window.requestAnimationFrame(tick);
          return;
        }

        setDisplayValue(value);
      };

      frameId = window.requestAnimationFrame(tick);
    };

    if (delay > 0) {
      timeoutId = window.setTimeout(startAnimation, delay * 1000);
    } else {
      startAnimation();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(frameId);
    };
  }, [delay, duration, prefersReducedMotion, value]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals]
  );

  const renderedValue = `${prefix}${formatter.format(displayValue)}${suffix}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 shadow-[var(--mi-shadow-soft)] ${className}`}
      {...props}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.surface}`} />
      <div className="relative">
        <p className={`text-[11px] uppercase tracking-[0.32em] ${styles.eyebrow}`}>{eyebrow}</p>
        <p className="mt-3 text-sm uppercase tracking-[0.18em] text-zinc-400">{label}</p>
        <p
          className={`mt-4 font-semibold leading-none tracking-[-0.06em] tabular-nums ${styles.value} ${
            compact ? "text-[clamp(2.6rem,7vw,4rem)]" : "text-[clamp(4rem,12vw,7.5rem)]"
          }`}
        >
          {renderedValue}
        </p>
        {caption ? (
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">{caption}</p>
        ) : null}
        <div className="mt-6 h-px bg-white/10" />
        <div className={`mt-3 h-1 w-full rounded-full bg-gradient-to-r ${styles.line}`} />
      </div>
    </motion.section>
  );
}
