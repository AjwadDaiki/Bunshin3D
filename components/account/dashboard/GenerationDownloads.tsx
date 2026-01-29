"use client";

import { Aperture, Cube, DownloadSimple, SpinnerGap, CircleNotch } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useModelDownload, type DownloadFormat } from "@/hooks/useModelDownload";
import { cn } from "@/lib/utils";

type Props = {
  modelUrl?: string;
  status: string;
};

type FormatConfig = {
  format: DownloadFormat;
  icon: typeof DownloadSimple;
  titleKey: string;
  labelKey: string;
  idleClass: string;
  activeClass: string;
};

export default function GenerationDownloads({
  modelUrl,
  status,
}: Props) {
  const t = useTranslations("Account");
  const tCommon = useTranslations("Common");
  const { downloadModel, isDownloading, downloadFormat } = useModelDownload({
    onError: (err) => console.error(tCommon("errors.downloadErrorLog"), err),
  });

  const formats: FormatConfig[] = [
    {
      format: "glb",
      icon: DownloadSimple,
      titleKey: "History.downloadTitles.glb",
      labelKey: "History.formatLabels.glb",
      idleClass: "bg-surface-3 hover:bg-white/10 text-white border-white/10",
      activeClass: "bg-brand-primary text-white border-brand-primary",
    },
    {
      format: "obj",
      icon: Cube,
      titleKey: "History.downloadTitles.obj",
      labelKey: "History.formatLabels.obj",
      idleClass: "bg-surface-3 hover:bg-white/10 text-white border-white/10",
      activeClass: "bg-brand-primary text-white border-brand-primary",
    },
    {
      format: "usdz",
      icon: Aperture,
      titleKey: "History.downloadTitles.usdz",
      labelKey: "History.formatLabels.usdz",
      idleClass: "bg-surface-3 hover:bg-white/10 text-white border-white/10",
      activeClass: "bg-brand-primary text-white border-brand-primary",
    },
    {
      format: "stl",
      icon: DownloadSimple,
      titleKey: "History.downloadTitles.stl",
      labelKey: "History.formatLabels.stl",
      idleClass: "bg-brand-primary hover:bg-brand-secondary text-white border-transparent",
      activeClass: "bg-brand-primary text-white border-brand-primary",
    },
  ];

  const isProcessing = status === "processing";

  if (!modelUrl) {
    return (
      <div className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-800 text-zinc-500 text-xs font-medium rounded-lg">
        <SpinnerGap className="w-3 h-3 animate-spin" weight="bold" />
        {isProcessing ? tCommon("processing") : tCommon("pending")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {formats.map(({ format, icon: Icon, titleKey, labelKey, idleClass, activeClass }) => {
        const isActive = isDownloading && downloadFormat === format;
        return (
          <button
            key={format}
            onClick={() => downloadModel(modelUrl, format)}
            disabled={isDownloading}
            className={cn(
              "flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg transition-smooth border",
              isActive ? activeClass : idleClass,
            )}
            title={t(titleKey)}
          >
            {isActive ? (
              <CircleNotch className="w-3 h-3 animate-spin" weight="bold" />
            ) : (
              <Icon className="w-3 h-3" weight="bold" />
            )}
            {t(labelKey)}
          </button>
        );
      })}
    </div>
  );
}
