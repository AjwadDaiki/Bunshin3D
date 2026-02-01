import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { extractStoragePath } from "@/lib/storage/paths";

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export async function POST() {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: generations } = await supabase
    .from("generations")
    .select("id,model_storage_path,model_glb_url,source_image_url,created_at,expires_at")
    .eq("user_id", user.id);

  const now = Date.now();
  const expired =
    generations?.filter((generation) => {
      const baseTime = generation.expires_at ?? generation.created_at;
      if (!baseTime) return false;
      const base = new Date(baseTime).getTime();
      const expiry = generation.expires_at ? base : base + MAX_AGE_MS;
      return now > expiry;
    }) ?? [];

  const paths = new Set<string>();
  expired.forEach((generation) => {
    if (generation.model_storage_path) paths.add(generation.model_storage_path);
    const modelPath = extractStoragePath(generation.model_glb_url);
    if (modelPath) paths.add(modelPath);
    const sourcePath = extractStoragePath(generation.source_image_url);
    if (sourcePath) paths.add(sourcePath);
  });

  if (paths.size > 0) {
    await supabase.storage.from("uploads").remove(Array.from(paths));
  }

  const ids = expired.map((generation) => generation.id);
  if (ids.length > 0) {
    await supabase.from("generations").delete().in("id", ids);
  }

  return NextResponse.json({ cleaned: ids.length });
}
