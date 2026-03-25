import { CenterPeekCard } from "@/components/center-peek-card";

export default function ShrinkableStickyBoxPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <section className="relative flex min-h-screen items-center overflow-hidden px-6 py-20 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.22),_transparent_42%),linear-gradient(180deg,_#16110f_0%,_#080808_65%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-orange-200/80">
              Shrinkable Sticky Box
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              A peek card that settles in the center instead of taking over the full screen.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
              This version keeps the same sticky scroll reveal as the bottom-peek card, but the motion resolves into a framed card that feels anchored in the middle of the page.
            </p>
          </div>

          <div className="grid gap-4 text-sm text-zinc-300 md:grid-cols-3 lg:max-w-xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              Sticky viewport scroll
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              Warm glow and card lift
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              Final state stays centered
            </div>
          </div>
        </div>
      </section>

      <CenterPeekCard
        className="relative z-10"
        shellClassName="bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.18),_transparent_28%),linear-gradient(180deg,_rgba(11,11,11,1)_0%,_rgba(20,12,10,1)_40%,_rgba(11,11,11,1)_100%)]"
        cardClassName="border border-orange-950/20 bg-gradient-to-br from-orange-100 via-amber-50 to-white text-zinc-950"
      >
        <div className="relative flex h-full flex-col overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.25),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(217,119,6,0.2),_transparent_42%)]" />

          <div className="relative flex h-full flex-col justify-between p-5 md:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-orange-700">
                  Center Peek Card
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                  The card finishes as the focal object, not the entire canvas.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600 md:text-base">
                  Scroll through the sticky range and the panel grows, rises, and lands as a centered showcase card. It keeps the sense of reveal without flattening into a full-bleed section.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left text-sm text-zinc-700">
                <div className="rounded-2xl bg-white/65 p-4 shadow-sm ring-1 ring-black/5">
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    End width
                  </p>
                  <p className="mt-2 text-2xl font-semibold">82%</p>
                </div>
                <div className="rounded-2xl bg-white/65 p-4 shadow-sm ring-1 ring-black/5">
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    End height
                  </p>
                  <p className="mt-2 text-2xl font-semibold">76vh</p>
                </div>
                <div className="rounded-2xl bg-white/65 p-4 shadow-sm ring-1 ring-black/5">
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    Motion
                  </p>
                  <p className="mt-2 text-2xl font-semibold">Spring</p>
                </div>
                <div className="rounded-2xl bg-white/65 p-4 shadow-sm ring-1 ring-black/5">
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    Anchor
                  </p>
                  <p className="mt-2 text-2xl font-semibold">Center</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.3fr_0.9fr]">
              <div className="rounded-[2rem] bg-zinc-950 px-5 py-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:px-7 md:py-8">
                <p className="text-sm uppercase tracking-[0.28em] text-orange-300/80">
                  Transition note
                </p>
                <p className="mt-4 max-w-xl text-2xl font-medium leading-tight md:text-3xl">
                  The peek begins low in the viewport, then lifts and expands until the layout reads like a premium center-stage card.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.75rem] bg-white/70 p-5 shadow-sm ring-1 ring-black/5">
                  <p className="text-sm font-medium text-zinc-500">
                    Visual intent
                  </p>
                  <p className="mt-3 text-lg font-semibold text-zinc-900">
                    Preserve framing around the card so the background remains part of the composition.
                  </p>
                </div>
                <div className="rounded-[1.75rem] bg-white/70 p-5 shadow-sm ring-1 ring-black/5">
                  <p className="text-sm font-medium text-zinc-500">
                    Implementation
                  </p>
                  <p className="mt-3 text-lg font-semibold text-zinc-900">
                    `useScroll`, `useTransform`, and a sticky viewport drive the width, height, radius, and lift.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CenterPeekCard>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20 md:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_#090909_0%,_#140d0a_100%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-orange-200/75">
            End State
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
            The motion resolves with space around the card, so the page still breathes.
          </h2>
          <p className="mt-6 text-base leading-7 text-zinc-400 md:text-lg">
            That keeps the transition closer to a product card reveal than a full-page takeover, which is the main difference from the existing bottom-peek-card effect.
          </p>
        </div>
      </section>
    </main>
  );
}
