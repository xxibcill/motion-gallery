"use client";

import { useState } from "react";
import { CopyChipButton } from "@/components/micro-interactions/CopyChipButton";
import {
  MicroInteractionScene,
  OptionPills,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

const labelSets = {
  docs: { idle: "Copy", copied: "Copied" },
  share: { idle: "Share", copied: "Sent" },
};

export default function CopyChipPage() {
  const [resetAfter, setResetAfter] = useState(1800);
  const [labelSet, setLabelSet] = useState<keyof typeof labelSets>("docs");

  return (
    <MicroInteractionScene
      title="Copy Confirmation Chip"
      description="A compact chip optimistically flips from idle to confirmed state with a label slide and short checkmark draw, then resets after a configurable delay."
      reducedMotionNote="Reduced motion keeps the same message flow but replaces the sliding label animation with an immediate text swap and color shift."
      notes={["Optimistic copy feedback", "Auto reset", "Docs and share-friendly"]}
      controls={
        <>
          <RangeControl
            label="Reset Delay"
            value={resetAfter}
            onChange={setResetAfter}
            min={1000}
            max={3200}
            step={100}
            valueLabel={`${resetAfter}ms`}
          />
          <OptionPills
            label="Label Set"
            value={labelSet}
            onChange={setLabelSet}
            options={[
              { label: "Docs", value: "docs" },
              { label: "Share", value: "share" },
            ]}
          />
        </>
      }
    >
      <div className="flex min-h-[340px] items-center justify-center rounded-[1.8rem] border border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(251,191,36,0.08),rgba(15,23,42,0.52))]">
        <CopyChipButton
          resetAfter={resetAfter}
          idleLabel={labelSets[labelSet].idle}
          copiedLabel={labelSets[labelSet].copied}
        />
      </div>
    </MicroInteractionScene>
  );
}
