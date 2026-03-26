'use client'

import { ScrollExpandGrid } from '@/components/scroll-expand-grid'

export default function ScrollExpandGridPage() {
  return (
    <main className="bg-zinc-100 min-h-screen">
      {/* Blank section - scroll hint before the animation */}
      <section className="h-screen flex items-center justify-center bg-zinc-100">
        <div className="text-center">
          <p className="text-zinc-400 text-lg mb-2">Scroll down to see the animation</p>
          <div className="animate-bounce mt-4">
            <svg
              className="w-6 h-6 mx-auto text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/*
        3-phase scroll animation: Enter → Expand → Exit

        expandableCardIds prop controls which cards expand (array of IDs):

        TradFi IDs: 'aapl', 'msft', 'nvda'
        Crypto IDs: 'bitcoin', 'ethereum', 'solana'

        Examples:
        - <ScrollExpandGrid expandableCardIds={['bitcoin']} />
        - <ScrollExpandGrid expandableCardIds={['bitcoin', 'nvda']} />
        - <ScrollExpandGrid expandableCardIds={['bitcoin', 'ethereum', 'msft']} />
        - <ScrollExpandGrid expandableCardIds={[]} />
      */}
      <ScrollExpandGrid expandableCardIds={['bitcoin', 'nvda']} />

      {/* Content after the animation */}
      <section className="h-screen flex items-center justify-center bg-zinc-100">
        <div className="text-center max-w-md">
          <p className="text-zinc-400 text-lg">Animation complete</p>
          <p className="text-zinc-500 text-sm mt-2">
            The grid entered, Bitcoin/NVDA/Ethereum cards expanded, then faded out.
          </p>
        </div>
      </section>
    </main>
  )
}
