"use client";

import { Aperture, Cube, Sparkle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const FORMATS = [
  { key: "standard", icon: Sparkle, tone: "text-brand-primary" },
  { key: "lowpoly", icon: Cube, tone: "text-emerald-400" },
  { key: "print", icon: Aperture, tone: "text-amber-400" },
] as const;

export default function StudioExportFormats() {
  const t = useTranslations("Studio");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      {FORMATS.map(({ key, icon: Icon, tone }) => (
        <div
          key={key}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start gap-3"
        >
          <span
            className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center bg-white/10",
              tone,
            )}
          >
            <Icon className="h-4 w-4" weight="fill" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              {t(`Interface.Formats.${key}.title` as const)}
            </p>
            <p className="text-xs text-gray-400">
              {t(`Interface.Formats.${key}.subtitle` as const)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
