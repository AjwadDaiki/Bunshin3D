import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/fr/studio";

  console.log("🔵 Callback URL:", requestUrl.href);
  console.log("🔵 Code:", code ? `${code.substring(0, 20)}...` : "MISSING");
  console.log("🔵 Next:", next);

  if (!code) {
    console.error("❌ No code provided");
    return NextResponse.redirect(`${requestUrl.origin}/fr/login?error=no_code`);
  }

  // Liste des cookies AVANT l'échange
  const cookiesBefore = request.cookies.getAll();
  console.log("🍪 Cookies BEFORE exchange:", cookiesBefore.map(c => c.name));

  const response = NextResponse.redirect(`${requestUrl.origin}${next}`);
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          console.log(`📝 Supabase wants to set ${cookiesToSet.length} cookies`);
          
          cookiesToSet.forEach(({ name, value, options }) => {
            console.log(`🍪 Setting: ${name}`);
            console.log(`   - httpOnly: ${options?.httpOnly}`);
            console.log(`   - secure: ${options?.secure}`);
            console.log(`   - sameSite: ${options?.sameSite}`);
            console.log(`   - path: ${options?.path}`);
            console.log(`   - domain: ${options?.domain}`);
            console.log(`   - maxAge: ${options?.maxAge}`);
            
            response.cookies.set(name, value, {
              ...options,
              path: options?.path || "/",
              httpOnly: options?.httpOnly ?? false,
              secure: process.env.NODE_ENV === "production",
              sameSite: (options?.sameSite as any) || "lax",
            });
          });
        },
      },
    }
  );

  console.log("🔄 Calling exchangeCodeForSession...");
  
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("❌ exchangeCodeForSession ERROR:");
    console.error("   - Message:", error.message);
    console.error("   - Status:", error.status);
    console.error("   - Name:", error.name);
    return NextResponse.redirect(`${requestUrl.origin}/fr/login?error=${encodeURIComponent(error.message)}`);
  }

  if (!data?.session) {
    console.error("❌ No session in response data");
    console.error("   - Data:", JSON.stringify(data));
    return NextResponse.redirect(`${requestUrl.origin}/fr/login?error=no_session`);
  }

  console.log("✅ Session created successfully!");
  console.log("   - User:", data.user.email);
  console.log("   - Expires at:", new Date(data.session.expires_at! * 1000).toISOString());
  console.log("   - Access token (first 30):", data.session.access_token.substring(0, 30));
  console.log("   - Refresh token (first 30):", data.session.refresh_token?.substring(0, 30));

  const cookiesAfter = response.cookies.getAll();
  console.log("🍪 Cookies AFTER exchange:", cookiesAfter.map(c => ({
    name: c.name,
    hasValue: !!c.value,
    httpOnly: c.httpOnly,
    secure: c.secure
  })));

  return response;
}
