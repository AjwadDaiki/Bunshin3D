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
import BackgroundFX from "@/components/landing/BackgroundFX";
import { generateAlternates, generateOGMetadata } from "@/lib/seo-utils";

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
    alternates: generateAlternates(locale, ""),
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      other: {
        "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
      },
    },
    openGraph: {
      ...generateOGMetadata(locale, "", t("ogTitle"), t("ogDescription")),
      siteName: t("ogSiteName"),
    },
    twitter: {
      card: "summary_large_image" as const,
      site: "@bunshin3d",
      creator: "@bunshin3d",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: {
        url: `${baseUrl}/og-image.jpg`,
        alt: t("ogImageAlt"),
      },
    },
    other: {
      ...baseMetadataConfig.other,
      "theme-color": "#9945ff",
      "google": "notranslate",
      "DC.title": t("defaultTitle"),
      "DC.creator": "Bunshin 3D",
      "DC.subject": t("description"),
      "DC.description": t("description"),
      "DC.publisher": "Bunshin 3D",
      "DC.language": locale,
      "DC.type": "Software",
      "DC.format": "text/html",
      "rating": "general",
      "distribution": "global",
      "revisit-after": "3 days",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "format-detection": "telephone=no",
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

        <BackgroundFX />
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <OTOProvider>
              <div className="sticky top-0 z-50">
                <OTOBanner />
                <HeaderNew />
              </div>
              <main id="main-content" className="relative z-10">{children}</main>
              <FooterNew />
            </OTOProvider>
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
