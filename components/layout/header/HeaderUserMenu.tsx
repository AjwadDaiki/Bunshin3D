"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { CreditCard, SignOut, SquaresFour, User as UserIcon } from "@phosphor-icons/react";
import HeaderCreditsBadge from "./HeaderCreditsBadge";

type Props = {
  credits: number;
  userMenuOpen: boolean;
  onToggleMenu: () => void;
  onLogout: () => void;
};

export default function HeaderUserMenu({
  credits,
  userMenuOpen,
  onToggleMenu,
  onLogout,
}: Props) {
  const t = useTranslations("Navigation");
  const tCommon = useTranslations("Common");

  return (
    <div className="hidden md:flex items-center gap-4">
      <HeaderCreditsBadge credits={credits} />

      <div className="relative">
        <button
          onClick={onToggleMenu}
          className="glass-button p-2 rounded-full hover:bg-white/15"
          aria-label={t("aria.userMenu")}
          aria-haspopup="true"
          aria-expanded={userMenuOpen}
        >
          <UserIcon className="h-5 w-5" weight="bold" />
        </button>

        {userMenuOpen && (
          <div
            className="absolute right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden"
            role="menu"
          >
            <Link
              href="/account"
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 transition-colors"
            >
              <SquaresFour className="h-4 w-4" weight="duotone" />
              <span className="text-sm">{t("dashboard")}</span>
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 transition-colors"
            >
              <CreditCard className="h-4 w-4" weight="duotone" />
              <span className="text-sm">{tCommon("buyCredits")}</span>
            </Link>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-500/10 text-red-400 transition-colors"
              aria-label={t("aria.logout")}
            >
              <SignOut className="h-4 w-4" weight="bold" />
              <span className="text-sm">{t("logout")}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
