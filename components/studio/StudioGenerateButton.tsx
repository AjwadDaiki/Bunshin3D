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
        "w-full mt-6 px-6 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-3",
        canGenerate
          ? "bg-white text-neutral-950 hover:bg-neutral-200"
          : "bg-[#191919] border border-white/6 text-neutral-400 hover:bg-[#222]",
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
