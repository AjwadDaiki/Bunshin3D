import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import { generateAlternates, generateOGMetadata, generateBreadcrumbJsonLd, generateWebPageJsonLd } from "@/lib/seo-utils";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.Metadata" });

  return {
    title: t("privacyTitle"),
    description: t("privacyDescription"),
    keywords: t("privacyKeywords").split(", "),
    robots: { index: true, follow: true },
    alternates: generateAlternates(locale, "/privacy"),
    openGraph: generateOGMetadata(locale, "/privacy", t("privacyOgTitle"), t("privacyOgDescription")),
    twitter: {
      card: "summary_large_image" as const,
      title: t("privacyOgTitle"),
      description: t("privacyOgDescription"),
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Legal.Privacy" });
  const tBreadcrumbs = await getTranslations({ locale, namespace: "Breadcrumbs" });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: tBreadcrumbs("home"), url: `/${locale}` },
    { name: tBreadcrumbs("privacy"), url: `/${locale}/privacy` },
  ]);

  const tMeta = await getTranslations({ locale, namespace: "Legal.Metadata" });
  const webPageJsonLd = generateWebPageJsonLd({
    locale,
    path: "/privacy",
    name: tMeta("privacyTitle"),
    description: tMeta("privacyDescription"),
    dateModified: "2026-01-01",
  });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={webPageJsonLd} />
      <main className="min-h-screen text-zinc-300 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-white mb-2">{t("title")}</h1>
          <p className="text-zinc-500 text-sm mb-12">{t("lastUpdated")}</p>

          <div className="space-y-12">
            <section>
              <p className="text-lg leading-relaxed">{t("intro")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                {t("section1Title")}
              </h2>
              <p className="leading-relaxed">{t("section1Text")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                {t("section2Title")}
              </h2>
              <p className="leading-relaxed">{t("section2Text")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                {t("section3Title")}
              </h2>
              <p className="leading-relaxed">{t("section3Text")}</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
