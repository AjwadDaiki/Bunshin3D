import { getTranslations } from "next-intl/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

type SchemaBundle = {
  websiteSchema: Record<string, any>;
  softwareSchema: Record<string, any>;
  webPageSchema: Record<string, any>;
  imageObjectSchema: Record<string, any>;
};

export async function getHomeSchemas(
  locale: string,
  appUrl: string,
  localeToLang: Record<string, string>,
): Promise<SchemaBundle> {
  const tHome = await getTranslations({ locale, namespace: "Home" });
  const tSchema = await getTranslations({ locale, namespace: "Home.Schema" });

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${appUrl}/#website`,
    name: tSchema("websiteName"),
    url: appUrl,
    description: tHome("Hero.subtitle"),
    inLanguage: localeToLang[locale] || "en-US",
    publisher: {
      "@type": "Organization",
      "@id": `${appUrl}/#organization`,
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${appUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      {
        "@type": "ReadAction",
        target: `${appUrl}/${locale}`,
      },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${appUrl}/#software`,
    name: tSchema("softwareName"),
    applicationCategory: tSchema("softwareCategory"),
    applicationSubCategory: "3D Modeling",
    operatingSystem: tSchema("operatingSystem"),
    permissions: "browser",
    url: `${appUrl}/${locale}`,
    downloadUrl: `${appUrl}/${locale}/studio`,
    screenshot: `${appUrl}/og-image.jpg`,
    softwareVersion: "2.0",
    releaseNotes: "AI-powered image to 3D model conversion",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      description: tHome("Hero.ctaPrimary"),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1247",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      tHome("Features.speedTitle"),
      tHome("Features.topologyTitle"),
      tHome("Features.exportTitle"),
    ].join(", "),
    author: {
      "@type": "Organization",
      "@id": `${appUrl}/#organization`,
    },
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${appUrl}/${locale}#webpage`,
    url: `${appUrl}/${locale}`,
    name: tSchema("websiteName"),
    description: tHome("Hero.subtitle"),
    inLanguage: localeToLang[locale] || "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${appUrl}/#website`,
    },
    about: {
      "@type": "SoftwareApplication",
      "@id": `${appUrl}/#software`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${appUrl}/og-image.jpg`,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".hero-subtitle"],
    },
  };

  const imageObjectSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${appUrl}/og-image.jpg#image`,
    url: `${appUrl}/og-image.jpg`,
    width: 1200,
    height: 630,
    caption: "Bunshin 3D - AI 3D Model Generator",
    representativeOfPage: true,
  };

  return { websiteSchema, softwareSchema, webPageSchema, imageObjectSchema };
}
