import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import UserDashboard from "@/components/account/UserDashboard";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateAlternates } from "@/lib/seo-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// --- SEO ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Account.Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
    alternates: generateAlternates(locale, "/account"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// --- SERVER PAGE ---
export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  // 1. Initialisation Supabase Serveur (Cookie-based Auth)
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
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );

  // 2. Vérification Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // 3. Fetch Data (Parallel)
  const [profileReq, generationsReq] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const profile = profileReq.data;
  const generations = generationsReq.data || [];
  const profileEmail =
    profile && typeof profile.email === "string" ? profile.email : undefined;
  const metadataEmail =
    typeof user.user_metadata?.email === "string"
      ? user.user_metadata.email
      : undefined;
  const resolvedEmail = user.email ?? profileEmail ?? metadataEmail;

  if (!resolvedEmail) {
    redirect(`/${locale}/login?error=missing_email`);
  }

  const accountUser = {
    id: user.id,
    email: resolvedEmail,
    created_at: user.created_at,
  };

  return (
    <div className="min-h-screen text-white pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <UserDashboard
          user={accountUser}
          profile={profile}
          generations={generations}
        />
      </div>
    </div>
  );
}
