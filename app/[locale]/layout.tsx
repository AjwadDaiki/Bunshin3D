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
import Script from "next/script";
import HeaderNew from "@/components/layout/HeaderNew";
import FooterNew from "@/components/layout/FooterNew";
import { organizationSchema } from "@/lib/schemas/organization";

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
    openGraph: {
      type: "website",
      locale: locale,
      url: process.env.NEXT_PUBLIC_APP_URL,
      siteName: t("ogSiteName"),
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      creator: "@bunshin3d",
      images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`],
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

  // Récupération de l'ID Google Analytics depuis l'environnement
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        {/* Resource hints pour performance */}
        <link rel="preconnect" href="https://ajax.googleapis.com" />
        <link rel="dns-prefetch" href="https://ajax.googleapis.com" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        {/* Google Analytics Preconnect */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Favicons & Icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icon-32x32.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#9945ff" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Windows Tiles */}
        <meta name="msapplication-TileColor" content="#0a0a0f" />
        <meta name="msapplication-TileImage" content="/mstile-150x150.png" />

        {/* Theme Colors */}
        <meta name="theme-color" content="#9945ff" />
        <meta name="color-scheme" content="dark" />

        {/* Preload model-viewer avec crossorigin pour éviter l'avertissement CORS */}
        <link
          rel="preload"
          href="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
          as="script"
          crossOrigin="anonymous"
        />

        {/* Schema.org Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        {/* Skip link pour accessibilité */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* --- GOOGLE ANALYTICS --- */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* --- CHARGEMENT DU MOTEUR 3D --- */}
        <Script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        <NextIntlClientProvider messages={messages}>
          <HeaderNew />
          <main id="main-content">{children}</main>
          <FooterNew />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
