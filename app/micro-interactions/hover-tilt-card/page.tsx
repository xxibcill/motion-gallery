"use client";

import { useState } from "react";
import { HoverTiltCard } from "@/components/micro-interactions/HoverTiltCard";
import {
  MicroInteractionScene,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

export default function HoverTiltCardPage() {
  const [tilt, setTilt] = useState(10);
  const [glare, setGlare] = useState(0.55);

  return (
    <MicroInteractionScene
      title="Hover Tilt Product Card"
      description="The card rotates within a tight range, pushes content onto separate depth layers, and uses a passing sheen to sell dimensionality without going gimmicky."
      reducedMotionNote="Reduced motion removes tilt travel and keeps the product readable with the same spotlight, shadow, and border emphasis."
      notes={["Bounded 3D tilt", "Passing sheen", "Touch-safe fallback"]}
      controls={
        <>
          <RangeControl
            label="Tilt"
            value={tilt}
            onChange={setTilt}
            min={4}
            max={16}
            step={1}
            valueLabel={`${tilt}° max`}
          />
          <RangeControl
            label="Glare"
            value={glare}
            onChange={setGlare}
            min={0.2}
            max={0.9}
            step={0.05}
            valueLabel={`${Math.round(glare * 100)}%`}
          />
        </>
      }
    >
      <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--surface-1)] px-6 py-8">
        <HoverTiltCard tilt={tilt} glare={glare} />
      </div>
    </MicroInteractionScene>
  );
}
