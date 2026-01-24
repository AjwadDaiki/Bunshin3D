import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const { imageUrl, userId } = await request.json();

    console.log(`🖼️ Image-to-3D Standard request: userId=${userId}`);

    if (!userId || !imageUrl) {
      return NextResponse.json(
        { error: "User ID and image URL are required" },
        { status: 400 }
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
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      console.error("❌ User profile not found:", profileError);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log(`📊 User ${userId} has ${profile.credits} credits`);

    if (profile.credits < 1) {
      console.error("❌ Insufficient credits");
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 }
      );
    }

    console.log(`💳 Calling decrement_credits for user ${userId}`);
    const { data: rpcData, error: deductError } = await supabase.rpc("decrement_credits", {
      target_user_id: userId,
      amount: 1,
    });

    if (deductError) {
      console.error("❌ Credit deduction error:", {
        message: deductError.message,
        details: deductError.details,
        hint: deductError.hint,
        code: deductError.code,
      });
      return NextResponse.json(
        { error: `Failed to deduct credits: ${deductError.message}` },
        { status: 500 }
      );
    }

    console.log(`✅ 1 credit deducted from user ${userId}`, rpcData);

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "e8f6c45206993f297372f5436b90350817bd9b4a0d52d2a76df50c1c8afa2b3c",
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
      console.error("❌ Replicate API error:", errorText);
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
        type: "image_to_3d_standard",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ Failed to insert generation:", insertError);
    } else {
      console.log(`✅ Generation created: ${insertedGen.id} with prediction_id: ${prediction.id}`);
    }

    return NextResponse.json({
      predictionId: prediction.id,
      status: prediction.status,
    });
  } catch (err: any) {
    console.error("❌ Image-to-3D Standard Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Image-to-3D generation failed" },
      { status: 500 }
    );
  }
}
