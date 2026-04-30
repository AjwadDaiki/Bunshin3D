import { getTranslations } from "next-intl/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

type SchemaBundle = {
  websiteSchema: Record<string, any>;
  softwareSchema: Record<string, any>;
  webPageSchema: Record<string, any>;
  imageObjectSchema: Record<string, any>;
  serviceSchema: Record<string, any>;
  breadcrumbSchema: Record<string, any>;
  glossarySchema: Record<string, any>;
};

const SEO_KEYWORDS = [
  "AI image to 3D converter",
  "image to STL",
  "PNG to STL converter",
  "JPG to 3D model",
  "photo to 3D printer",
  "logo to STL",
  "logo to 3D",
  "drawing to 3D",
  "sketch to 3D model",
  "AI 3D generator",
  "free 3D model maker",
  "free STL generator",
  "image to GLB",
  "image to OBJ",
  "image to FBX",
  "convert image to 3D online",
  "AI 3D printing",
  "Unity 3D asset generator",
  "Unreal Engine asset generator",
  "Blender mesh from image",
  "Godot 3D asset",
  "2D to 3D AI",
  "neural 3D reconstruction",
  "watertight STL",
  "PBR textures",
];

export async function getHomeSchemas(
  locale: string,
  appUrl: string,
  localeToLang: Record<string, string>,
): Promise<SchemaBundle> {
  const tHome = await getTranslations({ locale, namespace: "Home" });
  const tSchema = await getTranslations({ locale, namespace: "Home.Schema" });

  const featureList = [
    tHome("Features.speedTitle"),
    tHome("Features.topologyTitle"),
    tHome("Features.exportTitle"),
    tHome("Features.textureTitle"),
    tHome("Features.commercialTitle"),
    tHome("Features.instantTitle"),
    "Image to STL conversion",
    "Image to GLB conversion",
    "Image to OBJ conversion",
    "Image to FBX conversion",
    "Logo to 3D printing",
    "Photo to 3D model",
    "Sketch to 3D mesh",
    "AI depth reconstruction",
    "Watertight mesh export",
    "PBR texture generation",
    "Unity-ready 3D assets",
    "Unreal Engine asset export",
    "Blender OBJ export",
  ];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${appUrl}/#website`,
    name: tSchema("websiteName"),
    alternateName: ["Bunshin", "Bunshin3D", "Bunshin AI 3D Generator"],
    url: appUrl,
    description: tHome("Hero.subtitle"),
    inLanguage: localeToLang[locale] || "en-US",
    keywords: SEO_KEYWORDS.join(", "),
    publisher: {
      "@type": "Organization",
      "@id": `${appUrl}/#organization`,
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${appUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      {
        "@type": "ReadAction",
        target: `${appUrl}/${locale}`,
      },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${appUrl}/#software`,
    name: tSchema("softwareName"),
    alternateName: [
      "Bunshin AI 3D Generator",
      "Bunshin Image to 3D",
      "Bunshin STL Converter",
    ],
    applicationCategory: tSchema("softwareCategory"),
    applicationSubCategory: "3D Modeling",
    operatingSystem: tSchema("operatingSystem"),
    permissions: "browser",
    url: `${appUrl}/${locale}`,
    downloadUrl: `${appUrl}/${locale}/studio`,
    screenshot: `${appUrl}/og-image.jpg`,
    softwareVersion: "2.0",
    releaseNotes: "AI-powered image to 3D model conversion (STL, GLB, OBJ, FBX)",
    description: tHome("Hero.subtitle"),
    keywords: SEO_KEYWORDS.join(", "),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      description: tHome("Hero.ctaPrimary"),
    },
    featureList: featureList.join(", "),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "1247",
      reviewCount: "1247",
    },
    author: {
      "@type": "Organization",
      "@id": `${appUrl}/#organization`,
    },
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${appUrl}/${locale}#webpage`,
    url: `${appUrl}/${locale}`,
    name: tSchema("websiteName"),
    description: tHome("Hero.subtitle"),
    inLanguage: localeToLang[locale] || "en-US",
    keywords: SEO_KEYWORDS.join(", "),
    isPartOf: {
      "@type": "WebSite",
      "@id": `${appUrl}/#website`,
    },
    about: {
      "@type": "SoftwareApplication",
      "@id": `${appUrl}/#software`,
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      "@id": `${appUrl}/#software`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${appUrl}/og-image.jpg`,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".hero-subtitle"],
    },
    significantLink: [
      `${appUrl}/${locale}/studio`,
      `${appUrl}/${locale}/pricing`,
      `${appUrl}/${locale}/tools`,
      `${appUrl}/${locale}/use-cases`,
      `${appUrl}/${locale}/formats`,
    ],
  };

  const imageObjectSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${appUrl}/og-image.jpg#image`,
    url: `${appUrl}/og-image.jpg`,
    width: 1200,
    height: 630,
    caption: "Bunshin 3D - AI Image to 3D Model Converter (STL, GLB, OBJ, FBX)",
    representativeOfPage: true,
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${appUrl}/${locale}#service`,
    name: "AI Image to 3D Model Conversion",
    serviceType: "AI 3D Model Generation",
    provider: {
      "@type": "Organization",
      "@id": `${appUrl}/#organization`,
    },
    areaServed: "Worldwide",
    description: tHome("Hero.subtitle"),
    url: `${appUrl}/${locale}/studio`,
    audience: {
      "@type": "Audience",
      audienceType: "3D printing enthusiasts, game developers, designers, makers, hobbyists",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "3D Generation Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Image to STL conversion for 3D printing",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Image to GLB conversion for games and web",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Logo to 3D model conversion",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Photo to 3D printable model",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sketch and drawing to 3D model",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Unity and Unreal game asset generation",
          },
        },
      ],
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Bunshin 3D",
        item: `${appUrl}/${locale}`,
      },
    ],
  };

  const glossaryTerms = [
    {
      term: "STL",
      definition: "STL stores a 3D shape as a list of triangles. It is the standard file you load into a 3D printer slicer like Cura, PrusaSlicer or Bambu Studio.",
      url: `${appUrl}/${locale}/formats/stl`,
    },
    {
      term: "GLB",
      definition: "GLB packs geometry, materials and textures in a single binary glTF 2.0 file. Unity, Unreal, Godot, Three.js and most web viewers read it natively.",
      url: `${appUrl}/${locale}/formats/glb`,
    },
    {
      term: "OBJ",
      definition: "OBJ is the classic mesh format read by Blender, Maya and Cinema 4D. It carries geometry and UVs, and pairs with an MTL file for materials.",
      url: `${appUrl}/${locale}/formats/obj`,
    },
    {
      term: "FBX",
      definition: "FBX is the legacy interchange format from Autodesk. Older Unity projects and some studio pipelines still rely on it for animated meshes.",
      url: `${appUrl}/${locale}/formats/fbx`,
    },
    {
      term: "glTF",
      definition: "glTF 2.0 is a Khronos open standard for transmitting 3D scenes. GLB is the binary single-file flavor of glTF.",
      url: `${appUrl}/${locale}/formats/glb`,
    },
    {
      term: "Watertight mesh",
      definition: "A watertight mesh has no holes or gaps. 3D printer slicers need this to compute layers cleanly.",
      url: `${appUrl}/${locale}/formats/stl`,
    },
    {
      term: "PBR textures",
      definition: "Physically based rendering uses albedo, normal and roughness maps so a surface looks consistent under any light.",
      url: `${appUrl}/${locale}`,
    },
    {
      term: "Mesh",
      definition: "A mesh is the surface of a 3D object made of vertices, edges and faces. Every export from Bunshin 3D is a mesh.",
      url: `${appUrl}/${locale}`,
    },
  ];

  const glossarySchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${appUrl}/${locale}#glossary`,
    name: "3D file formats and modeling glossary",
    inLanguage: localeToLang[locale] || "en-US",
    url: `${appUrl}/${locale}#glossary`,
    hasDefinedTerm: glossaryTerms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
      url: t.url,
      inDefinedTermSet: `${appUrl}/${locale}#glossary`,
    })),
  };

  return {
    websiteSchema,
    softwareSchema,
    webPageSchema,
    imageObjectSchema,
    serviceSchema,
    breadcrumbSchema,
    glossarySchema,
  };
}
