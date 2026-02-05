"use client";

import { Aperture, Cube, Sparkle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const FORMATS = [
  { key: "standard", icon: Sparkle, tone: "text-white" },
  { key: "lowpoly", icon: Cube, tone: "text-white" },
  { key: "print", icon: Aperture, tone: "text-white" },
] as const;

export default function StudioExportFormats() {
  const t = useTranslations("Studio");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      {FORMATS.map(({ key, icon: Icon, tone }) => (
        <div
          key={key}
          className="rounded-xl border border-white/6 bg-[#191919] p-4 flex items-start gap-3"
        >
          <span
            className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center bg-white/5",
              tone,
            )}
          >
            <Icon className="h-4 w-4" weight="fill" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              {t(`Interface.Formats.${key}.title` as const)}
            </p>
            <p className="text-xs text-neutral-400">
              {t(`Interface.Formats.${key}.subtitle` as const)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
