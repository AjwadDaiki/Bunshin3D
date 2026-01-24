export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bunshin3D",
  url: process.env.NEXT_PUBLIC_APP_URL,
  logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
  description:
    "Transform your images into stunning 3D models with AI. The most advanced 2D to 3D conversion platform.",
  sameAs: [
    "https://twitter.com/bunshin3d",
    "https://github.com/bunshin3d",
    "https://linkedin.com/company/bunshin3d",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@bunshin3d.com",
    contactType: "Customer Support",
    availableLanguage: ["en", "fr", "es", "de", "ja", "zh"],
  },
};
