"use client";

import { useState, useCallback } from "react";
import { convertToSTL, triggerDownload } from "@/lib/3d-processing";

interface UseModelDownloadOptions {
  onSuccess?: (format: string) => void;
  onError?: (error: string) => void;
}

export function useModelDownload(options?: UseModelDownloadOptions) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"glb" | "stl" | null>(null);

  const downloadModel = useCallback(async (modelUrl: string, format: "glb" | "stl") => {
    if (!modelUrl) return { success: false, error: "No model URL provided" };

    setIsDownloading(true);
    setDownloadFormat(format);

    try {
      if (format === "glb") {
        const response = await fetch(modelUrl);
        if (!response.ok) throw new Error("Download failed");
        const blob = await response.blob();
        triggerDownload(blob, `bunshin-model-${Date.now()}.glb`);
        options?.onSuccess?.("GLB");
        return { success: true };
      } else if (format === "stl") {
        const stlBlob = await convertToSTL(modelUrl);
        triggerDownload(stlBlob, `bunshin-model-${Date.now()}.stl`);
        options?.onSuccess?.("STL");
        return { success: true };
      }
      return { success: false, error: "Unknown format" };
    } catch (e: any) {
      console.error(e);
      options?.onError?.(e.message);
      return { success: false, error: e.message };
    } finally {
      setIsDownloading(false);
      setDownloadFormat(null);
    }
  }, [options]);

  return {
    isDownloading,
    downloadFormat,
    downloadModel,
  };
}
