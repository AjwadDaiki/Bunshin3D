"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SupportedCurrency } from "@/lib/config/pricing";

type CurrencyContextValue = {
  currency: SupportedCurrency;
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "USD",
  isLoading: true,
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<SupportedCurrency>("USD");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/detect-country")
      .then((res) => res.json())
      .then((data) => {
        if (data.currency) {
          setCurrency(data.currency);
        }
      })
      .catch(() => {
        // keep USD default
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}
