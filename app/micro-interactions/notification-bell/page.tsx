"use client";

import { useState } from "react";
import { NotificationBellPeek } from "@/components/micro-interactions/NotificationBellPeek";
import {
  MicroInteractionScene,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

const notifications = [
  { title: "Preview approved", detail: "The motion review passed without timing changes." },
  { title: "Comment resolved", detail: "Shared-element alignment was corrected in the latest pass." },
  { title: "Docs ready", detail: "Usage notes were added next to the reusable component API." },
];

export default function NotificationBellPage() {
  const [trayWidth, setTrayWidth] = useState(360);
  const [badgeCount, setBadgeCount] = useState(3);

  return (
    <MicroInteractionScene
      title="Notification Bell Peek"
      description="The badge pulse, trigger press, and tray choreography each have their own role, so the anchored panel opens cleanly instead of feeling like one noisy animation."
      reducedMotionNote="Reduced motion removes the pulse and spatial growth, then keeps the same open and close state through opacity, contrast, and focus movement."
      notes={["Anchored tray", "Outside click dismissal", "Badge pulse decoupled"]}
      controls={
        <>
          <RangeControl
            label="Tray Width"
            value={trayWidth}
            onChange={setTrayWidth}
            min={300}
            max={440}
            step={10}
            valueLabel={`${trayWidth}px`}
          />
          <RangeControl
            label="Badge Count"
            value={badgeCount}
            onChange={setBadgeCount}
            min={0}
            max={9}
            step={1}
            valueLabel={`${badgeCount}`}
          />
        </>
      }
    >
      <div className="min-h-[420px] rounded-[1.8rem] border border-dashed border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.74),rgba(2,6,23,0.94))] px-6 py-8">
        <NotificationBellPeek items={notifications} badgeCount={badgeCount} trayWidth={trayWidth} />
      </div>
    </MicroInteractionScene>
  );
}
