// Système de conversion de devises simple
// Pour un système dynamique, utilisez une API comme exchangerate-api.com

export type Currency = "EUR" | "USD" | "GBP" | "JPY" | "CNY";

export interface ExchangeRates {
  [key: string]: number;
}

// Taux de change approximatifs (base EUR = 1)
// ⚠️ Mettre à jour régulièrement ou utiliser une API
export const EXCHANGE_RATES: ExchangeRates = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.85,
  JPY: 163.5,
  CNY: 7.86,
};

// Symboles de devises
export const CURRENCY_SYMBOLS: { [key in Currency]: string } = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
};

// Mapper la locale vers la devise
export function getLocaleCurrency(locale: string): Currency {
  const currencyMap: { [key: string]: Currency } = {
    en: "USD",
    fr: "EUR",
    es: "EUR",
    de: "EUR",
    ja: "JPY",
    zh: "CNY",
  };

  return currencyMap[locale] || "EUR";
}

// Convertir un prix EUR vers une autre devise
export function convertPrice(
  priceEUR: number,
  targetCurrency: Currency
): number {
  const rate = EXCHANGE_RATES[targetCurrency] || 1;
  return Math.round(priceEUR * rate * 100) / 100; // Arrondi à 2 décimales
}

// Formater un prix avec symbole
export function formatPrice(
  priceEUR: number,
  currency: Currency,
  showSymbol: boolean = true
): string {
  const convertedPrice = convertPrice(priceEUR, currency);
  const symbol = CURRENCY_SYMBOLS[currency];

  if (currency === "JPY" || currency === "CNY") {
    // Pas de décimales pour JPY et CNY
    const rounded = Math.round(convertedPrice);
    return showSymbol ? `${symbol}${rounded}` : `${rounded}`;
  }

  const formatted = convertedPrice.toFixed(2);
  return showSymbol ? `${formatted}${symbol}` : formatted;
}

// Exemple d'utilisation :
// const price = formatPrice(2.99, getLocaleCurrency("fr")); // "2.99€"
// const price = formatPrice(2.99, getLocaleCurrency("ja")); // "¥489"
