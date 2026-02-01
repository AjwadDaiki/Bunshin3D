import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { extractStoragePath } from "@/lib/storage/paths";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: generation } = await supabase
    .from("generations")
    .select("id,user_id,model_storage_path,model_glb_url,source_image_url")
    .eq("id", id)
    .maybeSingle();

  if (!generation || generation.user_id !== user.id) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const paths = new Set<string>();
  if (generation.model_storage_path) paths.add(generation.model_storage_path);
  const modelPath = extractStoragePath(generation.model_glb_url);
  if (modelPath) paths.add(modelPath);
  const sourcePath = extractStoragePath(generation.source_image_url);
  if (sourcePath) paths.add(sourcePath);

  if (paths.size > 0) {
    await supabase.storage.from("uploads").remove(Array.from(paths));
  }

  await supabase.from("generations").delete().eq("id", id);

  return NextResponse.json({ deleted: true });
}
