"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Plus, Mic, ArrowUp } from "lucide-react";
import { springPresets } from "@/lib/animation-presets";

type ChatBarDemoState = "idle" | "typing" | "holding";

interface ChatBarProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  demoState?: ChatBarDemoState;
  demoText?: string;
  demoTypingSpeed?: number;
  onDemoComplete?: () => void;
  className?: string;
}

export function ChatBar({
  placeholder = "Do a deep-dive research in crypto today",
  onSend,
  demoState = "idle",
  demoText = "",
  demoTypingSpeed = 50,
  onDemoComplete,
  className = "",
}: ChatBarProps) {
  const [value, setValue] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [demoDisplayText, setDemoDisplayText] = useState("");
  const onDemoCompleteRef = useRef(onDemoComplete);
  const demoRunIdRef = useRef(0);
  const demoViewportRef = useRef<HTMLDivElement>(null);

  // Keep ref updated
  useEffect(() => {
    onDemoCompleteRef.current = onDemoComplete;
  }, [onDemoComplete]);

  // Blinking cursor animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Demo typing is driven by explicit visual states so the parent can keep
  // the fully-typed message visible before advancing the sequence.
  useEffect(() => {
    demoRunIdRef.current += 1;
    const currentRunId = demoRunIdRef.current;

    if (value !== "") {
      return;
    }

    if (demoState === "idle") {
      const idleFrameId = window.requestAnimationFrame(() => {
        if (demoRunIdRef.current === currentRunId) {
          setDemoDisplayText("");
        }
      });
      return () => window.cancelAnimationFrame(idleFrameId);
    }

    if (demoState === "holding") {
      const holdingFrameId = window.requestAnimationFrame(() => {
        if (demoRunIdRef.current === currentRunId) {
          setDemoDisplayText(demoText);
        }
      });
      return () => window.cancelAnimationFrame(holdingFrameId);
    }

    if (!demoText) {
      const emptyFrameId = window.requestAnimationFrame(() => {
        if (demoRunIdRef.current === currentRunId) {
          setDemoDisplayText("");
        }
      });
      return () => window.cancelAnimationFrame(emptyFrameId);
    }

    let currentIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const typingFrameId = window.requestAnimationFrame(() => {
      if (demoRunIdRef.current === currentRunId) {
        setDemoDisplayText("");
      }
    });

    const typeNextChar = () => {
      if (demoRunIdRef.current !== currentRunId) {
        return;
      }

      const nextIndex = currentIndex + 1;
      setDemoDisplayText(demoText.slice(0, nextIndex));
      currentIndex = nextIndex;

      if (nextIndex < demoText.length) {
        timeoutId = setTimeout(typeNextChar, demoTypingSpeed);
        return;
      }

      onDemoCompleteRef.current?.();
    };

    timeoutId = setTimeout(typeNextChar, demoTypingSpeed);

    return () => {
      window.cancelAnimationFrame(typingFrameId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [demoState, demoText, demoTypingSpeed, value]);

  useEffect(() => {
    if (value !== "" || demoState === "idle") {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const viewport = demoViewportRef.current;

      if (!viewport) {
        return;
      }

      viewport.scrollLeft = viewport.scrollWidth;
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [demoDisplayText, demoState, value]);

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

  const isDemoVisible = value === "" && demoState !== "idle";

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
            {value === "" && demoState === "idle" && (
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

          {/* Demo typing / hold state */}
          <AnimatePresence mode="wait">
            {isDemoVisible && (
              <motion.div
                key={demoState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 flex items-center"
              >
                <div
                  ref={demoViewportRef}
                  className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  <div className="inline-flex items-center pr-1">
                    <span className="text-zinc-800 text-sm">{demoDisplayText}</span>
                    {demoState === "typing" && (
                      <motion.span
                        animate={{ opacity: cursorVisible ? 1 : 0 }}
                        transition={{ duration: 0.1 }}
                        className="w-0.5 h-4 bg-zinc-800 ml-0.5 flex-shrink-0"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={isDemoVisible}
            className={`w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 relative z-10 ${
              isDemoVisible ? "text-transparent caret-transparent" : "text-zinc-800"
            }`}
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
