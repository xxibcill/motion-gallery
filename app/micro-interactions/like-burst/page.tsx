"use client";

import { useState } from "react";
import { LikeBurstButton } from "@/components/micro-interactions/LikeBurstButton";
import {
  MicroInteractionScene,
  OptionPills,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

type AccentTone = "rose" | "amber" | "cyan";

export default function LikeBurstPage() {
  const [burstDensity, setBurstDensity] = useState(12);
  const [accent, setAccent] = useState<AccentTone>("rose");

  return (
    <MicroInteractionScene
      title="Like Burst Button"
      description="This save action lands as a compact celebration: the heart fills, pops with a light twist, and throws a fast contained burst that ends before it feels noisy."
      reducedMotionNote="Reduced motion removes the particles and keeps the same state change through fill, glow, label swap, and a quieter press response."
      notes={["Contained celebration", "Accessible toggle state", "Calmer unlike motion"]}
      controls={
        <>
          <RangeControl
            label="Burst Density"
            value={burstDensity}
            onChange={setBurstDensity}
            min={6}
            max={18}
            step={1}
            valueLabel={`${burstDensity} particles`}
          />
          <OptionPills
            label="Accent"
            value={accent}
            onChange={setAccent}
            options={[
              { label: "Rose", value: "rose" },
              { label: "Amber", value: "amber" },
              { label: "Cyan", value: "cyan" },
            ]}
          />
        </>
      }
    >
      <div className="flex min-h-[340px] flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--surface-1)]">
        <LikeBurstButton
          burstDensity={burstDensity}
          accent={accent}
          idleLabel="Save to Library"
          likedLabel="Saved to Library"
        />
        <p className="text-sm text-[var(--text-secondary)]">
          Use pointer, Enter, or Space to toggle the saved state.
        </p>
      </div>
    </MicroInteractionScene>
  );
}
