import { CenterPeekShrinkCard } from "@/components/scroll-animations/CenterPeekShrinkCard";

export default function CenterPeekShrinkPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <CenterPeekShrinkCard>
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-500 via-rose-500 to-purple-600 text-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2">Center Peek Shrink</h2>
            <p className="text-lg opacity-80">Two-phase scroll animation</p>
          </div>
        </div>
      </CenterPeekShrinkCard>
    </div>
  );
}
