"use client";

import { useState, useEffect, useRef } from "react";
import { Cube, CubeFocus } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

interface ShowcaseCard3DProps {
  model: {
    id: string;
    url: string;
    label: string;
    poster: string;
  };
}

export default function ShowcaseCard3D({ model }: ShowcaseCard3DProps) {
  const t = useTranslations("Showcase");
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
      { threshold: 0.1 }
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
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80 pointer-events-none z-10"></div>
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
            <Cube className="w-12 h-12 text-zinc-700 animate-float" weight="duotone" />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex justify-between items-end">
        <div>
          <div className="text-xs font-mono text-indigo-400 mb-1 uppercase tracking-wider">
            {t("generatedAsset")}
          </div>
          <h3 className="text-xl font-bold text-white">{model.label}</h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
          <CubeFocus className="w-5 h-5" weight="duotone" />
        </div>
      </div>
    </div>
  );
}
