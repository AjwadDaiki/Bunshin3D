import { createTranslator } from "next-intl";
import messages from "@/messages/en.json";

const t = createTranslator({ locale: "en", messages, namespace: "SEO" });

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: t("organizationName"),
  url: process.env.NEXT_PUBLIC_APP_URL,
  logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
  description: t("organizationDescription"),
  sameAs: [
    "https://twitter.com/bunshin3d",
    "https://github.com/bunshin3d",
    "https://linkedin.com/company/bunshin3d",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@bunshin3d.com",
    contactType: t("contactType"),
    availableLanguage: ["en", "fr", "es", "de", "ja", "zh"],
  },
};
