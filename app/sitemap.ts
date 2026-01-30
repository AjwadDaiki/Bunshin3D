import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

  const mainRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/login", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/legal-mentions", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const useCaseSlugs = [
    "convert-logo-to-stl-for-3d-printing",
    "create-unity-assets-from-photos",
    "turn-child-drawing-into-3d-object",
    "convert-2d-image-to-blender-obj",
    "generate-architecture-3d-model-from-blueprint",
    "ai-image-to-3d-model-free",
    "photo-to-3d-print-converter",
    "2d-drawing-to-3d-model-ai",
    "logo-3d-printing-service",
    "game-asset-generator-ai",
    "free-stl-file-generator",
    "convert-png-to-stl-online",
    "ai-3d-model-generator-from-image",
    "turn-picture-into-3d-model",
    "image-to-glb-converter",
  ];

  const entries: MetadataRoute.Sitemap = [];

  routing.locales.forEach((locale) => {
    mainRoutes.forEach((route) => {
      const alternates: Record<string, string> = {};
      routing.locales.forEach((loc) => {
        alternates[loc] = `${baseUrl}/${loc}${route.path}`;
      });
      alternates["x-default"] = `${baseUrl}/en${route.path}`;

      entries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages: alternates },
      });
    });

    useCaseSlugs.forEach((slug) => {
      const alternates: Record<string, string> = {};
      routing.locales.forEach((loc) => {
        alternates[loc] = `${baseUrl}/${loc}/use-cases/${slug}`;
      });
      alternates["x-default"] = `${baseUrl}/en/use-cases/${slug}`;

      entries.push({
        url: `${baseUrl}/${locale}/use-cases/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: alternates },
      });
    });
  });

  return entries;
}
