"use client";

import { List, X } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function HeaderMobileToggle({ isOpen, onToggle }: Props) {
  const t = useTranslations("Navigation");

  return (
    <button
      onClick={onToggle}
      className="md:hidden p-2 rounded-lg glass-button"
      aria-label={t("aria.toggleNav")}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X className="h-6 w-6" weight="bold" />
      ) : (
        <List className="h-6 w-6" weight="bold" />
      )}
    </button>
  );
}
