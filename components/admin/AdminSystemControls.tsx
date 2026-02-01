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
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-brand-primary">
        <ChartLineUp className="w-5 h-5" weight="duotone" />
        {t("Controls.systemControls")}
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-xl border border-white/10 bg-white/5 gap-6">
        <div>
          <h3 className="font-bold text-lg text-white">
            {t("Controls.maintenance")}
          </h3>
          <p className="text-gray-400 text-sm mt-1 max-w-xl">
            {t("Controls.maintenanceDesc")}
          </p>
        </div>

        <button
          onClick={onToggle}
          disabled={loading}
          className={cn(
            "flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all border uppercase tracking-widest shrink-0",
            maintenanceMode
              ? "bg-red-500 text-white border-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
              : "bg-brand-primary text-white border-brand-primary hover:bg-brand-secondary shadow-[0_0_20px_rgba(153,69,255,0.3)]",
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

