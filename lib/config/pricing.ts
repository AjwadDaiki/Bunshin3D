export type SupportedCurrency = "EUR" | "USD" | "JPY" | "CNY";

export const DEFAULT_CURRENCY: SupportedCurrency = "USD";

const SUPPORTED_CURRENCIES: SupportedCurrency[] = ["EUR", "USD", "JPY", "CNY"];

export const PRICING_CONFIG = {
  discovery: {
    credits: 10,
    prices: {
      EUR: { amount: 2.99, priceId: "price_1SsXtCRcc7sv4ae7cewEcPmX" },
      USD: { amount: 3.99, priceId: "price_1SuzLXRcc7sv4ae7PD4ZxUle" },
      JPY: { amount: 480, priceId: "price_1SuzM9Rcc7sv4ae7j52hIeiK" },
      CNY: { amount: 25, priceId: "price_1SuzNFRcc7sv4ae7EpfZmyTH" },
    },
  },
  creator: {
    credits: 50,
    prices: {
      EUR: { amount: 9.99, priceId: "price_1SsXuWRcc7sv4ae7iFxnyujz" },
      USD: { amount: 12.99, priceId: "price_1SuzOARcc7sv4ae7RCiMAaD0" },
      JPY: { amount: 1500, priceId: "price_1SuzOZRcc7sv4ae74mnXqvAi" },
      CNY: { amount: 88, priceId: "price_1SuzOxRcc7sv4ae7S4q6Evoa" },
    },
  },
  studio: {
    credits: 200,
    prices: {
      EUR: { amount: 29.99, priceId: "price_1SsXvjRcc7sv4ae7add6yPXT" },
      USD: { amount: 34.99, priceId: "price_1SuzPrRcc7sv4ae7LLT1bRs2" },
      JPY: { amount: 4500, priceId: "price_1SuzQGRcc7sv4ae7eOMIjq7r" },
      CNY: { amount: 250, priceId: "price_1SuzQdRcc7sv4ae7c7GGJP4F" },
    },
  },
} as const;

export type PackId = keyof typeof PRICING_CONFIG;

export function isSupportedCurrency(currency: string): currency is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency);
}

// OTO discount multipliers per pack
const OTO_DISCOUNTS: Record<PackId, number> = {
  discovery: 0.33, // 0.99 / 2.99 ≈ 33%
  creator: 0.67,   // ~33% off
  studio: 0.67,    // 19.99 / 29.99 ≈ 67%
};

export function getOTOPriceForCurrency(packId: PackId, currency: string) {
  const base = getPriceForCurrency(packId, currency);
  const discount = OTO_DISCOUNTS[packId];
  return {
    ...base,
    amount: Math.round(base.amount * discount * 100) / 100,
  };
}

export function getPriceForCurrency(packId: PackId, currency: string) {
  const pack = PRICING_CONFIG[packId];
  const safeCurrency = isSupportedCurrency(currency) ? currency : DEFAULT_CURRENCY;

  return {
    ...pack.prices[safeCurrency],
    currency: safeCurrency,
    credits: pack.credits,
  };
}
