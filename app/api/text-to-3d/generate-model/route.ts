import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getApiTranslations } from "@/lib/api-i18n";

export async function POST(request: NextRequest) {
  const t = await getApiTranslations(request, "Api.TextToModel");

  try {
    const { imageUrl, userId } = await request.json();

    console.log(t("logs.request", { userId }));

    if (!userId || !imageUrl) {
      return NextResponse.json(
        { error: t("responses.missingParams") },
        { status: 400 },
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
                cookieStore.set(name, value, options),
              );
            } catch {}
          },
        },
      },
    );

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: t("responses.userNotFound") },
        { status: 404 },
      );
    }

    if (profile.credits < 1) {
      return NextResponse.json(
        { error: t("responses.insufficientCredits") },
        { status: 400 },
      );
    }

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version:
          "e8f6c45206993f297372f5436b90350817bd9b4a0d52d2a76df50c1c8afa2b3c",
        input: {
          images: [imageUrl],
          texture_size: 2048,
          mesh_simplify: 0.9,
          generate_model: true,
          save_gaussian_ply: false,
          ss_sampling_steps: 38,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(t("errors.replicateApi"), response.status, errorText);

      if (response.status === 429) {
        return NextResponse.json(
          { error: t("responses.rateLimited") },
          { status: 429 },
        );
      }

      throw new Error(
        t("errors.replicateFailed", { status: response.status, message: errorText }),
      );
    }

    const prediction = await response.json();

    const { error: deductError } = await supabase.rpc("decrement_credits", {
      target_user_id: userId,
      amount: 1,
    });

    if (deductError) {
      console.error(t("errors.deductFailed", { message: deductError.message }));
    }

    await supabase.from("generations").insert({
      user_id: userId,
      status: "processing",
      prediction_id: prediction.id,
      type: "text_to_3d",
      source_image_url: imageUrl,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      predictionId: prediction.id,
      status: prediction.status,
    });
  } catch (err: any) {
    console.error(t("errors.requestFailed", { message: err.message }));
    return NextResponse.json(
      { error: err.message || t("responses.generationFailed") },
      { status: 500 },
    );
  }
}
