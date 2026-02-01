"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Sparkle } from "@phosphor-icons/react";

export default function ReferralPromoPanel() {
  const t = useTranslations("Referral.Promo");

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-indigo-500/10 via-white/5 to-cyan-500/10 p-6 md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed33,transparent_60%)]" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">
            <Sparkle className="h-4 w-4" weight="fill" />
            {t("highlightTag")}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            {t("pricingTitle")}
          </h3>
          <p className="text-sm md:text-base text-zinc-300">
            {t("pricingSubtitle", { signup: 2, payment: 10 })}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/account"
            className="px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold hover:bg-zinc-100 transition-colors"
          >
            {t("ctaPrimary")}
          </Link>
          <Link
            href="/pricing"
            className="px-6 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
          >
            {t("ctaSecondary")}
          </Link>
        </div>
      </div>
    </div>
  );
}
