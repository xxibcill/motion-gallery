import { BottomPeekCard, BottomPeekContent } from '@/components/bottom-peek-card'
import { ScrollRevealSection } from '@/components/scroll-reveal-section'

export default function TestPage() {
  return (
    <main className="bg-zinc-950">
      <BottomPeekCard bgClass="bg-[linear-gradient(180deg,_#09090b_0%,_#1e1b4b_44%,_#172554_100%)]">
        <BottomPeekContent
          title="The Next Section Enters in One Motion"
          subtitle="Shared Section Rhythm"
          description="This transition now behaves like a handoff between scenes. Drop it directly under another sticky reveal section and the next canvas rises into place without a detached card frame."
        />
      </BottomPeekCard>
      <ScrollRevealSection />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_34%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.34em] text-sky-200/70">Settled Section</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
            After the transition, the page is back to a normal full-screen section.
          </h2>
          <p className="mt-6 text-base leading-7 text-zinc-300 md:text-lg">
            That keeps the component useful as connective tissue between larger scroll experiences
            instead of turning it into a separate showcase card.
          </p>
        </div>
      </section>
    </main>
  )
}
