"use client";

import { useState } from "react";
import { DragLiftSortCards } from "@/components/micro-interactions/DragLiftSortCards";
import {
  MicroInteractionScene,
  OptionPills,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

type Axis = "x" | "y";

export default function DragSortPage() {
  const [cardCount, setCardCount] = useState(4);
  const [axis, setAxis] = useState<Axis>("y");

  return (
    <MicroInteractionScene
      title="Drag Lift Sort Cards"
      description="Cards lift on drag, preserve space during reorder, and settle with enough motion to explain the change without dragging the interaction out."
      reducedMotionNote="Reduced motion removes drag travel and leaves keyboard-style reorder controls with direct layout settlement."
      notes={["Reorderable list", "Keyboard move controls", "Intentional settle"]}
      controls={
        <>
          <RangeControl
            label="Card Count"
            value={cardCount}
            onChange={setCardCount}
            min={3}
            max={6}
            step={1}
            valueLabel={`${cardCount} cards`}
          />
          <OptionPills
            label="Axis"
            value={axis}
            onChange={setAxis}
            options={[
              { label: "Vertical", value: "y" },
              { label: "Horizontal", value: "x" },
            ]}
          />
        </>
      }
    >
      <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--surface-1)] px-6 py-8">
        <DragLiftSortCards cardCount={cardCount} axis={axis} />
      </div>
    </MicroInteractionScene>
  );
}
