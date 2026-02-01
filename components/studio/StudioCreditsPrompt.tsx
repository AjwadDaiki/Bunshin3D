"use client";

import { useState } from "react";
import { X, Sparkle, CreditCard, Lightning } from "@phosphor-icons/react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import {
  getPriceForCurrency,
  getOTOPriceForCurrency,
  PRICING_CONFIG,
  type PackId,
} from "@/lib/config/pricing";

type Props = {
  open: boolean;
  requiredCredits: number;
  isPromoActive?: boolean;
  onClose: () => void;
};

function formatPrice(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(amount);
}

const PACK_IDS: PackId[] = ["discovery", "creator", "studio"];

export default function StudioCreditsPrompt({
  open,
  requiredCredits,
  isPromoActive,
  onClose,
}: Props) {
  const t = useTranslations("Studio");
  const locale = useLocale();
  const { currency } = useCurrency();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center px-4 animate-paywall-backdrop">
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t("CreditsPrompt.close")}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-xl animate-paywall-enter rounded-3xl border border-white/10 bg-zinc-950/95 p-8 shadow-2xl"
        style={{
          boxShadow:
            "0 0 80px rgba(99, 102, 241, 0.08), 0 0 30px rgba(168, 85, 247, 0.06), 0 25px 50px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Close */}
        <button
          type="button"
          aria-label={t("CreditsPrompt.close")}
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" weight="bold" />
        </button>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20">
            <Sparkle className="h-7 w-7 text-indigo-400" weight="fill" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-400">
            {t("CreditsPrompt.title")}
          </p>
          <h3 className="text-2xl font-bold text-white">
            {t("CreditsPrompt.headline")}
          </h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            {t("CreditsPrompt.description", { count: requiredCredits })}
          </p>
        </div>

        {/* Pack prices */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {PACK_IDS.map((id) => {
            const price = getPriceForCurrency(id, currency);
            const otoPrice = isPromoActive
              ? getOTOPriceForCurrency(id, currency)
              : null;
            const displayAmount = otoPrice ? otoPrice.amount : price.amount;
            const formattedPrice = formatPrice(displayAmount, price.currency, locale);
            const originalFormatted = otoPrice
              ? formatPrice(price.amount, price.currency, locale)
              : null;

            return (
              <Link
                key={id}
                href="/pricing"
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition hover:border-indigo-500/30 hover:bg-white/[0.08]"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {PRICING_CONFIG[id].credits} {t("CreditsPrompt.creditsLabel")}
                </p>
                <div className="mt-2">
                  {originalFormatted && (
                    <span className="text-xs text-gray-500 line-through mr-1">
                      {originalFormatted}
                    </span>
                  )}
                  <span className={`text-lg font-bold ${otoPrice ? "text-green-400" : "text-white"}`}>
                    {formattedPrice}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA buttons */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/pricing"
            className="group flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-purple-500"
          >
            <CreditCard className="h-5 w-5" weight="duotone" />
            {t("CreditsPrompt.ctaPricing")}
          </Link>
          <Link
            href="/account"
            className="group flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 font-semibold text-white transition hover:bg-white/10 hover:border-white/15"
          >
            <Lightning className="h-5 w-5 text-amber-400" weight="fill" />
            {t("CreditsPrompt.ctaReferral")}
          </Link>
        </div>

        {/* Note */}
        <div className="mt-5 rounded-2xl border border-white/5 bg-white/2 px-4 py-3 text-center text-xs text-gray-500">
          {t("CreditsPrompt.note", { signup: 2, payment: 10 })}
        </div>
      </div>

      <style jsx global>{`
        @keyframes paywall-enter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes paywall-backdrop {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-paywall-enter {
          animation: paywall-enter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-paywall-backdrop {
          animation: paywall-backdrop 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
