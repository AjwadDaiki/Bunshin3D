"use client";

import { useTranslations } from "next-intl";
import {
  Coins,
  DotsThreeVertical,
  Prohibit,
  Trash,
  UserCircleGear,
} from "@phosphor-icons/react";
import { AdminUserProfile } from "./types";
import AdminUserRoleBadge from "./AdminUserRoleBadge";
import AdminUserStatusBadge from "./AdminUserStatusBadge";

type ActionType = "credits" | "role" | "ban" | "delete";

type Props = {
  user: AdminUserProfile;
  isActive: boolean;
  onToggle: (id: string) => void;
  onAction: (user: AdminUserProfile, action: ActionType) => void;
};

export default function AdminUserRow({
  user,
  isActive,
  onToggle,
  onAction,
}: Props) {
  const t = useTranslations("Admin");

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const initial = user.email?.charAt(0)?.toUpperCase() || t("Users.unknownInitial");

  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-xs font-bold">
            {initial}
          </div>
          <div>
            <p className="font-medium text-white truncate max-w-[200px]">
              {user.email}
            </p>
            <p className="text-xs text-gray-500 font-mono">
              {user.id.slice(0, 8)}...
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <AdminUserRoleBadge user={user} />
      </td>
      <td className="px-6 py-4 text-gray-400">
        {formatDate(user.created_at)}
      </td>
      <td className="px-6 py-4 text-right">
        <span className="font-mono font-bold text-brand-primary">
          {user.credits}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <AdminUserStatusBadge isBanned={user.is_banned} />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="relative">
          <button
            onClick={() => onToggle(user.id)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={t("Users.actions")}
          >
            <DotsThreeVertical className="w-5 h-5 text-gray-400" weight="bold" />
          </button>

          {isActive && (
            <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-surface-2 border border-white/10 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => onAction(user, "credits")}
                className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-3 text-gray-300"
              >
                <Coins className="w-4 h-4 text-amber-400" weight="fill" />
                {t("Users.grantCredits")}
              </button>
              <button
                onClick={() => onAction(user, "role")}
                className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-3 text-gray-300"
              >
                <UserCircleGear className="w-4 h-4 text-blue-400" weight="fill" />
                {t("Users.changeRole")}
              </button>
              <div className="my-2 border-t border-white/10" />
              <button
                onClick={() => onAction(user, "ban")}
                className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-3 text-orange-400"
              >
                <Prohibit className="w-4 h-4" weight="fill" />
                {user.is_banned ? t("Users.unban") : t("Users.ban")}
              </button>
              <button
                onClick={() => onAction(user, "delete")}
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-500/10 transition-colors flex items-center gap-3 text-red-400"
              >
                <Trash className="w-4 h-4" weight="fill" />
                {t("Users.delete")}
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

