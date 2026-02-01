"use client";

import { useTranslations } from "next-intl";
import { AdminUserProfile } from "./types";

type Props = {
  users: AdminUserProfile[];
};

export default function AdminRecentUsersTable({ users }: Props) {
  const t = useTranslations("Admin");

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 bg-brand-primary/5 flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary flex items-center gap-2">
          {t("Tables.usersTitle")}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-surface-2 text-gray-400 uppercase">
            <tr>
              <th className="px-6 py-3">{t("Tables.colUser")}</th>
              <th className="px-6 py-3">{t("Tables.colDate")}</th>
              <th className="px-6 py-3 text-right">{t("Tables.colCredits")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.slice(0, 5).map((user) => (
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
  );
}

