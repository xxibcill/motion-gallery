"use client";

import { CountUpNumber } from "@/components/micro-interactions/CountUpNumber";

export default function CountUpNumberPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-8">
      <div data-testid="registry-count-up-number" className="w-full max-w-3xl">
        <CountUpNumber
          value={98.7}
          label="Portability score"
          caption="Decimal values, suffixes, and delayed starts should compile in the consumer app."
          suffix="%"
          decimals={1}
          tone="amber"
        />
      </div>
    </div>
  );
}
