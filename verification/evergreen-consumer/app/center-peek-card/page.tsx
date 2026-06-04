"use client";

import { CenterPeekCard } from "@/components/scroll-animations/CenterPeekCard";

export default function CenterPeekCardPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="flex min-h-screen items-center justify-center px-8 text-center text-white">
        <div>
          <h1 className="text-4xl font-bold">Center Peek Card</h1>
          <p className="mt-3 text-zinc-400">Scroll to exercise the registry component.</p>
        </div>
      </div>
      <div data-testid="registry-center-peek-card">
        <CenterPeekCard>
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 text-white">
            <div className="text-center">
              <h2 className="text-4xl font-bold">Center Peek</h2>
              <p className="mt-2 text-lg opacity-80">Sticky framed reveal</p>
            </div>
          </div>
        </CenterPeekCard>
      </div>
    </div>
  );
}
