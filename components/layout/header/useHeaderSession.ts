"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export function useHeaderSession() {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const hydratedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    hydratedRef.current = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return;
      const nextUser = session?.user ?? null;

      if (event === "INITIAL_SESSION" && hydratedRef.current) return;
      hydratedRef.current = true;

      if (nextUser) {
        setUser(nextUser);
        const { data } = await supabase
          .from("profiles")
          .select("credits, is_admin")
          .eq("id", nextUser.id)
          .single();
        if (!mountedRef.current) return;
        setCredits(data?.credits ?? 0);
        setIsAdmin(data?.is_admin ?? false);
      } else {
        setUser(null);
        setCredits(null);
        setIsAdmin(false);
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  }, []);

  return {
    user,
    credits,
    isAdmin,
    logout,
  };
}
