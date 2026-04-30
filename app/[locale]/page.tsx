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
import HomeToolsSection from "@/components/home/HomeToolsSection";
import KeywordHub from "@/components/seo/KeywordHub";
import Glossary from "@/components/seo/Glossary";
import CompatibleWith from "@/components/seo/CompatibleWith";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tPricing = await getTranslations({
    locale,
    namespace: "Pricing.Header",
  });

  const tSEO = await getTranslations({
    locale,
    namespace: "Home.SEOContent",
  });

  const faqData = await getFAQData(locale);
  const faqSchema = generateFAQSchema(faqData, locale);
  const howToSchema = await generateHowToSchema(locale);
  const {
    websiteSchema,
    softwareSchema,
    webPageSchema,
    imageObjectSchema,
    serviceSchema,
    breadcrumbSchema,
    glossarySchema,
  } = await getHomeSchemas(locale, APP_URL, localeToLang);

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareSchema} />
      <JsonLd data={webPageSchema} />
      <JsonLd data={imageObjectSchema} />
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={glossarySchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={howToSchema} />

      <LandingPage />

      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-4xl">
          <article className="space-y-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-4">
                {tSEO("title1")}
              </h2>
              <p className="text-neutral-400 leading-relaxed text-base">
                {tSEO("text1")}
              </p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-4">
                {tSEO("title2")}
              </h2>
              <p className="text-neutral-400 leading-relaxed text-base">
                {tSEO("text2")}
              </p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-4">
                {tSEO("title3")}
              </h2>
              <p className="text-neutral-400 leading-relaxed text-base">
                {tSEO("text3")}
              </p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-4">
                {tSEO("title4")}
              </h2>
              <p className="text-neutral-400 leading-relaxed text-base">
                {tSEO("text4")}
              </p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-4">
                {tSEO("title5")}
              </h2>
              <p className="text-neutral-400 leading-relaxed text-base">
                {tSEO("text5")}
              </p>
            </div>
          </article>
        </div>
      </section>

      <hr className="section-hr" />

      <KeywordHub locale={locale} />

      <hr className="section-hr" />

      <CompatibleWith locale={locale} />

      <hr className="section-hr" />

      <Glossary locale={locale} />

      <hr className="section-hr" />

      <section
        id="pricing"
        className="py-24 md:py-36 relative overflow-hidden"
      >
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

          <PricingTable userId={user?.id ?? null} />

          <p className="text-center text-sm text-neutral-500 mt-8">
            {tPricing("guarantee")}
          </p>

          <div className="mt-16 max-w-5xl mx-auto">
            <ReferralPromoPanel />
          </div>
        </div>
      </section>

      <hr className="section-hr" />

      <HomeToolsSection />
    </>
  );
}
