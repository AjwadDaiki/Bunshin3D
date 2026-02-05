"use client";

import { useTranslations } from "next-intl";
import { Lightning, Cube, Stack, Palette, CurrencyDollar, CloudArrowDown } from "@phosphor-icons/react";
import FeatureCard from "./FeatureCard";

export default function FeatureGrid() {
  const t = useTranslations("Home");

  return (
    <section className="relative z-10 py-24 md:py-36 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-blue-400 uppercase tracking-widest mb-4">
            {t("Features.title")}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto">
            {t("Features.subtitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Lightning className="w-6 h-6 text-amber-400" weight="fill" />}
            title={t("Features.speedTitle")}
            desc={t("Features.speedDesc")}
          />
          <FeatureCard
            icon={<Cube className="w-6 h-6 text-blue-400" weight="duotone" />}
            title={t("Features.topologyTitle")}
            desc={t("Features.topologyDesc")}
          />
          <FeatureCard
            icon={<Stack className="w-6 h-6 text-emerald-400" weight="duotone" />}
            title={t("Features.exportTitle")}
            desc={t("Features.exportDesc")}
          />
          <FeatureCard
            icon={<Palette className="w-6 h-6 text-purple-400" weight="duotone" />}
            title={t("Features.textureTitle")}
            desc={t("Features.textureDesc")}
          />
          <FeatureCard
            icon={<CurrencyDollar className="w-6 h-6 text-cyan-400" weight="duotone" />}
            title={t("Features.commercialTitle")}
            desc={t("Features.commercialDesc")}
          />
          <FeatureCard
            icon={<CloudArrowDown className="w-6 h-6 text-rose-400" weight="duotone" />}
            title={t("Features.instantTitle")}
            desc={t("Features.instantDesc")}
          />
        </div>
      </div>
    </section>
  );
}
