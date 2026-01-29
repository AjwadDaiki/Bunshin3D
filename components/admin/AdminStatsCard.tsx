"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";

type AdminStatsCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  colorClass?: string;
};

export default function AdminStatsCard({
  icon,
  label,
  value,
  subValue,
  trend,
  colorClass = "text-brand-primary",
}: AdminStatsCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
            {label}
          </span>
          <div className={cn("p-2 rounded-lg bg-white/5", colorClass)}>
            {icon}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className={cn("text-3xl font-bold tracking-tight", colorClass)}>
              {value}
            </p>
            {subValue && (
              <p className="text-xs text-gray-500 mt-1 font-mono">{subValue}</p>
            )}
          </div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                trend === "up" && "bg-green-500/10 text-green-400",
                trend === "down" && "bg-red-500/10 text-red-400",
                trend === "neutral" && "bg-gray-500/10 text-gray-400",
              )}
            >
              {trend === "up" && <ArrowUpRight className="w-3 h-3" weight="bold" />}
              {trend === "down" && <ArrowDownRight className="w-3 h-3" weight="bold" />}
              {trend === "neutral" && <ArrowRight className="w-3 h-3" weight="bold" />}
            </div>
          )}
        </div>
      </div>

      <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-current opacity-5 group-hover:opacity-10 transition-opacity" />
    </div>
  );
}
