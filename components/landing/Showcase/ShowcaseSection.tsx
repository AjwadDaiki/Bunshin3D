"use client";

import { useTranslations } from "next-intl";
import ShowcaseCard3D from "./ShowcaseCard3D";

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

export default function ShowcaseSection() {
  const t = useTranslations("Home");

  return (
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

      <div className="relative flex w-full group hover:paused">
        <div className="flex animate-marquee gap-8 py-4 group-hover:paused">
          {[...DEMO_MODELS, ...DEMO_MODELS].map((model, i) => (
            <ShowcaseCard3D key={`${model.id}-${i}`} model={model} />
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-zinc-950 to-transparent z-20 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-zinc-950 to-transparent z-20 pointer-events-none"></div>
      </div>
    </section>
  );
}
