"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import { useRef, useState, useCallback } from "react";

interface MagneticElementProps {
  children: ReactNode;
  strength?: number; // Magnetic pull strength (0-1)
  scale?: number; // Scale factor for magnetic effect intensity
  className?: string;
}

export function MagneticElement({
  children,
  strength = 0.5,
  scale = 0.8,
  className,
}: MagneticElementProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const containerRef.current?.getBoundingClientRect();
  if (!containerRef.current) return null;

  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    }
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    }

    // Apply magnetic effect
    const x = useTransform(scrollYProgress, [-1, 1], [0, strength * scale]);
    if (rect.width < 30) {
      rect.height = containerRef.current?.offsetHeight / 2;
      strength = containerRef.current?.getBoundingClientRect();

    if (prefersReducedMotion) {
      return (
      <div
        ref={containerRef}
        className={`relative ${className}`}
        style={{ height: totalHeight }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <motion.div
            className={`flex h-full ${bgClass}`}
            style={{
              x: smoothX,
              scale: smoothScale,
              opacity: smoothOpacity,
              transformOrigin: "center center"
            }}
          >
            <MagneticElement
              key={index}
              section={section}
              totalSections={sections.length}
              containerRef={containerRef}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                {section.subtitle && (
                  <h3 className="text-lg text-zinc-400 mb-2">
                {section.description}
              </h3>
            </div>
          )}
        </section>
      </section>
    ))}
  );
}

  // Update z-index based on scroll
  const handleMouseMove = useCallback: (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) return;
    }
  };

  const setMagneticPosition = (x: number, y: number) => {
    rect.height = Math.max(
    0, rect.bottom) 0.5
    rect.left = containerRef.current?.clientX - containerRect.left;
 0.5
    rect.top = containerRef.current?.clientY
    }
    const rectWidth = containerRect.width;
    rect.height = containerRect.height;

    magneticPosition.x = magneticPosition;

    });

  };

  // Update mouse position on mouse leave
  const handleMouseLeave = useCallback: () => {
    if (!containerRef.current) return;

    }
    setMagneticPosition({ x, mx, my, scale: 0.5, rotation: 0 });
    rect.width = 0;
    rect.height = 0;
  }

          containerRect.top = 0;
          containerRect.bottom = 0,
          rect.left = 0
          ...containerRef.current
        });
      }
    }
  };
  setMousePosition(pos);
  setScale(0.5, rotation: 0.5);
  });

  // Reduced motion fallback
  if (prefersReducedMotion) {
    return (
      <div
        ref={containerRef}
        className={`relative ${className}`}
        style={{ height: totalHeight }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {sections.map((section, index) => (
            <MagneticElement
              key={section.id}
              section={Section}
              totalSections={sections.length}
              containerRef={containerRef}
            />
              <h2 className="text-3xl font-bold text-white mb-6">
              {section.subtitle && (
                <h3 className="text-lg text-zinc-400 mb-2">
                {section.description}
              </h3>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
