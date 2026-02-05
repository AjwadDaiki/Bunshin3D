"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Plus, SignOut } from "@phosphor-icons/react";

type Props = {
  profileEmail?: string;
  userEmail?: string;
  onLogout: () => void;
};

export default function DashboardHeader({
  profileEmail,
  userEmail,
  onLogout,
}: Props) {
  const t = useTranslations("Account");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {t("Header.title")}
        </h1>
        <p className="text-neutral-400">
          {t("Header.welcome")} {" "}
          <span className="text-white font-medium">
            {profileEmail || userEmail}
          </span>
        </p>
        <p className="text-sm text-neutral-500">{t("Header.subtitle")}</p>
      </div>

      <div className="flex items-start justify-end gap-4">
        <Link
          href="/pricing"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-neutral-950 font-medium text-sm transition-colors hover:bg-neutral-200"
        >
          <Plus className="w-4 h-4" weight="bold" />
          {t("Settings.buyCredits")}
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#191919] border border-white/6 text-neutral-400 hover:text-white hover:border-white/10 font-medium text-sm transition-colors"
        >
          <SignOut className="w-4 h-4" weight="bold" />
          {t("Settings.logout")}
        </button>
      </div>
    </div>
  );
}
