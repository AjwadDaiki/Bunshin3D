import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const allCookies = request.cookies.getAll();
  const supabaseCookies = allCookies.filter((c) => c.name.startsWith("sb-"));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    },
  );

  const { data: userData, error: userError } =
    await supabase.auth.getUser();
  const { data: sessionData } = await supabase.auth.getSession();

  let profile = null;
  let profileError = null;
  if (userData.user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("credits, is_admin, email")
      .eq("id", userData.user.id)
      .single();
    profile = data;
    profileError = error?.message ?? null;
  }

  return NextResponse.json(
    {
      cookies: {
        total: allCookies.length,
        supabaseCount: supabaseCookies.length,
        supabaseNames: supabaseCookies.map((c) => c.name),
      },
      auth: {
        hasUser: !!userData.user,
        userId: userData.user?.id ?? null,
        userEmail: userData.user?.email ?? null,
        userError: userError?.message ?? null,
        hasSession: !!sessionData.session,
        sessionExpiresAt: sessionData.session?.expires_at ?? null,
      },
      profile: {
        data: profile,
        error: profileError,
      },
      server: {
        nodeEnv: process.env.NODE_ENV,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
        requestOrigin: new URL(request.url).origin,
      },
    },
    { status: 200 },
  );
}
