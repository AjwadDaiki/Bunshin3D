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
    title: t("mentionsTitle"),
    description: t("mentionsDescription"),
    keywords: t("mentionsKeywords").split(", "),
    robots: { index: true, follow: true },
    alternates: generateAlternates(locale, "/legal-mentions"),
    openGraph: generateOGMetadata(locale, "/legal-mentions", t("mentionsOgTitle"), t("mentionsOgDescription")),
    twitter: {
      card: "summary_large_image" as const,
      title: t("mentionsOgTitle"),
      description: t("mentionsOgDescription"),
    },
  };
}

export default async function MentionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Legal.Mentions" });
  const tBreadcrumbs = await getTranslations({ locale, namespace: "Breadcrumbs" });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: tBreadcrumbs("home"), url: `/${locale}` },
    { name: tBreadcrumbs("legalMentions"), url: `/${locale}/legal-mentions` },
  ]);

  const tMeta = await getTranslations({ locale, namespace: "Legal.Metadata" });
  const webPageJsonLd = generateWebPageJsonLd({
    locale,
    path: "/legal-mentions",
    name: tMeta("mentionsTitle"),
    description: tMeta("mentionsDescription"),
  });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={webPageJsonLd} />
      <main className="min-h-screen text-zinc-300 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-white mb-12">{t("title")}</h1>

          <div className="space-y-12 border-l border-white/10 pl-8">
            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">{t("editorTitle")}</h2>
              <p className="whitespace-pre-line leading-relaxed">
                {t("editorText")}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">{t("hostTitle")}</h2>
              <p className="whitespace-pre-line leading-relaxed">
                {t("hostText")}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">
                {t("creditsTitle")}
              </h2>
              <p className="whitespace-pre-line leading-relaxed">
                {t("creditsText")}
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
