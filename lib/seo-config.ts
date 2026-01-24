import { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const constructCanonicalUrl = (path: string) => {
  return `${APP_URL}${path}`;
};

// Configuration technique de base (SANS TEXTE)
// Cette config sert de fondation technique. Le texte est fusionné dynamiquement dans le Layout.
export const baseMetadataConfig: Metadata = {
  metadataBase: new URL(APP_URL),
  authors: [{ name: "Bunshin 3D Engineering", url: APP_URL }],
  generator: "Next.js 16",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // La configuration robots reste ici car elle est technique
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};
