import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { routing } from "@/i18n/routing";

export async function getAdminTranslations(namespace: string) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || routing.defaultLocale;
  return getTranslations({ locale, namespace });
}

