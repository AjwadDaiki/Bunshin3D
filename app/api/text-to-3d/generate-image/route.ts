import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getApiTranslations } from "@/lib/api-i18n";

export async function POST(request: NextRequest) {
  const t = await getApiTranslations(request, "Api.TextToImage");

  try {
    const { prompt, userId } = await request.json();

    console.log(t("logs.request", { userId }));

    if (!userId || !prompt) {
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (!profile || profile.credits < 1) {
      return NextResponse.json(
        { error: t("responses.insufficientCredits") },
        { status: 400 },
      );
    }

    const optimizedPrompt = `${prompt}, 3d asset style, isometric view, neutral lighting, white background, no shadow, single object, high quality, 4k texture`;

    console.log(t("logs.optimizedPrompt", { prompt: optimizedPrompt }));

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version:
          "5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
        input: {
          prompt: optimizedPrompt,
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "png",
          output_quality: 90,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(t("errors.replicateApi"), errorText);
      throw new Error(t("errors.replicateFailed", { status: response.status }));
    }

    const prediction = await response.json();

    console.log(t("logs.imageStarted", { predictionId: prediction.id }));

    return NextResponse.json({
      predictionId: prediction.id,
      status: prediction.status,
    });
  } catch (err: any) {
    console.error(t("errors.requestFailed", { message: err.message }));
    return NextResponse.json(
      { error: err.message || t("responses.imageFailed") },
      { status: 500 },
    );
  }
}
