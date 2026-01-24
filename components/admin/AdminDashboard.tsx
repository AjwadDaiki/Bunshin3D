"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase";
import {
  ShieldAlert,
  Banknote,
  Users,
  Box,
  Activity,
  Lock,
  Unlock,
  TrendingUp,
  Zap,
  UserCheck,
  CheckCircle,
  XCircle,
  Calendar,
  Trophy,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TopUser = {
  email: string;
  count: number;
};

type AdminProps = {
  stats: {
    revenue: number;
    users: number;
    models: number;
    arpu: string;
    conversion: string;
    burn: string;
    // Nouvelles stats
    succeededGenerations: number;
    failedGenerations: number;
    successRate: string;
    todayGenerations: number;
    weekGenerations: number;
    monthGenerations: number;
    topUsers: TopUser[];
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
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const toggleMaintenance = async () => {
    setLoading(true);
    const newValue = !settings.maintenance_mode;

    const { error } = await supabase
      .from("app_settings")
      .update({ maintenance_mode: newValue })
      .eq("id", 1);

    if (!error) {
      setSettings({ ...settings, maintenance_mode: newValue });
    } else {
      alert("Error updating system status");
    }
    setLoading(false);
  };

  const formatDate = (date: string) => new Date(date).toLocaleString();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight uppercase flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-brand-primary" />
            {t("Header.title")}
          </h1>
          <p className="text-gray-400 text-sm font-bold tracking-wider">
            {t("Header.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-xs text-gray-400">SERVER TIME</div>
            <div className="font-mono text-brand-primary">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="px-4 py-2 bg-brand-primary/10 border border-brand-primary/30 rounded text-xs animate-pulse font-bold text-brand-primary flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
            {t("Header.status")}
          </div>
        </div>
      </div>

      {/* KPI GRID (First Row - Financials) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          icon={<Banknote className="w-6 h-6" />}
          label={t("KPI.revenue")}
          value={`${stats.revenue.toFixed(2)} €`}
          color="border-green-900/50 text-green-500"
        />
        <KpiCard
          icon={<TrendingUp className="w-6 h-6" />}
          label={t("KPI.arpu")}
          value={`${stats.arpu} €`}
          color="border-blue-900/50 text-blue-500"
        />
        <KpiCard
          icon={<Zap className="w-6 h-6" />}
          label={t("KPI.burn")}
          value={`$${stats.burn}`}
          color="border-orange-900/50 text-orange-500"
        />
      </div>

      {/* KPI GRID (Second Row - Usage) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          icon={<Users className="w-6 h-6" />}
          label={t("KPI.users")}
          value={stats.users.toString()}
        />
        <KpiCard
          icon={<Box className="w-6 h-6" />}
          label={t("KPI.models")}
          value={stats.models.toString()}
        />
        <KpiCard
          icon={<Activity className="w-6 h-6" />}
          label={t("KPI.conversion")}
          value={`${stats.conversion}%`}
        />
      </div>

      {/* KPI GRID (Third Row - Generation Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Taux de succès"
          value={`${stats.successRate}%`}
          color="border-emerald-900/50 text-emerald-500"
        />
        <KpiCard
          icon={<Calendar className="w-6 h-6" />}
          label="Aujourd'hui"
          value={stats.todayGenerations.toString()}
          color="border-cyan-900/50 text-cyan-500"
        />
        <KpiCard
          icon={<BarChart3 className="w-6 h-6" />}
          label="Cette semaine"
          value={stats.weekGenerations.toString()}
          color="border-violet-900/50 text-violet-500"
        />
        <KpiCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Ce mois"
          value={stats.monthGenerations.toString()}
          color="border-pink-900/50 text-pink-500"
        />
      </div>

      {/* Success/Failure breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Répartition des générations
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-300">Réussies</span>
              </div>
              <span className="font-bold text-emerald-500">{stats.succeededGenerations}</span>
            </div>
            <div className="w-full bg-surface-2 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${stats.successRate}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-gray-300">Échouées</span>
              </div>
              <span className="font-bold text-red-500">{stats.failedGenerations}</span>
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> Top utilisateurs
          </h3>
          {stats.topUsers && stats.topUsers.length > 0 ? (
            <div className="space-y-3">
              {stats.topUsers.map((user, index) => (
                <div key={user.email} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      index === 0 ? "bg-amber-500/20 text-amber-500" :
                      index === 1 ? "bg-gray-400/20 text-gray-400" :
                      index === 2 ? "bg-orange-600/20 text-orange-600" :
                      "bg-white/5 text-gray-500"
                    )}>
                      {index + 1}
                    </span>
                    <span className="text-gray-300 text-sm truncate max-w-[150px]">{user.email}</span>
                  </div>
                  <span className="font-mono font-bold text-brand-primary">{user.count} modèles</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucune donnée disponible</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT USERS TABLE */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 bg-brand-primary/5 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary flex items-center gap-2">
              <UserCheck className="w-4 h-4" /> {t("Tables.usersTitle")}
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
                {recentUsers.map((user) => (
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

        {/* RECENT GENERATIONS TABLE */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 bg-brand-primary/5 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary flex items-center gap-2">
              <Box className="w-4 h-4" /> {t("Tables.generationsTitle")}
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
                {recentGenerations.map((gen) => (
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
                            ? "bg-success/20 text-success"
                            : "bg-error/20 text-error",
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

      {/* SYSTEM CONTROLS */}
      <div className="glass-card p-8 mt-8 rounded-xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-brand-primary">
          <Activity className="w-5 h-5" /> SYSTEM CONTROLS
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-between p-6 glass-card rounded-xl gap-6">
          <div>
            <h3 className="font-bold text-lg text-brand-primary">
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
              "flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-smooth border uppercase tracking-widest",
              settings.maintenance_mode
                ? "bg-error text-white border-error hover:bg-error/90 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                : "bg-brand-primary text-white border-brand-primary hover:bg-brand-secondary",
            )}
          >
            {settings.maintenance_mode ? (
              <Lock className="w-5 h-5" />
            ) : (
              <Unlock className="w-5 h-5" />
            )}
            {settings.maintenance_mode
              ? t("Controls.inactive")
              : t("Controls.active")}
          </button>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="glass-card p-6 rounded-xl hover:bg-white/10 transition-all group relative overflow-hidden">
      <div className="flex items-center justify-between mb-2 relative z-10">
        <p className="text-sm text-gray-400 font-medium">{label}</p>
        <div
          className={cn(
            "p-2 rounded-lg",
            color ? color.split(" ")[1] : "text-brand-primary",
          )}
        >
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <p
          className={cn(
            "text-3xl font-bold",
            color ? color.split(" ")[1] : "text-brand-primary",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
