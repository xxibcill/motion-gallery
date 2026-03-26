"use client";

import { startTransition, useState } from "react";

export function useTransitionDemo<T extends string>(initialValue: T) {
  const [activeValue, setActiveValue] = useState<T>(initialValue);
  const [replayKey, setReplayKey] = useState(0);

  function selectValue(nextValue: T) {
    startTransition(() => {
      setActiveValue(nextValue);
      setReplayKey((value) => value + 1);
    });
  }

  function replay() {
    startTransition(() => {
      setReplayKey((value) => value + 1);
    });
  }

  return {
    activeValue,
    replayKey,
    selectValue,
    replay,
  };
}
