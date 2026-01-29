"use client";

import { useState } from "react";
import { Calendar, Clock } from "@phosphor-icons/react";
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
  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleDelete = async () => {
    if (!confirm(t("History.confirmDelete"))) return;
    setIsDeleting(true);
    await onDelete(generation.id);
  };

  return (
    <div className="group relative glass-card rounded-xl overflow-hidden hover:bg-white/10 transition-all">
      <GenerationMedia
        generation={generation}
        isDeleting={isDeleting}
        onDelete={handleDelete}
      />

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" weight="duotone" />
            {formatDate(generation.created_at)}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" weight="duotone" />
            {t("History.generatedTime", { time: formatTime(generation.created_at) })}
          </span>
        </div>

        <GenerationDownloads
          modelUrl={generation.model_glb_url}
          status={generation.status}
        />
      </div>
    </div>
  );
}
