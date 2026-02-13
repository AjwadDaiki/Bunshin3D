"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CreditCard } from "@phosphor-icons/react";
import { AdminStats, AdminUserProfile } from "./types";
import AdminKpiGrid from "./AdminKpiGrid";
import AdminRecentUsersTable from "./AdminRecentUsersTable";
import AdminRecentGenerationsTable from "./AdminRecentGenerationsTable";
import AdminSystemControls from "./AdminSystemControls";
import AdminSimulatePaymentModal from "./AdminSimulatePaymentModal";

type Generation = {
  id: string;
  mode: string;
  status: string;
  created_at: string;
};

type Props = {
  stats: AdminStats;
  recentUsers: AdminUserProfile[];
  recentGenerations: Generation[];
  maintenanceMode: boolean;
  loading: boolean;
  onToggleMaintenance: () => void;
  onRefresh: () => void;
};

export default function AdminOverviewTab({
  stats,
  recentUsers,
  recentGenerations,
  maintenanceMode,
  loading,
  onToggleMaintenance,
  onRefresh,
}: Props) {
  const t = useTranslations("Admin");
  const [showSimulate, setShowSimulate] = useState(false);

  return (
    <>
      <AdminKpiGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminRecentUsersTable users={recentUsers} />
        <AdminRecentGenerationsTable generations={recentGenerations} />
      </div>

      {/* Simulate Payment */}
      <div className="rounded-xl border border-white/6 bg-[#111] p-8">
        <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-xl border border-white/6 bg-[#191919] gap-6">
          <div>
            <h3 className="font-bold text-lg text-white">
              {t("SimulatePayment.title")}
            </h3>
            <p className="text-neutral-400 text-sm mt-1 max-w-xl">
              {t("SimulatePayment.description")}
            </p>
          </div>
          <button
            onClick={() => setShowSimulate(true)}
            className="flex items-center gap-2 px-8 py-4 rounded-lg font-bold transition-colors border shrink-0 bg-white text-neutral-950 border-white hover:bg-zinc-200"
          >
            <CreditCard className="w-5 h-5" weight="bold" />
            {t("SimulatePayment.simulate")}
          </button>
        </div>
      </div>

      <AdminSystemControls
        maintenanceMode={maintenanceMode}
        loading={loading}
        onToggle={onToggleMaintenance}
      />

      {showSimulate && (
        <AdminSimulatePaymentModal
          onClose={() => setShowSimulate(false)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}
