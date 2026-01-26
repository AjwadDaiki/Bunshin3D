"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ShieldWarning,
  Money,
  Users,
  Cube,
  ChartLineUp,
  Lock,
  LockOpen,
  TrendUp,
  Lightning,
  Clock,
  UserCheck,
  MagnifyingGlass,
  CaretLeft,
  CaretRight,
  Warning,
  Pulse,
  CalendarBlank,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import AdminStatsCard from "./AdminStatsCard";
import AdminUserTable from "./AdminUserTable";
import { getAllUsers, updateAppSettings } from "@/app/actions/admin";

type AdminProps = {
  stats: {
    revenue: number;
    users: number;
    models: number;
    arpu: string;
    conversion: string;
    burn: string;
    errorRate?: string;
    todayUsers?: number;
    todayGenerations?: number;
  };
  initialSettings: any;
  recentUsers: any[];
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
  // Correction 1: Sécurisation de initialSettings
  const [settings, setSettings] = useState(initialSettings || {});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");
  const [users, setUsers] = useState(recentUsers);
  const [userSearch, setUserSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(stats.users);

  // Correction 2: Initialisation à null pour éviter l'erreur d'hydratation
  const [serverTime, setServerTime] = useState<Date | null>(null);

  useEffect(() => {
    // On définit l'heure uniquement côté client
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
      alert("Error updating system status");
    }
    setLoading(false);
  };

  const loadUsers = useCallback(async (page: number, search?: string) => {
    try {
      const result = await getAllUsers(page, 20, search);
      setUsers(result.users);
      setTotalUsers(result.total);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
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

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const totalPages = Math.ceil(totalUsers / 20);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-white/10 pb-6 gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight uppercase flex items-center gap-3">
            <ShieldWarning
              className="w-8 h-8 text-brand-primary"
              weight="fill"
            />
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
            {/* Correction 2 (Affichage): Rendu conditionnel pour éviter le mismatch */}
            <div className="font-mono text-lg text-brand-primary min-h-[28px]">
              {serverTime ? serverTime.toLocaleTimeString() : ""}
            </div>
          </div>

          <div
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 border",
              settings.maintenance_mode
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-brand-primary/10 border-brand-primary/30 text-brand-primary",
            )}
          >
            <Pulse className="w-4 h-4 animate-pulse" weight="fill" />
            {settings.maintenance_mode
              ? t("Controls.inactive")
              : t("Header.status")}
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "overview"
              ? "bg-brand-primary text-white"
              : "text-gray-400 hover:text-white",
          )}
        >
          {t("Tabs.overview")}
        </button>
        <button
          onClick={() => {
            setActiveTab("users");
            if (users.length <= 10) loadUsers(1);
          }}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "users"
              ? "bg-brand-primary text-white"
              : "text-gray-400 hover:text-white",
          )}
        >
          {t("Tabs.users")}
        </button>
      </div>

      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminStatsCard
              icon={<Money className="w-6 h-6" weight="duotone" />}
              label={t("KPI.revenue")}
              value={`€${stats.revenue.toFixed(2)}`}
              subValue={`ARPU: €${stats.arpu}`}
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
              value={`$${stats.burn}`}
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
              value={`€${stats.arpu}`}
              colorClass="text-purple-400"
            />
            <AdminStatsCard
              icon={<Warning className="w-6 h-6" weight="duotone" />}
              label={t("KPI.errorRate")}
              value={`${stats.errorRate || "0"}%`}
              colorClass="text-red-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 bg-brand-primary/5 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary flex items-center gap-2">
                  <UserCheck className="w-4 h-4" weight="duotone" />
                  {t("Tables.usersTitle")}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-surface-2 text-gray-400 uppercase">
                    <tr>
                      <th className="px-6 py-3">{t("Tables.colUser")}</th>
                      <th className="px-6 py-3">{t("Tables.colDate")}</th>
                      <th className="px-6 py-3 text-right">
                        {t("Tables.colCredits")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {recentUsers.slice(0, 5).map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-3 font-medium text-gray-300 truncate max-w-[150px]">
                          {user.email}
                        </td>
                        <td className="px-6 py-3 text-gray-400">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-3 text-right font-mono font-bold text-brand-primary">
                          {user.credits}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 bg-brand-primary/5 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary flex items-center gap-2">
                  <Cube className="w-4 h-4" weight="duotone" />
                  {t("Tables.generationsTitle")}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-surface-2 text-gray-400 uppercase">
                    <tr>
                      <th className="px-6 py-3">{t("Tables.colMode")}</th>
                      <th className="px-6 py-3">{t("Tables.colStatus")}</th>
                      <th className="px-6 py-3 text-right">
                        {t("Tables.colDate")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {recentGenerations.slice(0, 5).map((gen) => (
                      <tr
                        key={gen.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-3 uppercase font-bold text-brand-primary">
                          {gen.mode}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={cn(
                              "px-2 py-1 rounded text-[10px] uppercase font-bold",
                              gen.status === "succeeded"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400",
                            )}
                          >
                            {gen.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right text-gray-400">
                          {formatDate(gen.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

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
                onClick={toggleMaintenance}
                disabled={loading}
                className={cn(
                  "flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all border uppercase tracking-widest shrink-0",
                  settings.maintenance_mode
                    ? "bg-red-500 text-white border-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                    : "bg-brand-primary text-white border-brand-primary hover:bg-brand-secondary shadow-[0_0_20px_rgba(153,69,255,0.3)]",
                )}
              >
                {settings.maintenance_mode ? (
                  <Lock className="w-5 h-5" weight="bold" />
                ) : (
                  <LockOpen className="w-5 h-5" weight="bold" />
                )}
                {settings.maintenance_mode
                  ? t("Controls.inactive")
                  : t("Controls.active")}
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === "users" && (
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder={t("Users.searchPlaceholder")}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-secondary transition-colors"
            >
              {t("Users.search")}
            </button>
          </form>

          <AdminUserTable users={users} onRefresh={handleRefresh} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CaretLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "w-10 h-10 rounded-lg font-medium transition-colors",
                        currentPage === page
                          ? "bg-brand-primary text-white"
                          : "bg-white/5 text-gray-400 hover:bg-white/10",
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CaretRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
