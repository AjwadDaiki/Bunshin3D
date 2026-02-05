"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  isGenerating: boolean;
};

export default function StudioViewerOverlay({ isGenerating }: Props) {
  const t = useTranslations("Studio");

  return (
    <div className="absolute inset-x-4 top-4 z-30 flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-widest">
      <div className="flex items-center gap-3">
        <span className="rounded-lg border border-white/6 bg-[#0a0a0a] px-3 py-1 text-neutral-300">
          {t("Interface.Viewer.label")}
        </span>
        <span className="rounded-lg border border-white/6 bg-white/5 px-3 py-1 text-neutral-400">
          {t("Interface.Viewer.engine")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-lg border border-white/6 bg-white/5 px-3 py-1 text-neutral-400">
          {t("Interface.Viewer.axis")}
        </span>
        <span
          className={cn(
            "rounded-lg border border-white/6 px-3 py-1",
            isGenerating
              ? "bg-white/10 text-white"
              : "bg-white/5 text-neutral-400",
          )}
        >
          {t("Interface.Viewer.autoRotate")}
        </span>
        <span className="rounded-lg border border-white/6 bg-white/5 px-3 py-1 text-neutral-400">
          {t("Interface.Viewer.shadows")}
        </span>
      </div>
    </div>
  );
}
