import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getAdminTranslations } from "./i18n";

export async function checkRole(role: "admin") {
  const t = await getAdminTranslations("Admin.Errors");
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(t("notAuthenticated"));
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (error || !profile?.is_admin || role !== "admin") {
    throw new Error(t("notAuthorized"));
  }

  return user;
}

