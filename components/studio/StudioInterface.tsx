"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase";
import {
  Upload,
  Sparkles,
  Zap,
  Download,
  Loader2,
  Image as ImageIcon,
  FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { convertToSTL, triggerDownload } from "@/lib/3d-processing";
// Import du nouveau logo
import { BunshinLogo } from "../ui/BunshinLogo";

// Déclaration pour TypeScript pour le Web Component model-viewer
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

// Loading message keys for rotation
const LOADING_MESSAGES = [
  "analyzing",
  "sculpting",
  "magic",
  "neurons",
  "dimensions",
  "geometry",
  "textures",
  "finalizing",
  "patience",
  "creating"
] as const;

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
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const [credits, setCredits] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Rotate loading messages
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  // Fetch and subscribe to credits
  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single();
        if (data) setCredits(data.credits);

        // Subscribe to real-time credit changes
        const channel = supabase
          .channel('credits-changes')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${user.id}`
            },
            (payload) => {
              if (payload.new && typeof payload.new.credits === 'number') {
                setCredits(payload.new.credits);
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    };
    getUser();
  }, []);

  // Auto-scroll des logs
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Charger le script model-viewer dynamiquement
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js";
    document.head.appendChild(script);
  }, []);

  const addLog = (
    message: string,
    type: "info" | "success" | "error" = "info",
  ) => {
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
      // Reset states
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
      addLog(
        `Insufficient credits. You need ${costInCredits} credit(s).`,
        "error",
      );
      return;
    }

    setIsGenerating(true);
    setLogs([]);
    setModelUrl(null);
    if (mode === "text") setGeneratedImageUrl(null);

    try {
      addLog(t("Logs.initializing"));

      let finalImageUrl: string;

      // --- ETAPE 1 : OBTENTION DE L'IMAGE ---
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

        // Polling Image
        while (!imageResult) {
          await new Promise((r) => setTimeout(r, 2000));
          const statusRes = await fetch(
            `/api/check-status/${imagePredictionId}`,
          );
          const status = await statusRes.json();

          if (status.status === "succeeded") {
            imageResult = status.output[0];
            // Don't show the intermediate image in text-to-3d mode - keep loading animation
            // setGeneratedImageUrl(imageResult); // REMOVED: User only wants to see final 3D model
            addLog("✓ Image generated successfully", "success");
            break;
          } else if (status.status === "failed") {
            throw new Error("Image generation failed");
          }
        }
        finalImageUrl = imageResult;

        addLog(t("Logs.coolingDown"));
        await new Promise((r) => setTimeout(r, 8000));
      } else {
        // Mode Image Upload
        addLog(t("Logs.uploadingImage"));
        const supabase = createClient();
        const fileName = `${userId}/${Date.now()}-${imageFile!.name.replace(/[^a-zA-Z0-9.]/g, "")}`;

        const { error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(fileName, imageFile!);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("uploads").getPublicUrl(fileName);

        finalImageUrl = publicUrl;
        addLog("✓ Image uploaded successfully", "success");
      }

      // --- ETAPE 2 : GENERATION 3D ---
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
        throw new Error(
          "System busy (Rate Limit). Please wait 30s and try again.",
        );
      }

      const modelData = await modelRes.json();
      console.log("📦 Model API response:", modelData);

      if (!modelRes.ok) throw new Error(modelData.error || "Generation failed");

      const modelPredictionId = modelData.predictionId;
      console.log("🔑 Prediction ID:", modelPredictionId);

      let modelResult = null;
      let pollCount = 0;

      // Polling 3D
      while (!modelResult) {
        await new Promise((r) => setTimeout(r, 4000));
        pollCount++;

        if (pollCount === 2) addLog(t("Logs.applyingTextures"));
        if (pollCount === 5) addLog(t("Logs.optimizingGeometry"));

        const statusRes = await fetch(`/api/check-status/${modelPredictionId}`);
        const status = await statusRes.json();

        if (status.status === "succeeded") {
          // Extraction robuste de l'URL du modèle GLB
          const extractGlbUrl = (output: any): string | null => {
            if (!output) return null;

            // String directe
            if (typeof output === "string") {
              if (output.endsWith(".glb")) return output;
              const match = output.match(/https?:\/\/[^\s"']+\.glb/);
              return match ? match[0] : output.startsWith("http") ? output : null;
            }

            // Tableau
            if (Array.isArray(output)) {
              return output.find((v) => typeof v === "string" && v.endsWith(".glb")) || output[0];
            }

            // Objet
            if (typeof output === "object") {
              if (output.model_file) return output.model_file;
              if (output.glb) return output.glb;
              if (output.model_urls?.glb) return output.model_urls.glb;

              // Chercher dans les valeurs
              const values = Object.values(output);
              const glb = values.find((v) => typeof v === "string" && (v as string).endsWith(".glb"));
              if (glb) return glb as string;

              // Chercher récursivement
              for (const val of values) {
                if (typeof val === "object") {
                  const found = extractGlbUrl(val);
                  if (found) return found;
                }
              }
            }

            return null;
          };

          modelResult = extractGlbUrl(status.output);
          console.log("🎯 Raw output from Replicate:", status.output);
          console.log("🎯 Extracted GLB URL:", modelResult);

          if (!modelResult) {
            console.error("❌ Could not extract GLB URL from output");
            throw new Error("Could not extract model URL from response");
          }

          setModelUrl(modelResult);

          // Save output to database via API route (bypasses RLS issues)
          // Also passes userId and type in case the generation record needs to be created
          const generationType = mode === "text" ? "text_to_3d" : "image_to_3d";
          console.log("📤 Sending update to API:", {
            predictionId: modelPredictionId,
            status: "succeeded",
            output: typeof modelResult === 'string' ? modelResult.substring(0, 100) + '...' : modelResult,
            userId,
            type: generationType
          });

          const updateRes = await fetch("/api/generations/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              predictionId: modelPredictionId,
              status: "succeeded",
              output: modelResult,
              userId,
              type: quality === "premium" ? "premium_3d" : generationType
            })
          });

          const updateData = await updateRes.json();
          console.log("📥 Update API response:", updateData);

          if (!updateRes.ok) {
            console.error("❌ Failed to save model to DB:", updateData);
          } else {
            console.log("✅ Model saved to DB successfully");
          }

          addLog("✅ " + t("Logs.complete"), "success");
          setCredits((c) => c - costInCredits);
          break;
        } else if (status.status === "failed") {
          const failedType = mode === "text" ? "text_to_3d" : "image_to_3d";
          await fetch("/api/generations/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              predictionId: modelPredictionId,
              status: "failed",
              userId,
              type: quality === "premium" ? "premium_3d" : failedType
            })
          });
          throw new Error(t("Logs.generationFailed"));
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
        {/* Header */}
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
              <Zap className="h-5 w-5 fill-current" />
              {credits} {t("Header.credits")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- LEFT COLUMN: CONTROLS (4 cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            {/* Mode Selection */}
            <div className="glass-card p-2 rounded-2xl flex gap-2">
              <button
                onClick={() => setMode("image")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
                  mode === "image"
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                    : "hover:bg-white/5 text-gray-400",
                )}
              >
                <Upload className="h-5 w-5" />
                {t("Modes.imageToModel")}
              </button>
              <button
                onClick={() => setMode("text")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
                  mode === "text"
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                    : "hover:bg-white/5 text-gray-400",
                )}
              >
                <Sparkles className="h-5 w-5" />
                {t("Modes.textToModel")}
              </button>
            </div>

            {/* Quality Selection */}
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
                      : "border-white/5 hover:border-white/10 bg-surface-2",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        quality === "standard"
                          ? "bg-amber-400/20 text-amber-400"
                          : "bg-white/5 text-gray-400",
                      )}
                    >
                      {/* Remplacement de Box par BunshinLogo */}
                      <BunshinLogo className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <span
                        className={cn(
                          "block font-bold",
                          quality === "standard"
                            ? "text-white"
                            : "text-gray-400",
                        )}
                      >
                        {t("Quality.standard")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {t("Quality.standardDesc")}
                      </span>
                    </div>
                  </div>
                  <span className="text-brand-primary font-bold">{t("Quality.standardCost", { cost: 1 })}</span>
                </button>

                <button
                  onClick={() => setQuality("premium")}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group",
                    quality === "premium"
                      ? "border-purple-500 bg-purple-500/5"
                      : "border-white/5 hover:border-white/10 bg-surface-2",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        quality === "premium"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-white/5 text-gray-400",
                      )}
                    >
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <span
                        className={cn(
                          "block font-bold",
                          quality === "premium"
                            ? "text-white"
                            : "text-gray-400",
                        )}
                      >
                        {t("Quality.premium")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {t("Quality.premiumDesc")}
                      </span>
                    </div>
                  </div>
                  <span className="text-purple-400 font-bold">{t("Quality.premiumCost", { cost: 5 })}</span>
                </button>
              </div>
            </div>

            {/* Input Zone */}
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
                          <Upload className="h-6 w-6" />
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
                    placeholder={t("TextMode.promptPlaceholder")}
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
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="animate-pulse">
                      {t("Interface.Controls.processing")}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    {t("Interface.Controls.generate")}
                  </>
                )}
              </button>
            </div>

            {/* Console Logs */}
            <div className="glass-card p-4 rounded-2xl bg-black/40 border-white/5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isGenerating ? "bg-green-400 animate-pulse" : "bg-gray-600",
                  )}
                />
                {t("Logs.title")}
              </h3>
              <div
                ref={logsContainerRef}
                className="h-48 overflow-y-auto space-y-2 font-mono text-xs pr-2 scrollbar-thin scrollbar-thumb-white/10 scroll-smooth"
              >
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-700">
                    <FileCode className="h-8 w-8 mb-2 opacity-50" />
                    <p>{t("Logs.ready")}</p>
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
                            : "text-gray-400",
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

          {/* --- RIGHT COLUMN: VISUALIZATION (8 cols) --- */}
          <div className="lg:col-span-8 flex flex-col gap-6 h-full">
            {/* Main Viewer Area */}
            <div className="glass-card rounded-3xl overflow-hidden bg-surface-2 border-white/10 relative h-[600px] flex items-center justify-center group">
              {/* Background Grid Pattern */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              {!modelUrl && !generatedImageUrl && !isGenerating && (
                <div className="text-center opacity-30 select-none pointer-events-none">
                  {/* Remplacement de Box par BunshinLogo */}
                  <BunshinLogo className="h-32 w-32 mx-auto mb-6 text-white stroke-1" />
                  <h3 className="text-2xl font-bold">{t("Viewer.waitingInput")}</h3>
                </div>
              )}

              {/* --- ANIMATION DE CHARGEMENT MAGNIFIQUE --- */}
              {isGenerating && (
                <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden">
                  {/* Animated background particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl animate-ping" style={{ animationDuration: '3s' }} />
                  </div>

                  {/* Logo with glow effect */}
                  <div className="relative z-10">
                    <div className="absolute inset-0 bg-brand-primary/30 blur-2xl rounded-full scale-150 animate-pulse" />
                    <BunshinLogo
                      className="relative h-40 w-40 text-brand-primary drop-shadow-2xl"
                      animated={true}
                    />
                  </div>

                  {/* Main title */}
                  <h2 className="relative z-10 mt-8 text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-brand-primary via-purple-400 to-brand-secondary animate-pulse">
                    {t("Viewer.creatingMagic")}
                  </h2>

                  {/* Rotating motivational messages */}
                  <div className="relative z-10 mt-6 h-8 overflow-hidden">
                    <p
                      key={loadingMessageIndex}
                      className="text-gray-300 text-lg font-medium text-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                      {t(`LoadingMessages.${LOADING_MESSAGES[loadingMessageIndex]}`)}
                    </p>
                  </div>

                  {/* Progress dots */}
                  <div className="relative z-10 flex gap-2 mt-8">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-brand-primary/50"
                        style={{
                          animation: 'pulse 1.5s ease-in-out infinite',
                          animationDelay: `${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>

                  {/* Current log message */}
                  <div className="relative z-10 mt-8 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                    <p className="text-gray-400 text-sm font-mono flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      {logs[logs.length - 1]?.message || t("Logs.initializing")}
                    </p>
                  </div>
                </div>
              )}

              {/* 2D Image Preview */}
              {generatedImageUrl && !modelUrl && (
                <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
                  <img
                    src={generatedImageUrl}
                    alt="Generated 2D"
                    className="max-h-full max-w-full rounded-xl shadow-2xl object-contain"
                  />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-brand-primary" />
                    {t("Viewer.referenceImage")}
                  </div>
                </div>
              )}

              {/* 3D Viewer */}
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

            {/* Action Bar (Download) */}
            {modelUrl && (
              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="glass-card flex-1 p-6 rounded-2xl flex items-center justify-between border-green-500/20 bg-green-500/5">
                  <div>
                    <h3 className="font-bold text-green-400 text-lg flex items-center gap-2">
                      <BunshinLogo className="h-5 w-5" />
                      {t("Download.modelReady")}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {t("Download.selectFormat")}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => downloadModel("glb")}
                      disabled={isDownloading}
                      className="px-5 py-2.5 bg-surface-3 hover:bg-white/10 border border-white/10 rounded-lg font-bold transition-all flex items-center gap-2 text-sm"
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      GLB <span className="opacity-50 text-xs">{t("Download.webAR")}</span>
                    </button>
                    <button
                      onClick={() => downloadModel("stl")}
                      disabled={isDownloading}
                      className="px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg font-bold transition-all flex items-center gap-2 text-sm shadow-lg shadow-brand-primary/20"
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      STL{" "}
                      <span className="opacity-50 text-xs text-white/70">
                        {t("Download.print")}
                      </span>
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
