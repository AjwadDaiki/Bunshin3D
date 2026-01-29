"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export function useStudioUser() {
  const supabase = createClient();
  const [credits, setCredits] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single();
        if (data) setCredits(data.credits);
      }
    };
    getUser();
  }, [supabase]);

  return {
    credits,
    setCredits,
    userId,
  };
}
