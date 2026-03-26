"use client";

import { useState } from "react";
import { MorphPlayPauseToggle } from "@/components/micro-interactions/MorphPlayPauseToggle";
import {
  MicroInteractionScene,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

export default function PlayPauseTogglePage() {
  const [size, setSize] = useState(92);
  const [cornerRounding, setCornerRounding] = useState(14);

  return (
    <MicroInteractionScene
      title="Morphing Play/Pause Toggle"
      description="The play icon expands and resolves into pause bars with shared geometry, making the state change feel continuous instead of swapped."
      reducedMotionNote="Reduced motion crossfades between the play and pause states and preserves the `aria-pressed` state change without shape morphing."
      notes={["Accessible pressed state", "Shared geometry", "Compact media-control scale"]}
      controls={
        <>
          <RangeControl
            label="Icon Size"
            value={size}
            onChange={setSize}
            min={72}
            max={128}
            step={4}
            valueLabel={`${size}px`}
          />
          <RangeControl
            label="Corner Rounding"
            value={cornerRounding}
            onChange={setCornerRounding}
            min={8}
            max={24}
            step={1}
            valueLabel={`${cornerRounding}px`}
          />
        </>
      }
    >
      <div className="flex min-h-[340px] flex-col items-center justify-center gap-6 rounded-[1.8rem] border border-dashed border-white/10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.16),transparent_42%)]">
        <MorphPlayPauseToggle size={size} cornerRounding={cornerRounding} />
        <p className="text-sm text-zinc-400">Use pointer, Enter, or Space to toggle playback.</p>
      </div>
    </MicroInteractionScene>
  );
}
