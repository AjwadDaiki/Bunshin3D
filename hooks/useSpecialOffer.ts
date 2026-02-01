"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";

const OTO_DURATION_MS = 24 * 60 * 60 * 1000; // 24h

export function useSpecialOffer(userId: string | null) {
  const supabase = createClient();
  const [offerStartedAt, setOfferStartedAt] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isOfferActive, setIsOfferActive] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("special_offer_started_at")
        .eq("id", userId)
        .single();
      if (data?.special_offer_started_at) {
        setOfferStartedAt(data.special_offer_started_at);
      }
    };
    fetch();
  }, [userId, supabase]);

  useEffect(() => {
    if (!offerStartedAt) {
      setIsOfferActive(false);
      setTimeRemaining(0);
      return;
    }

    const update = () => {
      const start = new Date(offerStartedAt).getTime();
      const end = start + OTO_DURATION_MS;
      const remaining = end - Date.now();
      if (remaining <= 0) {
        setIsOfferActive(false);
        setTimeRemaining(0);
      } else {
        setIsOfferActive(true);
        setTimeRemaining(remaining);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [offerStartedAt]);

  const triggerOffer = useCallback(async () => {
    if (!userId || offerStartedAt) return;
    const now = new Date().toISOString();
    await supabase
      .from("profiles")
      .update({ special_offer_started_at: now })
      .eq("id", userId);
    setOfferStartedAt(now);
  }, [userId, offerStartedAt, supabase]);

  return { isOfferActive, timeRemaining, triggerOffer, offerStartedAt };
}
