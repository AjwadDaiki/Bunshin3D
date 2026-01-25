"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase";
import {
  UploadSimple,
  Sparkle,
  Lightning,
  DownloadSimple,
  CircleNotch,
  Image as ImageIcon,
  FileCode,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { convertToSTL, triggerDownload } from "@/lib/3d-processing";
import { BunshinLogo } from "../ui/BunshinLogo";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        poster?: string;
        alt?: string;
        "camera-controls"?: boolean;
        "auto-rotate"?: boolean;
        ar?: boolean;
        "shadow-intensity"?: string;
        exposure?: string;
        loading?: "auto" | "lazy" | "eager";
      };
    }
  }
}

type Mode = "image" | "text";
type Quality = "standard" | "premium";

interface LogEntry {
  id: number;
  message: string;
  type: "info" | "success" | "error";
  timestamp: Date;
}

export default function StudioInterface() {
  const t = useTranslations("Studio");
  const [mode, setMode] = useState<Mode>("image");
  const [quality, setQuality] = useState<Quality>("standard");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js";
    document.head.appendChild(script);
  }, []);

  const addLog = (message: string, type: "info" | "success" | "error" = "info") => {
    setLogs((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), message, type, timestamp: new Date() },
    ]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setModelUrl(null);
      setGeneratedImageUrl(null);
    }
  };

  const downloadModel = async (format: "glb" | "stl") => {
    if (!modelUrl) return;
    setIsDownloading(true);
    try {
      if (format === "glb") {
        const response = await fetch(modelUrl);
        if (!response.ok) throw new Error("Download failed");
        const blob = await response.blob();
        triggerDownload(blob, `bunshin-model-${Date.now()}.glb`);
        addLog("✓ GLB Downloaded", "success");
      } else if (format === "stl") {
        addLog("Converting to STL...", "info");
        const stlBlob = await convertToSTL(modelUrl);
        triggerDownload(stlBlob, `bunshin-model-${Date.now()}.stl`);
        addLog("✓ STL Converted & Downloaded", "success");
      }
    } catch (e: any) {
      console.error(e);
      addLog(`Download error: ${e.message}`, "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const costInCredits = quality === "premium" ? 5 : 1;

  const handleGenerate = async () => {
    if (mode === "image" && !imageFile) {
      addLog("Please upload an image first", "error");
      return;
    }

    if (mode === "text" && !prompt.trim()) {
      addLog("Please enter a text description", "error");
      return;
    }

    if (credits < costInCredits) {
      addLog(`Insufficient credits. You need ${costInCredits} credit(s).`, "error");
      return;
    }

    setIsGenerating(true);
    setLogs([]);
    setModelUrl(null);
    if (mode === "text") setGeneratedImageUrl(null);

    try {
      addLog(t("Logs.initializing"));

      let finalImageUrl: string;

      if (mode === "text") {
        addLog(t("Logs.generatingImage"));

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
            addLog("✓ Image generated successfully", "success");
            break;
          } else if (status.status === "failed") {
            throw new Error("Image generation failed");
          }
        }
        finalImageUrl = imageResult;

        addLog("⏳ Cooling down API (Safe Wait)...", "info");
        await new Promise((r) => setTimeout(r, 3000));
      } else {
        addLog(t("Logs.uploadingImage"));
        const supabase = createClient();
        const fileName = `${userId}/${Date.now()}-${imageFile!.name.replace(/[^a-zA-Z0-9.]/g, "")}`;

        const { error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(fileName, imageFile!);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(fileName);

        finalImageUrl = publicUrl;
        addLog("✓ Image uploaded successfully", "success");
      }

      addLog(t("Logs.buildingMesh"));

      let apiEndpoint: string;
      if (quality === "premium") {
        apiEndpoint = "/api/premium-3d/create";
      } else {
        apiEndpoint = "/api/text-to-3d/generate-model";
      }

      const modelRes = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: finalImageUrl, userId }),
      });

      if (modelRes.status === 429) {
        addLog("⚠️ Server Busy (429). Retrying in 5s...", "error");
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

        if (pollCount === 2) addLog(t("Logs.applyingTextures"));
        if (pollCount === 5) addLog(t("Logs.optimizingGeometry"));

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
          addLog("✅ " + t("Logs.complete"), "success");
          setCredits((c) => c - costInCredits);
          break;
        } else if (status.status === "failed") {
          throw new Error("3D generation failed on server side.");
        }
      }
    } catch (error: any) {
      console.error(error);
      addLog(`❌ Error: ${error.message}`, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-surface-1 to-surface-2 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-[1600px]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-gradient-brand mb-2">
              {t("Header.title")}
            </h1>
            <p className="text-gray-400 max-w-lg">{t("Header.subtitle")}</p>
          </div>
          <div className="flex items-center gap-4 bg-surface-2 px-6 py-3 rounded-2xl border border-white/5">
            <span className="text-green-400 flex items-center gap-2 text-sm font-medium">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              {t("Header.status")}
            </span>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-amber-400 font-bold flex items-center gap-2">
              <Lightning className="h-5 w-5" weight="fill" />
              {credits} Credits
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-2 rounded-2xl flex gap-2">
              <button
                onClick={() => setMode("image")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
                  mode === "image"
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                    : "hover:bg-white/5 text-gray-400"
                )}
              >
                <UploadSimple className="h-5 w-5" weight="bold" />
                {t("Modes.imageToModel")}
              </button>
              <button
                onClick={() => setMode("text")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
                  mode === "text"
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                    : "hover:bg-white/5 text-gray-400"
                )}
              >
                <Sparkle className="h-5 w-5" weight="fill" />
                {t("Modes.textToModel")}
              </button>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                {t("Quality.title")}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setQuality("standard")}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group",
                    quality === "standard"
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-white/5 hover:border-white/10 bg-surface-2"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        quality === "standard"
                          ? "bg-amber-400/20 text-amber-400"
                          : "bg-white/5 text-gray-400"
                      )}
                    >
                      <BunshinLogo className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <span
                        className={cn(
                          "block font-bold",
                          quality === "standard" ? "text-white" : "text-gray-400"
                        )}
                      >
                        {t("Quality.standard")}
                      </span>
                      <span className="text-xs text-gray-500">
                        Fast generation, optimized mesh
                      </span>
                    </div>
                  </div>
                  <span className="text-brand-primary font-bold">1 Credit</span>
                </button>

                <button
                  onClick={() => setQuality("premium")}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group",
                    quality === "premium"
                      ? "border-purple-500 bg-purple-500/5"
                      : "border-white/5 hover:border-white/10 bg-surface-2"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        quality === "premium"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-white/5 text-gray-400"
                      )}
                    >
                      <Sparkle className="h-5 w-5" weight="fill" />
                    </div>
                    <div className="text-left">
                      <span
                        className={cn(
                          "block font-bold",
                          quality === "premium" ? "text-white" : "text-gray-400"
                        )}
                      >
                        {t("Quality.premium")}
                      </span>
                      <span className="text-xs text-gray-500">
                        High fidelity, PBR textures
                      </span>
                    </div>
                  </div>
                  <span className="text-purple-400 font-bold">5 Credits</span>
                </button>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              {mode === "image" ? (
                <>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                    {t("Interface.DropZone.title")}
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-white/5 transition-all group overflow-hidden relative"
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <>
                        <div className="p-4 rounded-full bg-white/5 group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-colors mb-3">
                          <UploadSimple className="h-6 w-6" weight="bold" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">
                          {t("Interface.DropZone.subtitle")}
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              ) : (
                <>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                    {t("TextMode.promptLabel")}
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: A futuristic cyberpunk samurai helmet, high detail, 4k..."
                    className="w-full h-40 px-4 py-3 bg-surface-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all resize-none text-white placeholder-gray-600"
                    disabled={isGenerating}
                  />
                </>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || credits < costInCredits}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 rounded-xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/25"
              >
                {isGenerating ? (
                  <>
                    <CircleNotch className="h-5 w-5 animate-spin" weight="bold" />
                    <span className="animate-pulse">
                      {t("Interface.Controls.processing")}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkle className="h-5 w-5" weight="fill" />
                    {t("Interface.Controls.generate")}
                  </>
                )}
              </button>
            </div>

            <div className="glass-card p-4 rounded-2xl bg-black/40 border-white/5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isGenerating ? "bg-green-400 animate-pulse" : "bg-gray-600"
                  )}
                />
                Process Logs
              </h3>
              <div
                ref={logsContainerRef}
                className="h-48 overflow-y-auto space-y-2 font-mono text-xs pr-2 scrollbar-thin scrollbar-thumb-white/10 scroll-smooth"
              >
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-700">
                    <FileCode className="h-8 w-8 mb-2 opacity-50" weight="duotone" />
                    <p>Ready to generate</p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className={cn(
                        "flex gap-2",
                        log.type === "success"
                          ? "text-green-400"
                          : log.type === "error"
                            ? "text-red-400"
                            : "text-gray-400"
                      )}
                    >
                      <span className="opacity-50">
                        [
                        {log.timestamp.toLocaleTimeString([], {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                        ]
                      </span>
                      <span>{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6 h-full">
            <div className="glass-card rounded-3xl overflow-hidden bg-surface-2 border-white/10 relative h-[600px] flex items-center justify-center group">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              {!modelUrl && !generatedImageUrl && !isGenerating && (
                <div className="text-center opacity-30 select-none pointer-events-none">
                  <BunshinLogo className="h-32 w-32 mx-auto mb-6 text-white stroke-1" />
                  <h3 className="text-2xl font-bold">Waiting for input...</h3>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="relative">
                    <BunshinLogo
                      className="h-32 w-32 text-brand-primary"
                      animated={true}
                    />
                  </div>
                  <p className="mt-8 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary animate-pulse">
                    Creating Magic...
                  </p>
                  <p className="text-gray-400 mt-3 text-sm max-w-xs text-center font-mono">
                    {logs[logs.length - 1]?.message}
                  </p>
                </div>
              )}

              {generatedImageUrl && !modelUrl && (
                <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
                  <img
                    src={generatedImageUrl}
                    alt="Generated 2D"
                    className="max-h-full max-w-full rounded-xl shadow-2xl object-contain"
                  />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-brand-primary" weight="duotone" />
                    Reference Image
                  </div>
                </div>
              )}

              {modelUrl && (
                <model-viewer
                  src={modelUrl}
                  poster={generatedImageUrl || undefined}
                  shadow-intensity="1"
                  camera-controls
                  auto-rotate
                  ar
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "transparent",
                  }}
                >
                  <div slot="progress-bar"></div>
                </model-viewer>
              )}
            </div>

            {modelUrl && (
              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="glass-card flex-1 p-6 rounded-2xl flex items-center justify-between border-green-500/20 bg-green-500/5">
                  <div>
                    <h3 className="font-bold text-green-400 text-lg flex items-center gap-2">
                      <BunshinLogo className="h-5 w-5" />
                      Model Ready!
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Select format to download
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => downloadModel("glb")}
                      disabled={isDownloading}
                      className="px-5 py-2.5 bg-surface-3 hover:bg-white/10 border border-white/10 rounded-lg font-bold transition-all flex items-center gap-2 text-sm"
                    >
                      {isDownloading ? (
                        <CircleNotch className="h-4 w-4 animate-spin" weight="bold" />
                      ) : (
                        <DownloadSimple className="h-4 w-4" weight="bold" />
                      )}
                      GLB <span className="opacity-50 text-xs">(Web/AR)</span>
                    </button>
                    <button
                      onClick={() => downloadModel("stl")}
                      disabled={isDownloading}
                      className="px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg font-bold transition-all flex items-center gap-2 text-sm shadow-lg shadow-brand-primary/20"
                    >
                      {isDownloading ? (
                        <CircleNotch className="h-4 w-4 animate-spin" weight="bold" />
                      ) : (
                        <DownloadSimple className="h-4 w-4" weight="bold" />
                      )}
                      STL <span className="opacity-50 text-xs text-white/70">(Print)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
