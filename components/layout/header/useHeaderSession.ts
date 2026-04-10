"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export function useHeaderSession() {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const hydratedRef = useRef(false);
  const mountedRef = useRef(true);
  const activeUserIdRef = useRef<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("credits, is_admin")
      .eq("id", userId)
      .single();

    if (!mountedRef.current) return;

    if (error) {
      console.error("[Header session] Failed to fetch profile", error);
      setCredits(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setCredits(data?.credits ?? 0);
    setIsAdmin(data?.is_admin ?? false);
    setLoading(false);
  }, []);

  const syncSession = useCallback(async (nextUser: User | null) => {
    if (!mountedRef.current) return;

    if (!nextUser) {
      activeUserIdRef.current = null;
      setUser(null);
      setCredits(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const isNewUser = activeUserIdRef.current !== nextUser.id;
    activeUserIdRef.current = nextUser.id;

    if (isNewUser) {
      setUser(nextUser);
      setLoading(true);
    }

    await fetchProfile(nextUser.id);
  }, [fetchProfile]);

  useEffect(() => {
    mountedRef.current = true;
    hydratedRef.current = false;

    const hydrateSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mountedRef.current) return;
      hydratedRef.current = true;
      await syncSession(session?.user ?? null);
    };

    void hydrateSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return;

      if (event === "INITIAL_SESSION" && hydratedRef.current) return;
      hydratedRef.current = true;
      await syncSession(session?.user ?? null);
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [syncSession]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  }, []);

  return {
    user,
    credits,
    isAdmin,
    loading,
    logout,
  };
}
