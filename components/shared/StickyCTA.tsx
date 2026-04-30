"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function StickyCTA() {
  const t = useTranslations("StickyCTA");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {

      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/6 bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-400 hidden sm:block">
          {t("text")}
        </p>
        <Link
          href="/studio"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-6 font-semibold text-neutral-950 text-sm transition-all hover:bg-neutral-100 shrink-0"
        >
          {t("cta")}
          <ArrowRight className="w-4 h-4" weight="bold" />
        </Link>
      </div>
    </div>
  );
}
