export const maskRevealCode = `// Mask reveal wrapper with direction support
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface MaskRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
}

function MaskReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.8,
}: MaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  const getInitialMask = () => {
    switch (direction) {
      case "up": return "inset(100% 0 0 0)";
      case "down": return "inset(0 0 100% 0)";
      case "left": return "inset(0 100% 0 0)";
      case "right": return "inset(0 0 0 100%)";
    }
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={\`relative overflow-hidden \${className}\`}>
      <motion.div
        initial={{ clipPath: getInitialMask() }}
        animate={isInView ? { clipPath: "inset(0 0 0 0)" } : {}}
        transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </div>
  );
}`;

export const circleRevealCode = `// Circle mask reveal for images
function CircleReveal({ src, alt, className = "" }: CircleRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={className}>
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div ref={ref} className={\`relative overflow-hidden \${className}\`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={isInView ? { clipPath: "circle(100% at 50% 50%)" } : {}}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  );
}`;

export const gridRevealCode = `// Staggered grid reveal animation
function GridReveal({
  items,
  columns = 3,
  staggerDelay = 0.1,
}: GridRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="grid gap-4"
      style={{ gridTemplateColumns: \`repeat(\${columns}, 1fr)\` }}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          className={item.className}
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: prefersReducedMotion ? 0 : i * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {item.content}
        </motion.div>
      ))}
    </div>
  );
}`;
