"use client";

import { useState } from "react";
import { CountUpNumber } from "@/components/micro-interactions/CountUpNumber";
import {
  MicroInteractionScene,
  OptionPills,
  RangeControl,
} from "@/components/micro-interactions/MicroInteractionScene";

type ScenarioKey = "community" | "revenue" | "uptime";

type ScenarioDefinition = {
  title: string;
  stageClass: string;
  hero: {
    label: string;
    value: number;
    caption: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    tone: "cyan" | "amber" | "rose";
  };
  rail: Array<{
    label: string;
    value: number;
    caption: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    tone: "cyan" | "amber" | "rose";
  }>;
};

const scenarios: Record<ScenarioKey, ScenarioDefinition> = {
  community: {
    title: "Community Pulse",
    stageClass:
      "bg-[var(--surface-1)]",
    hero: {
      label: "Live creators tracked",
      value: 18450,
      caption:
        "Large totals benefit from a fast ease-out curve so the motion feels intentional instead of lottery-machine noisy.",
      tone: "cyan" as const,
    },
    rail: [
      {
        label: "New teams this week",
        value: 124,
        prefix: "+",
        caption: "Short bursts still read clearly when the digits settle without overshoot.",
        tone: "amber" as const,
      },
      {
        label: "Activation rate",
        value: 86.4,
        suffix: "%",
        decimals: 1,
        caption: "Tabular digits keep decimal counters stable while the value climbs.",
        tone: "rose" as const,
      },
    ],
  },
  revenue: {
    title: "Revenue Snapshot",
    stageClass:
      "bg-[var(--surface-1)]",
    hero: {
      label: "Monthly recurring revenue",
      value: 247500,
      prefix: "$",
      caption:
        "Currency counters need decisive grouping and enough weight in the typography to keep the figure believable.",
      tone: "amber" as const,
    },
    rail: [
      {
        label: "Closed deals",
        value: 38,
        caption: "Whole-number counts can run quicker without feeling rushed.",
        tone: "cyan" as const,
      },
      {
        label: "Average contract value",
        value: 6513,
        prefix: "$",
        caption: "Secondary figures can follow the hero with a short stagger to build hierarchy.",
        tone: "rose" as const,
      },
    ],
  },
  uptime: {
    title: "Operations Readout",
    stageClass:
      "bg-[var(--surface-1)]",
    hero: {
      label: "System uptime",
      value: 99.98,
      suffix: "%",
      decimals: 2,
      caption:
        "Precision counters work when the decimal places stay fixed and the motion ends crisply on the final value.",
      tone: "rose" as const,
    },
    rail: [
      {
        label: "Average response time",
        value: 182,
        suffix: "ms",
        caption: "Suffixes should move with the number so the unit never feels detached.",
        tone: "cyan" as const,
      },
      {
        label: "Deployments today",
        value: 14,
        caption: "Small operational counts still feel stronger with a shared visual system.",
        tone: "amber" as const,
      },
    ],
  },
};

export default function CountUpNumberPage() {
  const [scenario, setScenario] = useState<ScenarioKey>("community");
  const [duration, setDuration] = useState(1.2);
  const [replaySeed, setReplaySeed] = useState(0);

  const activeScenario = scenarios[scenario];

  return (
    <MicroInteractionScene
      title="Count Up Number"
      description="A stat readout accelerates immediately, decelerates into the final digits, and stays legible enough to reuse in dashboards, launch metrics, and progress summaries."
      reducedMotionNote="Reduced motion skips the counting sequence and renders the final value immediately, preserving the same hierarchy and formatting without digit travel."
      notes={["Tabular digits", "Scenario presets", "Replayable without remounting the whole page"]}
      controls={
        <>
          <OptionPills
            label="Scenario"
            value={scenario}
            onChange={setScenario}
            options={[
              { label: "Community", value: "community" },
              { label: "Revenue", value: "revenue" },
              { label: "Ops", value: "uptime" },
            ]}
          />
          <RangeControl
            label="Duration"
            value={duration}
            onChange={setDuration}
            min={0.6}
            max={2.2}
            step={0.1}
            valueLabel={`${duration.toFixed(1)}s`}
          />
          <button
            type="button"
            onClick={() => setReplaySeed((value) => value + 1)}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-2)] px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)]"
          >
            Replay sequence
          </button>
        </>
      }
    >
      <div
        className={`grid min-h-[340px] gap-4 rounded-lg border border-dashed border-[var(--border-subtle)] p-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] ${activeScenario.stageClass}`}
      >
        <CountUpNumber
          key={`hero-${scenario}-${duration}-${replaySeed}`}
          eyebrow={activeScenario.title}
          label={activeScenario.hero.label}
          value={activeScenario.hero.value}
          prefix={activeScenario.hero.prefix}
          suffix={activeScenario.hero.suffix}
          decimals={activeScenario.hero.decimals}
          duration={duration}
          caption={activeScenario.hero.caption}
          tone={activeScenario.hero.tone}
          className="min-h-[280px] self-stretch"
        />

        <div className="grid gap-4">
          {activeScenario.rail.map((item, index) => (
            <CountUpNumber
              key={`${item.label}-${scenario}-${duration}-${replaySeed}`}
              eyebrow={activeScenario.title}
              label={item.label}
              value={item.value}
              prefix={item.prefix}
              suffix={item.suffix}
              decimals={item.decimals}
              duration={duration}
              delay={0.08 * (index + 1)}
              caption={item.caption}
              tone={item.tone}
              compact
            />
          ))}
        </div>
      </div>
    </MicroInteractionScene>
  );
}
