import { CenterPeekShrinkCard } from '@/components/center-peek-shrink-card'

export default function CenterPeekShrinkPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <section className="relative flex min-h-screen items-center overflow-hidden px-6 py-20 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.22),_transparent_42%),linear-gradient(180deg,_#16110f_0%,_#080808_65%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-orange-200/80">
              Center Peek Shrink
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              A peek card that grows, then shrinks and anchors to the top.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
              Two-phase animation: first the card expands to fill the viewport, then continues
              scrolling to shrink it into a compact header anchored at the top.
            </p>
          </div>

          <div className="grid gap-4 text-sm text-zinc-300 md:grid-cols-3 lg:max-w-xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              Phase 1: Grow to full
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              Phase 2: Shrink to header
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              Top-anchored collapse
            </div>
          </div>
        </div>
      </section>

      <CenterPeekShrinkCard
        className="relative z-10"
        shellClassName="bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.18),_transparent_28%),linear-gradient(180deg,_rgba(11,11,11,1)_0%,_rgba(20,12,10,1)_40%,_rgba(11,11,11,1)_100%)]"
        cardClassName="border border-orange-950/20 bg-gradient-to-br from-orange-100 via-amber-50 to-white text-zinc-950"
      >
        <div className="relative flex h-full flex-col overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.25),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(217,119,6,0.2),_transparent_42%)]" />
        </div>
      </CenterPeekShrinkCard>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20 md:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_#090909_0%,_#140d0a_100%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-orange-200/75">Content Revealed</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
            The card shrinks to 300px at the top, exposing this content below.
          </h2>
          <p className="mt-6 text-base leading-7 text-zinc-400 md:text-lg">
            This creates a seamless transition from a full-screen hero to a compact header that
            stays visible as users scroll through the page content.
          </p>
        </div>
      </section>
    </main>
  )
}
