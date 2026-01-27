"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase";
import { useRouter, Link } from "@/i18n/routing";
import {
  SignOut,
  Cube,
  Calendar,
  DownloadSimple,
  Plus,
  Lightning,
  CheckCircle,
  SpinnerGap,
  ArrowClockwise,
  Trash,
  CircleNotch,
  Aperture, // Ajout de l'icône pour USDZ
} from "@phosphor-icons/react";
// On remplace l'import direct des fonctions par le hook
import {
  useModelDownload,
  type DownloadFormat,
} from "@/hooks/useModelDownload";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const ModelViewer = dynamic(() => import("@/components/ui/ModelViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <SpinnerGap
        className="w-8 h-8 text-brand-primary animate-spin"
        weight="bold"
      />
    </div>
  ),
});

type Generation = {
  id: string;
  user_id: string;
  status: string;
  mode?: string;
  type?: string;
  source_image_url?: string;
  model_glb_url?: string;
  created_at: string;
  prediction_id?: string;
};

type DashboardProps = {
  user: any;
  profile: any;
  generations: Generation[];
};

export default function UserDashboard({
  user,
  profile: initialProfile,
  generations: initialGenerations,
}: DashboardProps) {
  const t = useTranslations("Account");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const supabase = createClient();

  const [generations, setGenerations] =
    useState<Generation[]>(initialGenerations);
  const [profile, setProfile] = useState(initialProfile);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 12;

  const fetchGenerations = useCallback(async () => {
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setGenerations(data);
    }
  }, [supabase, user.id]);

  const fetchProfile = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  }, [supabase, user.id]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchGenerations(), fetchProfile()]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (initialGenerations.length === 0) {
      fetchGenerations();
    }
  }, [initialGenerations.length, fetchGenerations]);

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
          if (payload.eventType === "INSERT") {
            setGenerations((prev) => [payload.new as Generation, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setGenerations((prev) =>
              prev.map((g) =>
                g.id === (payload.new as Generation).id
                  ? (payload.new as Generation)
                  : g,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setGenerations((prev) =>
              prev.filter((g) => g.id !== (payload.old as Generation).id),
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
          setProfile(payload.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGenerations = generations.slice(startIndex, endIndex);
  const totalPages = Math.ceil(generations.length / itemsPerPage);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {t("Header.title")}
          </h1>
          <p className="text-zinc-400">
            {t("Header.welcome")}{" "}
            <span className="text-white font-medium">
              {profile?.email || user.email}
            </span>
          </p>
          <p className="text-sm text-zinc-500">{t("Header.subtitle")}</p>
        </div>

        <div className="flex items-start justify-end gap-4">
          <Link
            href="/pricing"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary hover:bg-brand-secondary text-white font-medium text-sm transition-smooth shadow-lg shadow-brand-primary/20"
          >
            <Plus className="w-4 h-4" weight="bold" />
            {t("Settings.buyCredits")}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-button text-gray-300 hover:text-white font-medium text-sm"
          >
            <SignOut className="w-4 h-4" weight="bold" />
            {t("Settings.logout")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-brand-primary/10">
              <Lightning
                className={cn(
                  "h-6 w-6",
                  (profile?.credits ?? 0) > 5 ? "text-amber-400" : "text-error",
                )}
                weight="fill"
              />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t("Stats.credits")}</p>
              <p className="text-2xl font-bold">{profile?.credits ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" weight="fill" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t("Stats.generations")}</p>
              <p className="text-2xl font-bold">{generations.length}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-brand-accent/10">
              <Calendar
                className="h-6 w-6 text-brand-accent"
                weight="duotone"
              />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t("Stats.memberSince")}</p>
              <p className="text-sm font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-xl font-bold text-white">{t("History.title")}</h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 glass-button rounded-lg text-sm text-gray-400 hover:text-white disabled:opacity-50"
          >
            <ArrowClockwise
              className={cn("w-4 h-4", isRefreshing && "animate-spin")}
              weight="bold"
            />
          </button>
        </div>

        {generations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
              <Cube className="w-8 h-8 text-zinc-600" weight="duotone" />
            </div>
            <h3 className="text-lg font-medium text-white">
              {t("History.emptyTitle")}
            </h3>
            <p className="text-zinc-500 mb-6">{t("History.emptyDesc")}</p>
            <Link
              href="/studio"
              className="px-6 py-2 rounded-full bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors"
            >
              {t("History.emptyBtn")}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedGenerations.map((gen) => (
                <GenerationCard
                  key={gen.id}
                  generation={gen}
                  formatDate={formatDate}
                  onDelete={async (id) => {
                    await supabase.from("generations").delete().eq("id", id);
                    setGenerations((prev) => prev.filter((g) => g.id !== id));
                  }}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 glass-button rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tCommon("previous")}
                </button>
                <span className="px-4 py-2 text-gray-400">
                  {tCommon("pageOf", { page, total: totalPages })}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 glass-button rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tCommon("next")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function GenerationCard({
  generation,
  formatDate,
  onDelete,
}: {
  generation: Generation;
  formatDate: (date: string) => string;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isProcessing = generation.status === "processing";
  const hasModel = !!generation.model_glb_url;

  // Utilisation du hook pour gérer tous les formats
  const { downloadModel, isDownloading, downloadFormat } = useModelDownload({
    onError: (err) => console.error("Download error:", err),
  });

  const handleDownload = (format: DownloadFormat) => {
    if (generation.model_glb_url) {
      downloadModel(generation.model_glb_url, format);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this model?")) return;
    setIsDeleting(true);
    await onDelete(generation.id);
  };

  return (
    <div className="group relative glass-card rounded-xl overflow-hidden hover:bg-white/10 transition-all">
      <div className="aspect-square bg-surface-2 relative flex items-center justify-center overflow-hidden">
        {hasModel ? (
          <ModelViewer
            src={generation.model_glb_url!}
            className="w-full h-full"
          />
        ) : generation.source_image_url ? (
          <img
            src={generation.source_image_url}
            alt="Source"
            className={cn(
              "w-full h-full object-contain p-4 transition-opacity",
              isProcessing
                ? "opacity-50"
                : "opacity-80 group-hover:opacity-100",
            )}
          />
        ) : (
          <Cube className="w-12 h-12 text-zinc-600" weight="duotone" />
        )}
        <div
          className={cn(
            "absolute top-3 right-3 px-2 py-1 glass-card rounded text-[10px] font-mono uppercase font-bold",
            isProcessing ? "text-amber-400" : "text-brand-primary",
          )}
        >
          {generation.status}
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-3 left-3 p-1.5 glass-card rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
        >
          {isDeleting ? (
            <CircleNotch className="w-4 h-4 animate-spin" weight="bold" />
          ) : (
            <Trash className="w-4 h-4" weight="bold" />
          )}
        </button>
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <SpinnerGap
              className="w-8 h-8 text-brand-primary animate-spin"
              weight="bold"
            />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center mb-3">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" weight="duotone" />
            {formatDate(generation.created_at)}
          </span>
        </div>

        {hasModel ? (
          <div className="grid grid-cols-2 gap-2">
            {/* GLB Button */}
            <button
              onClick={() => handleDownload("glb")}
              disabled={isDownloading}
              className={cn(
                "flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg transition-smooth border",
                isDownloading && downloadFormat === "glb"
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-surface-3 hover:bg-white/10 text-white border-white/10",
              )}
              title="Download GLB (Web/Standard)"
            >
              {isDownloading && downloadFormat === "glb" ? (
                <CircleNotch className="w-3 h-3 animate-spin" weight="bold" />
              ) : (
                <DownloadSimple className="w-3 h-3" weight="bold" />
              )}
              GLB
            </button>

            {/* OBJ Button */}
            <button
              onClick={() => handleDownload("obj")}
              disabled={isDownloading}
              className={cn(
                "flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg transition-smooth border",
                isDownloading && downloadFormat === "obj"
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-surface-3 hover:bg-white/10 text-white border-white/10",
              )}
              title="Download OBJ (Universal)"
            >
              {isDownloading && downloadFormat === "obj" ? (
                <CircleNotch className="w-3 h-3 animate-spin" weight="bold" />
              ) : (
                <Cube className="w-3 h-3" weight="fill" />
              )}
              OBJ
            </button>

            {/* USDZ Button */}
            <button
              onClick={() => handleDownload("usdz")}
              disabled={isDownloading}
              className={cn(
                "flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg transition-smooth border",
                isDownloading && downloadFormat === "usdz"
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-surface-3 hover:bg-white/10 text-white border-white/10",
              )}
              title="Download USDZ (iOS/AR)"
            >
              {isDownloading && downloadFormat === "usdz" ? (
                <CircleNotch className="w-3 h-3 animate-spin" weight="bold" />
              ) : (
                <Aperture className="w-3 h-3" weight="fill" />
              )}
              USDZ
            </button>

            {/* STL Button */}
            <button
              onClick={() => handleDownload("stl")}
              disabled={isDownloading}
              className={cn(
                "flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg transition-smooth border",
                isDownloading && downloadFormat === "stl"
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-brand-primary hover:bg-brand-secondary text-white border-transparent",
              )}
              title="Download STL (3D Printing)"
            >
              {isDownloading && downloadFormat === "stl" ? (
                <CircleNotch className="w-3 h-3 animate-spin" weight="bold" />
              ) : (
                <DownloadSimple className="w-3 h-3" weight="bold" />
              )}
              STL
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-800 text-zinc-500 text-xs font-medium rounded-lg">
            <SpinnerGap className="w-3 h-3 animate-spin" weight="bold" />
            {isProcessing ? "Processing..." : "Pending"}
          </div>
        )}
      </div>
    </div>
  );
}
