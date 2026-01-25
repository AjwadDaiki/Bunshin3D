import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Étape B : Image-to-3D avec Trellis (Version firtoz/trellis)
export async function POST(request: Request) {
  try {
    const { imageUrl, userId } = await request.json();

    console.log(`🖼️ Image-to-3D request: userId=${userId}`);

    if (!userId || !imageUrl) {
      return NextResponse.json(
        { error: "User ID and image URL are required" },
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

    // Vérifier crédits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (profile.credits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 },
      );
    }

    // --- APPEL REPLICATE (Mise à jour firtoz/trellis) ---
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Version mise à jour basée sur ton snippet
        version:
          "e8f6c45206993f297372f5436b90350817bd9b4a0d52d2a76df50c1c8afa2b3c",
        input: {
          images: [imageUrl], // Trellis attend parfois un tableau
          texture_size: 2048,
          mesh_simplify: 0.9,
          generate_model: true,
          save_gaussian_ply: false, // On a juste besoin du GLB
          ss_sampling_steps: 38,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Replicate API error:", response.status, errorText);

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: "Server busy (Rate Limit). Please try again in 30 seconds.",
          },
          { status: 429 },
        );
      }
      throw new Error(
        `Replicate API failed: ${response.status} - ${errorText}`,
      );
    }

    const prediction = await response.json();

    // Déduction du crédit
    const { error: deductError } = await supabase.rpc("decrement_credits", {
      target_user_id: userId,
      amount: 1,
    });

    if (deductError) console.error("❌ Failed to deduct credits:", deductError);

    await supabase.from("generations").insert({
      user_id: userId,
      status: "processing",
      prediction_id: prediction.id,
      type: "text_to_3d_trellis",
      source_image_url: imageUrl,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      predictionId: prediction.id,
      status: prediction.status,
    });
  } catch (err: any) {
    console.error("❌ Image-to-3D Error:", err.message);
    return NextResponse.json(
      { error: err.message || "3D generation failed" },
      { status: 500 },
    );
  }
}
