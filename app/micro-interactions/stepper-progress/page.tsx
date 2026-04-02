"use client";

import { useState } from "react";
import { StepperProgressPulse } from "@/components/micro-interactions/StepperProgressPulse";
import {
  MicroInteractionScene,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

export default function StepperProgressPage() {
  const [stepCount, setStepCount] = useState(4);
  const [activeIndex, setActiveIndex] = useState(1);
  const [pulseKey, setPulseKey] = useState(0);

  return (
    <MicroInteractionScene
      title="Stepper Progress Pulse"
      description="Completing a step sends a short pulse through the connector toward the next stage, making forward progress readable without turning the whole stepper into an animation."
      reducedMotionNote="Reduced motion removes the traveling pulse and preserves the same completed versus active meaning through direct color and icon changes."
      notes={["Forward pulse cue", "Backward-safe state changes", "Completed vs active clarity"]}
      controls={
        <>
          <RangeControl
            label="Step Count"
            value={stepCount}
            onChange={(value) => {
              setStepCount(value);
              setActiveIndex((current) => Math.min(current, value - 1));
            }}
            min={3}
            max={6}
            step={1}
            valueLabel={`${stepCount} steps`}
          />
          <RangeControl
            label="Active Step"
            value={activeIndex}
            onChange={(value) => {
              setActiveIndex((current) => {
                if (value > current) {
                  setPulseKey((pulse) => pulse + 1);
                }
                return value;
              });
            }}
            min={0}
            max={stepCount - 1}
            step={1}
            valueLabel={`Step ${activeIndex + 1}`}
          />
        </>
      }
    >
      <div className="flex min-h-[380px] items-center justify-center rounded-[1.8rem] border border-dashed border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.1),transparent_36%),linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.94))] px-6 py-8">
        <StepperProgressPulse stepCount={stepCount} activeIndex={activeIndex} pulseKey={pulseKey} />
      </div>
    </MicroInteractionScene>
  );
}
