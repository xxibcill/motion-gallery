import Link from "next/link";
import {
  getTransitionLabRoutes,
  type AnimationMeta,
} from "@/lib/animation-registry";
import { SceneFrame } from "@/components/transition-lab/SceneFrame";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import { GradientVeil } from "@/components/transition-lab/GradientVeil";
import { SharedElementShell } from "@/components/transition-lab/SharedElementShell";
import { transitionLabControlPillars } from "@/lib/transition-lab";

const cardTones: Record<string, { stage: string; from: string; to: string; accent: string }> = {
  cyan: {
    stage: "bg-[#04131d]",
    from: "rgba(14, 116, 144, 0.72)",
    to: "rgba(8, 47, 73, 0.96)",
    accent: "rgba(103, 232, 249, 0.18)",
  },
  amber: {
    stage: "bg-[#1a1106]",
    from: "rgba(217, 119, 6, 0.76)",
    to: "rgba(120, 53, 15, 0.96)",
    accent: "rgba(253, 230, 138, 0.18)",
  },
  violet: {
    stage: "bg-[#13081f]",
    from: "rgba(124, 58, 237, 0.68)",
    to: "rgba(59, 7, 100, 0.96)",
    accent: "rgba(221, 214, 254, 0.2)",
  },
  emerald: {
    stage: "bg-[#051912]",
    from: "rgba(5, 150, 105, 0.72)",
    to: "rgba(6, 78, 59, 0.96)",
    accent: "rgba(167, 243, 208, 0.2)",
  },
  indigo: {
    stage: "bg-[#0b1024]",
    from: "rgba(67, 56, 202, 0.7)",
    to: "rgba(30, 27, 75, 0.96)",
    accent: "rgba(199, 210, 254, 0.2)",
  },
  rose: {
    stage: "bg-[#1b0911]",
    from: "rgba(225, 29, 72, 0.72)",
    to: "rgba(76, 5, 25, 0.96)",
    accent: "rgba(254, 205, 211, 0.18)",
  },
  fuchsia: {
    stage: "bg-[#190718]",
    from: "rgba(192, 38, 211, 0.72)",
    to: "rgba(74, 4, 78, 0.96)",
    accent: "rgba(245, 208, 254, 0.2)",
  },
  slate: {
    stage: "bg-[#090d16]",
    from: "rgba(51, 65, 85, 0.76)",
    to: "rgba(15, 23, 42, 0.96)",
    accent: "rgba(226, 232, 240, 0.14)",
  },
  zinc: {
    stage: "bg-[#111111]",
    from: "rgba(63, 63, 70, 0.74)",
    to: "rgba(9, 9, 11, 0.96)",
    accent: "rgba(244, 244, 245, 0.12)",
  },
};

function getCardTone(color: string) {
  return cardTones[color] ?? cardTones.slate;
}

function TransitionCard({ animation }: { animation: AnimationMeta }) {
  const tone = getCardTone(animation.color);

  return (
    <Link href={animation.path} className="block">
      <TransitionStage
        className="h-full min-h-[17rem] transition-transform duration-300 hover:-translate-y-1"
        backgroundClassName={tone.stage}
        overlays={
          <GradientVeil
            from={tone.from}
            to={tone.to}
            accent={tone.accent}
          />
        }
        chrome={
          <div className="flex h-full items-start justify-end p-5">
            <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[0.65rem] uppercase tracking-[0.26em] text-white/60">
              {animation.status === "planned" ? "Planned" : "Live"}
            </span>
          </div>
        }
      >
        <div className="flex h-full flex-col justify-between p-6">
          <div className="space-y-3">
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/45">
              {animation.path.split("/").at(-1)}
            </p>
            <h2 className="font-serif text-3xl text-white">{animation.title}</h2>
            <p className="max-w-md text-sm leading-6 text-white/70">
              {animation.description}
            </p>
          </div>
          <div className="flex items-center justify-between text-sm text-white/58">
            <span>{animation.difficulty}</span>
            <span>Open route</span>
          </div>
        </div>
      </TransitionStage>
    </Link>
  );
}

export default function TransitionHubPage() {
  const routes = getTransitionLabRoutes();
  const showcase = routes.find((route) => route.id === "transition-showcase");
  const demos = routes.filter((route) => route.id !== "transition-showcase");

  return (
    <SceneFrame
      eyebrow="Transition Wow"
      title="Ten transition directions, one section shell, and room for a real showcase controller."
      description="This hub establishes the permanent home for the transition collection. Each card has its own atmosphere, every planned route is already reachable, and the shell reserves space for the filters and replay controls that arrive later."
      aside={
        <div className="space-y-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-white/40">
              Future Control Rail
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {transitionLabControlPillars.map((pillar) => (
                <span
                  key={pillar}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/65"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </div>
          <p>
            The first demo routes are live now, and the remaining planned routes
            still sit behind section-aware placeholders so later work can land
            without changing navigation, gallery cards, or registry wiring.
          </p>
        </div>
      }
    >
      {showcase ? (
        <div className="mb-6">
          <TransitionStage
            className="min-h-[22rem]"
            backgroundClassName="bg-[#07111e]"
            overlays={
              <GradientVeil
                from="rgba(14, 165, 233, 0.4)"
                to="rgba(17, 24, 39, 0.96)"
                accent="rgba(125, 211, 252, 0.22)"
              />
            }
          >
            <div className="grid h-full gap-6 p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-center lg:p-8">
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/60">
                  Flagship Route
                </p>
                <div className="space-y-3">
                  <h2 className="font-serif text-4xl text-white sm:text-5xl">
                    {showcase.title}
                  </h2>
                  <p className="max-w-2xl text-base leading-7 text-cyan-50/75">
                    {showcase.description}
                  </p>
                </div>
                <Link
                  href={showcase.path}
                  className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-5 py-3 text-sm text-white transition-colors hover:bg-cyan-200/16"
                >
                  Open showcase route
                </Link>
              </div>
              <SharedElementShell
                layoutId="transition-lab-showcase-shell"
                label="Shared Shell"
                title="Controller space reserved"
              >
                <p className="text-sm leading-6 text-white/68">
                  This panel is already using the shared-element wrapper that later pages can animate between views, tiles, and scene states.
                </p>
                <div className="grid gap-3 pt-2 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                      Modes
                    </p>
                    <p className="mt-2 text-white">10</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                      Replay
                    </p>
                    <p className="mt-2 text-white">Ready</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                      Stage
                    </p>
                    <p className="mt-2 text-white">Shared</p>
                  </div>
                </div>
              </SharedElementShell>
            </div>
          </TransitionStage>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {demos.map((demo) => (
          <TransitionCard key={demo.id} animation={demo} />
        ))}
      </div>
    </SceneFrame>
  );
}
