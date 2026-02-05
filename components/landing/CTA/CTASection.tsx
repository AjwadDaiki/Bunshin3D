"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react";

export default function CTASection() {
  const t = useTranslations("Home");

  return (
    <section className="relative z-10 pt-32 pb-24 md:pt-44 md:pb-36 px-4 text-center overflow-hidden">
      <div className="container mx-auto max-w-4xl relative">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative rounded-2xl border border-white/6 bg-[#111]/80 backdrop-blur-sm px-8 pt-20 pb-16 md:px-16 md:pt-24 md:pb-20">
          {/* Top accent */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />

          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              {t("CTA.title")}
            </h2>
            <p className="text-neutral-400 text-lg max-w-xl mx-auto">{t("CTA.subtitle")}</p>
            <div className="pt-2">
              <Link
                href="/studio"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 font-semibold text-neutral-950 transition-all hover:bg-neutral-100 hover:shadow-lg hover:shadow-white/10"
              >
                {t("CTA.button")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
