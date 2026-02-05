"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type Props = {
  href: string;
};

export default function ReferralTopBar({ href }: Props) {
  const t = useTranslations("Referral.Promo");

  return (
    <div className="hidden md:flex items-center justify-between gap-4 px-4 py-2 rounded-lg bg-[#111] border border-white/6 text-xs text-neutral-300">
      <div className="flex items-center gap-2 font-medium">
        <span>{t("headerText")}</span>
      </div>
      <Link
        href={href}
        className="px-3 py-1 rounded-lg bg-[#191919] border border-white/6 hover:border-white/10 text-white font-semibold transition-colors"
      >
        {t("headerCta")}
      </Link>
    </div>
  );
}
