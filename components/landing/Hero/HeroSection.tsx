"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowRight, Lightning, ShieldCheck, Gift } from "@phosphor-icons/react";

export default function HeroSection() {
  const t = useTranslations("Home");

  return (
    <section className="relative z-10 pt-32 pb-24 md:pt-48 md:pb-36 px-4 overflow-hidden">
      {/* Subtle radial glow behind hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-500/7 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl text-center space-y-8 relative">
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.9]">
          {t("Hero.title")} <br className="hidden md:block" />
          <span className="text-blue-500">
            {t("Hero.titleHighlight")}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {t("Hero.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/studio"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 font-semibold text-neutral-950 transition-all hover:bg-neutral-100 hover:shadow-lg hover:shadow-white/10"
          >
            {t("Hero.ctaPrimary")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" weight="bold" />
          </Link>

          <Link
            href="#pricing"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/3 px-8 font-medium text-white transition-all hover:bg-white/6 hover:border-white/15"
          >
            {t("Hero.ctaSecondary")}
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-blue-400" weight="fill" />
            {t("Hero.freeCredits")}
          </span>
          <span className="hidden sm:inline-block w-px h-4 bg-white/10" />
          <span className="inline-flex items-center gap-1.5">
            <Lightning className="w-4 h-4 text-amber-400" weight="fill" />
            {t("Hero.fastGeneration")}
          </span>
          <span className="hidden sm:inline-block w-px h-4 bg-white/10" />
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" weight="fill" />
            {t("Hero.noSubscription")}
          </span>
        </div>
      </div>
    </section>
  );
}
