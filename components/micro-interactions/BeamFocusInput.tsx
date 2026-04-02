"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface BeamFocusInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  glowStrength?: number;
  beamSpeed?: number;
  invalid?: boolean;
}

export function BeamFocusInput({
  label = "Email",
  helperText,
  glowStrength = 68,
  beamSpeed = 1.2,
  invalid = false,
  className = "",
  ...props
}: BeamFocusInputProps) {
  const inputId = useId();
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [focused, setFocused] = useState(false);

  const glowAlpha = Math.min(0.55, glowStrength / 180);
  const borderClass = invalid
    ? "border-rose-300/35"
    : focused
      ? "border-cyan-200/40"
      : "border-white/12";

  return (
    <label className={`flex w-full max-w-xl flex-col gap-3 ${className}`}>
      <span className="text-xs uppercase tracking-[0.28em] text-zinc-400">{label}</span>
      <div
        className={`relative overflow-hidden rounded-[1.5rem] border bg-[linear-gradient(180deg,rgba(8,15,28,0.96),rgba(2,6,23,0.92))] p-[1px] shadow-[0_22px_54px_-36px_rgba(8,15,28,0.95)] transition-colors ${borderClass}`}
        style={{
          boxShadow: focused
            ? `0 24px 56px -34px rgba(8,145,178,${glowAlpha}), 0 0 0 1px rgba(255,255,255,0.04)`
            : "0 22px 54px -36px rgba(8,15,28,0.95)",
        }}
      >
        <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_38%),linear-gradient(180deg,rgba(15,23,42,0.86),rgba(2,6,23,0.95))] px-5 py-4">
          {!prefersReducedMotion ? (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-[-22%] w-[44%] skew-x-[-24deg]"
              initial={false}
              animate={
                focused
                  ? { x: ["-12%", "220%"], opacity: [0, 0.92, 0] }
                  : { x: "0%", opacity: 0 }
              }
              transition={{
                duration: Math.max(1.05, 2.6 - beamSpeed),
                repeat: focused ? Infinity : 0,
                repeatDelay: 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(165,243,252,0.1), rgba(255,255,255,0.65), rgba(34,211,238,0.18), transparent)",
                filter: `blur(${Math.max(6, glowStrength / 7)}px)`,
              }}
            />
          ) : null}

          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            initial={false}
            animate={{
              opacity: focused ? 1 : 0.4,
              scaleX: focused ? 1 : 0.72,
            }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: invalid
                ? "linear-gradient(90deg, transparent, rgba(251,113,133,0.8), transparent)"
                : "linear-gradient(90deg, transparent, rgba(103,232,249,0.86), transparent)",
            }}
          />

          <input
            {...props}
            id={inputId}
            aria-invalid={invalid}
            aria-describedby={helperId}
            onFocus={(event) => {
              setFocused(true);
              props.onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              props.onBlur?.(event);
            }}
            className="relative z-10 w-full bg-transparent text-lg text-white outline-none placeholder:text-zinc-500"
          />
        </div>
      </div>
      <span
        id={helperId}
        className={`min-h-6 text-sm leading-6 ${invalid ? "text-rose-200" : "text-zinc-400"}`}
      >
        {helperText}
      </span>
    </label>
  );
}
