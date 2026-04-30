"use client";

import { useEffect, useState, useCallback } from "react";

export function useExitIntent(options: { delay?: number; once?: boolean } = {}) {
  const { delay = 3000, once = true } = options;
  const [triggered, setTriggered] = useState(false);
  const [ready, setReady] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (!ready) return;
      if (once && triggered) return;

      if (e.clientY <= 0) {
        setTriggered(true);
      }
    },
    [ready, once, triggered],
  );

  useEffect(() => {
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [handleMouseLeave]);

  const reset = useCallback(() => setTriggered(false), []);

  return { triggered, reset };
}
