import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Étape A : Text-to-Image avec Flux Schnell
export async function POST(request: Request) {
  try {
    const { prompt, userId } = await request.json();

    console.log(`📝 Text-to-Image request: userId=${userId}`);

    if (!userId || !prompt) {
      return NextResponse.json(
        { error: "User ID and prompt are required" },
        { status: 400 }
      );
    }

    // Vérifier les crédits de l'utilisateur
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
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (!profile || profile.credits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits. You need 1 credit." },
        { status: 400 }
      );
    }

    // Optimisation automatique du prompt pour la 3D
    const optimizedPrompt = `${prompt}, 3d asset style, isometric view, neutral lighting, white background, no shadow, single object, high quality, 4k texture`;

    console.log(`✅ Optimized prompt: ${optimizedPrompt}`);

    // Appel à Replicate pour Flux Schnell
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637", // Flux Schnell
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
      console.error("❌ Replicate API error:", errorText);
      throw new Error(`Replicate API failed: ${response.status}`);
    }

    const prediction = await response.json();

    console.log(`✅ Image generation started: ${prediction.id}`);

    return NextResponse.json({
      predictionId: prediction.id,
      status: prediction.status,
    });
  } catch (err: any) {
    console.error("❌ Text-to-Image Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Image generation failed" },
      { status: 500 }
    );
  }
}
