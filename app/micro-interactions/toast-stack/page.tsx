"use client";

import { useState } from "react";
import { ToastStackDemo } from "@/components/micro-interactions/ToastStackDemo";
import {
  MicroInteractionScene,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

export default function ToastStackPage() {
  const [stackSize, setStackSize] = useState(3);
  const [timeoutMs, setTimeoutMs] = useState(2600);

  return (
    <MicroInteractionScene
      title="Toast Stack Dismiss"
      description="Toasts enter with a short stagger, can be swiped away, and reflow without collapsing into a messy overlap."
      reducedMotionNote="Reduced motion removes drag energy and keeps the stack understandable with direct fades and quieter layout updates."
      notes={["Swipe dismissal", "Auto-dismiss timing", "Stack reflow"]}
      controls={
        <>
          <RangeControl
            label="Stack Size"
            value={stackSize}
            onChange={setStackSize}
            min={1}
            max={5}
            step={1}
            valueLabel={`${stackSize} toasts`}
          />
          <RangeControl
            label="Timeout"
            value={timeoutMs}
            onChange={setTimeoutMs}
            min={1400}
            max={4200}
            step={100}
            valueLabel={`${timeoutMs}ms`}
          />
        </>
      }
    >
      <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--surface-1)] px-6 py-8">
        <ToastStackDemo stackSize={stackSize} timeoutMs={timeoutMs} />
      </div>
    </MicroInteractionScene>
  );
}
