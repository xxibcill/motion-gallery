"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

// =============================================================================
// SLIDER CONTROL
// =============================================================================

export interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Custom display for value (defaults to raw number) */
  valueLabel?: string;
  /** Unit to display after value (e.g., "px", "s", "deg") */
  unit?: string;
  /** Visual style variant */
  variant?: "default" | "compact";
}

/**
 * A styled slider control with label and value display.
 *
 * @example
 * ```tsx
 * <SliderControl
 *   label="Speed"
 *   value={speed}
 *   onChange={setSpeed}
 *   min={0}
 *   max={100}
 *   variant="default"
 * />
 * ```
 */
export function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  valueLabel,
  unit,
  variant = "default",
}: SliderControlProps) {
  const displayValue = valueLabel ?? (unit ? `${value}${unit}` : value);

  if (variant === "compact") {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-zinc-400 text-sm">{label}</label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-32 accent-purple-500"
        />
        <span className="text-zinc-500 text-xs">{displayValue}</span>
      </div>
    );
  }

  return (
    <label className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-zinc-100">{label}</span>
        <span className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-300"
      />
    </label>
  );
}

// =============================================================================
// TOGGLE CONTROL
// =============================================================================

export interface ToggleControlProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * A toggle switch control with label.
 *
 * @example
 * ```tsx
 * <ToggleControl
 *   label="Enabled"
 *   checked={enabled}
 *   onChange={setEnabled}
 * />
 * ```
 */
export function ToggleControl({ label, checked, onChange }: ToggleControlProps) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <span className="text-sm font-medium text-zinc-100">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors ${
          checked
            ? "border-cyan-300/50 bg-cyan-300/25"
            : "border-white/10 bg-white/6"
        }`}
      >
        <span
          className={`absolute h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}

// =============================================================================
// OPTION PILLS
// =============================================================================

export interface OptionPillsProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ label: string; value: T }>;
}

/**
 * A set of selectable pill buttons.
 *
 * @example
 * ```tsx
 * <OptionPills
 *   label="Size"
 *   value={size}
 *   onChange={setSize}
 *   options={[
 *     { label: "Small", value: "sm" },
 *     { label: "Large", value: "lg" },
 *   ]}
 * />
 * ```
 */
export function OptionPills<T extends string>({
  label,
  value,
  onChange,
  options,
}: OptionPillsProps<T>) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <span className="text-sm font-medium text-zinc-100">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-cyan-200 text-zinc-950"
                  : "bg-white/6 text-zinc-300 hover:bg-white/12"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// CONTROLS PANEL
// =============================================================================

export interface ControlsPanelProps {
  title?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

/**
 * A collapsible panel for grouping control components.
 *
 * @example
 * ```tsx
 * <ControlsPanel title="Animation Controls" defaultOpen>
 *   <SliderControl label="Speed" value={speed} onChange={setSpeed} min={0} max={100} />
 *   <ToggleControl label="Loop" checked={loop} onChange={setLoop} />
 * </ControlsPanel>
 * ```
 */
export function ControlsPanel({
  title = "Controls",
  children,
  defaultOpen = false,
}: ControlsPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 bg-zinc-800/90 backdrop-blur-sm rounded-2xl border border-zinc-700 overflow-hidden"
      initial={{ opacity: 0, y: 20, width: "auto" }}
      animate={{ opacity: 1, y: 0, width: isOpen ? "auto" : "auto" }}
      transition={{
        opacity: { delay: 1, duration: 0.3 },
        y: { delay: 1, type: "spring", stiffness: 300, damping: 30 },
        width: { type: "spring", stiffness: 300, damping: 30 },
      }}
    >
      {/* Header toggle */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-3 flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
        layout
      >
        <span className="font-medium mr-1">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Collapsible content */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.15 },
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 flex flex-wrap gap-6 items-center border-t border-zinc-700/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// =============================================================================
// LEGACY ALIASES (for backward compatibility)
// =============================================================================

/** @deprecated Use SliderControl instead */
export const ControlSlider = SliderControl;

/** @deprecated Use SliderControl instead */
export const RangeControl = SliderControl;
