"use client";

import { useState } from "react";
import {
  DropzonePulseUpload,
  type UploadPhase,
} from "@/components/micro-interactions/DropzonePulseUpload";
import {
  MicroInteractionScene,
  OptionPills,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

export default function DropzoneUploadPage() {
  const [phase, setPhase] = useState<UploadPhase>("drag");
  const [progress, setProgress] = useState(48);

  return (
    <MicroInteractionScene
      title="Dropzone Pulse Upload"
      description="The dropzone advertises drag-over state with a short pulse, then hands off to progress and confirmation states that stay visually distinct."
      reducedMotionNote="Reduced motion removes the pulse and leaves the same state meaning through border, icon, copy, and progress changes."
      notes={["Drag-over pulse", "Separate upload progress", "Success and error states"]}
      controls={
        <>
          <OptionPills
            label="State"
            value={phase}
            onChange={setPhase}
            options={[
              { label: "Idle", value: "idle" },
              { label: "Drag", value: "drag" },
              { label: "Uploading", value: "uploading" },
              { label: "Success", value: "success" },
              { label: "Error", value: "error" },
            ]}
          />
          <RangeControl
            label="Progress"
            value={progress}
            onChange={setProgress}
            min={0}
            max={100}
            step={1}
            valueLabel={`${progress}%`}
          />
        </>
      }
    >
      <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--surface-1)] px-6 py-8">
        <DropzonePulseUpload phase={phase} progress={progress} />
      </div>
    </MicroInteractionScene>
  );
}
