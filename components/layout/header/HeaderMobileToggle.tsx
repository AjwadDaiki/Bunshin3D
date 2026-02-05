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
      className="md:hidden p-2 rounded-lg bg-[#191919] border border-white/6 hover:border-white/10 transition-colors"
      aria-label={t("aria.toggleNav")}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X className="h-5 w-5 text-neutral-400" weight="bold" />
      ) : (
        <List className="h-5 w-5 text-neutral-400" weight="bold" />
      )}
    </button>
  );
}
