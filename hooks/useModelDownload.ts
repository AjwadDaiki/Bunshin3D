"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  convertToSTL,
  convertToOBJ,
  convertToUSDZ,
  triggerDownload,
} from "@/lib/3d-processing";

interface UseModelDownloadOptions {
  onSuccess?: (format: string) => void;
  onError?: (error: string) => void;
}

export type DownloadFormat = "glb" | "stl" | "obj" | "usdz";

export function useModelDownload(options?: UseModelDownloadOptions) {
  const t = useTranslations("Common");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat | null>(
    null,
  );

  const downloadModel = useCallback(
    async (modelUrl: string, format: DownloadFormat) => {
      if (!modelUrl)
        return { success: false, error: t("errors.noModelUrl") };

      setIsDownloading(true);
      setDownloadFormat(format);

      try {
        const timestamp = Date.now();
        let blob: Blob;
        let extension = format;

        if (format === "glb") {
          const response = await fetch(modelUrl);
          if (!response.ok) throw new Error(t("errors.downloadFailed"));
          blob = await response.blob();
        } else if (format === "stl") {
          blob = await convertToSTL(modelUrl);
        } else if (format === "obj") {
          blob = await convertToOBJ(modelUrl);
        } else if (format === "usdz") {
          blob = await convertToUSDZ(modelUrl);
        } else {
          throw new Error(t("errors.unknownFormat"));
        }

        const fileName = t("downloads.fileName", {
          timestamp,
          extension,
        });
        triggerDownload(blob, fileName);
        options?.onSuccess?.(format.toUpperCase());
        return { success: true };
      } catch (e: any) {
        console.error(e);
        options?.onError?.(e.message);
        return { success: false, error: e.message };
      } finally {
        setIsDownloading(false);
        setDownloadFormat(null);
      }
    },
    [options, t],
  );

  return {
    isDownloading,
    downloadFormat,
    downloadModel,
  };
}
