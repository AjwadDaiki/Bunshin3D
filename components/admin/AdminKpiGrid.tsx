"use client";

import {
  Money,
  Users,
  Cube,
  Lightning,
  TrendUp,
  ChartLineUp,
  Warning,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import AdminStatsCard from "./AdminStatsCard";
import { AdminStats } from "./types";

type Props = {
  stats: AdminStats;
};

export default function AdminKpiGrid({ stats }: Props) {
  const t = useTranslations("Admin");
  const tCommon = useTranslations("Common");
  const eurSymbol = tCommon("currencySymbols.eur");
  const usdSymbol = tCommon("currencySymbols.usd");

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={<Money className="w-6 h-6" weight="duotone" />}
          label={t("KPI.revenue")}
          value={`${eurSymbol}${stats.revenue.toFixed(2)}`}
          subValue={t("KPI.arpuSubValue", { symbol: eurSymbol, value: stats.arpu })}
          colorClass="text-green-400"
        />
        <AdminStatsCard
          icon={<Users className="w-6 h-6" weight="duotone" />}
          label={t("KPI.users")}
          value={stats.users.toString()}
          subValue={`+${stats.todayUsers || 0} ${t("KPI.today")}`}
          colorClass="text-blue-400"
        />
        <AdminStatsCard
          icon={<Cube className="w-6 h-6" weight="duotone" />}
          label={t("KPI.models")}
          value={stats.models.toString()}
          subValue={`+${stats.todayGenerations || 0} ${t("KPI.today")}`}
          colorClass="text-brand-primary"
        />
        <AdminStatsCard
          icon={<Lightning className="w-6 h-6" weight="fill" />}
          label={t("KPI.burn")}
          value={`${usdSymbol}${stats.burn}`}
          subValue={t("KPI.gpuCost")}
          colorClass="text-orange-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminStatsCard
          icon={<TrendUp className="w-6 h-6" weight="duotone" />}
          label={t("KPI.conversion")}
          value={`${stats.conversion}%`}
          colorClass="text-cyan-400"
        />
        <AdminStatsCard
          icon={<ChartLineUp className="w-6 h-6" weight="duotone" />}
          label={t("KPI.arpu")}
          value={`${eurSymbol}${stats.arpu}`}
          colorClass="text-purple-400"
        />
        <AdminStatsCard
          icon={<Warning className="w-6 h-6" weight="duotone" />}
          label={t("KPI.errorRate")}
          value={`${stats.errorRate || "0"}%`}
          colorClass="text-red-400"
        />
      </div>
    </>
  );
}

