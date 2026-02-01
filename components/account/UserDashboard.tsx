"use client";

import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardStatsGrid from "./dashboard/DashboardStatsGrid";
import GenerationHistory from "./dashboard/GenerationHistory";
import { useDashboardData } from "./dashboard/useDashboardData";
import ReferralSection from "@/components/referral/ReferralSection";
import { AccountProfile, AccountUser, Generation } from "./types";

type DashboardProps = {
  user: AccountUser;
  profile: AccountProfile;
  generations: Generation[];
};

export default function UserDashboard({
  user,
  profile: initialProfile,
  generations: initialGenerations,
}: DashboardProps) {
  const router = useRouter();
  const supabase = createClient();
  const {
    generations,
    profile,
    page,
    setPage,
    isRefreshing,
    refresh,
    deleteGeneration,
  } = useDashboardData({
    user,
    initialProfile,
    initialGenerations,
  });
  const visibleGenerations = generations.filter(
    (generation) => generation.status !== "processing",
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DashboardHeader
        profileEmail={profile?.email}
        userEmail={user.email}
        onLogout={handleLogout}
      />

      <DashboardStatsGrid
        credits={profile?.credits ?? 0}
        generationsCount={visibleGenerations.length}
        memberSince={new Date(user.created_at).toLocaleDateString()}
      />

      <ReferralSection
        referralCode={profile?.referral_code}
        referralCredits={profile?.referral_credits}
      />

      <GenerationHistory
        generations={visibleGenerations}
        page={page}
        onPageChange={setPage}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
        onDelete={deleteGeneration}
      />
    </div>
  );
}
