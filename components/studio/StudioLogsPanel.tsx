"use client";

import { FileCode } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { LogEntry } from "./types";

type Props = {
  logs: LogEntry[];
  isGenerating: boolean;
  logsContainerRef: React.RefObject<HTMLDivElement | null>;
};

export default function StudioLogsPanel({
  logs,
  isGenerating,
  logsContainerRef,
}: Props) {
  const t = useTranslations("Studio");

  return (
    <div className="glass-card p-4 rounded-2xl bg-black/40 border-white/5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              isGenerating ? "bg-green-400 animate-pulse" : "bg-gray-600",
            )}
          />
          {t("Logs.title")}
        </h3>
        <span className="text-[11px] text-gray-500 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
          {logs.length}
        </span>
      </div>
      <div
        ref={logsContainerRef}
        className="h-48 overflow-y-auto space-y-2 font-mono text-xs pr-2 scrollbar-thin scrollbar-thumb-white/10 scroll-smooth"
      >
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-700">
            <FileCode className="h-8 w-8 mb-2 opacity-50" weight="duotone" />
            <p>{t("Interface.Viewer.readyToGenerate")}</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={cn(
                "flex gap-2",
                log.type === "success"
                  ? "text-green-400"
                  : log.type === "error"
                    ? "text-red-400"
                    : "text-gray-400",
              )}
            >
              <span className="opacity-50">
                [
                {log.timestamp.toLocaleTimeString([], {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
                ]
              </span>
              <span>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
