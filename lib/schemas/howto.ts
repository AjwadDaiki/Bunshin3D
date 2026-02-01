import { getTranslations } from "next-intl/server";

type HowToData = {
  name: string;
  description: string;
  tools: { browser: string; image: string };
  steps: { name: string; text: string }[];
};

export async function getHowToData(locale: string): Promise<HowToData> {
  const t = await getTranslations({ locale, namespace: "HowTo" });
  return {
    name: t("name"),
    description: t("description"),
    tools: t.raw("tools") as HowToData["tools"],
    steps: (t.raw("steps") as HowToData["steps"]) || [],
  };
}

export async function generateHowToSchema(locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";
  const data = await getHowToData(locale);

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.name,
    description: data.description,
    image: `${baseUrl}/og-image.jpg`,
    totalTime: "PT1M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: "0",
    },
    supply: [],
    tool: [
      { "@type": "HowToTool", name: data.tools.browser },
      { "@type": "HowToTool", name: data.tools.image },
    ],
    step: data.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${baseUrl}/${locale}#step-${index + 1}`,
    })),
  };
}
