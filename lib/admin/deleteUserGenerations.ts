import type { SupabaseClient } from "@supabase/supabase-js";
import { extractStoragePath } from "@/lib/storage/paths";

export async function deleteUserGenerations(
  adminClient: SupabaseClient,
  userId: string,
) {
  const { data: generations } = await adminClient
    .from("generations")
    .select("model_storage_path,model_glb_url,source_image_url")
    .eq("user_id", userId);

  const paths = new Set<string>();
  generations?.forEach((generation) => {
    if (generation.model_storage_path) paths.add(generation.model_storage_path);
    const modelPath = extractStoragePath(generation.model_glb_url);
    if (modelPath) paths.add(modelPath);
    const sourcePath = extractStoragePath(generation.source_image_url);
    if (sourcePath) paths.add(sourcePath);
  });

  if (paths.size > 0) {
    await adminClient.storage.from("uploads").remove(Array.from(paths));
  }

  const { error } = await adminClient
    .from("generations")
    .delete()
    .eq("user_id", userId);

  return error;
}
