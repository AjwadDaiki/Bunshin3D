import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { storeModelFromUrl } from "@/lib/generation/storeModel";

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "missing_id" }, { status: 400 });
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
                cookieStore.set(name, value, options),
              );
            } catch {}
          },
        },
      },
    );

    const { data: generation } = await supabase
      .from("generations")
      .select("user_id,model_glb_url,model_storage_path,created_at,expires_at")
      .eq("prediction_id", id)
      .maybeSingle();

    if (!generation) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const baseTime = generation.expires_at ?? generation.created_at;
    if (baseTime) {
      const expiresAt = new Date(baseTime).getTime();
      if (Date.now() > expiresAt + (generation.expires_at ? 0 : MAX_AGE_MS)) {
        await supabase
          .from("generations")
          .update({ model_glb_url: null, model_storage_path: null })
          .eq("prediction_id", id);
        return NextResponse.json({ error: "expired" }, { status: 410 });
      }
    }

    if (!generation.model_glb_url) {
      return NextResponse.json({ error: "missing_model" }, { status: 404 });
    }

    if (!generation.model_glb_url.includes("replicate.delivery")) {
      if (!generation.model_storage_path) {
        const stored = await storeModelFromUrl({
          supabase,
          modelUrl: generation.model_glb_url,
          userId: generation.user_id,
          predictionId: id,
          existingUrl: generation.model_glb_url,
        });
        if (stored.path) {
          await supabase
            .from("generations")
            .update({ model_storage_path: stored.path })
            .eq("prediction_id", id);
        }
      }
      return NextResponse.redirect(generation.model_glb_url);
    }

    const stored = await storeModelFromUrl({
      supabase,
      modelUrl: generation.model_glb_url,
      userId: generation.user_id,
      predictionId: id,
      existingUrl: generation.model_glb_url,
    });

    if (stored.missing) {
      await supabase
        .from("generations")
        .update({ model_glb_url: null, model_storage_path: null })
        .eq("prediction_id", id);
      return NextResponse.json({ error: "expired" }, { status: 410 });
    }

    if (stored.url) {
      await supabase
        .from("generations")
        .update({
          model_glb_url: stored.url,
          model_storage_path: stored.path,
        })
        .eq("prediction_id", id);
      return NextResponse.redirect(stored.url);
    }
    return NextResponse.redirect(generation.model_glb_url);
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
