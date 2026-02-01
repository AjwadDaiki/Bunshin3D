"use client";

import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

export default function AdminUserStatusBadge({
  isBanned,
}: {
  isBanned?: boolean;
}) {
  const t = useTranslations("Admin");

  if (isBanned) {
    return (
      <span
        className="inline-flex items-center gap-1 text-red-400"
        aria-label={t("Users.statusBanned")}
        title={t("Users.statusBanned")}
      >
        <XCircle className="w-4 h-4" weight="fill" />
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 text-green-400"
      aria-label={t("Users.statusActive")}
      title={t("Users.statusActive")}
    >
      <CheckCircle className="w-4 h-4" weight="fill" />
    </span>
  );
}

