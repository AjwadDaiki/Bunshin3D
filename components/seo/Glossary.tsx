import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

const TERMS: { key: string; href: string }[] = [
  { key: "stl", href: "/formats/stl" },
  { key: "glb", href: "/formats/glb" },
  { key: "obj", href: "/formats/obj" },
  { key: "fbx", href: "/formats/fbx" },
  { key: "gltf", href: "/formats/glb" },
  { key: "watertight", href: "/formats/stl" },
  { key: "pbr", href: "/" },
  { key: "mesh", href: "/" },
];

export default async function Glossary({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Home.Glossary" });

  return (
    <section id="glossary" className="py-24 md:py-32 px-4">
      <div className="container mx-auto max-w-5xl">
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

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TERMS.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="group block rounded-xl border border-white/6 bg-[#111] p-5 transition-colors hover:border-white/12 hover:bg-[#161616]"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <dt className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {t(`items.${key}.term`)}
                </dt>
                <ArrowRight
                  className="h-3.5 w-3.5 shrink-0 text-neutral-600 transition-colors group-hover:text-blue-400"
                  weight="bold"
                />
              </div>
              <dd className="text-sm text-neutral-400 leading-relaxed">
                {t(`items.${key}.def`)}
              </dd>
            </Link>
          ))}
        </dl>
      </div>
    </section>
  );
}
