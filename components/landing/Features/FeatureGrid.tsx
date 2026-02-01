"use client";

import { useTranslations } from "next-intl";
import { Lightning, Cube, Stack } from "@phosphor-icons/react";
import FeatureCard from "./FeatureCard";

export default function FeatureGrid() {
  const t = useTranslations("Home");

  return (
    <section className="relative z-10 py-32 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Lightning className="w-8 h-8 text-yellow-400" weight="fill" />}
            title={t("Features.speedTitle")}
            desc={t("Features.speedDesc")}
            gradient="from-yellow-500/10 to-orange-500/10"
          />
          <FeatureCard
            icon={<Cube className="w-8 h-8 text-indigo-400" weight="duotone" />}
            title={t("Features.topologyTitle")}
            desc={t("Features.topologyDesc")}
            gradient="from-indigo-500/10 to-blue-500/10"
          />
          <FeatureCard
            icon={<Stack className="w-8 h-8 text-emerald-400" weight="duotone" />}
            title={t("Features.exportTitle")}
            desc={t("Features.exportDesc")}
            gradient="from-emerald-500/10 to-teal-500/10"
          />
        </div>
      </div>
    </section>
  );
}
