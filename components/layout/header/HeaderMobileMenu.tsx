"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "@phosphor-icons/react";

import HeaderAuthButton from "./HeaderAuthButton";

type Props = {
  isOpen: boolean;
  isAdmin: boolean;
  hasUser: boolean;
  credits: number;
  onLogout: () => void;
};

export default function HeaderMobileMenu({
  isOpen,
  isAdmin,
  hasUser,
  credits,
  onLogout,
}: Props) {
  const t = useTranslations("Navigation");

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-[#111] border border-white/6 rounded-lg mt-2 p-4 mb-4">
      <nav className="flex flex-col gap-3" aria-label={t("aria.mobileNav")}>
        <Link href="/studio" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
          {t("studio")}
        </Link>
        <Link href="/pricing" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
          {t("pricing")}
        </Link>

        {isAdmin && (
          <Link
            href="/admin"
            className="text-sm font-medium text-neutral-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" weight="fill" />
            {t("admin")}
          </Link>
        )}

        {hasUser ? (
          <>
            <div className="border-t border-white/6 my-1" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">{t("credits")}</span>
              <span className="text-sm font-semibold text-white">{credits}</span>
            </div>
            <Link href="/account" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
              {t("dashboard")}
            </Link>
            <button
              onClick={onLogout}
              className="text-sm font-medium text-red-400 text-left hover:text-red-300 transition-colors"
              aria-label={t("aria.logout")}
            >
              {t("logout")}
            </button>
          </>
        ) : (
          <HeaderAuthButton variant="mobile" />
        )}
      </nav>
    </div>
  );
}
