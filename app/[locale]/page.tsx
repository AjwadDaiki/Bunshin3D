import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import LandingPage from "@/components/home/LandingPage";
import PricingTable from "@/components/marketing/PricingTable";
import { baseMetadataConfig } from "@/lib/seo-config";
import { generateFAQSchema, getFAQData } from "@/lib/schemas/faq";
import { generateHowToSchema } from "@/lib/schemas/howto";
import { getHomeSchemas } from "@/lib/schemas/home";
import ReferralPromoPanel from "@/components/referral/ReferralPromoPanel";

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
  alternateLanguages["x-default"] = `${APP_URL}/en`;

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

  const faqData = await getFAQData(locale);
  const faqSchema = generateFAQSchema(faqData, locale);
  const howToSchema = await generateHowToSchema(locale);
  const { websiteSchema, softwareSchema, webPageSchema, imageObjectSchema } = await getHomeSchemas(
    locale,
    APP_URL,
    localeToLang,
  );

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareSchema} />
      <JsonLd data={webPageSchema} />
      <JsonLd data={imageObjectSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={howToSchema} />

      <LandingPage />

      <hr className="section-hr" />

      <section
        id="pricing"
        className="py-24 md:py-36 relative overflow-hidden"
      >
        {/* Subtle section glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-4 mb-16">
            <p className="text-sm font-mono text-blue-400 uppercase tracking-widest">
              {tPricing("title")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
              {tPricing("titleHighlight")}
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              {tPricing("subtitle")}
            </p>
            <p className="text-sm text-neutral-500">
              {tPricing("socialProof")}
            </p>
          </div>

          <PricingTable />

          <p className="text-center text-sm text-neutral-500 mt-8">
            {tPricing("guarantee")}
          </p>

          <div className="mt-16 max-w-5xl mx-auto">
            <ReferralPromoPanel />
          </div>
        </div>
      </section>
    </>
  );
}
