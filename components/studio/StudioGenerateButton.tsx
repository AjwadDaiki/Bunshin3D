"use client";

import { CircleNotch, Sparkle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  isGenerating: boolean;
  canGenerate: boolean;
  onGenerate: () => void;
};

export default function StudioGenerateButton({
  isGenerating,
  canGenerate,
  onGenerate,
}: Props) {
  const t = useTranslations("Studio");

  return (
    <button
      onClick={onGenerate}
      disabled={isGenerating}
      className={cn(
        "w-full mt-6 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg",
        canGenerate
          ? "bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 shadow-brand-primary/25"
          : "bg-surface-3 border border-white/10 text-white/80 hover:bg-surface-2",
        isGenerating && "opacity-60 cursor-not-allowed",
      )}
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
  );
}
