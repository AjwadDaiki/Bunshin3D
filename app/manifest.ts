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
    scope: "/",
    id: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#3b82f6",
    orientation: "portrait",
    categories: ["productivity", "design", "utilities"],
    prefer_related_applications: false,
    icons: [
      { src: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { src: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { src: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { src: "/icon-64x64.png", sizes: "64x64", type: "image/png" },
      { src: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { src: "/icon-128x128.png", sizes: "128x128", type: "image/png" },
      { src: "/mstile-150x150.png", sizes: "150x150", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-256x256.png", sizes: "256x256", type: "image/png" },
      { src: "/icon-384x384.png", sizes: "384x384", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon-192.webp", sizes: "192x192", type: "image/webp" },
      { src: "/icon-512.webp", sizes: "512x512", type: "image/webp" },
    ],
    shortcuts: [
      {
        name: "Studio",
        short_name: "Studio",
        url: "/en/studio",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Pricing",
        short_name: "Pricing",
        url: "/en/pricing",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
