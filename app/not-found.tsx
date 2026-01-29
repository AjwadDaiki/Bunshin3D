"use client";

import NotFoundHero from "@/components/ui/NotFoundHero";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import messages from "../messages/en.json";

function NotFoundContent() {
  const t = useTranslations("Error");

  return (
    <NotFoundHero
      code={t("notFoundCode")}
      title={t("notFoundTitle")}
      description={t("notFoundDescription")}
      action={t("backHome")}
    />
  );
}

export default function GlobalNotFound() {
  const handleIntlError = (error: any) => {
    if (error.code === "ENVIRONMENT_FALLBACK") return;
    console.error(error);
  };

  return (
    <NextIntlClientProvider
      locale="en"
      messages={messages}
      onError={handleIntlError}
    >
      <html>
        <body className="bg-[#0a0a0f] text-white m-0 p-0">
          <NotFoundContent />
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
