"use client";

import { useState } from "react";
import { ThemeSwitchOrb } from "@/components/micro-interactions/ThemeSwitchOrb";
import {
  MicroInteractionScene,
  OptionPills,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

type PaletteTone = "dawn" | "aurora" | "ember";

export default function ThemeSwitchPage() {
  const [checked, setChecked] = useState(true);
  const [palette, setPalette] = useState<PaletteTone>("aurora");
  const [orbSize, setOrbSize] = useState(36);

  return (
    <MicroInteractionScene
      title="Theme Switch Orb"
      description="The thumb behaves like a contained orb while the track shifts as a small environment, so the toggle feels deliberate rather than decorative."
      reducedMotionNote="Reduced motion swaps the palette and thumb position directly without rotational travel or accent drift."
      notes={["Contained environment shift", "Orb-like thumb", "Palette variants"]}
      controls={
        <>
          <OptionPills
            label="Palette"
            value={palette}
            onChange={setPalette}
            options={[
              { label: "Aurora", value: "aurora" },
              { label: "Dawn", value: "dawn" },
              { label: "Ember", value: "ember" },
            ]}
          />
          <RangeControl
            label="Orb Size"
            value={orbSize}
            onChange={setOrbSize}
            min={28}
            max={46}
            step={2}
            valueLabel={`${orbSize}px`}
          />
        </>
      }
    >
      <div className="flex min-h-[340px] items-center justify-center rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--surface-1)] px-6 py-8">
        <ThemeSwitchOrb checked={checked} onChange={setChecked} palette={palette} orbSize={orbSize} />
      </div>
    </MicroInteractionScene>
  );
}
