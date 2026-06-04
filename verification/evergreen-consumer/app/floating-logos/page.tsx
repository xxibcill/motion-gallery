"use client";

import { FloatingLogos } from "@/components/floating-logos/FloatingLogos";

export default function FloatingLogosPage() {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <div className="relative z-10 p-8">
        <h1 className="text-2xl font-bold text-white">Floating Logos</h1>
        <p className="text-zinc-400 mt-2">Ambient floating animation with spring physics</p>
      </div>
      <div data-testid="registry-floating-logos" className="absolute inset-0 z-0">
        <FloatingLogos
          logos={[
            {
              src: "https://cdn.simpleicons.org/react/white",
              size: 56,
              initialX: 10,
              initialY: 20,
              floatDuration: 6,
              floatDistance: 20,
              delay: 0,
            },
            {
              src: "https://cdn.simpleicons.org/nextdotjs/white",
              size: 48,
              initialX: 30,
              initialY: 60,
              floatDuration: 7,
              floatDistance: 25,
              delay: 0.2,
            },
            {
              src: "https://cdn.simpleicons.org/typescript/white",
              size: 44,
              initialX: 55,
              initialY: 15,
              floatDuration: 5,
              floatDistance: 18,
              delay: 0.4,
            },
            {
              src: "https://cdn.simpleicons.org/tailwindcss/white",
              size: 52,
              initialX: 75,
              initialY: 45,
              floatDuration: 8,
              floatDistance: 22,
              delay: 0.6,
            },
            {
              src: "https://cdn.simpleicons.org/framer/white",
              size: 40,
              initialX: 85,
              initialY: 75,
              floatDuration: 6.5,
              floatDistance: 28,
              delay: 0.8,
            },
          ]}
        />
      </div>
    </div>
  );
}
