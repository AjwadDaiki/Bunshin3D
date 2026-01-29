import { getTranslations } from "next-intl/server";

type FAQItem = {
  question: string;
  answer: string;
};

export function generateFAQSchema(items: FAQItem[], locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export async function getFAQData(locale: string): Promise<FAQItem[]> {
  const t = await getTranslations({ locale, namespace: "FAQ" });
  return (t.raw("items") as FAQItem[]) || [];
}
