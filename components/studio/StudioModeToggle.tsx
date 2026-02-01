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
    <div className="glass-card p-2 rounded-2xl flex gap-2">
      <button
        onClick={() => onChange("image")}
        className={cn(
          "flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
          mode === "image"
            ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
            : "hover:bg-white/5 text-gray-400",
        )}
      >
        <UploadSimple className="h-5 w-5" weight="bold" />
        {t("Modes.imageToModel")}
      </button>
      <button
        onClick={() => onChange("text")}
        className={cn(
          "flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
          mode === "text"
            ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
            : "hover:bg-white/5 text-gray-400",
        )}
      >
        <Sparkle className="h-5 w-5" weight="fill" />
        {t("Modes.textToModel")}
      </button>
    </div>
  );
}
