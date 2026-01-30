"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, clearSupabaseCookies } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { checkIsAdmin } from "@/app/actions/admin";

export function useHeaderSession() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const hydrateUser = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const sessionUser = session?.user ?? null;
    setUser(sessionUser);
    if (sessionUser) {
      await Promise.all([fetchCredits(sessionUser.id), refreshAdmin()]);
    } else {
      setIsAdmin(false);
      setCredits(null);
    }
  }, [fetchCredits, refreshAdmin, supabase]);

  useEffect(() => {
    hydrateUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_: any, session: any) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        await Promise.all([fetchCredits(nextUser.id), refreshAdmin()]);
      } else {
        setIsAdmin(false);
        setCredits(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchCredits, hydrateUser, refreshAdmin, supabase]);

  const logout = useCallback(async () => {
    setUser(null);
    setCredits(null);
    setIsAdmin(false);
    await supabase.auth.signOut({ scope: "global" });
    clearSupabaseCookies();
    window.location.href = window.location.pathname;
  }, [supabase]);

  return {
    user,
    credits,
    isAdmin,
    logout,
  };
}
