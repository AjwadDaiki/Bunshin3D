import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {

  let locale = await requestLocale;


  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }


  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.warn(
      `⚠️ Fichier de traduction manquant pour "${locale}". Chargement de la version anglaise.`,
    );
    messages = (await import(`../messages/${routing.defaultLocale}.json`))
      .default;
  }

  return {
    locale,
    messages,
    onError(error) {
      if (error.code === "ENVIRONMENT_FALLBACK") return;
      console.error(error);
    },
  };
});
