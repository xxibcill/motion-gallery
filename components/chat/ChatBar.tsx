"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Plus, Mic, ArrowUp } from "lucide-react";
import { springPresets } from "@/lib/animation-presets";

interface ChatBarProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  isTyping?: boolean;
  className?: string;
}

export function ChatBar({
  placeholder = "Do a deep-dive research in crypto today",
  onSend,
  isTyping = false,
  className = "",
}: ChatBarProps) {
  const [value, setValue] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (value.trim() && onSend) {
      onSend(value);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...springPresets.gentle }}
      className={`bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 ${className}`}
    >
      {/* Add Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 transition-colors"
      >
        <Plus className="w-4 h-4" />
      </motion.button>

      {/* Input Field */}
      <div className="flex-1 relative">
        <div className="relative flex items-center">
          <AnimatePresence mode="wait">
            {value === "" && !isTyping && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute text-zinc-400 pointer-events-none text-sm"
              >
                {placeholder}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Typing animation placeholder */}
          <AnimatePresence>
            {isTyping && value === "" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <span className="text-zinc-800 text-sm">{placeholder}</span>
                <motion.span
                  animate={{ opacity: cursorVisible ? 1 : 0 }}
                  className="w-0.5 h-4 bg-zinc-800 ml-0.5"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400 relative z-10"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 transition-colors"
        >
          <Mic className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-zinc-800 transition-colors"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
