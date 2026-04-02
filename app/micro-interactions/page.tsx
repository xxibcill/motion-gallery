import Link from "next/link";

const demos = [
  {
    phase: "Phase 1",
    title: "Beam Focus Input",
    href: "/micro-interactions/beam-focus-input",
    accent: "from-cyan-300/35 via-sky-300/20 to-transparent",
    description: "Directional focus sweep and edge glow that make text entry feel intentional without hurting readability.",
  },
  {
    phase: "Phase 1",
    title: "Inline Validation Field",
    href: "/micro-interactions/inline-validation",
    accent: "from-emerald-300/35 via-cyan-300/20 to-transparent",
    description: "Typing, error, and success states that stay in one footprint so the layout never jolts.",
  },
  {
    phase: "Phase 1",
    title: "Magnetic CTA Button",
    href: "/micro-interactions/magnetic-cta",
    accent: "from-cyan-300/35 via-sky-300/20 to-transparent",
    description: "Pointer pull, press compression, and a restrained snap-back tuned for premium calls to action.",
  },
  {
    phase: "Phase 1",
    title: "Ripple Press Button",
    href: "/micro-interactions/ripple-press",
    accent: "from-fuchsia-300/35 via-pink-300/20 to-transparent",
    description: "A contained ripple and rebound built for tap-heavy utility surfaces.",
  },
  {
    phase: "Phase 1",
    title: "Morphing Play/Pause Toggle",
    href: "/micro-interactions/play-pause-toggle",
    accent: "from-emerald-300/35 via-cyan-300/20 to-transparent",
    description: "A stateful icon transition that preserves continuity instead of swapping symbols abruptly.",
  },
  {
    phase: "Phase 2",
    title: "Like Burst Button",
    href: "/micro-interactions/like-burst",
    accent: "from-rose-300/35 via-pink-300/20 to-transparent",
    description: "A fast favorite interaction with heart fill, a compact burst, and a softer reverse motion.",
  },
  {
    phase: "Phase 1",
    title: "Copy Confirmation Chip",
    href: "/micro-interactions/copy-chip",
    accent: "from-amber-300/35 via-orange-300/20 to-transparent",
    description: "Optimistic copy feedback with a short-lived success state that resets cleanly.",
  },
  {
    phase: "Phase 1",
    title: "Hover Tilt Product Card",
    href: "/micro-interactions/hover-tilt-card",
    accent: "from-sky-300/35 via-cyan-300/20 to-transparent",
    description: "Restrained 3D tilt with a passing sheen and separated depth layers for richer hover feedback.",
  },
  {
    phase: "Phase 1",
    title: "Spotlight Hover Link List",
    href: "/micro-interactions/spotlight-links",
    accent: "from-teal-300/35 via-cyan-300/20 to-transparent",
    description: "Cursor-led spotlight and keyboard focus treatment that keep dense lists easy to scan.",
  },
  {
    phase: "Phase 1",
    title: "Notification Bell Peek",
    href: "/micro-interactions/notification-bell",
    accent: "from-sky-300/35 via-cyan-300/20 to-transparent",
    description: "Anchored notification tray with separate badge pulse and panel choreography.",
  },
  {
    phase: "Phase 1",
    title: "Toast Stack Dismiss",
    href: "/micro-interactions/toast-stack",
    accent: "from-amber-300/35 via-orange-300/20 to-transparent",
    description: "Stacked toasts with staggered entry, swipe dismissal, and clean reflow between items.",
  },
  {
    phase: "Phase 1",
    title: "Drag Lift Sort Cards",
    href: "/micro-interactions/drag-sort",
    accent: "from-cyan-300/35 via-sky-300/20 to-transparent",
    description: "Reorderable cards with lift, placeholder spacing, and deliberate settle motion.",
  },
  {
    phase: "Phase 1",
    title: "Dropzone Pulse Upload",
    href: "/micro-interactions/dropzone-upload",
    accent: "from-cyan-300/35 via-emerald-300/20 to-transparent",
    description: "Clear drag-over pulse that hands off to upload progress, success, and error states.",
  },
  {
    phase: "Bonus",
    title: "Count Up Number",
    href: "/micro-interactions/count-up-number",
    accent: "from-cyan-300/35 via-emerald-300/20 to-transparent",
    description: "An accelerating stat readout that lands cleanly on the final digits and respects reduced motion.",
  },
  {
    phase: "Phase 1",
    title: "Slide Toggle Switch",
    href: "/micro-interactions/slide-toggle",
    accent: "from-sky-300/35 via-cyan-300/20 to-transparent",
    description: "A tactile switch with thumb travel and track bloom that stays crisp in reduced motion.",
  },
  {
    phase: "Phase 1",
    title: "Segmented Control Rail",
    href: "/micro-interactions/segmented-rail",
    accent: "from-violet-300/35 via-fuchsia-300/20 to-transparent",
    description: "A shared rail highlight that makes filter changes feel connected instead of replaced.",
  },
  {
    phase: "Phase 1",
    title: "Chevron Accordion",
    href: "/micro-interactions/chevron-accordion",
    accent: "from-cyan-300/35 via-teal-300/20 to-transparent",
    description: "Expanded panels reveal with weight shifts and a restrained, directional chevron cue.",
  },
  {
    phase: "Phase 1",
    title: "Tab Underline Follower",
    href: "/micro-interactions/tab-underline",
    accent: "from-rose-300/35 via-pink-300/20 to-transparent",
    description: "Underline or pill followers that keep tab state transitions visually continuous.",
  },
  {
    phase: "Phase 1",
    title: "Theme Switch Orb",
    href: "/micro-interactions/theme-switch",
    accent: "from-violet-300/35 via-cyan-300/20 to-transparent",
    description: "Orb-like thumb travel and a contained environment shift built for theme toggles.",
  },
  {
    phase: "Phase 1",
    title: "Command Palette Highlight",
    href: "/micro-interactions/command-palette",
    accent: "from-fuchsia-300/35 via-rose-300/20 to-transparent",
    description: "Shared result highlight that follows both pointer hover and keyboard selection.",
  },
  {
    phase: "Phase 1",
    title: "Stepper Progress Pulse",
    href: "/micro-interactions/stepper-progress",
    accent: "from-emerald-300/35 via-cyan-300/20 to-transparent",
    description: "Completion pulse that travels through the connector to emphasize forward progress.",
  },
];

export default function MicroInteractionsIndexPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_34%),linear-gradient(180deg,#020617_0%,#09090b_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 sm:px-8 lg:px-10">
        <section className="rounded-[2.4rem] border border-white/10 bg-white/[0.04] p-8 shadow-[var(--mi-shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-200/75">
            Micro Interactions
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Compact feedback demos with reusable components and explicit reduced-motion fallbacks.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            This track now covers the full planned micro-interactions set. Each route is isolated,
            keyboard-usable, and built on
            `motion/react` with short, decisive timing.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${demo.accent}`} />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">{demo.phase}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{demo.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{demo.description}</p>
                <span className="mt-6 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-sm text-zinc-100 transition-colors group-hover:bg-black/30">
                  Open Demo
                </span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
