"use client";

import { motion, AnimatePresence } from "motion/react";
import type { SpringOptions } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Plus, Mic, ArrowUp } from "lucide-react";

// Self-contained spring presets
export const CHAT_SPRING_PRESETS = {
  gentle: { stiffness: 200, damping: 25, mass: 1 } as SpringOptions,
  snappy: { stiffness: 300, damping: 30, mass: 0.8 } as SpringOptions,
};

type ChatBarDemoState = "idle" | "typing" | "holding" | "deleting";

// ============================================
// ChatBar
// ============================================

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
  placeholder = "Ask anything...",
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

  useEffect(() => {
    onDemoCompleteRef.current = onDemoComplete;
  }, [onDemoComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    demoRunIdRef.current += 1;
    const currentRunId = demoRunIdRef.current;

    const updateDemoTextOnFrame = (nextText: string) => {
      const frameId = window.requestAnimationFrame(() => {
        if (demoRunIdRef.current === currentRunId) {
          setDemoDisplayText(nextText);
        }
      });

      return () => window.cancelAnimationFrame(frameId);
    };

    if (value !== "") {
      return;
    }

    if (demoState === "idle") {
      return updateDemoTextOnFrame("");
    }

    if (demoState === "holding") {
      return updateDemoTextOnFrame(demoText);
    }

    if (demoState === "deleting") {
      if (!demoText) {
        return updateDemoTextOnFrame("");
      }

      let currentLength = demoText.length;
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      const resetFrameId = window.requestAnimationFrame(() => {
        if (demoRunIdRef.current === currentRunId) {
          setDemoDisplayText(demoText);
        }
      });

      const deleteNextChar = () => {
        if (demoRunIdRef.current !== currentRunId) {
          return;
        }

        currentLength -= 1;
        setDemoDisplayText(demoText.slice(0, currentLength));

        if (currentLength > 0) {
          timeoutId = setTimeout(deleteNextChar, demoTypingSpeed);
          return;
        }

        onDemoCompleteRef.current?.();
      };

      timeoutId = setTimeout(deleteNextChar, demoTypingSpeed);

      return () => {
        window.cancelAnimationFrame(resetFrameId);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }

    if (!demoText) {
      return updateDemoTextOnFrame("");
    }

    let currentIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const resetFrameId = window.requestAnimationFrame(() => {
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
      window.cancelAnimationFrame(resetFrameId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [demoState, demoText, demoTypingSpeed, value]);

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
      transition={{ ...CHAT_SPRING_PRESETS.gentle }}
      className={`bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 ${className}`}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 transition-colors"
      >
        <Plus className="w-4 h-4" />
      </motion.button>

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

          {isDemoVisible && (
            <div className="pointer-events-none absolute inset-0 flex items-center">
              <div className="inline-flex items-center pr-1">
                <span className="text-zinc-800 text-sm">{demoDisplayText}</span>
                {(demoState === "typing" || demoState === "deleting") && (
                  <motion.span
                    animate={{ opacity: cursorVisible ? 1 : 0 }}
                    transition={{ duration: 0.1 }}
                    className="w-0.5 h-4 bg-zinc-800 ml-0.5 flex-shrink-0"
                  />
                )}
              </div>
            </div>
          )}

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

// ============================================
// TypingIndicator
// ============================================

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
      transition={{ ...CHAT_SPRING_PRESETS.gentle }}
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

// ============================================
// UserMessage
// ============================================

interface UserMessageProps {
  message: string;
  className?: string;
}

export function UserMessage({ message, className = "" }: UserMessageProps) {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      transition={{ ...CHAT_SPRING_PRESETS.snappy }}
      className={`flex justify-end ${className}`}
    >
      <motion.div
        className="bg-zinc-900 text-white px-4 py-2.5 rounded-2xl text-sm font-medium max-w-[80%]"
        whileHover={{ scale: 1.02 }}
      >
        {message}
      </motion.div>
    </motion.div>
  );
}

// ============================================
// AIMessage
// ============================================

interface AIMessageProps {
  message: string;
  subheader?: string;
  isTyping?: boolean;
  typingSpeed?: number;
  onTypingComplete?: () => void;
  className?: string;
}

export function AIMessage({
  message,
  subheader = "AI Assistant",
  isTyping = false,
  typingSpeed = 30,
  onTypingComplete,
  className = "",
}: AIMessageProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let frameId: ReturnType<typeof window.requestAnimationFrame> | undefined;

    if (!isTyping) {
      frameId = window.requestAnimationFrame(() => {
        setDisplayedText(message);
        setIsComplete(true);
      });

      return () => {
        if (frameId) {
          window.cancelAnimationFrame(frameId);
        }
      };
    }

    frameId = window.requestAnimationFrame(() => {
      setDisplayedText("");
      setIsComplete(false);
    });

    let currentIndex = 0;

    const typeNextChar = () => {
      if (currentIndex < message.length) {
        setDisplayedText(message.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsComplete(true);
        onTypingComplete?.();
      }
    };

    timeoutRef.current = setTimeout(typeNextChar, typingSpeed);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, isTyping, typingSpeed, onTypingComplete]);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ...CHAT_SPRING_PRESETS.gentle }}
      className={`flex flex-col gap-1 ${className}`}
    >
      <span className="text-xs text-zinc-500">{subheader}</span>
      <div className="text-sm text-zinc-800 leading-relaxed">
        {displayedText}
        {isTyping && !isComplete && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-0.5 h-4 bg-zinc-800 ml-0.5 align-middle"
          />
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// ChatContainer
// ============================================

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ChatContainer({ children, className = "" }: ChatContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col gap-4 ${className}`}
    >
      {children}
    </motion.div>
  );
}
