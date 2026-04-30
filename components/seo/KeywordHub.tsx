import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

const HUB_LINKS: { key: string; href: string }[] = [
  { key: "imageToStl", href: "/tools/image-to-stl" },
  { key: "pngToStl", href: "/tools/png-to-3d" },
  { key: "jpgTo3d", href: "/use-cases/photo-to-3d-print-converter" },
  { key: "photoTo3dPrint", href: "/tools/photo-to-3d-print" },
  { key: "logoToStl", href: "/use-cases/convert-logo-to-stl-for-3d-printing" },
  { key: "logoTo3d", href: "/tools/logo-to-3d" },
  { key: "drawingTo3d", href: "/use-cases/2d-drawing-to-3d-model-ai" },
  { key: "sketchTo3d", href: "/use-cases/2d-drawing-to-3d-model-ai" },
  { key: "imageToGlb", href: "/use-cases/image-to-glb-converter" },
  { key: "imageToObj", href: "/use-cases/convert-2d-image-to-blender-obj" },
  { key: "unityAssets", href: "/use-cases/create-unity-assets-from-photos" },
  { key: "unrealAssets", href: "/for/game-developers" },
  { key: "aiGameAssets", href: "/use-cases/game-asset-generator-ai" },
  { key: "freeStl", href: "/use-cases/free-stl-file-generator" },
  { key: "aiImageTo3d", href: "/use-cases/ai-image-to-3d-model-free" },
];

export default async function KeywordHub({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Home.KeywordHub" });

  return (
    <section className="py-24 md:py-32 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-3 mb-12">
          <p className="text-sm font-mono text-blue-400 uppercase tracking-widest">
            {t("label")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
            {t("title")}
          </h2>
          <p className="text-base text-neutral-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {HUB_LINKS.map(({ key, href }) => (
            <li key={key}>
              <Link
                href={href}
                className="group flex items-center justify-between gap-3 rounded-lg border border-white/6 bg-[#111] px-4 py-3 text-sm text-neutral-300 transition-colors hover:border-white/12 hover:bg-[#161616] hover:text-white"
              >
                <span className="truncate">{t(`items.${key}`)}</span>
                <ArrowRight
                  className="h-3.5 w-3.5 shrink-0 text-neutral-600 transition-colors group-hover:text-blue-400"
                  weight="bold"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
