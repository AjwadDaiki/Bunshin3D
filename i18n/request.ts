import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Récupère la locale demandée
  let locale = await requestLocale;

  // Si la locale est invalide ou null, on force la langue par défaut
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Chargement sécurisé des messages (Fallback sur 'en' si le fichier manque)
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
  };
});
