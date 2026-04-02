import Link from "next/link";
import { getTransitionLabRoutes } from "@/lib/animation-registry";
import { SceneFrame } from "@/components/transition-lab/SceneFrame";
import { TransitionStage } from "@/components/transition-lab/TransitionStage";
import { GradientVeil } from "@/components/transition-lab/GradientVeil";
import { TransitionPreviewCard } from "@/components/transition-lab/TransitionPreviewCard";

const toolkitItems = [
  {
    name: "TransitionStage",
    description: "Scene container with layered backgrounds, overlays, and entrance animations",
    importPath: "@/components/transition-lab/TransitionStage",
  },
  {
    name: "SceneFrame",
    description: "Page header with eyebrow, title, description, and optional aside",
    importPath: "@/components/transition-lab/SceneFrame",
  },
  {
    name: "GradientVeil",
    description: "Gradient overlay system for rich stage backgrounds",
    importPath: "@/components/transition-lab/GradientVeil",
  },
  {
    name: "SharedElementShell",
    description: "Card with layoutId for shared element transitions across routes",
    importPath: "@/components/transition-lab/SharedElementShell",
  },
  {
    name: "DemoToolbar",
    description: "Controls for scene selection and replay actions",
    importPath: "@/components/transition-lab/DemoToolbar",
  },
  {
    name: "useTransitionDemo",
    description: "Hook for managing active value and replay state",
    importPath: "@/components/transition-lab/useTransitionDemo",
  },
];

export default function TransitionHubPage() {
  const routes = getTransitionLabRoutes();
  const showcase = routes.find((route) => route.id === "transition-showcase");
  const gallery = routes.find((route) => route.id === "transition-gallery");
  const demos = routes.filter(
    (route) =>
      route.id !== "transition-showcase" &&
      route.id !== "transition-gallery" &&
      route.id !== "transition-dimensional-rift"
  );
  const rift = routes.find((route) => route.id === "transition-dimensional-rift");

  return (
    <SceneFrame
      eyebrow="Transition Lab"
      title="Eleven transition effects for scene changes, route swaps, and high-drama reveals."
      description="Each demo is a self-contained transition with its own motion signature. Compare them all side-by-side in the showcase, or explore individually."
    >
      {/* Section A — Showcase & Gallery */}
      {showcase ? (
        <div className="mb-10">
          <TransitionStage
            className="min-h-[20rem]"
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
                  Showcase
                </p>
                <div className="space-y-3">
                  <h2 className="font-serif text-4xl text-white sm:text-5xl">
                    Compare all transitions side by side
                  </h2>
                  <p className="max-w-2xl text-base leading-7 text-cyan-50/75">
                    One shared scene cycles through every transition mode from a single control surface. Switch modes, adjust speed and intensity, replay instantly.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={showcase.path}
                    className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-5 py-3 text-sm text-white transition-colors hover:bg-cyan-200/16"
                  >
                    Open showcase
                  </Link>
                  {gallery && (
                    <Link
                      href={gallery.path}
                      className="inline-flex rounded-full border border-white/12 bg-white/[0.05] px-5 py-3 text-sm text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white"
                    >
                      Scroll gallery
                    </Link>
                  )}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                    Modes
                  </p>
                  <p className="mt-2 text-2xl font-medium text-white">10</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                    Controls
                  </p>
                  <p className="mt-2 text-2xl font-medium text-white">Speed</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                    Intensity
                  </p>
                  <p className="mt-2 text-2xl font-medium text-white">3 levels</p>
                </div>
              </div>
            </div>
          </TransitionStage>
        </div>
      ) : null}

      {/* Section B — Demo Grid */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Demos</p>
        <p className="mt-1 text-sm text-white/55">
          Hover to preview each transition&apos;s signature motion. Click to open the full demo.
        </p>
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {demos.map((demo) => (
          <TransitionPreviewCard key={demo.id} animation={demo} />
        ))}
      </div>

      {/* Dimensional Rift — featured */}
      {rift ? (
        <div className="mb-10">
          <TransitionPreviewCard animation={rift} />
        </div>
      ) : null}

      {/* Section C — Toolkit */}
      <div className="mt-10">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Toolkit</p>
          <p className="mt-1 text-sm text-white/55">
            Shared primitives used across every transition demo. Import and compose them to build your own.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {toolkitItems.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
            >
              <p className="font-mono text-sm text-white/90">{item.name}</p>
              <p className="mt-1.5 text-xs leading-5 text-white/50">{item.description}</p>
              <p className="mt-2 font-mono text-[0.65rem] text-white/30">{item.importPath}</p>
            </div>
          ))}
        </div>
      </div>
    </SceneFrame>
  );
}
