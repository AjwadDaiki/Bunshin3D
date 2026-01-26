import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import LandingPage from "@/components/home/LandingPage";
import PricingTable from "@/components/marketing/PricingTable";
import { baseMetadataConfig } from "@/lib/seo-config";
import { generateFAQSchema, getFAQDataForLocale } from "@/lib/schemas/faq";
import { generateHowToSchema } from "@/lib/schemas/howto";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

const localeToOG: Record<string, string> = {
  fr: "fr_FR",
  en: "en_US",
  es: "es_ES",
  de: "de_DE",
  ja: "ja_JP",
  zh: "zh_CN",
};

const localeToLang: Record<string, string> = {
  fr: "fr-FR",
  en: "en-US",
  es: "es-ES",
  de: "de-DE",
  ja: "ja-JP",
  zh: "zh-CN",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const alternateLanguages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    alternateLanguages[loc] = `${APP_URL}/${loc}`;
  });
  alternateLanguages["x-default"] = `${APP_URL}/fr`;

  return {
    ...baseMetadataConfig,
    title: t("defaultTitle"),
    description: t("description"),
    applicationName: t("applicationName"),
    keywords: t("keywords").split(", "),
    alternates: {
      canonical: `${APP_URL}/${locale}`,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "website",
      locale: localeToOG[locale] || "en_US",
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => localeToOG[l]),
      url: `${APP_URL}/${locale}`,
      siteName: t("ogSiteName"),
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: `${APP_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@bunshin3d",
      creator: "@bunshin3d",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: [`${APP_URL}/og-image.jpg`],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const tPricing = await getTranslations({
    locale,
    namespace: "Pricing.Header",
  });

  const tHome = await getTranslations({ locale, namespace: "Home" });

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${APP_URL}/#website`,
    name: "Bunshin 3D",
    url: APP_URL,
    description: tHome("Hero.subtitle"),
    inLanguage: localeToLang[locale] || "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${APP_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${APP_URL}/#software`,
    name: "Bunshin 3D",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: tHome("Hero.ctaPrimary"),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1247",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: tHome("Features.speedTitle") + ", " + tHome("Features.topologyTitle") + ", " + tHome("Features.exportTitle"),
  };

  const faqData = getFAQDataForLocale(locale);
  const faqSchema = generateFAQSchema(faqData, locale);
  const howToSchema = generateHowToSchema(locale);

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={howToSchema} />

      <LandingPage />

      <section
        id="pricing"
        className="py-24 bg-zinc-950 relative overflow-hidden border-t border-white/5"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
              {tPricing("title")}{" "}
              <span className="bg-linear-to-r from-indigo-300 to-indigo-500 bg-clip-text text-transparent">
                {tPricing("titleHighlight")}
              </span>
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              {tPricing("subtitle")}
            </p>
          </div>

          <PricingTable />
        </div>
      </section>
    </>
  );
}
