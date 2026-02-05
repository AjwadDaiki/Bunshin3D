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
      idleClass: "bg-[#191919] border-white/6 hover:border-white/10 text-white",
      activeClass: "bg-blue-600 text-white border-blue-600",
    },
    {
      format: "obj",
      icon: Cube,
      titleKey: "History.downloadTitles.obj",
      labelKey: "History.formatLabels.obj",
      idleClass: "bg-[#191919] border-white/6 hover:border-white/10 text-white",
      activeClass: "bg-blue-600 text-white border-blue-600",
    },
    {
      format: "usdz",
      icon: Aperture,
      titleKey: "History.downloadTitles.usdz",
      labelKey: "History.formatLabels.usdz",
      idleClass: "bg-[#191919] border-white/6 hover:border-white/10 text-white",
      activeClass: "bg-blue-600 text-white border-blue-600",
    },
    {
      format: "stl",
      icon: DownloadSimple,
      titleKey: "History.downloadTitles.stl",
      labelKey: "History.formatLabels.stl",
      idleClass: "bg-white text-neutral-950 border-transparent hover:bg-neutral-200",
      activeClass: "bg-blue-600 text-white border-blue-600",
    },
  ];

  const isProcessing = status === "processing";

  if (!modelUrl) {
    return (
      <div className="flex items-center justify-center gap-2 w-full py-2 bg-[#191919] text-neutral-500 text-xs font-medium rounded-lg">
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
              "flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg transition-colors border",
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
