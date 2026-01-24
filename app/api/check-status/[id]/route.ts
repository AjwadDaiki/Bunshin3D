import { NextResponse } from "next/server";

// Route universelle pour vérifier le statut de n'importe quelle génération
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

    console.log(`🔍 Checking status for prediction: ${id}`);

    // Appel à Replicate pour obtenir le statut
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
      console.error("❌ Replicate API error:", errorText);
      throw new Error(`Failed to check status: ${response.status}`);
    }

    const prediction = await response.json();

    console.log(`✅ Status: ${prediction.status}`);

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
      logs: prediction.logs,
    });
  } catch (err: any) {
    console.error("❌ Status Check Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Failed to check status" },
      { status: 500 }
    );
  }
}
