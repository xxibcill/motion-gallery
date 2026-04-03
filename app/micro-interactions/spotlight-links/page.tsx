"use client";

import { useState } from "react";
import {
  SpotlightLinkList,
  type SpotlightLinkItem,
} from "@/components/micro-interactions/SpotlightLinkList";
import {
  MicroInteractionScene,
  OptionPills,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

const linkItems: SpotlightLinkItem[] = [
  { title: "Route transition presets", meta: "Shared curves and timing tokens", href: "/transition" },
  { title: "Scroll reveal section", meta: "Mask-based content entrance", href: "/scroll-reveal" },
  { title: "Magnetic CTA button", meta: "Pointer-aware hover pull", href: "/micro-interactions/magnetic-cta" },
  { title: "Gallery search", meta: "Filterable catalog for motion references", href: "/gallery" },
  { title: "Dimensional rift", meta: "High-energy transition experiment", href: "/transition/dimensional-rift" },
];

type Feel = "soft" | "crisp";

export default function SpotlightLinksPage() {
  const [spotlightSize, setSpotlightSize] = useState(180);
  const [feel, setFeel] = useState<Feel>("soft");

  return (
    <MicroInteractionScene
      title="Spotlight Hover Link List"
      description="A cursor-led spotlight and shared active row treatment keep the current target obvious across hover and keyboard focus."
      reducedMotionNote="Reduced motion removes the moving spotlight and preserves the same active row with a direct highlight and focus ring."
      notes={["Cursor-led spotlight", "Keyboard parity", "Dense list readability"]}
      controls={
        <>
          <RangeControl
            label="Spotlight Size"
            value={spotlightSize}
            onChange={setSpotlightSize}
            min={120}
            max={260}
            step={10}
            valueLabel={`${spotlightSize}px`}
          />
          <OptionPills
            label="Feel"
            value={feel}
            onChange={setFeel}
            options={[
              { label: "Soft", value: "soft" },
              { label: "Crisp", value: "crisp" },
            ]}
          />
        </>
      }
    >
      <div className="flex min-h-[380px] items-center justify-center rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-8">
        <SpotlightLinkList items={linkItems} spotlightSize={spotlightSize} feel={feel} />
      </div>
    </MicroInteractionScene>
  );
}
