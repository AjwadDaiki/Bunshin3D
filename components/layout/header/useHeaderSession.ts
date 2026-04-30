"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export function useHeaderSession() {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const supabaseRef = useRef(createClient());

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabaseRef.current
      .from("profiles")
      .select("credits, is_admin")
      .eq("id", userId)
      .single();

    if (!mountedRef.current) return;

    if (error) {
      console.error("[useHeaderSession] profile fetch error:", error.message);
      setCredits(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setCredits(data?.credits ?? 0);
    setIsAdmin(data?.is_admin ?? false);
    setLoading(false);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setCredits(null);
    setIsAdmin(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const supabase = supabaseRef.current;


    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mountedRef.current) return;

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        clearSession();
      }
    };

    void init();


    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mountedRef.current) return;

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        clearSession();
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, clearSession]);

  const logout = useCallback(async () => {
    await supabaseRef.current.auth.signOut();
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
