"use client";

import { ChartLineUp, Lock, LockOpen } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  loading: boolean;
  maintenanceMode: boolean;
  onToggle: () => void;
};

export default function AdminSystemControls({
  loading,
  maintenanceMode,
  onToggle,
}: Props) {
  const t = useTranslations("Admin");

  return (
    <div className="rounded-xl border border-white/6 bg-[#111] p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
        <ChartLineUp className="w-5 h-5" weight="duotone" />
        {t("Controls.systemControls")}
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-xl border border-white/6 bg-[#191919] gap-6">
        <div>
          <h3 className="font-bold text-lg text-white">
            {t("Controls.maintenance")}
          </h3>
          <p className="text-neutral-400 text-sm mt-1 max-w-xl">
            {t("Controls.maintenanceDesc")}
          </p>
        </div>

        <button
          onClick={onToggle}
          disabled={loading}
          className={cn(
            "flex items-center gap-2 px-8 py-4 rounded-lg font-bold transition-colors border shrink-0",
            maintenanceMode
              ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
              : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
          )}
        >
          {maintenanceMode ? (
            <Lock className="w-5 h-5" weight="bold" />
          ) : (
            <LockOpen className="w-5 h-5" weight="bold" />
          )}
          {maintenanceMode ? t("Controls.inactive") : t("Controls.active")}
        </button>
      </div>
    </div>
  );
}

