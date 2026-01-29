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

  return (
    <Link
      href="/pricing"
      className="glass-button px-3 py-1.5 rounded-full flex items-center gap-2"
      aria-label={t("aria.creditsAvailable", { count: credits })}
    >
      <Lightning
        className={cn(
          "h-4 w-4",
          credits > 5 ? "text-amber-400" : "text-red-400",
        )}
        weight="fill"
      />
      <span className="text-sm font-bold">{credits}</span>
    </Link>
  );
}
