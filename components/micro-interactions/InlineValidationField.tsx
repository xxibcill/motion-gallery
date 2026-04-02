"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type ValidationMode = "idle" | "typing" | "error" | "success";

export interface InlineValidationFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  mode?: ValidationMode;
}

const modeCopy: Record<
  ValidationMode,
  {
    eyebrow: string;
    message: string;
    border: string;
    tint: string;
    tone: string;
  }
> = {
  idle: {
    eyebrow: "Waiting",
    message: "Clear structure keeps the field stable before validation starts.",
    border: "border-white/12",
    tint: "rgba(255,255,255,0.08)",
    tone: "text-zinc-300",
  },
  typing: {
    eyebrow: "Typing",
    message: "Live guidance stays quiet until the user has enough signal.",
    border: "border-cyan-200/28",
    tint: "rgba(34,211,238,0.14)",
    tone: "text-cyan-100",
  },
  error: {
    eyebrow: "Needs Attention",
    message: "Add a work email with your company domain to continue.",
    border: "border-rose-300/34",
    tint: "rgba(251,113,133,0.16)",
    tone: "text-rose-100",
  },
  success: {
    eyebrow: "Looks Good",
    message: "Validated and ready for the next step.",
    border: "border-emerald-300/34",
    tint: "rgba(52,211,153,0.16)",
    tone: "text-emerald-100",
  },
};

export function InlineValidationField({
  label = "Work email",
  mode = "idle",
  placeholder = "name@studio.com",
  className = "",
  ...props
}: InlineValidationFieldProps) {
  const fieldId = useId();
  const messageId = `${fieldId}-message`;
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const copy = modeCopy[mode];

  return (
    <label className={`flex w-full max-w-xl flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.28em] text-zinc-400">{label}</span>
        <span className={`text-xs uppercase tracking-[0.24em] ${copy.tone}`}>{copy.eyebrow}</span>
      </div>

      <motion.div
        className={`relative overflow-hidden rounded-[1.45rem] border bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.96))] px-5 py-4 ${copy.border}`}
        initial={false}
        animate={{
          scale: focused && mode !== "error" ? 1.01 : 1,
          boxShadow:
            mode === "error"
              ? "0 24px 54px -34px rgba(251,113,133,0.45)"
              : mode === "success"
                ? "0 24px 54px -34px rgba(52,211,153,0.42)"
                : focused
                  ? "0 24px 54px -34px rgba(34,211,238,0.35)"
                  : "0 18px 42px -34px rgba(2,6,23,0.95)",
        }}
        transition={{ duration: prefersReducedMotion ? 0.01 : 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background: `radial-gradient(circle at top, ${copy.tint}, transparent 48%)`,
          }}
        />
        <div className="relative z-10 flex items-center gap-4">
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-black/20 ${copy.tone}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mode}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.92 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm font-semibold"
              >
                {mode === "success" ? "✓" : mode === "error" ? "!" : mode === "typing" ? "…" : "•"}
              </motion.span>
            </AnimatePresence>
          </span>
          <input
            {...props}
            id={fieldId}
            value={value}
            placeholder={placeholder}
            aria-invalid={mode === "error"}
            aria-describedby={messageId}
            onChange={(event) => {
              setValue(event.target.value);
              props.onChange?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              props.onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              props.onBlur?.(event);
            }}
            className="w-full bg-transparent text-lg text-white outline-none placeholder:text-zinc-500"
          />
        </div>
      </motion.div>

      <div className="min-h-10 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2.5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={mode}
            id={messageId}
            className={`text-sm leading-6 ${copy.tone}`}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {copy.message}
          </motion.p>
        </AnimatePresence>
      </div>
    </label>
  );
}
