"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase";
import { useSpecialOffer } from "@/hooks/useSpecialOffer";

type OTOContextValue = {
  isOfferActive: boolean;
  timeRemaining: number;
  triggerOffer: () => Promise<void>;
  offerStartedAt: string | null;
  bannerVisible: boolean;
};

const OTOContext = createContext<OTOContextValue>({
  isOfferActive: false,
  timeRemaining: 0,
  triggerOffer: async () => {},
  offerStartedAt: null,
  bannerVisible: false,
});

export function useOTO() {
  return useContext(OTOContext);
}

export function OTOProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const { isOfferActive, timeRemaining, triggerOffer, offerStartedAt } =
    useSpecialOffer(userId);

  return (
    <OTOContext.Provider
      value={{
        isOfferActive,
        timeRemaining,
        triggerOffer,
        offerStartedAt,
        bannerVisible: isOfferActive,
      }}
    >
      {children}
    </OTOContext.Provider>
  );
}
