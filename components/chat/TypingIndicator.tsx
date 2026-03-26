"use client";

import { motion } from "motion/react";
import { springPresets, staggerPresets } from "@/lib/animation-presets";

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className = "" }: TypingIndicatorProps) {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -4 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ ...springPresets.gentle }}
      className={`flex items-center gap-1.5 ${className}`}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.15,
            ease: "easeInOut",
          }}
          className="w-2 h-2 rounded-full bg-zinc-400"
        />
      ))}
    </motion.div>
  );
}
