"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Generation = {
  id: string;
  mode: string;
  status: string;
  created_at: string;
};

type Props = {
  generations: Generation[];
};

export default function AdminRecentGenerationsTable({ generations }: Props) {
  const t = useTranslations("Admin");

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusLabels: Record<string, string> = {
    succeeded: t("Statuses.succeeded"),
    failed: t("Statuses.failed"),
    processing: t("Statuses.processing"),
    queued: t("Statuses.queued"),
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 bg-brand-primary/5 flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary flex items-center gap-2">
          {t("Tables.generationsTitle")}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-surface-2 text-gray-400 uppercase">
            <tr>
              <th className="px-6 py-3">{t("Tables.colMode")}</th>
              <th className="px-6 py-3">{t("Tables.colStatus")}</th>
              <th className="px-6 py-3 text-right">{t("Tables.colDate")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {generations.slice(0, 5).map((gen) => (
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
                        : gen.status === "failed"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400",
                    )}
                  >
                    {statusLabels[gen.status] || gen.status}
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
  );
}

