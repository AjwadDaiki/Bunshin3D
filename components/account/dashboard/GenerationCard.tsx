"use client";

import { useState } from "react";
import { Calendar, Clock, X, Trash } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import GenerationMedia from "./GenerationMedia";
import GenerationDownloads from "./GenerationDownloads";
import { Generation } from "../types";

type Props = {
  generation: Generation;
  formatDate: (date: string) => string;
  onDelete: (id: string) => Promise<void>;
};

export default function GenerationCard({ generation, formatDate, onDelete }: Props) {
  const t = useTranslations("Account");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleDelete = async () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    setIsDeleting(true);
    await onDelete(generation.id);
  };

  return (
    <div className="group relative bg-[#111] border border-white/6 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
      <GenerationMedia
        generation={generation}
        isDeleting={isDeleting}
        onDelete={handleDelete}
      />

      <div className="p-4 border-t border-white/6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" weight="duotone" />
            {formatDate(generation.created_at)}
          </span>
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <Clock className="w-3 h-3" weight="duotone" />
            {t("History.generatedTime", { time: formatTime(generation.created_at) })}
          </span>
        </div>

        <GenerationDownloads
          modelUrl={generation.model_glb_url}
          status={generation.status}
        />

        {showConfirm && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
            <p className="text-xs text-red-300 flex-1">{t("History.confirmDelete")}</p>
            <button
              onClick={confirmDelete}
              className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-500"
            >
              <Trash className="h-3 w-3" weight="bold" />
              {t("History.confirmYes")}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="flex items-center justify-center rounded-lg border border-white/6 bg-[#191919] px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:border-white/10"
            >
              {t("History.confirmNo")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
