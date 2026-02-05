"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { BunshinLogo } from "@/components/ui/BunshinLogo";

export default function HeaderBrand() {
  const t = useTranslations("Navigation");

  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label={t("aria.home")}
    >
      <BunshinLogo className="h-7 w-7 text-blue-500" />
      <span className="text-lg font-bold">
        <span className="text-white">{t("brandName")}</span>
        <span className="text-blue-500">{t("brandSuffix")}</span>
      </span>
    </Link>
  );
}
