import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { generationId, userId } = await request.json();

    if (!generationId || !userId) {
      return NextResponse.json(
        { error: "Generation ID and User ID are required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
            } catch {}
          },
        },
      }
    );

    // Security: Only delete if the generation belongs to the user
    const { data: generation } = await supabase
      .from("generations")
      .select("user_id")
      .eq("id", generationId)
      .single();

    if (!generation) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    if (generation.user_id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("generations")
      .delete()
      .eq("id", generationId);

    if (error) {
      console.error("❌ Delete generation error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Generation ${generationId} deleted`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ API Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Delete failed" },
      { status: 500 }
    );
  }
}
