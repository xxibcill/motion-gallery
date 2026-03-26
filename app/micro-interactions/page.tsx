import Link from "next/link";

const demos = [
  {
    title: "Magnetic CTA Button",
    href: "/micro-interactions/magnetic-cta",
    accent: "from-cyan-300/35 via-sky-300/20 to-transparent",
    description: "Pointer pull, press compression, and a restrained snap-back tuned for premium calls to action.",
  },
  {
    title: "Ripple Press Button",
    href: "/micro-interactions/ripple-press",
    accent: "from-fuchsia-300/35 via-pink-300/20 to-transparent",
    description: "A contained ripple and rebound built for tap-heavy utility surfaces.",
  },
  {
    title: "Morphing Play/Pause Toggle",
    href: "/micro-interactions/play-pause-toggle",
    accent: "from-emerald-300/35 via-cyan-300/20 to-transparent",
    description: "A stateful icon transition that preserves continuity instead of swapping symbols abruptly.",
  },
  {
    title: "Copy Confirmation Chip",
    href: "/micro-interactions/copy-chip",
    accent: "from-amber-300/35 via-orange-300/20 to-transparent",
    description: "Optimistic copy feedback with a short-lived success state that resets cleanly.",
  },
  {
    title: "Slide Toggle Switch",
    href: "/micro-interactions/slide-toggle",
    accent: "from-sky-300/35 via-cyan-300/20 to-transparent",
    description: "A tactile switch with thumb travel and track bloom that stays crisp in reduced motion.",
  },
  {
    title: "Segmented Control Rail",
    href: "/micro-interactions/segmented-rail",
    accent: "from-violet-300/35 via-fuchsia-300/20 to-transparent",
    description: "A shared rail highlight that makes filter changes feel connected instead of replaced.",
  },
  {
    title: "Chevron Accordion",
    href: "/micro-interactions/chevron-accordion",
    accent: "from-cyan-300/35 via-teal-300/20 to-transparent",
    description: "Expanded panels reveal with weight shifts and a restrained, directional chevron cue.",
  },
  {
    title: "Tab Underline Follower",
    href: "/micro-interactions/tab-underline",
    accent: "from-rose-300/35 via-pink-300/20 to-transparent",
    description: "Underline or pill followers that keep tab state transitions visually continuous.",
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
            This track covers the roadmap foundation plus the Phase 1 fast wins. Each route is
            isolated, keyboard-usable, and built on `motion/react` with short, decisive timing.
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
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Phase 1</p>
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
