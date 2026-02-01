"use client";

import { useEffect } from "react";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import messages from "../messages/en.json";

function RootErrorContent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error(t("rootLogPrefix"), error);
  }, [error, t]);

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "400px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
            {t("warningSymbol")}
          </div>
          <h1 style={{ color: "#fff", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            {t("serverErrorTitle")}
          </h1>
          <p style={{ color: "#888", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            {t("serverErrorDescription")}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              style={{ padding: "0.75rem 1.5rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "9999px", color: "#fff", cursor: "pointer", fontSize: "0.9rem" }}
            >
              {t("tryAgain")}
            </button>
            <a
              href="/"
              style={{ padding: "0.75rem 1.5rem", background: "linear-gradient(to right, #6366f1, #9333ea)", borderRadius: "9999px", color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}
            >
              {t("backHome")}
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

export default function RootError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      <RootErrorContent {...props} />
    </NextIntlClientProvider>
  );
}
