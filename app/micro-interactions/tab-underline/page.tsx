"use client";

import { useState } from "react";
import {
  TabUnderlineFollower,
  type TabUnderlineItem,
} from "@/components/micro-interactions/TabUnderlineFollower";
import {
  MicroInteractionScene,
  OptionPills,
} from "@/components/micro-interactions/MicroInteractionScene";

const tabs: TabUnderlineItem[] = [
  {
    id: "concept",
    label: "Concept",
    content:
      "Use shared underline motion to connect adjacent tab states. The goal is continuity: the indicator moves, but the control still feels like one system.",
  },
  {
    id: "motion",
    label: "Motion",
    content:
      "Separate the tab indicator from the panel transition. The underline should stay brisk and directional while content fades and slides with less visual weight.",
  },
  {
    id: "fallback",
    label: "Fallback",
    content:
      "When reduced motion is enabled, collapse the effect to an immediate underline jump or pill state and keep keyboard navigation unchanged.",
  },
];

export default function TabUnderlinePage() {
  const [underlineStyle, setUnderlineStyle] = useState<"line" | "pill">("line");

  return (
    <MicroInteractionScene
      title="Tab Underline Follower"
      description="The selected tab travels with an underline or soft pill highlight, while the related content transitions independently so state changes feel connected."
      reducedMotionNote="Reduced motion removes the underline travel and panel movement, then swaps both to their new states immediately while preserving tab semantics."
      notes={["Tab semantics", "Separate panel transition", "Line or pill styles"]}
      controls={
        <OptionPills
          label="Underline Style"
          value={underlineStyle}
          onChange={setUnderlineStyle}
          options={[
            { label: "Line", value: "line" },
            { label: "Pill", value: "pill" },
          ]}
        />
      }
    >
      <div className="mx-auto flex min-h-[340px] w-full max-w-3xl items-center justify-center rounded-[1.8rem] border border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(244,114,182,0.08),rgba(15,23,42,0.55))] px-4 py-10 sm:px-6">
        <TabUnderlineFollower tabs={tabs} underlineStyle={underlineStyle} className="w-full" />
      </div>
    </MicroInteractionScene>
  );
}
