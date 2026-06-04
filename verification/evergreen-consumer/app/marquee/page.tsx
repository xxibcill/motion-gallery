"use client";

import { MarqueeRow } from "@/components/category-marquee/MarqueeRow";
import { BookOpen, Camera, Code, DollarSign, Gamepad2, Headphones, Music, Palette, Rocket, Shield, Sparkles, Zap } from "lucide-react";

const categories = [
  { name: "Technology", color: "#3b82f6", icon: Code },
  { name: "Business", color: "#22c55e", icon: DollarSign },
  { name: "Entertainment", color: "#ec4899", icon: Music },
  { name: "Sports", color: "#f97316", icon: Gamepad2 },
  { name: "Art", color: "#8b5cf6", icon: Palette },
  { name: "Science", color: "#06b6d4", icon: Rocket },
  { name: "Health", color: "#ef4444", icon: Sparkles },
  { name: "Finance", color: "#eab308", icon: Shield },
  { name: "Education", color: "#6366f1", icon: BookOpen },
  { name: "Photography", color: "#14b8a6", icon: Camera },
  { name: "Audio", color: "#f43f5e", icon: Headphones },
  { name: "Gaming", color: "#a855f7", icon: Zap },
];

export default function MarqueePage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center p-8 gap-12">
      <h1 className="text-2xl font-bold text-white mb-4">Category Marquee</h1>

      <div>
        <p className="text-zinc-400 mb-4 text-sm">Direction: left</p>
        <div data-testid="registry-category-marquee">
          <MarqueeRow categories={categories} direction="left" duration={30} />
        </div>
      </div>

      <div>
        <p className="text-zinc-400 mb-4 text-sm">Direction: right</p>
        <MarqueeRow categories={categories} direction="right" duration={25} />
      </div>
    </div>
  );
}
