"use client";

import { UploadSimple, Sparkle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Mode } from "./types";

type Props = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

export default function StudioModeToggle({ mode, onChange }: Props) {
  const t = useTranslations("Studio");

  return (
    <div className="bg-[#111] border border-white/6 rounded-lg p-2 flex gap-2">
      <button
        onClick={() => onChange("image")}
        className={cn(
          "flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2",
          mode === "image"
            ? "bg-white text-neutral-950"
            : "text-neutral-400 hover:text-white",
        )}
      >
        <UploadSimple className="h-5 w-5" weight="bold" />
        {t("Modes.imageToModel")}
      </button>
      <button
        onClick={() => onChange("text")}
        className={cn(
          "flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2",
          mode === "text"
            ? "bg-white text-neutral-950"
            : "text-neutral-400 hover:text-white",
        )}
      >
        <Sparkle className="h-5 w-5" weight="fill" />
        {t("Modes.textToModel")}
      </button>
    </div>
  );
}
