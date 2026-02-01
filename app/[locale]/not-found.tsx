import { useTranslations } from "next-intl";
import NotFoundHero from "@/components/ui/NotFoundHero";

export default function NotFound() {
  const t = useTranslations("Error");

  return (
    <NotFoundHero
      code={t("notFoundCode")}
      title={t("notFoundTitle")}
      description={t("notFoundDescription")}
      action={t("backHome")}
    />
  );
}
