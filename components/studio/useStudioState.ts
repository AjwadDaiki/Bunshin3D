"use client";

import { useCallback, useState } from "react";
import { Mode, Quality } from "./types";
import { sanitizeFileName } from "@/lib/generation-utils";

export function useStudioState() {
  const [mode, setMode] = useState<Mode>("image");
  const [quality, setQuality] = useState<Quality>("standard");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File | null) => {
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
    setModelUrl(null);
    setGeneratedImageUrl(null);
  }, []);

  const buildFilePath = useCallback(
    (userId: string) => {
      if (!imageFile) return "";
      const safeName = sanitizeFileName(imageFile.name);
      return `${userId}/${Date.now()}-${safeName}`;
    },
    [imageFile],
  );

  const resetOutputs = useCallback(() => {
    setModelUrl(null);
    setGeneratedImageUrl(null);
  }, []);

  return {
    mode,
    setMode,
    quality,
    setQuality,
    imageFile,
    imagePreview,
    prompt,
    setPrompt,
    isGenerating,
    setIsGenerating,
    modelUrl,
    setModelUrl,
    generatedImageUrl,
    setGeneratedImageUrl,
    handleFileChange,
    resetOutputs,
    buildFilePath,
  };
}
