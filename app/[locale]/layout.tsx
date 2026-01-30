import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { cn } from "@/lib/utils";
import { baseMetadataConfig } from "@/lib/seo-config";
import HeaderNew from "@/components/layout/HeaderNew";
import FooterNew from "@/components/layout/FooterNew";
import HeadLinks from "@/components/layout/HeadLinks";
import AnalyticsScripts from "@/components/layout/AnalyticsScripts";
import ModelViewerScript from "@/components/layout/ModelViewerScript";
import OTOBanner from "@/components/layout/OTOBanner";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { OTOProvider } from "@/components/providers/OTOProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

  const alternateLanguages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    alternateLanguages[loc] = `${baseUrl}/${loc}`;
  });
  alternateLanguages["x-default"] = `${baseUrl}/en`;

  return {
    ...baseMetadataConfig,
    title: {
      default: t("defaultTitle"),
      template: t("templateTitle"),
    },
    description: t("description"),
    applicationName: t("applicationName"),
    keywords: t("keywords").split(", "),
    creator: t("creator"),
    publisher: t("publisher"),
    category: "technology",
    classification: "3D Modeling Software",
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: alternateLanguages,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      other: {
        "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
      },
    },
    openGraph: {
      type: "website",
      locale: ({ fr: "fr_FR", en: "en_US", es: "es_ES", de: "de_DE", ja: "ja_JP", zh: "zh_CN" } as Record<string, string>)[locale] || "en_US",
      alternateLocale: ["fr_FR", "en_US", "es_ES", "de_DE", "ja_JP", "zh_CN"].filter(l => l !== ({ fr: "fr_FR", en: "en_US", es: "es_ES", de: "de_DE", ja: "ja_JP", zh: "zh_CN" } as Record<string, string>)[locale]),
      url: `${baseUrl}/${locale}`,
      siteName: t("ogSiteName"),
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
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
      images: {
        url: `${baseUrl}/og-image.jpg`,
        alt: t("ogImageAlt"),
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <HeadLinks supabaseUrl={supabaseUrl} />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <a href="#main-content" className="skip-link">
          {tCommon("skipToContent")}
        </a>

        <AnalyticsScripts gaId={gaId} />
        <ModelViewerScript />

        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <OTOProvider>
              <div className="sticky top-0 z-50">
                <OTOBanner />
                <HeaderNew />
              </div>
              <main id="main-content">{children}</main>
              <FooterNew />
            </OTOProvider>
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
