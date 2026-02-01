"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Sparkle } from "@phosphor-icons/react";

type Props = {
  href: string;
};

export default function ReferralTopBar({ href }: Props) {
  const t = useTranslations("Referral.Promo");

  return (
    <div className="hidden md:flex items-center justify-between gap-4 px-4 py-2 rounded-full bg-linear-to-r from-indigo-500/20 via-brand-primary/10 to-cyan-500/20 border border-white/10 text-xs text-white/90">
      <div className="flex items-center gap-2 font-medium">
        <Sparkle className="h-4 w-4 text-brand-primary" weight="fill" />
        <span>{t("headerText")}</span>
      </div>
      <Link
        href={href}
        className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
      >
        {t("headerCta")}
      </Link>
    </div>
  );
}
