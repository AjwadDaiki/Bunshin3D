


export type Currency = "EUR" | "USD" | "GBP" | "JPY" | "CNY";

export interface ExchangeRates {
  [key: string]: number;
}


export const EXCHANGE_RATES: ExchangeRates = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.85,
  JPY: 163.5,
  CNY: 7.86,
};


export const CURRENCY_SYMBOLS: { [key in Currency]: string } = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
};


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


export function convertPrice(
  priceEUR: number,
  targetCurrency: Currency
): number {
  const rate = EXCHANGE_RATES[targetCurrency] || 1;
  return Math.round(priceEUR * rate * 100) / 100;
}


export function formatPrice(
  priceEUR: number,
  currency: Currency,
  showSymbol: boolean = true
): string {
  const convertedPrice = convertPrice(priceEUR, currency);
  const symbol = CURRENCY_SYMBOLS[currency];

  if (currency === "JPY" || currency === "CNY") {

    const rounded = Math.round(convertedPrice);
    return showSymbol ? `${symbol}${rounded}` : `${rounded}`;
  }

  const formatted = convertedPrice.toFixed(2);
  return showSymbol ? `${formatted}${symbol}` : formatted;
}


