"use client";

import { useState } from "react";
import { SlideToggleSwitch } from "@/components/micro-interactions/SlideToggleSwitch";
import {
  MicroInteractionScene,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

export default function SlideTogglePage() {
  const [size, setSize] = useState(1);
  const [damping, setDamping] = useState(24);

  return (
    <MicroInteractionScene
      title="Slide Toggle Switch"
      description="The switch thumb glides with weight while the track tint blooms underneath it, making the on and off states feel physical without overshoot."
      reducedMotionNote='Reduced motion collapses the travel into immediate thumb placement and a direct color swap while keeping the `role="switch"` state change intact.'
      notes={["Pointer and keyboard", "Track bloom", "No overshoot"]}
      controls={
        <>
          <RangeControl
            label="Size"
            value={size}
            onChange={setSize}
            min={0.8}
            max={1.4}
            step={0.05}
            valueLabel={`${size.toFixed(2)}x`}
          />
          <RangeControl
            label="Damping"
            value={damping}
            onChange={setDamping}
            min={18}
            max={36}
            step={1}
            valueLabel={String(damping)}
          />
        </>
      }
    >
      <div className="flex min-h-[340px] items-center justify-center rounded-[1.8rem] border border-dashed border-white/10 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.16),transparent_44%)]">
        <SlideToggleSwitch size={size} damping={damping} />
      </div>
    </MicroInteractionScene>
  );
}
