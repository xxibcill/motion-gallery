"use client";

import { useState } from "react";
import { MagneticCtaButton } from "@/components/micro-interactions/MagneticCtaButton";
import {
  MicroInteractionScene,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

export default function MagneticCtaPage() {
  const [intensity, setIntensity] = useState(0.72);
  const [radius, setRadius] = useState(180);

  return (
    <MicroInteractionScene
      title="Magnetic CTA Button"
      description="An oversized pill CTA drifts toward the pointer, compresses on press, and resolves with a controlled snap instead of a slippery chase."
      reducedMotionNote="Reduced motion disables translation and keeps the feedback on shadow, opacity, and press compression so the call to action still reads as active."
      notes={["Pointer pull capped", "Keyboard focus-ready", "Fast spring return"]}
      controls={
        <>
          <RangeControl
            label="Intensity"
            value={intensity}
            onChange={setIntensity}
            min={0.25}
            max={1.1}
            step={0.05}
            valueLabel={`${intensity.toFixed(2)}x`}
          />
          <RangeControl
            label="Radius"
            value={radius}
            onChange={setRadius}
            min={120}
            max={240}
            step={5}
            valueLabel={`${radius}px`}
          />
        </>
      }
    >
      <div className="flex min-h-[340px] flex-col items-center justify-center gap-6 rounded-[1.8rem] border border-dashed border-white/10 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.14),transparent_48%)]">
        <MagneticCtaButton intensity={intensity} radius={radius} label="Start the Sequence" />
        <p className="text-sm text-zinc-400">Hover with a pointer or tab onto the button.</p>
      </div>
    </MicroInteractionScene>
  );
}
