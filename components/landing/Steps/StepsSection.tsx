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
      icon: <Scan weight="duotone" className="w-7 h-7" />,
      accent: "from-violet-500 to-indigo-500",
      glow: "bg-violet-500/20",
    },
    {
      step: "02",
      title: t("Steps.step2"),
      desc: t("Steps.step2Desc"),
      icon: <Cpu weight="duotone" className="w-7 h-7" />,
      accent: "from-indigo-500 to-cyan-500",
      glow: "bg-indigo-500/20",
    },
    {
      step: "03",
      title: t("Steps.step3"),
      desc: t("Steps.step3Desc"),
      icon: <Globe weight="duotone" className="w-7 h-7" />,
      accent: "from-cyan-500 to-emerald-500",
      glow: "bg-cyan-500/20",
    },
  ];

  return (
    <section className="relative z-10 py-32">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t("Steps.title")}
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line — desktop only */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="w-full h-full bg-linear-to-b from-transparent via-white/10 to-transparent" />
          </div>

          <div className="space-y-16 md:space-y-24">
            {steps.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div key={idx} className="relative">
                  {/* Center dot on the line — desktop */}
                  <div className="hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 z-20">
                    <div className={`w-12 h-12 rounded-full bg-linear-to-br ${item.accent} flex items-center justify-center shadow-lg`}>
                      <span className="text-sm font-black text-white">{item.step}</span>
                    </div>
                  </div>

                  {/* Card — alternates left/right on desktop */}
                  <div
                    className={`md:w-[calc(50%-3rem)] ${
                      isEven ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <div className="group relative rounded-2xl border border-white/5 bg-white/2 p-8 transition-all duration-500 hover:border-white/10 hover:bg-white/4">
                      {/* Glow behind card on hover */}
                      <div
                        className={`absolute -inset-px rounded-2xl ${item.glow} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10`}
                      />

                      {/* Mobile step number + icon row */}
                      <div className="flex items-center gap-4 mb-5">
                        <div className={`md:hidden w-10 h-10 rounded-full bg-linear-to-br ${item.accent} flex items-center justify-center shrink-0`}>
                          <span className="text-xs font-black text-white">{item.step}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 text-white/70 group-hover:text-white transition-colors">
                          {item.icon}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
