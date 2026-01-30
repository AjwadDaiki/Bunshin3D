import { organizationSchema } from "@/lib/schemas/organization";

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

      <link rel="icon" href="/safari-pinned-tab.svg" type="image/svg+xml" />
      <link rel="icon" href="/icon-48x48.png" sizes="48x48" type="image/png" />
      <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
      <link rel="icon" href="/favicon.ico" sizes="32x32" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#9945ff" />

      <link rel="manifest" href="/manifest.webmanifest" />

      <meta name="msapplication-TileColor" content="#0a0a0f" />
      <meta name="msapplication-TileImage" content="/mstile-150x150.png" />
      <meta name="theme-color" content="#9945ff" />
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
    </>
  );
}
