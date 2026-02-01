"use client";

import React, { useState, useCallback, useEffect, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { getAllUsers, updateAppSettings } from "@/app/actions/admin";
import AdminDashboardHeader from "./AdminDashboardHeader";
import AdminTabs from "./AdminTabs";
import AdminOverviewTab from "./AdminOverviewTab";
import AdminUsersTab from "./AdminUsersTab";
import { AdminStats, AdminUserProfile } from "./types";
import Toast from "@/components/ui/Toast";

type AdminProps = {
  stats: AdminStats;
  initialSettings: any;
  recentUsers: AdminUserProfile[];
  recentGenerations: any[];
};

export default function AdminDashboard({
  stats,
  initialSettings,
  recentUsers,
  recentGenerations,
}: AdminProps) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings || {});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");
  const [users, setUsers] = useState(recentUsers);
  const [userSearch, setUserSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(stats.users);
  const [serverTime, setServerTime] = useState<Date | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);

  useEffect(() => {
    setServerTime(new Date());
    const interval = setInterval(() => setServerTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMaintenance = async () => {
    setLoading(true);
    const newValue = !settings.maintenance_mode;

    try {
      await updateAppSettings({ maintenance_mode: newValue });
      setSettings({ ...settings, maintenance_mode: newValue });
    } catch {
      setToast({ message: t("Errors.updateSystemStatus"), type: "error" });
    }
    setLoading(false);
  };

  const loadUsers = useCallback(async (page: number, search?: string) => {
    try {
      const result = await getAllUsers(page, 20, search);
      setUsers(result.users);
      setTotalUsers(result.total);
    } catch (err) {
      console.error(t("Errors.loadUsers"), err);
    }
  }, [t]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadUsers(1, userSearch);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadUsers(page, userSearch);
  };

  const handleRefresh = () => {
    loadUsers(currentPage, userSearch);
    router.refresh();
  };

  const totalPages = Math.ceil(totalUsers / 20);

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <AdminDashboardHeader
        maintenanceMode={!!settings.maintenance_mode}
        serverTime={serverTime?.toLocaleTimeString()}
      />

      <AdminTabs
        activeTab={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          if (tab === "users" && users.length <= 10) {
            loadUsers(1);
          }
        }}
      />

      {activeTab === "overview" && (
        <AdminOverviewTab
          stats={stats}
          recentUsers={recentUsers}
          recentGenerations={recentGenerations}
          maintenanceMode={!!settings.maintenance_mode}
          loading={loading}
          onToggleMaintenance={toggleMaintenance}
        />
      )}

      {activeTab === "users" && (
        <AdminUsersTab
          users={users}
          userSearch={userSearch}
          onSearchChange={setUserSearch}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
    </>
  );
}

