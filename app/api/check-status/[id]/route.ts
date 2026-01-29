import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getApiTranslations } from "@/lib/api-i18n";
import { storeModelFromUrl } from "@/lib/generation/storeModel";
import { resolveModelUrl } from "@/lib/generation-utils";
export const dynamic = "force-dynamic";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const t = await getApiTranslations(request, "Api.Status");
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: t("responses.missingId") },
        { status: 400 },
      );
    }

    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      cache: "no-store",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        t("errors.fetchFailed", { status: response.status, message: errorText }),
      );
    }
    const prediction = await response.json();
    if (prediction.status === "succeeded" || prediction.status === "failed") {
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

      if (prediction.status === "succeeded") {
        const modelUrl = resolveModelUrl(prediction.output);
        const { data: columns } = await supabase
          .from("information_schema.columns")
          .select("column_name")
          .eq("table_schema", "public")
          .eq("table_name", "generations");
        const hasExpiresAt = Boolean(
          columns?.some((col) => col.column_name === "expires_at"),
        );
        const hasModelStoragePath = Boolean(
          columns?.some((col) => col.column_name === "model_storage_path"),
        );
        const selectColumns = ["id", "user_id", "model_glb_url", "created_at"];
        if (hasExpiresAt) selectColumns.push("expires_at");
        if (hasModelStoragePath) selectColumns.push("model_storage_path");
        type GenerationRow = {
          id?: string;
          user_id?: string;
          model_glb_url?: string | null;
          created_at?: string | null;
          expires_at?: string | null;
          model_storage_path?: string | null;
        };

        const { data: generation } = (await supabase
          .from("generations")
          .select(selectColumns.join(","))
          .eq("prediction_id", id)
          .maybeSingle()) as { data: GenerationRow | null };

        const updatePayload: Record<string, string | null> = {
          status: "succeeded",
        };

        if (hasExpiresAt && !generation?.expires_at) {
          const baseTime = generation?.created_at ? new Date(generation.created_at) : new Date();
          updatePayload.expires_at = new Date(
            baseTime.getTime() + 24 * 60 * 60 * 1000,
          ).toISOString();
        }

        if (modelUrl && generation?.user_id) {
          const stored = await storeModelFromUrl({
            supabase,
            modelUrl,
            userId: generation.user_id,
            predictionId: id,
            existingUrl: generation.model_glb_url,
          });

          const finalUrl = stored.url ?? modelUrl;

          if (stored.missing) {
            updatePayload.model_glb_url = null;
            if (hasModelStoragePath) updatePayload.model_storage_path = null;
          } else if (finalUrl) {
            updatePayload.model_glb_url = finalUrl;
            if (stored.path && hasModelStoragePath) {
              updatePayload.model_storage_path = stored.path;
            }
          }

          if (stored.url) {
            prediction.output = stored.url;
          }
        } else {
          updatePayload.model_glb_url = null;
          if (hasModelStoragePath) updatePayload.model_storage_path = null;
        }

        await supabase
          .from("generations")
          .update(updatePayload)
          .eq("prediction_id", id);
      }
      if (prediction.status === "failed") {
        await supabase
          .from("generations")
          .update({ status: "failed" })
          .eq("prediction_id", id);
      }
    }

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || t("responses.checkFailed") },
      { status: 500 },
    );
  }
}
