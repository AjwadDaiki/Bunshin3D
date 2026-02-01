"use client";

import { Cube, Trash, CircleNotch, SpinnerGap } from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Generation } from "../types";

type Props = {
  generation: Generation;
  isDeleting: boolean;
  onDelete: () => void;
};

export default function GenerationMedia({ generation, isDeleting, onDelete }: Props) {
  const t = useTranslations("Account");
  const isProcessing = generation.status === "processing";
  const [imageError, setImageError] = useState(false);
  const showImage = !!generation.source_image_url && !imageError;

  const statusLabels: Record<string, string> = {
    processing: t("History.statuses.processing"),
    succeeded: t("History.statuses.succeeded"),
    failed: t("History.statuses.failed"),
    queued: t("History.statuses.queued"),
  };
  const statusLabel = statusLabels[generation.status] || generation.status;

  return (
    <div className="aspect-square bg-surface-2 relative flex items-center justify-center overflow-hidden">
      {showImage ? (
        <img
          src={generation.source_image_url}
          alt={t("History.sourceAlt")}
          onError={() => setImageError(true)}
          className={cn(
            "w-full h-full object-contain p-4 transition-opacity",
            isProcessing ? "opacity-50" : "opacity-80 group-hover:opacity-100",
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
        {statusLabel}
      </div>

      <button
        onClick={onDelete}
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
          <SpinnerGap className="w-8 h-8 text-brand-primary animate-spin" weight="bold" />
        </div>
      )}
    </div>
  );
}
