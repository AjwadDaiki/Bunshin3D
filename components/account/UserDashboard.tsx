"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase";
import { useRouter, Link } from "@/i18n/routing";
import {
  LogOut,
  Box,
  Calendar,
  Download,
  Plus,
  Zap,
  CheckCircle,
  Loader2,
  Trash2,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { convertToSTL, triggerDownload } from "@/lib/3d-processing";

// Déclaration TypeScript pour model-viewer
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

type DashboardProps = {
  user: any;
  profile: any;
  generations: any[]; // Peut être vide si le fetch serveur échoue
};

export default function UserDashboard({
  user,
  profile,
  generations: initialGenerations,
}: DashboardProps) {
  const t = useTranslations("Account");
  const router = useRouter();
  const supabase = createClient();

  // État local
  const [generations, setGenerations] = useState<any[]>(
    initialGenerations || [],
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [credits, setCredits] = useState(profile?.credits ?? 0);
  const itemsPerPage = 9;

  // Chargement du script model-viewer
  useEffect(() => {
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement("script");
      script.type = "module";
      script.src =
        "https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js";
      document.head.appendChild(script);
    }
  }, []);

  // Fonction de récupération robuste des données (Fallback client)
  const fetchGenerations = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setGenerations(data);
    } catch (error) {
      console.error("❌ Erreur chargement dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user.id, supabase]);

  // Si aucune donnée initiale, on charge côté client
  useEffect(() => {
    if (!initialGenerations || initialGenerations.length === 0) {
      fetchGenerations();
    }
  }, [initialGenerations, fetchGenerations]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "generations",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("⚡ Realtime Update:", payload);
          if (payload.eventType === "INSERT") {
            setGenerations((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setGenerations((prev) =>
              prev.map((g) => (g.id === payload.new.id ? payload.new : g)),
            );
          } else if (payload.eventType === "DELETE") {
            setGenerations((prev) =>
              prev.filter((g) => g.id !== payload.old.id),
            );
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new?.credits !== undefined) {
            setCredits(payload.new.credits);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id, supabase]);

  // Extraction d'URL robuste (améliorée)
  // Priorité: r2_url (permanent) > output (peut être temporaire)
  const getModelUrl = (generation: any): string | null => {
    // Priorité à l'URL R2 si disponible (stockage permanent)
    if (generation.r2_url && typeof generation.r2_url === "string") {
      return generation.r2_url;
    }

    const output = generation.output;
    if (!output) return null;
    if (typeof output === "string") {
      if (output.startsWith("http")) return output;
      // Tentative de parsing si JSON stringifié
      try {
        const parsed = JSON.parse(output);
        return getModelUrlFromOutput(parsed);
      } catch {
        return null;
      }
    }
    return getModelUrlFromOutput(output);
  };

  // Helper pour extraire l'URL depuis le champ output
  const getModelUrlFromOutput = (output: any): string | null => {
    if (!output) return null;
    if (typeof output === "string" && output.startsWith("http")) return output;
    if (Array.isArray(output)) {
      return (
        output.find((url) => typeof url === "string" && url.includes(".glb")) ||
        output[0] ||
        null
      );
    }
    if (typeof output === "object") {
      return output.model_file || output.glb || output.model_urls?.glb || null;
    }
    return null;
  };

  const handleDownload = async (
    modelUrl: string,
    format: "glb" | "stl",
    genId: string,
  ) => {
    if (!modelUrl) return;
    setDownloadingId(genId);
    try {
      if (format === "glb") {
        const response = await fetch(modelUrl);
        const blob = await response.blob();
        triggerDownload(blob, `bunshin-${genId.slice(0, 8)}.glb`);
      } else {
        const stlBlob = await convertToSTL(modelUrl);
        triggerDownload(stlBlob, `bunshin-${genId.slice(0, 8)}.stl`);
      }
    } catch (e) {
      alert(t("History.downloadFailed"));
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("History.confirmDelete"))) return;
    // Optimistic UI update
    const previousGenerations = [...generations];
    setGenerations((prev) => prev.filter((g) => g.id !== id));

    try {
      const res = await fetch("/api/generations/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId: id, userId: user.id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
    } catch (error) {
      setGenerations(previousGenerations); // Rollback
      alert(t("History.deleteError"));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  // Pagination
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedGenerations = generations.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(generations.length / itemsPerPage);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {t("Header.title")}
          </h1>
          <p className="text-zinc-400">
            {t("Header.welcome")}{" "}
            <span className="text-white font-medium">{profile?.email}</span>
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/pricing"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary hover:bg-brand-secondary text-white font-medium text-sm transition-all shadow-lg hover:shadow-brand-primary/25"
          >
            <Plus className="w-4 h-4" />
            {t("Settings.buyCredits")}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-button text-gray-300 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t("Settings.logout")}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-brand-primary/10">
              <Zap
                className={cn(
                  "h-6 w-6",
                  credits > 0 ? "text-brand-primary" : "text-zinc-500",
                )}
              />
            </div>
            <div>
              <p className="text-sm text-zinc-400">{t("Stats.credits")}</p>
              <p className="text-2xl font-bold text-white">{credits}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/10">
              <CheckCircle className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">{t("Stats.generations")}</p>
              <p className="text-2xl font-bold text-white">
                {generations.length}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-500/10">
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">{t("Stats.memberSince")}</p>
              <p className="text-sm font-medium text-white">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Box className="h-5 w-5 text-brand-primary" />
            {t("History.title")}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchGenerations}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
              title="Refresh"
            >
              <RefreshCw
                className={cn(
                  "w-4 h-4 text-zinc-400",
                  isLoading && "animate-spin",
                )}
              />
            </button>
            <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded">
              {generations.length} items
            </span>
          </div>
        </div>

        {generations.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
            <Box className="w-16 h-16 text-zinc-700 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {t("History.emptyTitle")}
            </h3>
            <p className="text-zinc-500 mb-6 max-w-sm text-center">
              {t("History.emptyDesc")}
            </p>
            <Link
              href="/studio"
              className="px-8 py-3 rounded-full bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors"
            >
              {t("History.emptyBtn")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGenerations.map((gen) => {
              const modelUrl = getModelUrl(gen);
              const isProcessing = gen.status === "processing";
              const isFailed = gen.status === "failed";

              return (
                <div
                  key={gen.id}
                  className="group relative glass-card rounded-xl overflow-hidden hover:border-brand-primary/50 transition-all flex flex-col h-[350px] bg-zinc-900/40"
                >
                  {/* Status Overlay */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border",
                        isProcessing
                          ? "bg-amber-500/20 border-amber-500/30 text-amber-200"
                          : isFailed
                            ? "bg-red-500/20 border-red-500/30 text-red-200"
                            : "bg-emerald-500/20 border-emerald-500/30 text-emerald-200",
                      )}
                    >
                      {isProcessing
                        ? "GENERATING"
                        : isFailed
                          ? "FAILED"
                          : "READY"}
                    </span>
                  </div>

                  {/* 3D Viewer Area */}
                  <div className="flex-1 relative bg-gradient-to-b from-zinc-800/50 to-zinc-900/50">
                    {isProcessing ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 text-brand-primary animate-spin mb-3" />
                        <p className="text-xs text-brand-primary/80 font-mono animate-pulse">
                          AI PROCESSING...
                        </p>
                      </div>
                    ) : isFailed ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400">
                        <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                        <span className="text-xs">Generation Failed</span>
                      </div>
                    ) : modelUrl ? (
                      <model-viewer
                        src={modelUrl}
                        shadow-intensity="1"
                        camera-controls
                        auto-rotate
                        loading="lazy"
                        style={{ width: "100%", height: "100%" }}
                        alt="3D Model"
                      ></model-viewer>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                        <span className="text-xs">No preview available</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 border-t border-white/5 bg-zinc-950/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        {new Date(gen.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleDelete(gen.id)}
                        className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {!isProcessing && !isFailed && modelUrl && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            handleDownload(modelUrl, "glb", gen.id)
                          }
                          disabled={downloadingId === gen.id}
                          className="flex items-center justify-center gap-2 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs rounded-md transition-colors"
                        >
                          {downloadingId === gen.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                          GLB
                        </button>
                        <button
                          onClick={() =>
                            handleDownload(modelUrl, "stl", gen.id)
                          }
                          disabled={downloadingId === gen.id}
                          className="flex items-center justify-center gap-2 py-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs rounded-md transition-colors"
                        >
                          {downloadingId === gen.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                          STL
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination simple */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm bg-white/5 rounded-lg disabled:opacity-30 hover:bg-white/10"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-zinc-500">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm bg-white/5 rounded-lg disabled:opacity-30 hover:bg-white/10"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
