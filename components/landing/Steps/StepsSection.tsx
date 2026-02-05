"use client";

import { useTranslations } from "next-intl";
import { Scan, Cpu, Globe } from "@phosphor-icons/react";

export default function StepsSection() {
  const t = useTranslations("Home");

  const steps = [
    {
      step: "01",
      title: t("Steps.step1"),
      desc: t("Steps.step1Desc"),
      icon: <Scan weight="duotone" className="w-6 h-6" />,
    },
    {
      step: "02",
      title: t("Steps.step2"),
      desc: t("Steps.step2Desc"),
      icon: <Cpu weight="duotone" className="w-6 h-6" />,
    },
    {
      step: "03",
      title: t("Steps.step3"),
      desc: t("Steps.step3Desc"),
      icon: <Globe weight="duotone" className="w-6 h-6" />,
    },
  ];

  return (
    <section className="relative z-10 py-24 md:py-36">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-blue-400 uppercase tracking-widest mb-4">
            {t("Steps.label")}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            {t("Steps.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="group relative p-8 rounded-xl border border-white/6 bg-[#111] transition-all duration-300 hover:border-white/12 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20"
            >
              {/* Step number */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-white/10">{item.step}</span>
                <div className="h-px flex-1 bg-white/6" />
              </div>

              <div className="mb-4 p-3 bg-[#191919] rounded-lg inline-flex border border-white/4 text-blue-400">
                {item.icon}
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
