import { getTranslations } from "next-intl/server";

const TOOLS: { name: string; url: string }[] = [
  { name: "Unity", url: "https://unity.com" },
  { name: "Unreal Engine", url: "https://www.unrealengine.com" },
  { name: "Godot", url: "https://godotengine.org" },
  { name: "Blender", url: "https://www.blender.org" },
  { name: "Three.js", url: "https://threejs.org" },
  { name: "Cura", url: "https://ultimaker.com/software/ultimaker-cura" },
  { name: "PrusaSlicer", url: "https://www.prusa3d.com/en/page/prusaslicer_424" },
  { name: "Bambu Studio", url: "https://bambulab.com/en/download/studio" },
];

export default async function CompatibleWith({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Home.CompatibleWith" });

  return (
    <section className="py-20 md:py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-2 mb-10">
          <p className="text-sm font-mono text-blue-400 uppercase tracking-widest">
            {t("label")}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {t("title")}
          </h2>
          <p className="text-sm text-neutral-500 max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-3">
          {TOOLS.map(({ name, url }) => (
            <li key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg border border-white/6 bg-[#111] text-sm text-neutral-300 transition-colors hover:border-white/12 hover:bg-[#161616] hover:text-white"
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
