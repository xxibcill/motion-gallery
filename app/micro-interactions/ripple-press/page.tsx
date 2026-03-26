"use client";

import { useState } from "react";
import { RipplePressButton } from "@/components/micro-interactions/RipplePressButton";
import {
  MicroInteractionScene,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

export default function RipplePressPage() {
  const [rippleSize, setRippleSize] = useState(180);
  const [duration, setDuration] = useState(220);

  return (
    <MicroInteractionScene
      title="Ripple Press Button"
      description="This utility action emits a tight radial pulse from the exact interaction point and settles with a quick rebound instead of a generic full-surface wash."
      reducedMotionNote="Reduced motion swaps the radial ripple for a brief surface flash so repeated taps still get confirmation without traveling motion."
      notes={["Pointer origin aware", "Keyboard-centered fallback", "Repeated taps stay responsive"]}
      controls={
        <>
          <RangeControl
            label="Ripple Size"
            value={rippleSize}
            onChange={setRippleSize}
            min={120}
            max={260}
            step={10}
            valueLabel={`${rippleSize}px`}
          />
          <RangeControl
            label="Duration"
            value={duration}
            onChange={setDuration}
            min={140}
            max={320}
            step={10}
            valueLabel={`${duration}ms`}
          />
        </>
      }
    >
      <div className="flex min-h-[340px] items-center justify-center rounded-[1.8rem] border border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(236,72,153,0.08),rgba(15,23,42,0.55))]">
        <RipplePressButton label="Queue Action" rippleSize={rippleSize} duration={duration} />
      </div>
    </MicroInteractionScene>
  );
}
