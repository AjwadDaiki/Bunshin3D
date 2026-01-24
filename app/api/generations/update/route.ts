import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { uploadModelToR2, isR2Configured } from "@/lib/r2";

export async function POST(request: Request) {
  try {
    const { predictionId, status, output, userId, type } = await request.json();

    console.log("📥 Update request received:", {
      predictionId,
      status,
      outputType: typeof output,
      outputPreview: typeof output === 'string' ? output.substring(0, 100) : 'non-string',
      userId,
      type
    });

    if (!predictionId) {
      return NextResponse.json(
        { error: "Prediction ID is required" },
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

    // First check if generation exists
    const { data: existing } = await supabase
      .from("generations")
      .select("id, prediction_id, status, user_id")
      .eq("prediction_id", predictionId)
      .single();

    console.log("🔍 Existing generation:", existing);

    // Determine the final URL (upload to R2 if configured and output is a URL)
    let finalOutputUrl = output;
    let r2Url: string | null = null;

    if (output && status === "succeeded" && typeof output === "string" && output.startsWith("http")) {
      // Try to upload to R2 for permanent storage
      if (isR2Configured()) {
        const targetUserId = userId || existing?.user_id;
        if (targetUserId) {
          console.log("☁️ Uploading model to Cloudflare R2...");
          const r2Result = await uploadModelToR2(output, targetUserId, predictionId);

          if (r2Result.success && r2Result.url) {
            r2Url = r2Result.url;
            finalOutputUrl = r2Result.url; // Use R2 URL as the main output
            console.log("✅ Model uploaded to R2:", r2Url);
          } else {
            console.warn("⚠️ R2 upload failed, keeping Replicate URL:", r2Result.error);
            // Keep the original Replicate URL as fallback
          }
        }
      } else {
        console.log("ℹ️ R2 not configured, using Replicate URL (temporary)");
      }
    }

    // If generation doesn't exist and we have userId, CREATE it (handles INSERT failures)
    if (!existing) {
      if (!userId) {
        console.error("❌ Generation not found and no userId provided for creation");
        return NextResponse.json(
          { error: "Generation not found and cannot create without userId" },
          { status: 404 }
        );
      }

      console.log("⚠️ Generation not found, creating new record...");

      const outputString = finalOutputUrl
        ? (typeof finalOutputUrl === "string" ? finalOutputUrl : JSON.stringify(finalOutputUrl))
        : null;

      const insertData: any = {
        user_id: userId,
        prediction_id: predictionId,
        status: status || "succeeded",
        output: outputString,
        type: type || "image_to_3d",
        created_at: new Date().toISOString(),
      };

      // Add r2_url if available
      if (r2Url) {
        insertData.r2_url = r2Url;
      }

      const { data: newGen, error: createError } = await supabase
        .from("generations")
        .insert(insertData)
        .select()
        .single();

      if (createError) {
        console.error("❌ Failed to create generation:", createError);
        return NextResponse.json(
          { error: createError.message },
          { status: 500 }
        );
      }

      console.log("✅ Generation created successfully:", newGen.id);
      return NextResponse.json({ success: true, data: [newGen], created: true, r2Uploaded: !!r2Url });
    }

    // Generation exists, update it
    const updateData: { status?: string; output?: string; r2_url?: string } = {};
    if (status) updateData.status = status;
    if (finalOutputUrl) {
      updateData.output = typeof finalOutputUrl === "string" ? finalOutputUrl : JSON.stringify(finalOutputUrl);
      console.log("📦 Output to store:", updateData.output.substring(0, 200));
    }
    if (r2Url) {
      updateData.r2_url = r2Url;
    }

    console.log("📝 Updating generation", existing.id, "with:", updateData);

    const { data, error } = await supabase
      .from("generations")
      .update(updateData)
      .eq("prediction_id", predictionId)
      .select();

    if (error) {
      console.error("❌ Update generation error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Generation ${predictionId} updated successfully. Result:`, data);

    return NextResponse.json({ success: true, data, r2Uploaded: !!r2Url });
  } catch (err: any) {
    console.error("❌ API Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Update failed" },
      { status: 500 }
    );
  }
}
