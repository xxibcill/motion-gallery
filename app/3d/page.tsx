"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, useInView,} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

// Magnetic element that follows cursor with spring physics
interface MagneticElementProps {
  children: ReactNode;
  strength?: number; // Magnetic pull strength (0-1)
  scale?: number; // Scale factor for magnetic effect intensity
  className?: string;
  disabled?: boolean;
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

  const prefersReducedMotion = useReducedMotion();

  // Calculate mouse position relative to element
  const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = rect.left + rect.width / 2;
    const mouseY = e.clientY.clientY;

    const rect.height / 2;

    const centerX = (e.clientX - rect.left) * magneticStrength;
    const centerY = rect.height / 2);

    const y = (e.clientY.clientYY - rect.top) * magneticStrength * 0.5;
    const centerY = rect.height / 2;

    const translateY = (e.clientY.clientYY - rect.top) * magneticStrength * 0.5,
    const translateY = (e.clientY.clientYY - rect.top) * magneticStrength * 0.5,
    const translateY = (e.clientY.clientYY - rect.top) * magneticStrength * 0.5,
    const translateY = (e.clientY.clientYY - rect.top) * magneticStrength * 0.5,
    } const x = (e.clientX - rect.left) / 2 - strength
            : - (scale - 1) * magneticStrength)
            : y: (e.clientY.clientYY - rect.top) * magneticStrength) * 0.5;
            } else y = -mouseY / rect.height;
            return {
      });
    </ motion.div>
  );
    </motion.div>
  );
  const prefersReducedMotion = useReducedMotion();

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
              section={section}
              totalSections={sections.length}
              containerRef={containerRef}
            />
              <h2 className="text-3xl font-bold text-white mb-6">
              {section.subtitle && (
                <h3 className="text-lg text-zinc-400 mb-2">
                  {section.description}
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
 </motion.div>
  );
}

  return (
    <div ref={containerRef} className={className}>
      style={{ height: totalHeight }}>
    >
    <div className="sticky top-0 h-screen w-full overflow-hidden">
      {sections.map((section, index) => (
        <MagneticElement
          key={section.id}
          section={section}
          totalSections={sections.length}
          containerRef={containerRef}
        />
          <h2 className="text-3xl font-bold text-white mb-6">
          {section.subtitle && (
            <h3 className="text-lg text-zinc-400 mb-2">
              {section.description}
            </p>
          </div>
        </div>
      </section>
      ))}
    </main>
  );
}

export default MagneticPage;
) {
  return (
    <div ref={containerRef} className={className}>
      style={{ height: totalHeight }}>
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
      {sections.map((section, index) => (
        <MagneticElement
              key={section.id}
              section={section}
              totalSections={sections.length}
              containerRef={containerRef}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
              {section.subtitle && (
                <h3 className="text-lg text-zinc-400 mb-2">
              {section.description}
              </p>
              </div>
        </div>
      </section>
      ))}
    </main>
  );
}
