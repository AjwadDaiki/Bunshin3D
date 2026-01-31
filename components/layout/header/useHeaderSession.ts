"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { checkIsAdmin } from "@/app/actions/admin";

export function useHeaderSession() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const hydratedRef = useRef(false);

  const fetchCredits = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();
      setCredits(data?.credits ?? 0);
    },
    [supabase],
  );

  const refreshAdmin = useCallback(async () => {
    const adminStatus = await checkIsAdmin();
    setIsAdmin(adminStatus);
  }, []);

  const loadUserData = useCallback(
    async (u: User) => {
      setUser(u);
      await Promise.all([fetchCredits(u.id), refreshAdmin()]);
    },
    [fetchCredits, refreshAdmin],
  );

  const clearUserData = useCallback(() => {
    setUser(null);
    setIsAdmin(false);
    setCredits(null);
  }, []);

  useEffect(() => {
    let mounted = true;
    hydratedRef.current = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      const nextUser = session?.user ?? null;

      // Skip INITIAL_SESSION if we already hydrated from a SIGNED_IN event
      if (event === "INITIAL_SESSION" && hydratedRef.current) return;
      hydratedRef.current = true;

      if (nextUser) {
        await loadUserData(nextUser);
      } else {
        clearUserData();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadUserData, clearUserData]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  }, [supabase]);

  return {
    user,
    credits,
    isAdmin,
    logout,
  };
}
