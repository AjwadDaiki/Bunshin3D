"use client";

import { useTranslations } from "next-intl";
import { Lightning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Props = {
  credits: number;
};

export default function StudioHeader({ credits }: Props) {
  const t = useTranslations("Studio");
  const tCommon = useTranslations("Common");

  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-surface-2/80 p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-gray-500">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            {t("Header.version")}
          </span>
        </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-brand">
            {t("Header.title")}
          </h1>
          <p className="text-gray-400 max-w-2xl">{t("Header.subtitle")}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-black/30 px-6 py-4 rounded-2xl border border-white/10">
          <span className="text-green-400 flex items-center gap-2 text-sm font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            {t("Header.status")}
          </span>
          <div className="hidden sm:block h-5 w-px bg-white/10" />
          <span className="text-amber-400 font-bold flex items-center gap-2">
            <Lightning className={cn("h-5 w-5")} weight="fill" />
            {tCommon("creditsWithCount", { count: credits })}
          </span>
        </div>
      </div>
    </div>
  );
}
