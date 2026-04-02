"use client";

import { useState } from "react";
import { BeamFocusInput } from "@/components/micro-interactions/BeamFocusInput";
import {
  MicroInteractionScene,
  OptionPills,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

type FieldState = "idle" | "invalid";

export default function BeamFocusInputPage() {
  const [glowStrength, setGlowStrength] = useState(68);
  const [beamSpeed, setBeamSpeed] = useState(1.2);
  const [fieldState, setFieldState] = useState<FieldState>("idle");

  return (
    <MicroInteractionScene
      title="Beam Focus Input"
      description="A directional beam sweep and edge glow make focus feel intentional, while the input itself stays readable and calm."
      reducedMotionNote="Reduced motion removes the beam travel and keeps the same focus state through border, surface tint, and helper copy shifts."
      notes={["Directional focus cue", "Text-first readability", "Invalid state included"]}
      controls={
        <>
          <RangeControl
            label="Glow Strength"
            value={glowStrength}
            onChange={setGlowStrength}
            min={32}
            max={96}
            step={2}
            valueLabel={`${glowStrength}%`}
          />
          <RangeControl
            label="Beam Speed"
            value={beamSpeed}
            onChange={setBeamSpeed}
            min={0.8}
            max={2.2}
            step={0.1}
            valueLabel={`${beamSpeed.toFixed(1)}x`}
          />
          <OptionPills
            label="Field State"
            value={fieldState}
            onChange={setFieldState}
            options={[
              { label: "Idle", value: "idle" },
              { label: "Invalid", value: "invalid" },
            ]}
          />
        </>
      }
    >
      <div className="flex min-h-[340px] items-center justify-center rounded-[1.8rem] border border-dashed border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] px-6">
        <BeamFocusInput
          label="Work email"
          placeholder="you@studio.com"
          glowStrength={glowStrength}
          beamSpeed={beamSpeed}
          invalid={fieldState === "invalid"}
          helperText={
            fieldState === "invalid"
              ? "Use your work domain to unlock the team features."
              : "Focus the field to watch the beam stay behind the caret and text."
          }
        />
      </div>
    </MicroInteractionScene>
  );
}
