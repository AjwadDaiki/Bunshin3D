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
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
        {t("Quality.title")}
      </h3>
      <div className="space-y-3">
        <button
          onClick={() => onChange("standard")}
          className={cn(
            "w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group",
            quality === "standard"
              ? "border-brand-primary bg-brand-primary/5"
              : "border-white/5 hover:border-white/10 bg-surface-2",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                quality === "standard"
                  ? "bg-amber-400/20 text-amber-400"
                  : "bg-white/5 text-gray-400",
              )}
            >
              <BunshinLogo className="h-5 w-5" />
            </div>
            <div className="text-left">
              <span
                className={cn(
                  "block font-bold",
                  quality === "standard" ? "text-white" : "text-gray-400",
                )}
              >
                {t("Quality.standard")}
              </span>
              <span className="text-xs text-gray-500">
                {t("Quality.standardDesc")}
              </span>
            </div>
          </div>
          <span className="text-brand-primary font-bold">
            {t("Quality.standardCost", { cost: 1 })}
          </span>
        </button>

        <button
          onClick={() => onChange("premium")}
          className={cn(
            "w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group",
            quality === "premium"
              ? "border-purple-500 bg-purple-500/5"
              : "border-white/5 hover:border-white/10 bg-surface-2",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                quality === "premium"
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-white/5 text-gray-400",
              )}
            >
              <Sparkle className="h-5 w-5" weight="fill" />
            </div>
            <div className="text-left">
              <span
                className={cn(
                  "block font-bold",
                  quality === "premium" ? "text-white" : "text-gray-400",
                )}
              >
                {t("Quality.premium")}
              </span>
              <span className="text-xs text-gray-500">
                {t("Quality.premiumDesc")}
              </span>
            </div>
          </div>
          <span className="text-purple-400 font-bold">
            {t("Quality.premiumCost", { cost: 5 })}
          </span>
        </button>
      </div>
    </div>
  );
}
