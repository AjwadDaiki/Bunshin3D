import { getTranslations } from "next-intl/server";
import NotFoundHero from "@/components/ui/NotFoundHero";

const RECOVERY_LINKS: { href: string; key: string }[] = [
  { href: "/studio", key: "studio" },
  { href: "/pricing", key: "pricing" },
  { href: "/tools/image-to-stl", key: "imageToStl" },
  { href: "/tools/png-to-3d", key: "pngTo3d" },
  { href: "/tools/logo-to-3d", key: "logoTo3d" },
  { href: "/tools/photo-to-3d-print", key: "photoTo3dPrint" },
  { href: "/use-cases", key: "useCases" },
  { href: "/formats", key: "formats" },
  { href: "/compare", key: "compare" },
];

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const resolved = params ? await params : { locale: "en" };
  const locale = resolved.locale || "en";
  const t = await getTranslations({ locale, namespace: "Error" });
  const tRecovery = await getTranslations({ locale, namespace: "Error.recovery" });

  const recoveryItems = RECOVERY_LINKS.map(({ href, key }) => ({
    href,
    label: tRecovery(`items.${key}`),
  }));

  return (
    <NotFoundHero
      code={t("notFoundCode")}
      title={t("notFoundTitle")}
      description={t("notFoundDescription")}
      action={t("backHome")}
      recoveryTitle={tRecovery("title")}
      recoveryItems={recoveryItems}
    />
  );
}
