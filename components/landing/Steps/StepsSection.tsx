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
      icon: <Scan weight="duotone" />,
    },
    {
      step: "02",
      title: t("Steps.step2"),
      desc: t("Steps.step2Desc"),
      icon: <Cpu weight="duotone" />,
    },
    {
      step: "03",
      title: t("Steps.step3"),
      desc: t("Steps.step3Desc"),
      icon: <Globe weight="duotone" />,
    },
  ];

  return (
    <section className="relative z-10 py-32 bg-zinc-900/30 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row items-start justify-between mb-16">
          <h2 className="text-4xl font-bold">{t("Steps.title")}</h2>
          <div className="hidden md:flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-zinc-800"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-6 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
          {steps.map((item, idx) => (
            <div key={idx} className="relative pt-8">
              <div className="absolute top-0 left-0 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-zinc-950 border-2 border-indigo-500 rounded-full z-10"></div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="mb-4 text-indigo-400">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
