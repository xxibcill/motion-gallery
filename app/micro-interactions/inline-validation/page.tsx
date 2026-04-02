"use client";

import { useState } from "react";
import {
  InlineValidationField,
  type ValidationMode,
} from "@/components/micro-interactions/InlineValidationField";
import {
  MicroInteractionScene,
  OptionPills,
} from "@/components/micro-interactions/MicroInteractionScene";

export default function InlineValidationPage() {
  const [mode, setMode] = useState<ValidationMode>("typing");

  return (
    <MicroInteractionScene
      title="Inline Validation Field"
      description="Typing, error, and success states share the same footprint so the message can change without jolting the layout."
      reducedMotionNote="Reduced motion keeps the message area reserved and swaps color and icon state directly instead of sliding content."
      notes={["Reserved message space", "Typing, error, success", "Stable feedback rhythm"]}
      controls={
        <OptionPills
          label="Validation State"
          value={mode}
          onChange={setMode}
          options={[
            { label: "Idle", value: "idle" },
            { label: "Typing", value: "typing" },
            { label: "Error", value: "error" },
            { label: "Success", value: "success" },
          ]}
        />
      }
    >
      <div className="flex min-h-[340px] items-center justify-center rounded-[1.8rem] border border-dashed border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.92))] px-6">
        <InlineValidationField mode={mode} />
      </div>
    </MicroInteractionScene>
  );
}
