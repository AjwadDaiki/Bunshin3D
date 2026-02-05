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
          "text-sm font-medium transition-colors hover:text-white",
          pathname === "/studio" ? "text-white" : "text-neutral-400",
        )}
      >
        {t("studio")}
      </Link>
      <Link
        href="/pricing"
        className={cn(
          "text-sm font-medium transition-colors hover:text-white",
          pathname === "/pricing" ? "text-white" : "text-neutral-400",
        )}
      >
        {t("pricing")}
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className={cn(
            "text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-white",
            pathname === "/admin" ? "text-white" : "text-neutral-400",
          )}
        >
          <ShieldCheck className="w-4 h-4" weight="fill" />
          {t("admin")}
        </Link>
      )}
    </nav>
  );
}
