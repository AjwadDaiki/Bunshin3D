"use client";

import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase";
import { Mode, Quality } from "./types";
import { generateModel } from "@/lib/generation/generateModel";
import { generateTextImage } from "@/lib/generation/generateTextImage";
import { uploadImage } from "@/lib/generation/uploadImage";

type Props = {
  mode: Mode;
  quality: Quality;
  imageFile: File | null;
  prompt: string;
  userId: string | null;
  credits: number;
  onInsufficientCredits?: () => void;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  setGeneratedImageUrl: (value: string | null) => void;
  setModelUrl: (value: string | null) => void;
  setIsGenerating: (value: boolean) => void;
  addLog: (message: string, type?: "info" | "success" | "error") => void;
  clearLogs: () => void;
  buildFilePath: (userId: string) => string;
};

export function useStudioGeneration({
  mode,
  quality,
  imageFile,
  prompt,
  userId,
  credits,
  onInsufficientCredits,
  setCredits,
  setGeneratedImageUrl,
  setModelUrl,
  setIsGenerating,
  addLog,
  clearLogs,
  buildFilePath,
}: Props) {
  const t = useTranslations("Studio");
  // Stable reference: avoid recreating the Supabase client on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const supabase = useMemo(() => createClient(), []);

  const handleGenerate = useCallback(async () => {
    const costInCredits = quality === "premium" ? 5 : 1;

    if (mode === "image" && !imageFile) {
      addLog(t("Logs.missingImage"), "error");
      return;
    }

    if (mode === "text" && !prompt.trim()) {
      addLog(t("Logs.missingPrompt"), "error");
      return;
    }

    if (credits < costInCredits) {
      addLog(t("Logs.insufficientCredits", { count: costInCredits }), "error");
      onInsufficientCredits?.();
      return;
    }

    if (!userId) {
      addLog(t("Logs.errorPrefix", { message: t("Logs.generationFailed") }), "error");
      return;
    }

    setIsGenerating(true);
    clearLogs();
    setModelUrl(null);
    if (mode === "text") setGeneratedImageUrl(null);

    try {
      addLog(t("Logs.initializing"));
      const finalImageUrl =
        mode === "text"
          ? await generateTextImage({
              prompt,
              userId,
              addLog,
              setGeneratedImageUrl,
              t,
            })
          : await uploadImage({
              supabase,
              filePath: buildFilePath(userId),
              imageFile: imageFile as File,
              addLog,
              t,
            });

      await generateModel({
        quality,
        imageUrl: finalImageUrl,
        userId,
        costInCredits,
        addLog,
        setModelUrl,
        setCredits,
        t,
      });
    } catch (error: any) {
      console.error(error);
      addLog(t("Logs.errorPrefix", { message: error.message }), "error");
    } finally {
      setIsGenerating(false);
    }
  }, [
    addLog,
    buildFilePath,
    clearLogs,
    credits,
    imageFile,
    mode,
    onInsufficientCredits,
    prompt,
    quality,
    setCredits,
    setGeneratedImageUrl,
    setIsGenerating,
    setModelUrl,
    supabase,
    t,
    userId,
  ]);

  return {
    handleGenerate,
  };
}
