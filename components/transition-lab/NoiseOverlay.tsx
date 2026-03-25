"use client";

interface NoiseOverlayProps {
  className?: string;
  opacity?: number;
}

export function NoiseOverlay({
  className = "",
  opacity = 0.14,
}: NoiseOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 mix-blend-soft-light ${className}`}
      style={{
        opacity,
        backgroundImage: `
          linear-gradient(0deg, rgba(255,255,255,0.05) 50%, transparent 50%),
          linear-gradient(90deg, rgba(255,255,255,0.03) 50%, transparent 50%)
        `,
        backgroundSize: "3px 3px, 5px 5px",
      }}
    />
  );
}
