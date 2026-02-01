import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const allCookies = request.cookies.getAll();
  
  const supabaseCookies = allCookies.filter(c => c.name.startsWith("sb-"));
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Read-only for debug
        },
      },
    },
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();

  return NextResponse.json({
    cookies: {
      total: allCookies.length,
      supabase: supabaseCookies.map(c => ({
        name: c.name,
        valueLength: c.value.length,
        valueStart: c.value.substring(0, 20) + "..."
      }))
    },
    auth: {
      hasUser: !!user,
      userEmail: user?.email,
      error: error?.message,
      hasSession: !!session,
      sessionExpiry: session?.expires_at
    },
    env: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
  }, { status: 200 });
}
