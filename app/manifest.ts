import { MetadataRoute } from "next";
import { createTranslator } from "next-intl";
import messages from "@/messages/en.json";

export default function manifest(): MetadataRoute.Manifest {
  const t = createTranslator({ locale: "en", messages, namespace: "Metadata" });

  return {
    name: t("applicationName"),
    short_name: t("applicationName"),
    description: t("description"),
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#9945ff",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/icon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/mstile-150x150.png",
        sizes: "150x150",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
