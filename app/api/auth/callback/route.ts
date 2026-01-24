import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/fr/studio";

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/fr/login?error=no_code`);
  }

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
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            console.error("❌ Error setting cookies:", error);
          }
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("❌ Auth error:", error.message);
    return NextResponse.redirect(`${requestUrl.origin}/fr/login?error=auth_failed`);
  }

  if (!data.session) {
    console.error("❌ No session");
    return NextResponse.redirect(`${requestUrl.origin}/fr/login?error=no_session`);
  }

  console.log("✅ Session created:", data.user.email);

  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
