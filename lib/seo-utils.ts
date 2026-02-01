import { routing } from "@/i18n/routing";

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

/**
 * Generate hreflang alternates for a given path.
 */
export function generateAlternates(locale: string, path: string) {
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    languages[loc] = `${APP_URL}/${loc}${path}`;
  });
  languages["x-default"] = `${APP_URL}/en${path}`;

  return {
    canonical: `${APP_URL}/${locale}${path}`,
    languages,
  };
}

/**
 * Generate OpenGraph metadata for a page.
 */
export function generateOGMetadata(
  locale: string,
  path: string,
  title: string,
  description: string,
) {
  return {
    type: "website" as const,
    locale: localeToOG[locale] || "en_US",
    alternateLocale: Object.values(localeToOG).filter(
      (l) => l !== (localeToOG[locale] || "en_US"),
    ),
    url: `${APP_URL}/${locale}${path}`,
    siteName: "Bunshin 3D",
    title,
    description,
    images: [
      {
        url: `${APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Bunshin 3D - AI 3D Model Generator",
        type: "image/jpeg",
      },
    ],
  };
}

/**
 * Generate BreadcrumbList JSON-LD schema.
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${APP_URL}${item.url}`,
    })),
  };
}

/**
 * Generate WebPage JSON-LD schema for any page.
 */
export function generateWebPageJsonLd(opts: {
  locale: string;
  path: string;
  name: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${APP_URL}/${opts.locale}${opts.path}#webpage`,
    url: `${APP_URL}/${opts.locale}${opts.path}`,
    name: opts.name,
    description: opts.description,
    inLanguage: localeToLang[opts.locale] || "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      name: "Bunshin 3D",
      url: APP_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${APP_URL}/#organization`,
      name: "Bunshin 3D",
    },
    ...(opts.datePublished && { datePublished: opts.datePublished }),
    ...(opts.dateModified && { dateModified: opts.dateModified }),
    potentialAction: {
      "@type": "ReadAction",
      target: `${APP_URL}/${opts.locale}${opts.path}`,
    },
  };
}

/**
 * Generate SpeakableSpecification for a page (helps voice assistants).
 */
export function generateSpeakableJsonLd(locale: string, path: string, cssSelectors: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${APP_URL}/${locale}${path}#speakable`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  };
}

export { APP_URL, localeToOG, localeToLang };
