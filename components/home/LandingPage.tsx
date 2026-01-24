"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  Zap,
  Box,
  Layers,
  Cpu,
  ScanFace,
  Globe,
  Play,
  Move3d,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Exemples de modèles 3D (GLB)
const DEMO_MODELS = [
  {
    id: "axe",
    url: "/models/hache.glb",
    label: "Axe",
    poster: "https://modelviewer.dev/shared-assets/models/DamagedHelmet.png",
  },
  {
    id: "trash",
    url: "/models/poubelle.glb",
    label: "Trash",
    poster: "https://modelviewer.dev/shared-assets/models/RobotExpressive.png",
  },
  {
    id: "shuriken",
    url: "/models/shuriken.glb",
    label: "Shuriken",
    poster: "https://modelviewer.dev/shared-assets/models/Astronaut.png",
  },
  {
    id: "chair",
    url: "/models/chaise.glb",
    label: "Chair",
    poster: "https://modelviewer.dev/shared-assets/models/SheenChair.png",
  },
];

export default function LandingPage() {
  const t = useTranslations("Home");

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white overflow-hidden selection:bg-indigo-500/30">
      {/* --- BACKGROUND FX --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-4">
        <div className="container mx-auto max-w-6xl text-center space-y-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            {t("Hero.title")} <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-500 bg-clip-text text-transparent">
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
              <Move3d className="w-5 h-5 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-white to-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <Link
              href="#showcase"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <Play className="w-4 h-4 fill-current" />
              {t("Hero.ctaSecondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* --- CAROUSEL 3D INFINI (Showcase) --- */}
      <section
        id="showcase"
        className="relative z-10 py-24 border-y border-white/5 bg-zinc-950/50 backdrop-blur-sm overflow-hidden"
      >
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-zinc-800"></span>
            {t("Showcase.title")}
            <span className="h-px w-8 bg-zinc-800"></span>
          </h2>
        </div>

        <div className="relative flex w-full group hover:[animation-play-state:paused]">
          <div className="flex animate-marquee gap-8 py-4 group-hover:[animation-play-state:paused]">
            {[...DEMO_MODELS, ...DEMO_MODELS].map((model, i) => (
              <ShowcaseCard3D key={`${model.id}-${i}`} model={model} />
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none"></div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="relative z-10 py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title={t("Features.speedTitle")}
              desc={t("Features.speedDesc")}
              gradient="from-yellow-500/10 to-orange-500/10"
            />
            <FeatureCard
              icon={<Box className="w-8 h-8 text-indigo-400" />}
              title={t("Features.topologyTitle")}
              desc={t("Features.topologyDesc")}
              gradient="from-indigo-500/10 to-blue-500/10"
            />
            <FeatureCard
              icon={<Layers className="w-8 h-8 text-emerald-400" />}
              title={t("Features.exportTitle")}
              desc={t("Features.exportDesc")}
              gradient="from-emerald-500/10 to-teal-500/10"
            />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
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
            <div className="hidden md:block absolute top-6 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            {[
              {
                step: "01",
                title: t("Steps.step1"),
                desc: t("Steps.step1Desc"),
                icon: <ScanFace />,
              },
              {
                step: "02",
                title: t("Steps.step2"),
                desc: t("Steps.step2Desc"),
                icon: <Cpu />,
              },
              {
                step: "03",
                title: t("Steps.step3"),
                desc: t("Steps.step3Desc"),
                icon: <Globe />,
              },
            ].map((item, idx) => (
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

      {/* --- FOOTER CTA --- */}
      <section className="relative z-10 py-32 px-4 text-center">
        <div className="container mx-auto max-w-3xl space-y-8 p-12 rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-zinc-900/80 to-black backdrop-blur-xl shadow-2xl">
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
    </div>
  );
}

// --- COMPOSANT CARTE 3D ---

function ShowcaseCard3D({ model }: { model: any }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="mx-6 w-87.5 h-100 shrink-0 relative group rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/80 shadow-2xl transition-all hover:scale-105 hover:border-indigo-500/30 hover:shadow-indigo-500/10"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none z-10"></div>
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        {isVisible ? (
          <model-viewer
            src={model.url}
            poster={model.poster}
            loading="lazy"
            camera-controls
            auto-rotate
            auto-rotate-delay="0"
            rotation-per-second="30deg"
            shadow-intensity="1"
            shadow-softness="0.5"
            exposure="1"
            environment-image="neutral"
            disable-zoom
            class="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          >
            <div slot="progress-bar"></div>
          </model-viewer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900/50 animate-pulse">
            <Box className="w-12 h-12 text-zinc-700 animate-float" />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex justify-between items-end">
        <div>
          <div className="text-xs font-mono text-indigo-400 mb-1 uppercase tracking-wider">
            Generated Asset
          </div>
          <h3 className="text-xl font-bold text-white">{model.label}</h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
          <Move3d className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

// --- FEATURE CARD ---

function FeatureCard({
  icon,
  title,
  desc,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient: string;
}) {
  return (
    <div
      className={cn(
        "group relative p-8 rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm transition-all hover:border-white/10 hover:-translate-y-1",
        "overflow-hidden",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
          gradient,
        )}
      ></div>

      <div className="relative z-10 space-y-4">
        <div className="p-3 bg-zinc-950 rounded-2xl inline-flex ring-1 ring-white/10 shadow-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-zinc-400 leading-relaxed text-sm">{desc}</p>
      </div>
    </div>
  );
}
