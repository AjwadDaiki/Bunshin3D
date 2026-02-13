"use client";

import { ShieldWarning, Pulse } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

type Props = {
  serverTime?: string;
};

export default function AdminDashboardHeader({ serverTime }: Props) {
  const t = useTranslations("Admin");

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-white/10 pb-6 gap-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight uppercase flex items-center gap-3">
          <ShieldWarning className="w-8 h-8 text-blue-500" weight="fill" />
          {t("Header.title")}
        </h1>
        <p className="text-gray-400 text-sm font-bold tracking-wider">
          {t("Header.subtitle")}
        </p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="hidden md:block text-right">
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            {t("Controls.serverTime")}
          </div>
          <div className="font-mono text-lg text-blue-500 min-h-[28px]">
            {serverTime || ""}
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 border bg-blue-500/10 border-blue-500/30 text-blue-400">
          <Pulse className="w-4 h-4 animate-pulse" weight="fill" />
          {t("Header.status")}
        </div>
      </div>
    </div>
  );
}
