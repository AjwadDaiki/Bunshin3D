"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function ReferralPromoPanel() {
  const t = useTranslations("Referral.Promo");

  return (
    <div className="bg-[#111] border border-white/6 rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <p className="text-sm font-semibold text-blue-400">
            {t("highlightTag")}
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            {t("pricingTitle")}
          </h3>
          <p className="text-sm md:text-base text-neutral-400">
            {t("pricingSubtitle", { signup: 2, payment: 10 })}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/account"
            className="px-6 py-3 rounded-lg bg-white text-neutral-950 font-semibold hover:bg-neutral-200 transition-colors"
          >
            {t("ctaPrimary")}
          </Link>
          <Link
            href="/pricing"
            className="px-6 py-3 rounded-lg border border-white/6 text-white hover:border-white/10 transition-colors"
          >
            {t("ctaSecondary")}
          </Link>
        </div>
      </div>
    </div>
  );
}
