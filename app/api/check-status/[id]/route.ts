import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Prediction ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${id}`,
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to check status: ${response.status}`);
    }

    const prediction = await response.json();

    if (prediction.status === "succeeded" && prediction.output) {
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

      let modelUrl: string | null = null;

      if (typeof prediction.output === "string") {
        modelUrl = prediction.output;
      } else if (prediction.output?.model_file) {
        modelUrl = prediction.output.model_file;
      } else if (prediction.output?.glb) {
        modelUrl = prediction.output.glb;
      } else if (Array.isArray(prediction.output)) {
        modelUrl = prediction.output.find(
          (val: string) => typeof val === "string" && val.includes(".glb")
        );
      } else if (typeof prediction.output === "object") {
        const values = Object.values(prediction.output);
        modelUrl = values.find(
          (val: any) => typeof val === "string" && val.includes(".glb")
        ) as string | null;
      }

      if (modelUrl) {
        await supabase
          .from("generations")
          .update({
            status: "succeeded",
            model_glb_url: modelUrl,
          })
          .eq("prediction_id", id);
      }
    } else if (prediction.status === "failed") {
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

      await supabase
        .from("generations")
        .update({ status: "failed" })
        .eq("prediction_id", id);
    }

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to check status" },
      { status: 500 }
    );
  }
}
