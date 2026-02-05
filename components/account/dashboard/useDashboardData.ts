"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { AccountProfile, AccountUser, Generation } from "../types";

type Props = {
  user: AccountUser;
  initialProfile: AccountProfile;
  initialGenerations: Generation[];
};

export function useDashboardData({
  user,
  initialProfile,
  initialGenerations,
}: Props) {
  const supabase = createClient();
  const [generations, setGenerations] = useState<Generation[]>(initialGenerations);
  const [profile, setProfile] = useState<AccountProfile>(initialProfile);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchGenerations = useCallback(async () => {
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setGenerations(data as Generation[]);
    }
  }, [supabase, user.id]);

  const fetchProfile = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setProfile(data as AccountProfile);
    }
  }, [supabase, user.id]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([fetchGenerations(), fetchProfile()]);
    setIsRefreshing(false);
  }, [fetchGenerations, fetchProfile]);

  const deleteGeneration = useCallback(async (id: string) => {
    await supabase.from("generations").delete().eq("id", id);
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  }, [supabase]);

  useEffect(() => {
    // Run cleanup in the background — don't re-fetch since we already
    // have initialGenerations from the server. Realtime handles updates.
    fetch("/api/generations/cleanup", { method: "POST" }).catch(() => {});
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "generations",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            setGenerations((prev) => [payload.new as Generation, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setGenerations((prev) =>
              prev.map((g) =>
                g.id === (payload.new as Generation).id
                  ? (payload.new as Generation)
                  : g,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setGenerations((prev) =>
              prev.filter((g) => g.id !== (payload.old as Generation).id),
            );
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload: any) => {
          setProfile(payload.new as AccountProfile);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user.id]);

  return {
    generations,
    profile,
    page,
    setPage,
    isRefreshing,
    refresh,
    deleteGeneration,
  };
}
