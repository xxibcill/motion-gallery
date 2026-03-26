"use client";

import { useState, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { motion, AnimatePresence } from "motion/react";

interface CodePanelProps {
  code: string;
  language?: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CodePanel({
  code,
  language = "typescript",
  title,
  isOpen,
  onClose,
}: CodePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-zinc-900 border-l border-zinc-800 z-50 overflow-hidden flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                {title && (
                  <span className="text-zinc-400 text-sm font-mono">{title}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-sm rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Code */}
            <div className="flex-1 overflow-auto p-4">
              <Highlight theme={themes.nightOwl} code={code} language={language}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre
                    className={`${className} text-sm`}
                    style={{ ...style, background: "transparent" }}
                  >
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })} className="table-row">
                        <span className="table-cell text-zinc-600 pr-4 select-none text-right w-8">
                          {i + 1}
                        </span>
                        <span className="table-cell">
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </span>
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Toggle button to open code panel
interface CodeToggleProps {
  onClick: () => void;
  hasCode?: boolean;
}

export function CodeToggle({ onClick, hasCode = true }: CodeToggleProps) {
  if (!hasCode) return null;

  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 p-4 bg-zinc-800 hover:bg-zinc-700 rounded-full shadow-lg border border-zinc-700 text-zinc-300 hover:text-white transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    </motion.button>
  );
}
