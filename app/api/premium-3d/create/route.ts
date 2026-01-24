import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Premium Image-to-3D avec Rodin (5 crédits)
export async function POST(request: Request) {
  try {
    const { imageUrl, userId } = await request.json();

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

    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (!profile || profile.credits < 5) {
      return NextResponse.json(
        { error: "Insufficient credits. You need 5 credits." },
        { status: 400 },
      );
    }

    // Déduire 5 crédits
    const { error: deductError } = await supabase.rpc("decrement_credits", {
      target_user_id: userId,
      amount: 5,
    });

    if (deductError) {
      return NextResponse.json(
        { error: "Failed to deduct credits" },
        { status: 500 },
      );
    }

    // Appel à Replicate
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "hyper3d/rodin",
        input: {
          images: [imageUrl],
          prompt:
            "High fidelity 3D model, realistic texture, 4k, photorealistic",
        },
      }),
    });

    if (!response.ok) {
      // Remboursement en cas d'erreur API
      await supabase.rpc("increment_credits", {
        target_user_id: userId,
        amount: 5,
      });

      const errorText = await response.text();
      console.error("❌ Replicate API error:", response.status);

      if (response.status === 429) {
        return NextResponse.json(
          { error: "Server busy (Rate Limit). Please try again later." },
          { status: 429 }, // Retourne 429 explicitement, pas 500
        );
      }

      throw new Error(`Replicate API failed: ${response.status}`);
    }

    const prediction = await response.json();

    // Insert generation with error handling
    const { data: insertedGen, error: insertError } = await supabase
      .from("generations")
      .insert({
        user_id: userId,
        status: "processing",
        prediction_id: prediction.id,
        type: "premium_3d",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ Failed to insert generation:", insertError);
    } else {
      console.log(`✅ Premium generation created: ${insertedGen.id} with prediction_id: ${prediction.id}`);
    }

    return NextResponse.json({
      predictionId: prediction.id,
      status: prediction.status,
    });
  } catch (err: any) {
    console.error("❌ Premium 3D Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Premium 3D generation failed" },
      { status: 500 },
    );
  }
}
