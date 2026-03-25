import { PeekSnapSections, SectionData } from "@/components/peek-snap-sections";
import {
  BottomPeekCard,
  BottomPeekContent,
  BOTTOM_PEEK_CONFIG,
} from "@/components/bottom-peek-card";

// Sample section data - customize these for your use case
const sections: SectionData[] = [
  {
    id: "hero",
    title: "Motion Gallery",
    subtitle: "Premium scroll experiences",
    description:
      "Scroll down to experience smooth, premium section transitions with a peek-before-commit effect.",
    bgClass: "bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900",
  },
  {
    id: "design",
    title: "Crafted Design",
    subtitle: "Every detail matters",
    description:
      "The transition you're experiencing uses scroll-driven transforms with spring physics for a natural feel.",
    bgClass: "bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950",
  },
  {
    id: "technology",
    title: "Modern Stack",
    subtitle: "Built with care",
    description:
      "Powered by Framer Motion's useScroll and useTransform hooks, combined with sticky positioning for native scroll feel.",
    bgClass: "bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950",
  },
  {
    id: "finale",
    title: "Fully Reusable",
    subtitle: "Ready for your project",
    description:
      "Tune the effect by adjusting PEEK_CONFIG in the component. Control threshold, transforms, and spring physics.",
    bgClass: "bg-gradient-to-br from-amber-950 via-orange-900 to-red-950",
  },
];

export default function Home() {
  return (
    <main className="w-full">
      <PeekSnapSections sections={sections} />

      {/* Bottom peek card - starts as half-height and expands to full */}
      <BottomPeekCard
        bgClass="bg-gradient-to-br from-rose-950 via-pink-900 to-fuchsia-950"
        className="relative z-10"
      >
        <BottomPeekContent
          title="Expandable Card"
          subtitle="A different approach"
          description="This card starts at half height peeking from the bottom. Keep scrolling to see it expand to a full-page card with smooth spring physics."
        />
      </BottomPeekCard>

      {/* Another section after the expanded card */}
      <div className="h-screen bg-gradient-to-br from-sky-950 via-blue-900 to-indigo-950 flex items-center justify-center">
        <div className="max-w-3xl px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Continue Exploring
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            The bottom peek card transitioned to full height. You can stack multiple effects for rich scroll experiences.
          </p>
        </div>
      </div>
    </main>
  );
}
