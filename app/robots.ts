import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/", "/fr/", "/en/", "/fr/pricing", "/en/pricing"],
        disallow: ["/studio/", "/account/", "/admin/", "/api/", "/*?*"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/"],
        disallow: ["/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/fr/", "/en/"],
        disallow: ["/studio/", "/account/", "/admin/", "/api/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio/", "/account/", "/admin/", "/api/", "/_next/", "/static/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
