import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import AdminDashboard from "@/components/admin/AdminDashboard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin.Metadata" });

  return {
    title: t("title"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  // 1. Init Supabase (Cookie Auth)
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  // 2. Auth Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // 3. Admin Check
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_admin) {
    redirect(`/${locale}`);
  }

  // 4. MASSIVE DATA FETCHING (Parallel)
  const [
    settingsReq,
    usersCountReq,
    generationsCountReq,
    recentUsersReq,
    recentGenerationsReq,
    payingUsersReq,
  ] = await Promise.all([
    supabase.from("app_settings").select("*").single(),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("generations").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gt("credits", 5), // Simple proxy for paying users
  ]);

  const settings = settingsReq.data;
  const totalUsers = usersCountReq.count || 0;
  const totalGenerations = generationsCountReq.count || 0;
  const payingUsers = payingUsersReq.count || 0;
  const revenue = settings?.total_revenue || 0;

  // Calculs KPI
  const arpu = totalUsers > 0 ? (revenue / totalUsers).toFixed(2) : "0.00";
  const conversionRate =
    totalUsers > 0 ? ((payingUsers / totalUsers) * 100).toFixed(1) : "0.0";
  // Estimation coût GPU (hypothetique 0.05$ par run)
  const gpuBurn = (totalGenerations * 0.05).toFixed(2);

  const stats = {
    revenue,
    users: totalUsers,
    models: totalGenerations,
    arpu,
    conversion: conversionRate,
    burn: gpuBurn,
  };

  return (
    <div className="min-h-screen text-white pt-24 px-4 relative">

      <div className="relative z-10 container mx-auto max-w-7xl">
        <AdminDashboard
          stats={stats}
          initialSettings={settings}
          recentUsers={recentUsersReq.data || []}
          recentGenerations={recentGenerationsReq.data || []}
        />
      </div>
    </div>
  );
}
