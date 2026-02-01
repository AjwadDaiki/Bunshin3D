import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { NextRequest } from "next/server";

export async function getApiTranslations(
  request: NextRequest,
  namespace: string,
) {
  const locale = request.cookies.get("NEXT_LOCALE")?.value || routing.defaultLocale;
  return getTranslations({ locale, namespace });
}
