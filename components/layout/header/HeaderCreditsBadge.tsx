"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Lightning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Props = {
  credits: number;
};

export default function HeaderCreditsBadge({ credits }: Props) {
  const t = useTranslations("Navigation");
  const isLow = credits <= 5;
  const isEmpty = credits === 0;

  return (
    <Link
      href="/pricing"
      className={cn(
        "px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors",
        isEmpty
          ? "bg-red-500/10 border border-red-500/20 text-red-400"
          : isLow
            ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
            : "bg-[#191919] border border-white/6 text-neutral-300 hover:border-white/10",
      )}
      aria-label={t("aria.creditsAvailable", { count: credits })}
    >
      <Lightning
        className={cn(
          "h-4 w-4",
          isEmpty ? "text-red-400" : isLow ? "text-amber-400" : "text-amber-400",
        )}
        weight="fill"
      />
      <span className="font-semibold">{credits}</span>
      {isEmpty && (
        <span className="text-xs font-medium hidden sm:inline">
          {t("buyCredits")}
        </span>
      )}
      {isLow && !isEmpty && (
        <span className="text-xs font-medium hidden sm:inline">
          {t("lowCredits")}
        </span>
      )}
    </Link>
  );
}
