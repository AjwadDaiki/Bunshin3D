import { Metadata } from "next";
import { createTranslator } from "next-intl";
import messages from "@/messages/en.json";
import { routing } from "@/i18n/routing";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";
const t = createTranslator({ locale: "en", messages, namespace: "SEO" });

export const constructCanonicalUrl = (path: string) => {
  return `${APP_URL}${path}`;
};

export const baseMetadataConfig: Metadata = {
  metadataBase: new URL(APP_URL),
  authors: [
    { name: t("siteName"), url: APP_URL },
    { name: t("engineeringTeam") },
  ],
  generator: t("generator"),
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-64x64.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/safari-pinned-tab.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#9945ff",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: t("appleWebAppTitle"),
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
  },
};

export const seoConstants = {
  siteName: t("siteName"),
  twitterHandle: t("twitterHandle"),
  defaultLocale: routing.defaultLocale,
  supportedLocales: routing.locales,
};
