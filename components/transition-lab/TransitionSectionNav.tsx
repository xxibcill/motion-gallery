"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AnimationMeta } from "@/lib/animation-registry";
import { isAnimationActive } from "@/lib/route-matching";

interface TransitionSectionNavProps {
  items: AnimationMeta[];
}

export function TransitionSectionNav({ items }: TransitionSectionNavProps) {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto pb-1">
      <nav className="flex min-w-max gap-2">
        {items.map((item) => {
          const isActive = isAnimationActive(pathname, item);

          return (
            <Link
              key={item.id}
              href={item.path}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "border-white/25 bg-white/14 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/65 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
