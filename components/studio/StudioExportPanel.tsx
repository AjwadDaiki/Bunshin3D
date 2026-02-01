"use client";

import { Aperture, CircleNotch, Cube, DownloadSimple } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { BunshinLogo } from "@/components/ui/BunshinLogo";
import { DownloadFormat } from "@/hooks/useModelDownload";
import StudioExportFormats from "./StudioExportFormats";

type Props = {
  modelUrl: string | null;
  isDownloading: boolean;
  downloadFormat: DownloadFormat | null;
  onDownload: (format: DownloadFormat) => void;
};

export default function StudioExportPanel({
  modelUrl,
  isDownloading,
  downloadFormat,
  onDownload,
}: Props) {
  const t = useTranslations("Studio");

  if (!modelUrl) return null;

  return (
    <div className="glass-card p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
          {t("Interface.Export.title")}
        </h2>
      </div>

      <StudioExportFormats />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-bold text-white text-xl flex items-center gap-2 mb-1">
            <BunshinLogo className="h-6 w-6 text-green-400" />
            {t("Interface.Export.readyTitle")}
          </h3>
          <p className="text-gray-400 text-sm">{t("Interface.Export.subtitle")}</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center md:justify-end">
          <button
            onClick={() => onDownload("glb")}
            disabled={isDownloading}
            className={cn(
              "px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm border",
              isDownloading && downloadFormat === "glb"
                ? "bg-brand-primary border-brand-primary text-white"
                : "bg-surface-3 hover:bg-surface-1 border-white/10 text-gray-300",
            )}
          >
            {isDownloading && downloadFormat === "glb" ? (
              <CircleNotch className="h-4 w-4 animate-spin" />
            ) : (
              <DownloadSimple className="h-4 w-4" weight="bold" />
            )}
            {t("Interface.Export.labels.glb")}
            <span className="opacity-50 text-xs font-normal hidden sm:inline">
              ({t("Interface.Export.labels.web")})
            </span>
          </button>

          <button
            onClick={() => onDownload("obj")}
            disabled={isDownloading}
            className={cn(
              "px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm border",
              isDownloading && downloadFormat === "obj"
                ? "bg-brand-primary border-brand-primary text-white"
                : "bg-surface-3 hover:bg-surface-1 border-white/10 text-gray-300",
            )}
          >
            {isDownloading && downloadFormat === "obj" ? (
              <CircleNotch className="h-4 w-4 animate-spin" />
            ) : (
              <Cube className="h-4 w-4" weight="fill" />
            )}
            {t("Interface.Export.labels.obj")}
            <span className="opacity-50 text-xs font-normal hidden sm:inline">
              ({t("Interface.Export.labels.universal")})
            </span>
          </button>

          <button
            onClick={() => onDownload("usdz")}
            disabled={isDownloading}
            className={cn(
              "px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm border",
              isDownloading && downloadFormat === "usdz"
                ? "bg-brand-primary border-brand-primary text-white"
                : "bg-surface-3 hover:bg-surface-1 border-white/10 text-gray-300",
            )}
          >
            {isDownloading && downloadFormat === "usdz" ? (
              <CircleNotch className="h-4 w-4 animate-spin" />
            ) : (
              <Aperture className="h-4 w-4" weight="fill" />
            )}
            {t("Interface.Export.labels.usdz")}
            <span className="opacity-50 text-xs font-normal hidden sm:inline">
              ({t("Interface.Export.labels.ar")})
            </span>
          </button>

          <button
            onClick={() => onDownload("stl")}
            disabled={isDownloading}
            className={cn(
              "px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm border",
              isDownloading && downloadFormat === "stl"
                ? "bg-brand-primary border-brand-primary text-white"
                : "bg-surface-3 hover:bg-surface-1 border-white/10 text-gray-300",
            )}
          >
            {isDownloading && downloadFormat === "stl" ? (
              <CircleNotch className="h-4 w-4 animate-spin" />
            ) : (
              <DownloadSimple className="h-4 w-4" weight="bold" />
            )}
            {t("Interface.Export.labels.stl")}
            <span className="opacity-50 text-xs font-normal hidden sm:inline">
              ({t("Interface.Export.labels.print")})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
