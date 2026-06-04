"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { ChatBar, TypingIndicator, UserMessage, AIMessage, CHAT_SPRING_PRESETS } from "./ChatComponents";

type ChatDemoPhase = "idle" | "input-typing" | "input-holding" | "user" | "typing" | "response";

const demoConversation = {
  userMessage: "What is the current state of US politics?",
  aiResponse: `The current political landscape in the United States is characterized by significant polarization between the two major parties. Key issues dominating the discourse include economic policy, immigration reform, healthcare access, and climate change legislation.`,
};

interface ChatDemoProps {
  className?: string;
}

export function ChatDemo({ className = "" }: ChatDemoProps) {
  const [phase, setPhase] = useState<ChatDemoPhase>("idle");
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const [runCount, setRunCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeRunIdRef = useRef(0);
  const pendingChatbarCompletionRef = useRef<{ runId: number; resolve: () => void } | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });
  const prefersReducedMotion = useReducedMotion();

  const wait = (duration: number) =>
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, duration);
    });

  const startDemo = () => {
    setRunCount((current) => current + 1);
  };

  const handleChatbarTypingComplete = () => {
    const pendingCompletion = pendingChatbarCompletionRef.current;

    if (!pendingCompletion || pendingCompletion.runId !== activeRunIdRef.current) {
      return;
    }

    pendingChatbarCompletionRef.current = null;
    pendingCompletion.resolve();
  };

  useEffect(() => {
    if (!isInView || hasAutoStarted) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setHasAutoStarted(true);
      startDemo();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isInView, hasAutoStarted]);

  useEffect(() => {
    if (runCount === 0) {
      return;
    }

    const runId = runCount;
    activeRunIdRef.current = runId;
    pendingChatbarCompletionRef.current = null;

    if (prefersReducedMotion) {
      const frame = window.requestAnimationFrame(() => {
        if (activeRunIdRef.current === runId) {
          setPhase("response");
        }
      });

      return () => window.cancelAnimationFrame(frame);
    }

    let cancelled = false;
    const isActiveRun = () => !cancelled && activeRunIdRef.current === runId;

    const waitForChatbarCompletion = () =>
      new Promise<void>((resolve) => {
        pendingChatbarCompletionRef.current = { runId, resolve };
      });

    const runSequence = async () => {
      setPhase("idle");
      await wait(300);
      if (!isActiveRun()) return;

      setPhase("input-typing");
      await waitForChatbarCompletion();
      if (!isActiveRun()) return;

      setPhase("input-holding");
      await wait(260);
      if (!isActiveRun()) return;

      setPhase("user");
      await wait(420);
      if (!isActiveRun()) return;

      setPhase("typing");
      await wait(1500);
      if (!isActiveRun()) return;

      setPhase("response");
    };

    runSequence();

    return () => {
      cancelled = true;
      if (pendingChatbarCompletionRef.current?.runId === runId) {
        pendingChatbarCompletionRef.current = null;
      }
    };
  }, [runCount, prefersReducedMotion]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ ...CHAT_SPRING_PRESETS.gentle }}
      className={`h-[515px] w-full max-w-2xl bg-zinc-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative ${className}`}
    >
      {/* Replay button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startDemo}
        className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-zinc-600 text-sm font-medium hover:bg-white transition-colors shadow-sm"
      >
        <RotateCcw className="w-4 h-4" />
        Replay
      </motion.button>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pt-16">
        <div className="space-y-6">
          {/* User Message */}
          <AnimatePresence>
            {(phase === "user" || phase === "typing" || phase === "response") && (
              <UserMessage message={demoConversation.userMessage} />
            )}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {phase === "typing" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pl-4">
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Response */}
          <AnimatePresence>
            {phase === "response" && (
              <AIMessage
                message={demoConversation.aiResponse}
                isTyping={!prefersReducedMotion}
                typingSpeed={10}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ChatBar */}
      <div className="px-4 py-4 bg-zinc-100">
        <ChatBar
          demoState={
            phase === "input-typing" ? "typing" : phase === "input-holding" ? "holding" : "idle"
          }
          demoText={demoConversation.userMessage}
          demoTypingSpeed={20}
          onDemoComplete={handleChatbarTypingComplete}
          onSend={(message) => console.log("Sent:", message)}
        />
      </div>
    </motion.div>
  );
}

export default ChatDemo;
