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
      <Link href="/login" className="text-sm font-medium text-brand-primary">
        {t("login")}
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="px-6 py-2 bg-brand-primary hover:bg-brand-secondary rounded-full text-sm font-medium transition-smooth"
    >
      {t("login")}
    </Link>
  );
}
