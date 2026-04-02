"use client";

import { useState } from "react";
import {
  CommandPaletteHighlight,
  type CommandPaletteItem,
} from "@/components/micro-interactions/CommandPaletteHighlight";
import {
  MicroInteractionScene,
  OptionPills,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

const baseItems: CommandPaletteItem[] = [
  { id: "deploy", title: "Open deployment preview", detail: "Jump to the latest shared build.", shortcut: "G P" },
  { id: "tokens", title: "Edit motion tokens", detail: "Adjust timing and easing primitives.", shortcut: "M T" },
  { id: "gallery", title: "Browse animation gallery", detail: "Search all motion demos and routes.", shortcut: "G A" },
  { id: "copy", title: "Copy component source", detail: "Grab the current implementation for reuse.", shortcut: "C C" },
  { id: "docs", title: "Open usage notes", detail: "Read API and reduced-motion guidance.", shortcut: "D O" },
  { id: "review", title: "Start design review", detail: "Prepare a focused critique pass.", shortcut: "R V" },
];

type Density = "compact" | "comfortable";

export default function CommandPalettePage() {
  const [resultCount, setResultCount] = useState(5);
  const [density, setDensity] = useState<Density>("comfortable");

  return (
    <MicroInteractionScene
      title="Command Palette Result Hover"
      description="A shared active highlight tracks both pointer hover and keyboard selection so the current result feels like one continuous surface."
      reducedMotionNote="Reduced motion removes the follower and keeps the same active-row meaning with a direct row treatment and unchanged keyboard behavior."
      notes={["Shared active highlight", "Pointer and keyboard parity", "Loading and empty states"]}
      controls={
        <>
          <RangeControl
            label="Result Count"
            value={resultCount}
            onChange={setResultCount}
            min={0}
            max={6}
            step={1}
            valueLabel={`${resultCount} results`}
          />
          <OptionPills
            label="Density"
            value={density}
            onChange={setDensity}
            options={[
              { label: "Comfortable", value: "comfortable" },
              { label: "Compact", value: "compact" },
            ]}
          />
        </>
      }
    >
      <div className="flex min-h-[420px] items-center justify-center rounded-[1.8rem] border border-dashed border-white/10 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.08),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.94))] px-6 py-8">
        <CommandPaletteHighlight items={baseItems.slice(0, resultCount)} density={density} loading={false} />
      </div>
    </MicroInteractionScene>
  );
}
