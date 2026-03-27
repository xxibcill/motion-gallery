"use client";

import { memo, useMemo } from "react";
import { Shard } from "./Shard";
import { generateShards, type ShardConfig } from "./dimensional-rift-presets";

interface RealityFractureProps {
  shardCount: number;
  palette: {
    shard: string;
    glow: string;
  };
  phase: "idle" | "fracture" | "void" | "tunnel" | "reassembly";
  prefersReducedMotion: boolean;
}

function RealityFractureComponent({
  shardCount,
  palette,
  phase,
  prefersReducedMotion,
}: RealityFractureProps) {
  const shards = useMemo(() => generateShards(shardCount), [shardCount]);
  const cols = Math.ceil(Math.sqrt(shardCount));
  const rows = Math.ceil(shardCount / cols);

  const isActive = phase === "fracture" || phase === "void";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        perspective: "1600px",
        transformStyle: "preserve-3d",
      }}
    >
      {shards.map((shard) => (
        <Shard
          key={shard.id}
          config={shard}
          gridCols={cols}
          gridRows={rows}
          palette={palette}
          phase={phase}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}

      {/* Fracture lines overlay */}
      {isActive && !prefersReducedMotion && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              linear-gradient(45deg, transparent 48%, ${palette.glow} 49%, ${palette.glow} 51%, transparent 52%),
              linear-gradient(-45deg, transparent 48%, ${palette.glow} 49%, ${palette.glow} 51%, transparent 52%)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      )}
    </div>
  );
}

export const RealityFracture = memo(RealityFractureComponent);
