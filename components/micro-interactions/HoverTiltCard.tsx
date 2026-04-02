"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface HoverTiltCardProps {
  tilt?: number;
  glare?: number;
  title?: string;
  description?: string;
  price?: string;
}

export function HoverTiltCard({
  tilt = 10,
  glare = 0.55,
  title = "Studio Headphones",
  description = "Restrained depth, a passing sheen, and layered content that still reads like a product card instead of a demo trick.",
  price = "$248",
}: HoverTiltCardProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [surface, setSurface] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 40, active: false });

  return (
    <div className="perspective-[1200px]">
      <motion.article
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))] p-6 shadow-[0_36px_80px_-42px_rgba(2,6,23,0.96)]"
        initial={false}
        animate={{
          rotateX: prefersReducedMotion ? 0 : surface.rotateX,
          rotateY: prefersReducedMotion ? 0 : surface.rotateY,
          y: surface.active && !prefersReducedMotion ? -4 : 0,
        }}
        transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.7 }}
        style={{ transformStyle: "preserve-3d" }}
        onPointerMove={(event) => {
          if (prefersReducedMotion || event.pointerType === "touch") {
            return;
          }

          const rect = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = (event.clientY - rect.top) / rect.height;
          setSurface({
            rotateX: (0.5 - y) * tilt,
            rotateY: (x - 0.5) * tilt,
            glowX: x * 100,
            glowY: y * 100,
            active: true,
          });
        }}
        onPointerLeave={() =>
          setSurface({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 40, active: false })
        }
        onPointerEnter={() => setSurface((value) => ({ ...value, active: true }))}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_34%)]" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-90"
          initial={false}
          animate={{
            opacity: prefersReducedMotion ? 0.3 : surface.active ? 0.92 : 0.5,
          }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: `radial-gradient(circle at ${surface.glowX}% ${surface.glowY}%, rgba(255,255,255,${glare * 0.42}), transparent 28%), linear-gradient(135deg, rgba(56,189,248,${glare * 0.25}), transparent 42%)`,
          }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-20%] opacity-70"
          initial={false}
          animate={{
            x: prefersReducedMotion ? 0 : surface.active ? "18%" : "-16%",
            opacity: surface.active ? 0.75 : 0.32,
          }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background:
              "linear-gradient(110deg, transparent 26%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.48) 50%, rgba(255,255,255,0.1) 60%, transparent 74%)",
            transform: "rotate(-6deg)",
          }}
        />

        <div className="relative flex min-h-[26rem] flex-col justify-between" style={{ transformStyle: "preserve-3d" }}>
          <div className="flex items-start justify-between gap-4" style={{ transform: "translateZ(42px)" }}>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-sky-200/70">Product Card</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">{title}</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-zinc-100">
              {price}
            </span>
          </div>

          <div
            className="relative mx-auto mt-8 flex h-48 w-48 items-center justify-center rounded-[2.4rem] border border-white/10 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.28),rgba(56,189,248,0.16),rgba(15,23,42,0.3)_70%)]"
            style={{ transform: "translateZ(56px)" }}
          >
            <div className="h-28 w-28 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.88),rgba(148,163,184,0.7)_44%,rgba(15,23,42,0.86)_76%)] shadow-[inset_0_-18px_32px_rgba(15,23,42,0.5),0_24px_48px_-24px_rgba(125,211,252,0.5)]" />
          </div>

          <div className="grid gap-5" style={{ transform: "translateZ(36px)" }}>
            <p className="max-w-[34ch] text-sm leading-6 text-zinc-300">{description}</p>
            <div className="grid grid-cols-3 gap-3 text-left text-sm text-zinc-300">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Clamp</p>
                <p className="mt-2 text-white">Bounded tilt</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Depth</p>
                <p className="mt-2 text-white">Layered content</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Fallback</p>
                <p className="mt-2 text-white">Static spotlight</p>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
