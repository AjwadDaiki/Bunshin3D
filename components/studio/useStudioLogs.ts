"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LogEntry } from "./types";

type LogType = "info" | "success" | "error";

export function useStudioLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = useCallback((message: string, type: LogType = "info") => {
    setLogs((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), message, type, timestamp: new Date() },
    ]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    logs,
    addLog,
    clearLogs,
    logsContainerRef,
  };
}
