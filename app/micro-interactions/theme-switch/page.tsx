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
      <div className="flex min-h-[340px] items-center justify-center rounded-[1.8rem] border border-dashed border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.94))] px-6 py-8">
        <ThemeSwitchOrb checked={checked} onChange={setChecked} palette={palette} orbSize={orbSize} />
      </div>
    </MicroInteractionScene>
  );
}
