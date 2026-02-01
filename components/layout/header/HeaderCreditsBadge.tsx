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
        "px-3 py-1.5 rounded-full flex items-center gap-2 transition-all duration-300",
        isEmpty
          ? "bg-red-500/20 border border-red-500/40 hover:bg-red-500/30"
          : isLow
            ? "glass-button border border-amber-500/30 animate-pulse-subtle"
            : "glass-button",
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
      <span className={cn("text-sm font-bold", isEmpty && "text-red-400")}>
        {credits}
      </span>
      {isEmpty && (
        <span className="text-xs font-semibold text-red-300 hidden sm:inline">
          {t("buyCredits")}
        </span>
      )}
      {isLow && !isEmpty && (
        <span className="text-xs font-semibold text-amber-300 hidden sm:inline">
          {t("lowCredits")}
        </span>
      )}
    </Link>
  );
}
