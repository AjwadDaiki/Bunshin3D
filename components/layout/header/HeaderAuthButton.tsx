"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type Props = {
  variant?: "desktop" | "mobile";
};

export default function HeaderAuthButton({ variant = "desktop" }: Props) {
  const t = useTranslations("Navigation");

  if (variant === "mobile") {
    return (
      <Link href="/login" className="text-sm font-medium text-blue-500">
        {t("login")}
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="px-5 py-2 bg-white hover:bg-neutral-200 rounded-lg text-sm font-semibold text-neutral-950 transition-colors"
    >
      {t("login")}
    </Link>
  );
}
