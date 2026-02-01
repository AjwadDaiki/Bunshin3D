"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { BunshinLogo } from "@/components/ui/BunshinLogo";

export default function HeaderBrand() {
  const t = useTranslations("Navigation");

  return (
    <Link
      href="/"
      className="flex items-center gap-2 group"
      aria-label={t("aria.home")}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full animate-pulse-slow" />
        <BunshinLogo className="relative h-8 w-8 text-brand-primary group-hover:scale-110 transition-transform" />
      </div>
      <span className="text-xl font-bold">
        <span className="text-gradient-brand">{t("brandName")}</span>
        <span className="text-brand-accent">{t("brandSuffix")}</span>
      </span>
    </Link>
  );
}
