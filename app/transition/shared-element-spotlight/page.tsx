"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { DemoToolbar } from "@/components/transition-lab/DemoToolbar";
import { GradientVeil } from "@/components/transition-lab/GradientVeil";
import { SceneFrame } from "@/components/transition-lab/SceneFrame";
import { SharedElementShell } from "@/components/transition-lab/SharedElementShell";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import { useTransitionDemo } from "@/components/transition-lab/useTransitionDemo";
import {
  transitionLabDurations,
  transitionLabEasings,
} from "@/lib/animation-presets";

const spotlightViews = [
  {
    id: "rail",
    label: "Collection Rail",
    eyebrow: "Catalog View",
    title: "A persistent card anchors the layout while the surrounding rail reshuffles.",
    body:
      "The hero object stays visually continuous between views. Secondary pieces fade and shift around it instead of competing for attention.",
  },
  {
    id: "focus",
    label: "Focus View",
    eyebrow: "Detail View",
    title: "The same shared element expands into a product-grade detail state.",
    body:
      "Layout-aware motion preserves continuity through the scene change. The user never loses the focal object while the interface grows around it.",
  },
] as const;

const supportingCards = [
  "Moonlight stock",
  "Low-glare finish",
  "Graphite trim",
] as const;

type SpotlightViewId = (typeof spotlightViews)[number]["id"];

export default function SharedElementSpotlightPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeValue, replayKey, replay, selectValue } =
    useTransitionDemo<SpotlightViewId>(spotlightViews[0].id);
  const activeView =
    spotlightViews.find((view) => view.id === activeValue) ?? spotlightViews[0];

  return (
    <SceneFrame
      eyebrow="Task 07"
      title="Shared Element Spotlight"
      description="A UI transition pattern where one hero object survives the scene change and the rest of the layout reorganizes around it."
      aside={
        <div className="space-y-4">
          <p className="text-sm leading-6 text-white/68">
            The focal card keeps the same layout identity across both states.
            That continuity is the point of the demo: the scene can rebuild
            without making the user reacquire the hero object.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/52">
              Shared shell
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/52">
              Layout aware
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/52">
              Toggle views
            </span>
          </div>
        </div>
      }
    >
      <DemoToolbar
        eyebrow="View Modes"
        options={spotlightViews.map((view) => ({
          value: view.id,
          label: view.label,
        }))}
        activeValue={activeValue}
        onSelect={selectValue}
        actionLabel="Replay morph"
        onAction={replay}
        actionHint="Replays the shared-element jump between the two layouts."
      />

      <TransitionStage
        className="min-h-[33rem]"
        backgroundClassName="bg-[#071018]"
        overlays={
          <GradientVeil
            from="rgba(16, 185, 129, 0.18)"
            to="rgba(6, 78, 59, 0.92)"
            accent="rgba(167, 243, 208, 0.12)"
          />
        }
      >
        <LayoutGroup id={`spotlight-${replayKey}`}>
          <div className="grid min-h-[33rem] gap-6 p-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)] lg:items-start lg:p-8">
            <div className="space-y-5">
              <motion.div
                initial={{
                  opacity: 0,
                  y: prefersReducedMotion ? 0 : 18,
                }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion
                    ? transitionLabDurations.brisk
                    : transitionLabDurations.base,
                  ease: transitionLabEasings.emphasis,
                }}
              >
                <p className="text-xs uppercase tracking-[0.32em] text-white/40">
                  {activeView.eyebrow}
                </p>
                <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-[0.95] text-white md:text-6xl">
                  {activeView.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                  {activeView.body}
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                {activeValue === "rail" ? (
                  <motion.div
                    key="rail"
                    className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.72fr)]"
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
                    transition={{ duration: transitionLabDurations.base }}
                  >
                    <SharedElementShell
                      layoutId="spotlight-card"
                      label="Persistent Card"
                      title="Aster Headlamp"
                      className="h-full"
                    >
                      <motion.div
                        layoutId="spotlight-media"
                        className="mt-1 rounded-[1.5rem] border border-emerald-200/12 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.32),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.02))] p-5"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="rounded-full border border-white/14 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/54">
                            Hero object
                          </span>
                          <span className="text-sm text-white/62">01</span>
                        </div>
                        <div className="mt-8 h-40 rounded-[1.5rem] bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.52),transparent_18%),linear-gradient(180deg,rgba(12,74,54,0.88),rgba(6,24,20,0.96))]" />
                      </motion.div>
                      <p className="text-sm leading-6 text-white/68">
                        In the rail view, the focal card sits inside a wider
                        browsing layout while small companions provide context.
                      </p>
                    </SharedElementShell>

                    <motion.div
                      className="grid gap-4"
                      initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: prefersReducedMotion ? 0 : 12 }}
                      transition={{ duration: transitionLabDurations.base }}
                    >
                      {supportingCards.map((card) => (
                        <div
                          key={card}
                          className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4 text-sm text-white/66 backdrop-blur-md"
                        >
                          {card}
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="focus"
                    className="space-y-4"
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
                    transition={{ duration: transitionLabDurations.base }}
                  >
                    <SharedElementShell
                      layoutId="spotlight-card"
                      label="Persistent Card"
                      title="Aster Headlamp"
                    >
                      <motion.div
                        layoutId="spotlight-media"
                        className="mt-1 rounded-[1.75rem] border border-emerald-200/12 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.32),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.02))] p-6"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="rounded-full border border-white/14 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/54">
                            Shared expansion
                          </span>
                          <span className="text-sm text-white/62">Product focus</span>
                        </div>
                        <div className="mt-8 h-48 rounded-[1.75rem] bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.52),transparent_18%),linear-gradient(180deg,rgba(12,74,54,0.88),rgba(6,24,20,0.96))]" />
                      </motion.div>
                      <div className="grid gap-3 pt-1 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-sm text-white/68">
                          1800 lumen beam
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-sm text-white/68">
                          42 hour reserve
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-sm text-white/68">
                          Magnetic dock
                        </div>
                      </div>
                    </SharedElementShell>

                    <motion.div
                      className="grid gap-4 sm:grid-cols-3"
                      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: transitionLabDurations.base,
                        delay: prefersReducedMotion ? 0 : 0.08,
                      }}
                    >
                      {[
                        "Continuity stays anchored to one object.",
                        "Secondary details arrive after the hero settles.",
                        "The layout reads like a real product workflow.",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4 text-sm leading-6 text-white/66 backdrop-blur-md"
                        >
                          {item}
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.aside
              className="rounded-[1.75rem] border border-white/10 bg-black/25 p-5 text-sm text-white/66 backdrop-blur-md"
              initial={{
                opacity: 0,
                x: prefersReducedMotion ? 0 : 24,
              }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: prefersReducedMotion
                  ? transitionLabDurations.brisk
                  : transitionLabDurations.base,
                delay: prefersReducedMotion ? 0 : 0.12,
              }}
            >
              <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                Spotlight rules
              </p>
              <div className="mt-5 space-y-4 leading-6">
                <p>One layout id carries the hero card between both states.</p>
                <p>The surrounding UI changes later and with less emphasis.</p>
                <p>The toggle proves the pattern works for real product views.</p>
              </div>
            </motion.aside>
          </div>
        </LayoutGroup>
      </TransitionStage>
    </SceneFrame>
  );
}
