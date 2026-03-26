import { notFound } from "next/navigation";
import {
  getTransitionLabRoutes,
  type AnimationMeta,
} from "@/lib/animation-registry";
import { SceneFrame } from "@/components/transition-lab/SceneFrame";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import { GradientVeil } from "@/components/transition-lab/GradientVeil";
import { SharedElementShell } from "@/components/transition-lab/SharedElementShell";

const toneByColor: Record<string, { background: string; from: string; to: string; accent: string }> = {
  amber: {
    background: "bg-[#160e05]",
    from: "rgba(234, 179, 8, 0.3)",
    to: "rgba(120, 53, 15, 0.94)",
    accent: "rgba(253, 230, 138, 0.2)",
  },
  cyan: {
    background: "bg-[#05131a]",
    from: "rgba(34, 211, 238, 0.26)",
    to: "rgba(8, 47, 73, 0.94)",
    accent: "rgba(165, 243, 252, 0.18)",
  },
  emerald: {
    background: "bg-[#05150f]",
    from: "rgba(16, 185, 129, 0.24)",
    to: "rgba(6, 78, 59, 0.94)",
    accent: "rgba(167, 243, 208, 0.2)",
  },
  fuchsia: {
    background: "bg-[#180915]",
    from: "rgba(232, 121, 249, 0.24)",
    to: "rgba(112, 26, 117, 0.94)",
    accent: "rgba(245, 208, 254, 0.2)",
  },
  indigo: {
    background: "bg-[#090f1f]",
    from: "rgba(129, 140, 248, 0.22)",
    to: "rgba(30, 27, 75, 0.94)",
    accent: "rgba(224, 231, 255, 0.18)",
  },
  rose: {
    background: "bg-[#17080f]",
    from: "rgba(251, 113, 133, 0.24)",
    to: "rgba(76, 5, 25, 0.94)",
    accent: "rgba(254, 205, 211, 0.18)",
  },
  violet: {
    background: "bg-[#11091b]",
    from: "rgba(167, 139, 250, 0.24)",
    to: "rgba(59, 7, 100, 0.94)",
    accent: "rgba(221, 214, 254, 0.2)",
  },
  slate: {
    background: "bg-[#0b1018]",
    from: "rgba(148, 163, 184, 0.18)",
    to: "rgba(15, 23, 42, 0.94)",
    accent: "rgba(226, 232, 240, 0.14)",
  },
  zinc: {
    background: "bg-[#111111]",
    from: "rgba(161, 161, 170, 0.18)",
    to: "rgba(9, 9, 11, 0.94)",
    accent: "rgba(244, 244, 245, 0.12)",
  },
};

function getPlannedAnimation(slug: string): AnimationMeta | undefined {
  return getTransitionLabRoutes().find(
    (animation) =>
      animation.status === "planned" && animation.path === `/transition/${slug}`
  );
}

function getTone(color: string) {
  return toneByColor[color] ?? toneByColor.slate;
}

function getRouteChecklist(animation: AnimationMeta) {
  if (animation.id === "transition-showcase") {
    return [
      "Keep one shared scene contract so every mode swaps cleanly.",
      "Add replay and mode switching without rebuilding the page shell.",
      "Use the toolkit primitives so later demos plug in instead of branching.",
    ];
  }

  return [
    "The route is registered and reachable from both the lab hub and the gallery.",
    "The shared stage, veil, and shared-element shell are already available here.",
    "A real demo page can replace this placeholder without changing registry or nav wiring.",
  ];
}

export async function generateStaticParams() {
  return getTransitionLabRoutes()
    .filter((animation) => animation.status === "planned")
    .map((animation) => ({
      slug: animation.path.split("/").at(-1) ?? animation.id,
    }));
}

export default async function TransitionPlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const animation = getPlannedAnimation(slug);

  if (!animation) {
    notFound();
  }

  const tone = getTone(animation.color);
  const checklist = getRouteChecklist(animation);

  return (
    <SceneFrame
      eyebrow="Planned Route"
      title={animation.title}
      description={`${animation.description} This route exists now as a section-aware placeholder so later demo work can focus on choreography instead of routing, registry, and shell plumbing.`}
      aside={
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/45">
            <span>Status</span>
            <span>{animation.status ?? "ready"}</span>
          </div>
          <p>
            The layout, navigation, and shared primitives are already in place. What lands later is the specific transition choreography for this route.
          </p>
        </div>
      }
    >
      <TransitionStage
        className="min-h-[28rem]"
        backgroundClassName={tone.background}
        overlays={
          <GradientVeil
            from={tone.from}
            to={tone.to}
            accent={tone.accent}
          />
        }
      >
        <div className="grid h-full gap-6 p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-center lg:p-8">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.32em] text-white/45">
              Foundation Complete
            </p>
            <h2 className="max-w-2xl font-serif text-4xl text-white sm:text-5xl">
              Route ready for full choreography.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-white/72">
              This placeholder deliberately uses the shared stage and shell pieces so the next implementation step can concentrate on the effect itself: panels, veils, portal logic, shared elements, or controller mechanics.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {checklist.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-white/65"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <SharedElementShell
            layoutId={`transition-lab-${animation.id}`}
            label="Reusable Shell"
            title={animation.title}
          >
            <p className="text-sm leading-6 text-white/68">
              Expected motion direction: later tasks replace this card content with the route-specific demo scene while preserving the shared framing, layering, and reduced-motion defaults.
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                  Path
                </p>
                <p className="mt-2 text-white">{animation.path}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                  Keywords
                </p>
                <p className="mt-2 text-white/72">{animation.keywords.join(" / ")}</p>
              </div>
            </div>
          </SharedElementShell>
        </div>
      </TransitionStage>
    </SceneFrame>
  );
}
