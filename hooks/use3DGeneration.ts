"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";

type Mode = "image" | "text";
type Quality = "standard" | "premium";

interface LogEntry {
  id: number;
  message: string;
  type: "info" | "success" | "error";
  timestamp: Date;
}

interface Use3DGenerationOptions {
  onLog?: (message: string, type: "info" | "success" | "error") => void;
}

export function use3DGeneration(options?: Use3DGenerationOptions) {
  const [mode, setMode] = useState<Mode>("image");
  const [quality, setQuality] = useState<Quality>("standard");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  const costInCredits = quality === "premium" ? 5 : 1;

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single();
        if (data) setCredits(data.credits);
      }
    };
    getUser();
  }, []);

  const addLog = useCallback((message: string, type: "info" | "success" | "error" = "info") => {
    setLogs((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), message, type, timestamp: new Date() },
    ]);
    options?.onLog?.(message, type);
  }, [options]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const handleFileChange = useCallback((file: File | null) => {
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
    setModelUrl(null);
    setGeneratedImageUrl(null);
  }, []);

  const resetGeneration = useCallback(() => {
    setModelUrl(null);
    setGeneratedImageUrl(null);
    setLogs([]);
  }, []);

  const generate = useCallback(async (translations: {
    initializing: string;
    generatingImage: string;
    uploadingImage: string;
    buildingMesh: string;
    applyingTextures: string;
    optimizingGeometry: string;
    complete: string;
  }) => {
    if (mode === "image" && !imageFile) {
      addLog("Please upload an image first", "error");
      return { success: false };
    }

    if (mode === "text" && !prompt.trim()) {
      addLog("Please enter a text description", "error");
      return { success: false };
    }

    if (credits < costInCredits) {
      addLog(`Insufficient credits. You need ${costInCredits} credit(s).`, "error");
      return { success: false };
    }

    setIsGenerating(true);
    setLogs([]);
    setModelUrl(null);
    if (mode === "text") setGeneratedImageUrl(null);

    try {
      addLog(translations.initializing);

      let finalImageUrl: string;

      if (mode === "text") {
        addLog(translations.generatingImage);

        const imageRes = await fetch("/api/text-to-3d/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, userId }),
        });

        const imageData = await imageRes.json();
        if (!imageRes.ok) throw new Error(imageData.error);

        const imagePredictionId = imageData.predictionId;
        let imageResult = null;

        while (!imageResult) {
          await new Promise((r) => setTimeout(r, 2000));
          const statusRes = await fetch(`/api/check-status/${imagePredictionId}`);
          const status = await statusRes.json();

          if (status.status === "succeeded") {
            imageResult = status.output[0];
            setGeneratedImageUrl(imageResult);
            addLog("Image generated successfully", "success");
            break;
          } else if (status.status === "failed") {
            throw new Error("Image generation failed");
          }
        }
        finalImageUrl = imageResult;

        addLog("Cooling down API...", "info");
        await new Promise((r) => setTimeout(r, 3000));
      } else {
        addLog(translations.uploadingImage);
        const supabase = createClient();
        const fileName = `${userId}/${Date.now()}-${imageFile!.name.replace(/[^a-zA-Z0-9.]/g, "")}`;

        const { error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(fileName, imageFile!);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(fileName);

        finalImageUrl = publicUrl;
        addLog("Image uploaded successfully", "success");
      }

      addLog(translations.buildingMesh);

      const apiEndpoint = quality === "premium"
        ? "/api/premium-3d/create"
        : "/api/text-to-3d/generate-model";

      const modelRes = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: finalImageUrl, userId }),
      });

      if (modelRes.status === 429) {
        addLog("Server Busy (429). Retrying in 5s...", "error");
        await new Promise((r) => setTimeout(r, 5000));
        throw new Error("System busy (Rate Limit). Please wait 30s and try again.");
      }

      const modelData = await modelRes.json();
      if (!modelRes.ok) throw new Error(modelData.error || "Generation failed");

      const modelPredictionId = modelData.predictionId;
      let modelResult = null;
      let pollCount = 0;

      while (!modelResult) {
        await new Promise((r) => setTimeout(r, 4000));
        pollCount++;

        if (pollCount === 2) addLog(translations.applyingTextures);
        if (pollCount === 5) addLog(translations.optimizingGeometry);

        const statusRes = await fetch(`/api/check-status/${modelPredictionId}`);
        const status = await statusRes.json();

        if (status.status === "succeeded") {
          if (typeof status.output === "string") {
            modelResult = status.output;
          } else if (status.output && status.output.model_file) {
            modelResult = status.output.model_file;
          } else {
            modelResult =
              Object.values(status.output).find(
                (val: any) => typeof val === "string" && val.includes(".glb")
              ) || status.output;
          }

          setModelUrl(modelResult);
          addLog(translations.complete, "success");
          setCredits((c) => c - costInCredits);
          break;
        } else if (status.status === "failed") {
          throw new Error("3D generation failed on server side.");
        }
      }

      return { success: true, modelUrl: modelResult };
    } catch (error: any) {
      console.error(error);
      addLog(`Error: ${error.message}`, "error");
      return { success: false, error: error.message };
    } finally {
      setIsGenerating(false);
    }
  }, [mode, quality, imageFile, prompt, userId, credits, costInCredits, addLog]);

  return {
    mode,
    setMode,
    quality,
    setQuality,
    imageFile,
    imagePreview,
    handleFileChange,
    prompt,
    setPrompt,
    isGenerating,
    logs,
    addLog,
    clearLogs,
    modelUrl,
    generatedImageUrl,
    credits,
    userId,
    costInCredits,
    generate,
    resetGeneration,
  };
}
