"use client";

import { useState } from "react";
import { X, Sparkle, Timer, Cube } from "@phosphor-icons/react";
import { useTranslations, useLocale } from "next-intl";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import {
  getPriceForCurrency,
  getOTOPriceForCurrency,
  PRICING_CONFIG,
  type PackId,
} from "@/lib/config/pricing";

type Props = {
  open: boolean;
  timeRemaining: number;
  userId: string | null;
  onClose: () => void;
};

function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatPrice(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(amount);
}

const PACKS: { id: PackId; icon: typeof Cube; color: string; border: string; bg: string }[] = [
  { id: "discovery", icon: Cube, color: "text-zinc-400", border: "border-white/10", bg: "bg-white/5" },
  { id: "studio", icon: Sparkle, color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
];

export default function OTOPopup({
  open,
  timeRemaining,
  userId,
  onClose,
}: Props) {
  const t = useTranslations("OTO");
  const locale = useLocale();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (packId: PackId) => {
    if (!userId) return;
    setLoading(packId);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, userId, currency, isOTO: true, locale }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || t("checkoutError"));
        setLoading(null);
      }
    } catch {
      setError(t("checkoutError"));
      setLoading(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center px-4 animate-oto-backdrop">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg animate-oto-enter rounded-3xl border border-white/10 p-[1px] shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(168,85,247,0.4), rgba(234,179,8,0.4), rgba(168,85,247,0.2))",
        }}
      >
        <div className="rounded-3xl bg-zinc-950/95 p-8">
          <button
            type="button"
            aria-label={t("close")}
            onClick={onClose}
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition hover:text-white"
          >
            <X className="h-4 w-4" weight="bold" />
          </button>

          {/* Timer badge */}
          <div className="mb-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-mono text-amber-400">
              <Timer className="h-4 w-4" weight="fill" />
              <span>{formatCountdown(timeRemaining)}</span>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400">
              {t("badge")}
            </p>
            <h3 className="text-2xl font-bold text-white">{t("title")}</h3>
            <p className="text-sm text-gray-400">{t("subtitle")}</p>
          </div>

          {/* Discount tag */}
          <div className="mt-5 flex justify-center">
            <span className="rounded-lg bg-linear-to-r from-purple-600 to-amber-500 px-4 py-1 text-sm font-bold text-white shadow-lg shadow-purple-500/25">
              {t("discountBadge")}
            </span>
          </div>

          {/* Offers - 3 packs */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {PACKS.map(({ id, icon: Icon, color, border, bg }) => {
              const price = getPriceForCurrency(id, currency);
              const otoPrice = getOTOPriceForCurrency(id, currency);
              if (!otoPrice) return null;
              const formattedOTO = formatPrice(otoPrice.amount, price.currency, locale);
              const formattedOriginal = formatPrice(price.amount, price.currency, locale);

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleCheckout(id)}
                  disabled={loading === id}
                  className={`group relative overflow-hidden rounded-2xl ${border} ${bg} p-5 text-left transition hover:bg-white/[0.08] disabled:opacity-60`}
                >
                  <div className={`flex items-center gap-2 ${color}`}>
                    <Icon className="h-5 w-5" weight="fill" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {PRICING_CONFIG[id].credits} {t("creditsLabel")}
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">
                      {formattedOTO}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formattedOriginal}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {error && (
            <p className="mt-3 text-center text-xs text-red-400">{error}</p>
          )}

          <p className="mt-4 text-center text-xs text-gray-600">
            {t("footer")}
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes oto-enter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes oto-backdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-oto-enter {
          animation: oto-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-oto-backdrop {
          animation: oto-backdrop 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
