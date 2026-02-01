"use client";

import { AdminStats, AdminUserProfile } from "./types";
import AdminKpiGrid from "./AdminKpiGrid";
import AdminRecentUsersTable from "./AdminRecentUsersTable";
import AdminRecentGenerationsTable from "./AdminRecentGenerationsTable";
import AdminSystemControls from "./AdminSystemControls";

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
};

export default function AdminOverviewTab({
  stats,
  recentUsers,
  recentGenerations,
  maintenanceMode,
  loading,
  onToggleMaintenance,
}: Props) {
  return (
    <>
      <AdminKpiGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminRecentUsersTable users={recentUsers} />
        <AdminRecentGenerationsTable generations={recentGenerations} />
      </div>

      <AdminSystemControls
        maintenanceMode={maintenanceMode}
        loading={loading}
        onToggle={onToggleMaintenance}
      />
    </>
  );
}

