"use client";

import Link from "next/link";
import { CopyChipButton } from "@/components/micro-interactions/CopyChipButton";
import { CountUpNumber } from "@/components/micro-interactions/CountUpNumber";
import { LikeBurstButton } from "@/components/micro-interactions/LikeBurstButton";
import { RipplePressButton } from "@/components/micro-interactions/RipplePressButton";
import { SlideToggleSwitch } from "@/components/micro-interactions/SlideToggleSwitch";
import { TabUnderlineFollower } from "@/components/micro-interactions/TabUnderlineFollower";

const components = [
  { name: "CenterPeekCard", href: "/center-peek-card" },
  { name: "CenterPeekShrinkCard", href: "/center-peek-shrink" },
  { name: "ChatBar", href: "/chat" },
  { name: "ChatDemo", href: "/chat-page" },
  { name: "CategoryMarquee", href: "/marquee" },
  { name: "FloatingLogos", href: "/floating-logos" },
  { name: "CountUpNumber", href: "/count-up-number" },
];

const tabs = [
  {
    id: "install",
    label: "Install",
    content: "Registry components should compile after shadcn installs them into this app.",
  },
  {
    id: "render",
    label: "Render",
    content: "Each component is mounted from the consumer app's local components directory.",
  },
  {
    id: "verify",
    label: "Verify",
    content: "Playwright can target these stable containers for smoke and visual checks.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <h1 className="mb-3 text-3xl font-bold">Registry Component Demos</h1>
      <p className="mb-8 max-w-2xl text-sm leading-6 text-zinc-400">
        This page mounts the compact registry items directly from the consumer app. Scroll and
        page-level components live on their own routes.
      </p>

      <nav className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {components.map((comp) => (
          <Link
            key={comp.name}
            href={comp.href}
            className="block p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <span className="text-lg font-semibold text-white">{comp.name}</span>
          </Link>
        ))}
      </nav>

      <div className="grid gap-6 lg:grid-cols-2">
        <section
          data-testid="registry-slide-toggle-switch"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Slide Toggle Switch
          </h2>
          <SlideToggleSwitch />
        </section>

        <section
          data-testid="registry-ripple-press-button"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Ripple Press Button
          </h2>
          <RipplePressButton label="Run Smoke Check" />
        </section>

        <section
          data-testid="registry-copy-confirmation-chip"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Copy Confirmation Chip
          </h2>
          <CopyChipButton textToCopy="motion-gallery-registry" />
        </section>

        <section
          data-testid="registry-like-burst-button"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Like Burst Button
          </h2>
          <LikeBurstButton idleLabel="Save fixture" likedLabel="Saved fixture" />
        </section>

        <section
          data-testid="registry-tab-underline-follower"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2"
        >
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Tab Underline Follower
          </h2>
          <TabUnderlineFollower tabs={tabs} underlineStyle="pill" />
        </section>

        <section
          data-testid="registry-count-up-number"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2"
        >
          <CountUpNumber
            value={12840}
            label="Registry installs"
            caption="Installed component renders with formatting, prefix, suffix, and reduced-motion support."
            prefix="+"
            suffix=" checks"
            compact
          />
        </section>
      </div>
    </main>
  );
}
