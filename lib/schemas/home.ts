import { getTranslations } from "next-intl/server";

type SchemaBundle = {
  websiteSchema: Record<string, any>;
  softwareSchema: Record<string, any>;
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${appUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${appUrl}/#software`,
    name: tSchema("softwareName"),
    applicationCategory: tSchema("softwareCategory"),
    operatingSystem: tSchema("operatingSystem"),
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
    featureList: [
      tHome("Features.speedTitle"),
      tHome("Features.topologyTitle"),
      tHome("Features.exportTitle"),
    ].join(", "),
  };

  return { websiteSchema, softwareSchema };
}
