"use client";

import { useMemo, useState } from "react";
import {
  ChevronAccordion,
  type AccordionItem,
} from "@/components/micro-interactions/ChevronAccordion";
import {
  MicroInteractionScene,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

const accordionItems: AccordionItem[] = [
  {
    id: "timing",
    title: "Tight timing windows",
    body: "Keep interaction feedback between 120ms and 280ms so the UI feels confident instead of laggy. Longer timing is reserved for celebratory outcomes, not utility controls.",
  },
  {
    id: "rendering",
    title: "Render on the compositor",
    body: "Favor transforms, opacity, filters, and CSS variables before layout changes. Even in a reveal pattern like accordion content, the supporting motion should avoid fighting the browser.",
  },
  {
    id: "accessibility",
    title: "Reduced motion is first-class",
    body: "Every interaction demo in this track keeps the same state change without motion. Simplifying is fine, but removing the underlying feedback entirely is not.",
  },
  {
    id: "composition",
    title: "Reusable over bespoke",
    body: "Each interaction ships as a component plus a dedicated route. That keeps the behavior portable when the gallery demos later get composed into richer screens.",
  },
  {
    id: "tone",
    title: "Tactile, not noisy",
    body: "The target personality is polished and slightly playful. Avoid bouncy curves and novelty motion that calls attention to itself instead of clarifying the interface.",
  },
];

export default function ChevronAccordionPage() {
  const [itemCount, setItemCount] = useState(4);
  const [spacing, setSpacing] = useState(14);
  const items = useMemo(() => accordionItems.slice(0, itemCount), [itemCount]);

  return (
    <MicroInteractionScene
      title="Chevron Accordion"
      description="The trigger line shifts subtly, the chevron rotates with direction, and the panel content reveals cleanly so expand and collapse feel related instead of abrupt."
      reducedMotionNote="Reduced motion removes the reveal choreography and chevron rotation, then swaps content instantly while preserving button semantics and `aria-expanded`."
      notes={["Button semantics", "Masked reveal", "Stable spacing controls"]}
      controls={
        <>
          <RangeControl
            label="Item Count"
            value={itemCount}
            onChange={setItemCount}
            min={3}
            max={5}
            step={1}
            valueLabel={String(itemCount)}
          />
          <RangeControl
            label="Spacing"
            value={spacing}
            onChange={setSpacing}
            min={10}
            max={24}
            step={1}
            valueLabel={`${spacing}px`}
          />
        </>
      }
    >
      <div className="mx-auto flex min-h-[340px] w-full max-w-3xl items-center justify-center rounded-[1.8rem] border border-dashed border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_52%)] px-4 py-10 sm:px-6">
        <ChevronAccordion items={items} spacing={spacing} className="w-full" />
      </div>
    </MicroInteractionScene>
  );
}
