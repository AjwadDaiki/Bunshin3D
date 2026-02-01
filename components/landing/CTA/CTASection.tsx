"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function CTASection() {
  const t = useTranslations("Home");

  return (
    <section className="relative z-10 py-32 px-4 text-center">
      <div className="container mx-auto max-w-3xl space-y-8 p-12 rounded-[2.5rem] border border-white/5 bg-white/3">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
          {t("CTA.title")}
        </h2>
        <p className="text-zinc-400 text-lg">{t("CTA.subtitle")}</p>
        <Link
          href="/studio"
          className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-zinc-950 transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          {t("CTA.button")}
        </Link>
      </div>
    </section>
  );
}
