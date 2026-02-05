"use client";

import { Timer } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useOTO } from "@/components/providers/OTOProvider";
import { Link } from "@/i18n/routing";

function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function OTOBanner() {
  const t = useTranslations("OTO");
  const { isOfferActive, timeRemaining } = useOTO();

  if (!isOfferActive) return null;

  return (
    <div
      id="oto-banner"
      className="flex items-center justify-center gap-3 bg-blue-600 px-4 py-2 text-sm font-medium text-white"
    >
      <Timer className="h-4 w-4 shrink-0" weight="fill" />
      <span>{t("banner.text")}</span>
      <span className="font-mono font-bold tabular-nums">
        {formatCountdown(timeRemaining)}
      </span>
      <Link
        href="/pricing"
        className="ml-2 rounded-lg bg-white/20 px-3 py-0.5 text-xs font-semibold transition-colors hover:bg-white/30"
      >
        {t("banner.cta")}
      </Link>
    </div>
  );
}
