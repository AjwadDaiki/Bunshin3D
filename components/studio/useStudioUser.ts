"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export function useStudioUser() {
  const supabase = createClient();
  const [credits, setCredits] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      const user = session?.user;
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single();
        if (mounted && data) setCredits(data.credits);
      }
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
