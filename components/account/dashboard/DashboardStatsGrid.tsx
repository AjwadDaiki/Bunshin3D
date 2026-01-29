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
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-brand-primary/10">
            <Lightning
              className={cn(
                "h-6 w-6",
                credits > 5 ? "text-amber-400" : "text-error",
              )}
              weight="fill"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400">{t("Stats.credits")}</p>
            <p className="text-2xl font-bold">{credits}</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-success/10">
            <CheckCircle className="h-6 w-6 text-success" weight="fill" />
          </div>
          <div>
            <p className="text-sm text-gray-400">{t("Stats.generations")}</p>
            <p className="text-2xl font-bold">{generationsCount}</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-brand-accent/10">
            <Calendar className="h-6 w-6 text-brand-accent" weight="duotone" />
          </div>
          <div>
            <p className="text-sm text-gray-400">{t("Stats.memberSince")}</p>
            <p className="text-sm font-medium">{memberSince}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
