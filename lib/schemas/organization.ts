import { createTranslator } from "next-intl";
import messages from "@/messages/en.json";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";
const t = createTranslator({ locale: "en", messages, namespace: "SEO" });

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${APP_URL}/#organization`,
  name: t("organizationName"),
  legalName: t("organizationName"),
  url: APP_URL,
  logo: {
    "@type": "ImageObject",
    url: `${APP_URL}/icon-512.png`,
    width: 512,
    height: 512,
    caption: t("organizationName"),
  },
  image: `${APP_URL}/og-image.jpg`,
  description: t("organizationDescription"),
  foundingDate: "2024",
  areaServed: "Worldwide",
  knowsAbout: [
    "3D Modeling",
    "Artificial Intelligence",
    "3D Printing",
    "Game Development",
    "Image Processing",
    "STL File Format",
    "GLB File Format",
    "OBJ File Format",
    "Computer Vision",
    "Neural Networks",
  ],
  knowsLanguage: ["en", "fr", "es", "de", "ja", "zh"],
  slogan: t("organizationSlogan"),
  sameAs: [
    "https://twitter.com/bunshin3d",
    "https://github.com/bunshin3d",
    "https://linkedin.com/company/bunshin3d",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: "support@bunshin3d.com",
      contactType: t("contactType"),
      availableLanguage: ["en", "fr", "es", "de", "ja", "zh"],
      areaServed: "Worldwide",
    },
  ],
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    lowPrice: "0",
    highPrice: "49.99",
    offerCount: "4",
  },
};
