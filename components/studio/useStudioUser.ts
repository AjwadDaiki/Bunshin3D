"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";

export function useStudioUser() {
  const supabaseRef = useRef(createClient());
  const [credits, setCredits] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const supabase = supabaseRef.current;

    const syncFromSession = async (sessionUserId: string | null) => {
      if (!mountedRef.current) return;

      if (!sessionUserId) {
        setUserId(null);
        setCredits(0);
        return;
      }

      setUserId(sessionUserId);
      const { data } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", sessionUserId)
        .single();
      if (mountedRef.current) setCredits(data?.credits ?? 0);
    };

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await syncFromSession(session?.user?.id ?? null);
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await syncFromSession(session?.user?.id ?? null);
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    credits,
    setCredits,
    userId,
  };
}
