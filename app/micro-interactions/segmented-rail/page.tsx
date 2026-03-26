"use client";

import { useMemo, useState } from "react";
import { SegmentedControlRail } from "@/components/micro-interactions/SegmentedControlRail";
import {
  MicroInteractionScene,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

const optionSets = ["Overview", "Signals", "Details", "Exports", "History"];

export default function SegmentedRailPage() {
  const [segmentCount, setSegmentCount] = useState(4);
  const [width, setWidth] = useState(420);

  const options = useMemo(() => optionSets.slice(0, segmentCount), [segmentCount]);

  return (
    <MicroInteractionScene
      title="Segmented Control Rail"
      description="A shared rail highlight glides between segments so filter and mode changes feel like one control with continuous state, not a row of unrelated buttons."
      reducedMotionNote="Reduced motion keeps keyboard roving focus but swaps the animated rail movement for an immediate highlight reposition and direct text color change."
      notes={["Roving keyboard focus", "Shared rail highlight", "Filter-friendly sizing"]}
      controls={
        <>
          <RangeControl
            label="Segment Count"
            value={segmentCount}
            onChange={setSegmentCount}
            min={3}
            max={5}
            step={1}
            valueLabel={String(segmentCount)}
          />
          <RangeControl
            label="Width"
            value={width}
            onChange={setWidth}
            min={320}
            max={560}
            step={20}
            valueLabel={`${width}px`}
          />
        </>
      }
    >
      <div className="flex min-h-[340px] items-center justify-center rounded-[1.8rem] border border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(168,85,247,0.08),rgba(15,23,42,0.55))]">
        <SegmentedControlRail options={options} width={width} />
      </div>
    </MicroInteractionScene>
  );
}
