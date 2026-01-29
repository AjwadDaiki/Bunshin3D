"use client";

import { useEffect, useState } from "react";
import { X, Sparkle, Lightning, Timer } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

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

export default function OTOPopup({
  open,
  timeRemaining,
  userId,
  onClose,
}: Props) {
  const t = useTranslations("OTO");
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (packId: string) => {
    if (!userId) return;
    setLoading(packId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, userId, isOTO: true }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
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

          {/* Offers */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {/* Discovery OTO */}
            <button
              type="button"
              onClick={() => handleCheckout("oto_discovery")}
              disabled={loading === "oto_discovery"}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-purple-500/30 hover:bg-white/[0.08] disabled:opacity-60"
            >
              <div className="flex items-center gap-2 text-zinc-400">
                <Lightning className="h-5 w-5" weight="fill" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {t("discovery.name")}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  {t("discovery.price")}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {t("discovery.originalPrice")}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {t("discovery.credits")}
              </p>
            </button>

            {/* Studio OTO */}
            <button
              type="button"
              onClick={() => handleCheckout("oto_studio")}
              disabled={loading === "oto_studio"}
              className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-left transition hover:border-amber-500/40 hover:bg-amber-500/10 disabled:opacity-60"
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-500/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 text-amber-400">
                  <Sparkle className="h-5 w-5" weight="fill" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {t("studio.name")}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {t("studio.price")}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {t("studio.originalPrice")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {t("studio.credits")}
                </p>
              </div>
            </button>
          </div>

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
