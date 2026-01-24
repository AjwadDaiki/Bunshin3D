import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

  const staticRoutes = ["", "/pricing", "/login"];

  // SLUGS EN ANGLAIS (SEO FIRST)
  // Ces slugs seront les mêmes pour toutes les locales pour l'instant,
  // ou prefixés par /fr/, /en/ etc.
  const useCaseSlugs = [
    "convert-logo-to-stl-for-3d-printing",
    "create-unity-assets-from-photos",
    "turn-child-drawing-into-3d-object",
    "convert-2d-image-to-blender-obj",
    "generate-architecture-3d-model-from-blueprint",
  ];

  let entries: MetadataRoute.Sitemap = [];

  routing.locales.forEach((locale) => {
    // Routes Statiques
    staticRoutes.forEach((route) => {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    });

    // Routes pSEO
    useCaseSlugs.forEach((slug) => {
      entries.push({
        url: `${baseUrl}/${locale}/use-cases/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    });
  });

  return entries;
}
