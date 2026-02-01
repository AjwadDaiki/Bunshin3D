import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getApiTranslations } from "@/lib/api-i18n";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const t = await getApiTranslations(request, "Api.Generate");

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
      console.error(t("errors.profileNotFound"), profileError);
      return NextResponse.json(
        { error: t("responses.userNotFound") },
        { status: 404 },
      );
    }

    console.log(t("logs.credits", { userId, credits: profile.credits }));

    if (profile.credits < 1) {
      console.error(t("errors.insufficientCredits"));
      return NextResponse.json(
        { error: t("responses.insufficientCredits") },
        { status: 400 },
      );
    }

    console.log(t("logs.decrementCredits", { userId }));
    const { error: deductError } = await supabase.rpc("decrement_credits", {
      target_user_id: userId,
      amount: 1,
    });

    if (deductError) {
      console.error(t("errors.deductFailed", { message: deductError.message }), {
        details: deductError.details,
        hint: deductError.hint,
        code: deductError.code,
      });
      return NextResponse.json(
        { error: t("responses.deductFailed", { message: deductError.message }) },
        { status: 500 },
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
          texture_size: 1024,
          mesh_simplify: 0.95,
          generate_model: true,
          ss_sampling_steps: 32,
        },
      }),
    });

    if (!response.ok) {
      await supabase.rpc("increment_credits", {
        target_user_id: userId,
        amount: 1,
      });

      const errorText = await response.text();
      console.error(t("errors.replicateApi"), errorText);
      throw new Error(t("errors.replicateFailed", { status: response.status }));
    }

    const prediction = await response.json();

    await supabase.from("generations").insert({
      user_id: userId,
      status: "processing",
      prediction_id: prediction.id,
      type: "image_to_3d_standard",
      source_image_url: imageUrl,
      created_at: new Date().toISOString(),
    });

    console.log(t("logs.generationStarted", { predictionId: prediction.id }));

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
