"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { CubeFocus, Play } from "@phosphor-icons/react";

export default function HeroSection() {
  const t = useTranslations("Home");

  return (
    <section className="relative z-10 pt-20 pb-20 md:pt-32 md:pb-32 px-4">
      <div className="container mx-auto max-w-6xl text-center space-y-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          {t("Hero.title")} <br className="hidden md:block" />
          <span className="bg-linear-to-r from-white via-indigo-200 to-indigo-500 bg-clip-text text-transparent">
            {t("Hero.titleHighlight")}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {t("Hero.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link
            href="/studio"
            className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-8 font-bold text-zinc-950 transition-all hover:scale-105"
          >
            <span className="relative z-10">{t("Hero.ctaPrimary")}</span>
            <CubeFocus className="w-5 h-5 relative z-10 group-hover:rotate-180 transition-transform duration-500" weight="duotone" />
            <div className="absolute inset-0 bg-linear-to-r from-indigo-200 via-white to-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <Link
            href="#showcase"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            <Play className="w-4 h-4" weight="fill" />
            {t("Hero.ctaSecondary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
