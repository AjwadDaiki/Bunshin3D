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
      className="mx-6 w-87.5 h-100 shrink-0 relative group rounded-xl overflow-hidden border border-white/6 bg-[#111] transition-colors hover:border-white/12"
    >
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 pointer-events-none z-10"></div>
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
          <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] animate-pulse">
            <Cube className="w-12 h-12 text-neutral-700" weight="duotone" />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex justify-between items-end">
        <div>
          <div className="text-xs font-mono text-blue-400 mb-1 uppercase tracking-wider">
            {t("generatedAsset")}
          </div>
          <h3 className="text-xl font-bold text-white">{model.label}</h3>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#191919] flex items-center justify-center border border-white/6 text-neutral-400 group-hover:text-white transition-colors">
          <CubeFocus className="w-5 h-5" weight="duotone" />
        </div>
      </div>
    </div>
  );
}
