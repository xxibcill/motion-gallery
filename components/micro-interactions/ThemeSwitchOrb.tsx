"use client";

import { motion, useReducedMotion } from "motion/react";

type PaletteTone = "dawn" | "aurora" | "ember";

const paletteThemes: Record<
  PaletteTone,
  {
    off: string;
    on: string;
    orb: string;
  }
> = {
  dawn: {
    off: "linear-gradient(135deg, rgba(30,41,59,0.96), rgba(15,23,42,0.92))",
    on: "linear-gradient(135deg, rgba(251,191,36,0.42), rgba(251,146,60,0.22), rgba(30,41,59,0.95))",
    orb: "radial-gradient(circle at 30% 30%, rgba(255,251,235,0.96), rgba(251,191,36,0.72), rgba(245,158,11,0.88))",
  },
  aurora: {
    off: "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(17,24,39,0.94))",
    on: "linear-gradient(135deg, rgba(16,185,129,0.35), rgba(34,211,238,0.26), rgba(15,23,42,0.95))",
    orb: "radial-gradient(circle at 30% 30%, rgba(236,254,255,0.96), rgba(34,211,238,0.8), rgba(16,185,129,0.9))",
  },
  ember: {
    off: "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(2,6,23,0.96))",
    on: "linear-gradient(135deg, rgba(251,113,133,0.34), rgba(248,113,113,0.2), rgba(15,23,42,0.96))",
    orb: "radial-gradient(circle at 30% 30%, rgba(255,241,242,0.96), rgba(251,113,133,0.78), rgba(225,29,72,0.92))",
  },
};

export interface ThemeSwitchOrbProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  palette?: PaletteTone;
  orbSize?: number;
}

export function ThemeSwitchOrb({
  checked,
  onChange,
  palette = "aurora",
  orbSize = 36,
}: ThemeSwitchOrbProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const theme = paletteThemes[palette];
  const trackWidth = orbSize * 2.6;
  const travel = trackWidth - orbSize - 10;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex items-center gap-4 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
    >
      <span className="flex min-w-[10rem] flex-col">
        <span className="text-xs uppercase tracking-[0.24em] text-zinc-500">Theme Switch</span>
        <span className="mt-1 text-base font-medium text-white">
          {checked ? "Environment shifted on" : "Environment shifted off"}
        </span>
      </span>

      <motion.span
        className="relative inline-flex shrink-0 items-center rounded-full border border-white/10 p-[5px]"
        style={{
          width: trackWidth,
          background: checked ? theme.on : theme.off,
        }}
        initial={false}
        animate={{
          boxShadow: checked
            ? "0 18px 40px -24px rgba(34,211,238,0.35)"
            : "0 18px 40px -24px rgba(2,6,23,0.85)",
        }}
        transition={{ duration: prefersReducedMotion ? 0.01 : 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-[6px] left-[6px] rounded-full bg-white/10"
          initial={false}
          animate={{
            x: checked ? travel * 0.44 : 0,
            width: checked ? trackWidth * 0.54 : trackWidth * 0.36,
            opacity: checked ? 1 : 0.55,
          }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.span
          className="relative grid place-items-center rounded-full"
          initial={false}
          animate={{ x: checked ? travel : 0, rotate: checked ? 18 : 0 }}
          transition={{ type: prefersReducedMotion ? false : "spring", stiffness: 280, damping: 22 }}
          style={{
            width: orbSize,
            height: orbSize,
            background: theme.orb,
            boxShadow: checked
              ? "inset 0 -10px 14px rgba(15,23,42,0.2), 0 12px 28px -16px rgba(34,211,238,0.55)"
              : "inset 0 -10px 14px rgba(15,23,42,0.25), 0 12px 28px -16px rgba(2,6,23,0.65)",
          }}
        >
          <motion.span
            className="text-sm font-semibold text-slate-950"
            initial={false}
            animate={{ opacity: 1, scale: checked ? 1 : 0.92 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.18 }}
          >
            {checked ? "☼" : "◐"}
          </motion.span>
        </motion.span>
      </motion.span>
    </button>
  );
}
