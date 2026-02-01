"use client";

import { Crown, ShieldCheck, User } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { AdminUserProfile } from "./types";

export default function AdminUserRoleBadge({ user }: { user: AdminUserProfile }) {
  const t = useTranslations("Admin");

  if (user.is_admin) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400">
        <Crown className="w-3 h-3" weight="fill" />
        {t("Users.rolesShort.admin")}
      </span>
    );
  }

  if (user.is_moderator) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400">
        <ShieldCheck className="w-3 h-3" weight="fill" />
        {t("Users.rolesShort.moderator")}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-500/20 text-gray-400">
      <User className="w-3 h-3" weight="fill" />
      {t("Users.rolesShort.user")}
    </span>
  );
}

