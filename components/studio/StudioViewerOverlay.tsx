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
        <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-gray-300">
          {t("Interface.Viewer.label")}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-400">
          {t("Interface.Viewer.engine")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-400">
          {t("Interface.Viewer.axis")}
        </span>
        <span
          className={cn(
            "rounded-full border border-white/10 px-3 py-1",
            isGenerating
              ? "bg-brand-primary/20 text-brand-primary"
              : "bg-white/5 text-gray-400",
          )}
        >
          {t("Interface.Viewer.autoRotate")}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-400">
          {t("Interface.Viewer.shadows")}
        </span>
      </div>
    </div>
  );
}
