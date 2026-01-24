import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bunshin3D - AI 3D Generation",
    short_name: "Bunshin3D",
    description: "Transform images into 3D models using AI",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#9945ff",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
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
        // @ts-expect-error Next.js type definition is too strict for "any maskable"
        purpose: "any maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        // @ts-expect-error Next.js type definition is too strict for "any maskable"
        purpose: "any maskable",
      },
    ],
  };
}
