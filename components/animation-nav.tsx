"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllAnimations } from "@/lib/animation-registry";

const colorClasses: Record<string, string> = {
  zinc: "text-zinc-400 hover:text-zinc-300",
  slate: "text-slate-400 hover:text-slate-300",
  indigo: "text-indigo-400 hover:text-indigo-300",
  violet: "text-violet-400 hover:text-violet-300",
  fuchsia: "text-fuchsia-400 hover:text-fuchsia-300",
  emerald: "text-emerald-400 hover:text-emerald-300",
  rose: "text-rose-400 hover:text-rose-300",
  amber: "text-amber-400 hover:text-amber-300",
  cyan: "text-cyan-400 hover:text-cyan-300",
};

const activeColorClasses: Record<string, string> = {
  zinc: "text-zinc-200",
  slate: "text-slate-200",
  indigo: "text-indigo-200",
  violet: "text-violet-200",
  fuchsia: "text-fuchsia-200",
  emerald: "text-emerald-200",
  rose: "text-rose-200",
  amber: "text-amber-200",
  cyan: "text-cyan-200",
};

export function AnimationNav() {
  const pathname = usePathname();
  const animations = getAllAnimations();

  return (
    <nav className="fixed top-6 left-6 z-50 flex flex-col gap-1">
      {animations.map((animation) => {
        const isActive = pathname === `/${animation.id}` ||
          (animation.id === "home" && pathname === "/");
        const colorClass = colorClasses[animation.color] || colorClasses.zinc;
        const activeClass = activeColorClasses[animation.color] || activeColorClasses.zinc;

        return (
          <Link
            key={animation.id}
            href={animation.id === "home" ? "/" : `/${animation.id}`}
            className={`${isActive ? activeClass : colorClass} transition-colors`}
          >
            {animation.title}
          </Link>
        );
      })}
    </nav>
  );
}
