"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Eye, Cube, SpinnerGap, Image as ImageIcon, CheckCircle, XCircle } from "@phosphor-icons/react";
import { getUserGenerations } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

type Generation = {
  id: string;
  mode: string;
  status: string;
  created_at: string;
  source_image_url?: string;
  model_glb_url?: string;
};

type Props = {
  user: { id: string; email: string };
  onClose: () => void;
};

export default function AdminGenerationsModal({ user, onClose }: Props) {
  const t = useTranslations("Admin");
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const data = await getUserGenerations(user.id);
        setGenerations(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch generations");
      } finally {
        setLoading(false);
      }
    };

    fetchGenerations();
  }, [user.id]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[80vh] bg-surface-2 border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-primary/20">
              <Eye className="w-6 h-6 text-brand-primary" weight="fill" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t("Users.inspectTitle")}
              </h3>
              <p className="text-sm text-gray-400 truncate max-w-[300px]">
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <SpinnerGap className="w-8 h-8 text-brand-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          ) : generations.length === 0 ? (
            <div className="text-center py-12">
              <Cube className="w-16 h-16 text-gray-600 mx-auto mb-4" weight="duotone" />
              <p className="text-gray-400">{t("Users.noGenerations")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generations.map((gen) => (
                <div
                  key={gen.id}
                  className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-all"
                >
                  <div className="aspect-square relative bg-surface-1">
                    {gen.source_image_url ? (
                      <img
                        src={gen.source_image_url}
                        alt="Source"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-600" weight="duotone" />
                      </div>
                    )}

                    <div className="absolute top-2 left-2">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                          gen.status === "succeeded"
                            ? "bg-green-500/20 text-green-400"
                            : gen.status === "failed"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        )}
                      >
                        {gen.status === "succeeded" && <CheckCircle className="w-3 h-3 inline mr-1" weight="fill" />}
                        {gen.status === "failed" && <XCircle className="w-3 h-3 inline mr-1" weight="fill" />}
                        {gen.status}
                      </span>
                    </div>

                    {gen.model_glb_url && (
                      <div className="absolute top-2 right-2">
                        <a
                          href={gen.model_glb_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-brand-primary/80 text-white hover:bg-brand-primary transition-colors"
                        >
                          <Cube className="w-4 h-4" weight="fill" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="text-xs font-bold uppercase text-brand-primary mb-1">
                      {gen.mode}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(gen.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {t("Users.totalGenerations", { count: generations.length })}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl font-medium bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
            >
              {t("Users.close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
