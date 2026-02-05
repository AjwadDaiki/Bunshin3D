"use client";

import { Calendar, CheckCircle, Lightning } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  credits: number;
  generationsCount: number;
  memberSince: string;
};

export default function DashboardStatsGrid({
  credits,
  generationsCount,
  memberSince,
}: Props) {
  const t = useTranslations("Account");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-[#111] border border-white/6 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#191919] rounded-lg">
            <Lightning
              className={cn(
                "h-6 w-6",
                credits > 5 ? "text-amber-400" : "text-red-500",
              )}
              weight="fill"
            />
          </div>
          <div>
            <p className="text-sm text-neutral-400">{t("Stats.credits")}</p>
            <p className="text-2xl font-bold text-white">{credits}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-white/6 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#191919] rounded-lg">
            <CheckCircle className="h-6 w-6 text-emerald-500" weight="fill" />
          </div>
          <div>
            <p className="text-sm text-neutral-400">{t("Stats.generations")}</p>
            <p className="text-2xl font-bold text-white">{generationsCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-white/6 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#191919] rounded-lg">
            <Calendar className="h-6 w-6 text-neutral-400" weight="duotone" />
          </div>
          <div>
            <p className="text-sm text-neutral-400">{t("Stats.memberSince")}</p>
            <p className="text-sm font-medium text-white">{memberSince}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
