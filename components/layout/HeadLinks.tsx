import { organizationSchema } from "@/lib/schemas/organization";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${APP_URL}/#webapp`,
  name: "Bunshin 3D",
  url: APP_URL,
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript, WebGL",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
  },
  featureList: "Image to 3D, Logo to STL, AI 3D Generation, GLB Export, STL Export, Text to 3D",
  screenshot: `${APP_URL}/og-image.jpg`,
  softwareVersion: "2.0",
  creator: {
    "@type": "Organization",
    "@id": `${APP_URL}/#organization`,
    name: "Bunshin 3D",
  },
};

type Props = {
  supabaseUrl?: string | null;
};

export default function HeadLinks({ supabaseUrl }: Props) {
  return (
    <>
      <link rel="preconnect" href="https://ajax.googleapis.com" />
      <link rel="dns-prefetch" href="https://ajax.googleapis.com" />
      {supabaseUrl && <link rel="preconnect" href={supabaseUrl} />}
      {supabaseUrl && <link rel="dns-prefetch" href={supabaseUrl} />}
      <link rel="preconnect" href="https://www.googletagmanager.com" />

      {/* msapplication tags — not handled by Next.js metadata API */}
      <meta name="msapplication-TileColor" content="#0a0a0f" />
      <meta name="msapplication-TileImage" content="/mstile-150x150.png" />
      <meta name="color-scheme" content="dark" />

      <link
        rel="preload"
        href="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
        as="script"
        crossOrigin="anonymous"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
    </>
  );
}
