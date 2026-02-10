"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";

export function useStudioUser() {
  // Stable reference: avoid recreating the Supabase client on every render
  const supabase = useMemo(() => createClient(), []);
  const [credits, setCredits] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const syncFromSession = async (sessionUserId: string | null) => {
      if (!mounted) return;

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
      if (mounted) setCredits(data?.credits ?? 0);
    };

    const hydrateSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await syncFromSession(session?.user?.id ?? null);
    };

    void hydrateSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await syncFromSession(session?.user?.id ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    credits,
    setCredits,
    userId,
  };
}
