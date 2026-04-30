"use client";

import { Sparkle, Crown } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Quality } from "./types";
import { BunshinLogo } from "@/components/ui/BunshinLogo";

type Props = {
  quality: Quality;
  onChange: (quality: Quality) => void;
};

const QUALITY_OPTIONS: {
  id: Quality;
  icon: typeof Sparkle;
  iconWeight: "fill" | "bold" | "regular";
  labelKey: string;
  descKey: string;
  costKey: string;
  cost: number;
  useBunshinLogo?: boolean;
}[] = [
  {
    id: "standard",
    icon: Sparkle, // placeholder, we use BunshinLogo instead
    iconWeight: "fill",
    labelKey: "Quality.standard",
    descKey: "Quality.standardDesc",
    costKey: "Quality.standardCost",
    cost: 1,
    useBunshinLogo: true,
  },
  {
    id: "premium",
    icon: Sparkle,
    iconWeight: "fill",
    labelKey: "Quality.premium",
    descKey: "Quality.premiumDesc",
    costKey: "Quality.premiumCost",
    cost: 5,
  },
  {
    id: "ultra",
    icon: Crown,
    iconWeight: "fill",
    labelKey: "Quality.ultra",
    descKey: "Quality.ultraDesc",
    costKey: "Quality.ultraCost",
    cost: 10,
  },
];

export default function StudioQualitySelector({ quality, onChange }: Props) {
  const t = useTranslations("Studio");

  return (
    <div className="bg-[#111] border border-white/6 rounded-xl p-6">
      <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">
        {t("Quality.title")}
      </h3>
      <div className="space-y-3">
        {QUALITY_OPTIONS.map(({ id, icon: Icon, iconWeight, labelKey, descKey, costKey, cost, useBunshinLogo }) => {
          const isSelected = quality === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cn(
                "w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                isSelected
                  ? id === "ultra"
                    ? "border-amber-500/60 bg-amber-500/5"
                    : "border-white bg-white/5"
                  : "border-white/6 hover:border-white/10 bg-[#0a0a0a]",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    isSelected
                      ? id === "ultra"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-white/10 text-white"
                      : "bg-white/5 text-neutral-400",
                  )}
                >
                  {useBunshinLogo ? (
                    <BunshinLogo className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" weight={iconWeight} />
                  )}
                </div>
                <div className="text-left">
                  <span
                    className={cn(
                      "block font-bold",
                      isSelected
                        ? id === "ultra"
                          ? "text-amber-400"
                          : "text-white"
                        : "text-neutral-400",
                    )}
                  >
                    {t(labelKey)}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {t(descKey)}
                  </span>
                </div>
              </div>
              <span className={cn(
                "font-bold",
                isSelected && id === "ultra" ? "text-amber-400" : "text-white",
              )}>
                {t(costKey, { cost })}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
