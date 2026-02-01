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

    // IMPORTANT: Respond to the client FAST.
    // Heavy operations (model download/upload) are done in background AFTER the response.
    // This prevents the polling loop from hanging while downloading/uploading GLB files.

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

        // Quick lightweight DB update — only mark status + URL
        await supabase
          .from("generations")
          .update({
            status: "succeeded",
            model_glb_url: modelUrl || null,
          })
          .eq("prediction_id", id);

        // Fire-and-forget: store model to permanent storage in background.
        // This does NOT block the response to the client.
        if (modelUrl) {
          const { data: gen } = await supabase
            .from("generations")
            .select("user_id")
            .eq("prediction_id", id)
            .maybeSingle();

          if (gen?.user_id) {
            storeModelFromUrl({
              supabase,
              modelUrl,
              userId: gen.user_id,
              predictionId: id,
              existingUrl: null,
            })
              .then(async (stored) => {
                if (stored.url) {
                  await supabase
                    .from("generations")
                    .update({ model_glb_url: stored.url })
                    .eq("prediction_id", id);
                  console.log(`✅ Model stored permanently for ${id}`);
                }
              })
              .catch((err) => {
                console.error("⚠️ Background model storage failed:", err.message);
              });
          }
        }
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
