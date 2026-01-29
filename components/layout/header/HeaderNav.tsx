"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Props = {
  pathname: string;
  isAdmin: boolean;
};

export default function HeaderNav({ pathname, isAdmin }: Props) {
  const t = useTranslations("Navigation");

  return (
    <nav
      className="hidden md:flex items-center gap-6"
      aria-label={t("aria.mainNav")}
    >
      <Link
        href="/studio"
        className={cn(
          "text-sm font-medium transition-colors hover:text-brand-primary",
          pathname === "/studio" ? "text-brand-primary" : "text-gray-300",
        )}
      >
        {t("studio")}
      </Link>
      <Link
        href="/pricing"
        className={cn(
          "text-sm font-medium transition-colors hover:text-brand-primary",
          pathname === "/pricing" ? "text-brand-primary" : "text-gray-300",
        )}
      >
        {t("pricing")}
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className={cn(
            "text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all",
            pathname === "/admin"
              ? "bg-red-500/10 border-red-500/50 text-red-400"
              : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white",
          )}
        >
          <ShieldCheck className="w-4 h-4" weight="fill" />
          {t("admin")}
        </Link>
      )}
    </nav>
  );
}
