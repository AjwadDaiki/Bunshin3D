import type { SupabaseClient } from "@supabase/supabase-js";
import { extractStoragePath } from "@/lib/storage/paths";

type Args = {
  supabase: SupabaseClient;
  modelUrl: string;
  userId: string;
  predictionId: string;
  existingUrl?: string | null;
};

type Result = {
  url: string | null;
  path: string | null;
  missing: boolean;
};


export async function storeModelFromUrl({
  supabase,
  modelUrl,
  userId,
  predictionId,
  existingUrl,
}: Args): Promise<Result> {
  if (!modelUrl) return { url: null, path: null, missing: false };
  if (existingUrl && !existingUrl.includes("replicate.delivery")) {
    return {
      url: existingUrl,
      path: extractStoragePath(existingUrl),
      missing: false,
    };
  }
  if (!modelUrl.includes("replicate.delivery")) {
    return { url: modelUrl, path: extractStoragePath(modelUrl), missing: false };
  }

  let response: Response;
  try {
    response = await fetch(modelUrl);
  } catch {
    return { url: null, path: null, missing: false };
  }
  if (response.status === 404) return { url: null, path: null, missing: true };
  if (!response.ok) return { url: null, path: null, missing: false };

  const buffer = new Uint8Array(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") || "model/gltf-binary";
  const path = `models/${userId}/${predictionId}.glb`;

  const { error } = await supabase.storage.from("uploads").upload(path, buffer, {
    contentType,
    upsert: true,
  });

  if (error) return { url: null, path: null, missing: false };

  const { data } = supabase.storage.from("uploads").getPublicUrl(path);
  return { url: data.publicUrl ?? null, path, missing: false };
}
