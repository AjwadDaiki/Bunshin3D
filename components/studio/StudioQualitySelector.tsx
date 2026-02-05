"use client";

import { Sparkle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Quality } from "./types";
import { BunshinLogo } from "@/components/ui/BunshinLogo";

type Props = {
  quality: Quality;
  onChange: (quality: Quality) => void;
};

export default function StudioQualitySelector({ quality, onChange }: Props) {
  const t = useTranslations("Studio");

  return (
    <div className="bg-[#111] border border-white/6 rounded-xl p-6">
      <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">
        {t("Quality.title")}
      </h3>
      <div className="space-y-3">
        <button
          onClick={() => onChange("standard")}
          className={cn(
            "w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
            quality === "standard"
              ? "border-white bg-white/5"
              : "border-white/6 hover:border-white/10 bg-[#0a0a0a]",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                quality === "standard"
                  ? "bg-white/10 text-white"
                  : "bg-white/5 text-neutral-400",
              )}
            >
              <BunshinLogo className="h-5 w-5" />
            </div>
            <div className="text-left">
              <span
                className={cn(
                  "block font-bold",
                  quality === "standard" ? "text-white" : "text-neutral-400",
                )}
              >
                {t("Quality.standard")}
              </span>
              <span className="text-xs text-neutral-500">
                {t("Quality.standardDesc")}
              </span>
            </div>
          </div>
          <span className="text-white font-bold">
            {t("Quality.standardCost", { cost: 1 })}
          </span>
        </button>

        <button
          onClick={() => onChange("premium")}
          className={cn(
            "w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
            quality === "premium"
              ? "border-white bg-white/5"
              : "border-white/6 hover:border-white/10 bg-[#0a0a0a]",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                quality === "premium"
                  ? "bg-white/10 text-white"
                  : "bg-white/5 text-neutral-400",
              )}
            >
              <Sparkle className="h-5 w-5" weight="fill" />
            </div>
            <div className="text-left">
              <span
                className={cn(
                  "block font-bold",
                  quality === "premium" ? "text-white" : "text-neutral-400",
                )}
              >
                {t("Quality.premium")}
              </span>
              <span className="text-xs text-neutral-500">
                {t("Quality.premiumDesc")}
              </span>
            </div>
          </div>
          <span className="text-white font-bold">
            {t("Quality.premiumCost", { cost: 5 })}
          </span>
        </button>
      </div>
    </div>
  );
}
