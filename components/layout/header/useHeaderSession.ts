"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
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
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user ?? null);
    if (user) {
      await Promise.all([fetchCredits(user.id), refreshAdmin()]);
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
