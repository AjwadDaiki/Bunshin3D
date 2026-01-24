"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase"; // Client Browser
import { useRouter, Link } from "@/i18n/routing";
import {
  LogOut,
  CreditCard,
  Layers,
  Box,
  Calendar,
  Download,
  Plus,
  Zap,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardProps = {
  user: any;
  profile: any;
  generations: any[];
};

export default function UserDashboard({
  user,
  profile,
  generations,
}: DashboardProps) {
  const t = useTranslations("Account");
  const router = useRouter();
  const supabase = createClient();
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

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

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGenerations = generations.slice(startIndex, endIndex);
  const totalPages = Math.ceil(generations.length / itemsPerPage);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- HEADER & STATS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Welcome Block */}
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

        {/* Actions Block */}
        <div className="flex items-start justify-end gap-4">
          <Link
            href="/pricing"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary hover:bg-brand-secondary text-white font-medium text-sm transition-smooth shadow-lg shadow-brand-primary/20"
          >
            <Plus className="w-4 h-4" />
            {t("Settings.buyCredits")}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-button text-gray-300 hover:text-white font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            {t("Settings.logout")}
          </button>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-brand-primary/10">
              <Zap className={cn(
                "h-6 w-6",
                profile?.credits > 5 ? "text-amber-400" : "text-error"
              )} />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t("Stats.credits")}</p>
              <p className="text-2xl font-bold">{profile?.credits || 0}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
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
              <Calendar className="h-6 w-6 text-brand-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Member Since</p>
              <p className="text-sm font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- HISTORY GRID --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-xl font-bold text-white">{t("History.title")}</h2>
        </div>

        {generations.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
              <Box className="w-8 h-8 text-zinc-600" />
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
            {/* GENERATIONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedGenerations.map((gen) => (
                <div
                  key={gen.id}
                  className="group relative glass-card rounded-xl overflow-hidden hover:bg-white/10 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="aspect-square bg-surface-2 relative p-4 flex items-center justify-center">
                    <img
                      src={gen.source_image_url}
                      alt="Source"
                      className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute top-3 right-3 px-2 py-1 glass-card rounded text-[10px] font-mono text-brand-primary uppercase font-bold">
                      {gen.mode}
                    </div>
                  </div>

                  {/* Info Footer */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(gen.created_at)}
                      </span>
                    </div>

                    <a
                      href={gen.model_glb_url}
                      download
                      className="flex items-center justify-center gap-2 w-full py-2 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-medium rounded-lg transition-smooth"
                    >
                      <Download className="w-3 h-3" />
                      {t("History.download")} GLB
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 glass-button rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 glass-button rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

