import { PeekSnapSections, SectionData } from "@/components/peek-snap-sections";
import {
  BottomPeekCard,
  BottomPeekContent,
} from "@/components/bottom-peek-card";

// Sample section data - customize these for your use case
const sections: SectionData[] = [
  {
    id: "hero",
    title: "Motion Gallery",
    subtitle: "Scroll-driven transitions",
    description:
      "Scroll down to experience peek-snap section transitions with spring physics.",
    bgClass: "bg-[var(--surface-0)]",
  },
  {
    id: "design",
    title: "Scroll-driven transforms",
    subtitle: "Spring physics",
    description:
      "Scroll progress drives transforms with spring-smoothed easing for a natural, physical feel.",
    bgClass: "bg-[var(--surface-1)]",
  },
  {
    id: "technology",
    title: "useScroll + useTransform",
    subtitle: "Framer Motion",
    description:
      "Framer Motion's useScroll and useTransform hooks combined with sticky positioning for native scroll feel.",
    bgClass: "bg-[var(--surface-0)]",
  },
  {
    id: "finale",
    title: "Fully Configurable",
    subtitle: "PEEK_CONFIG",
    description:
      "Tune the effect by adjusting PEEK_CONFIG in the component. Control threshold, transforms, and spring physics.",
    bgClass: "bg-[var(--surface-1)]",
  },
];

export default function Home() {
  return (
    <main className="w-full">
      <PeekSnapSections sections={sections} />

      {/* Bottom peek transition - lifts the next section into place */}
      <BottomPeekCard
        bgClass="bg-[var(--surface-1)]"
        className="relative z-10"
      >
        <BottomPeekContent
          title="A Seamless Section Handoff"
          subtitle="Bottom Peek Transition"
          description="Instead of introducing a framed card, the next scene rises from the bottom as a full-bleed surface. That keeps the transition compatible with other scroll-driven sections."
        />
      </BottomPeekCard>

      {/* Another section after the transition */}
      <div className="h-screen bg-[var(--surface-0)] flex items-center justify-center">
        <div className="max-w-3xl px-8 text-center">
          <h2 className="font-serif text-5xl md:text-7xl text-[var(--text-primary)] mb-6 tracking-tight">
            Continue Exploring
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            The bottom peek transition resolves into a normal section, so you can stack it with other full-screen effects without the layout breaking into separate demo blocks.
          </p>
        </div>
      </div>
    </main>
  );
}
