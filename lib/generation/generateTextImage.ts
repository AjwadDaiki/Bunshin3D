import { sleep } from "@/lib/generation-utils";
import { pollPredictionStatus } from "./pollPredictionStatus";

type AddLog = (message: string, type?: "info" | "success" | "error") => void;
type Translator = (key: string, values?: Record<string, string | number>) => string;

type Args = {
  prompt: string;
  userId: string;
  addLog: AddLog;
  setGeneratedImageUrl: (value: string | null) => void;
  t: Translator;
};

export async function generateTextImage({
  prompt,
  userId,
  addLog,
  setGeneratedImageUrl,
  t,
}: Args) {
  addLog(t("Logs.generatingImage"));
  const imageRes = await fetch("/api/text-to-3d/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, userId }),
  });

  const imageData = await imageRes.json();
  if (!imageRes.ok) throw new Error(imageData.error);

  const imagePredictionId = imageData.predictionId;
  let imageResult: string | null = null;

  while (!imageResult) {
    await sleep(2000);
    const status = await pollPredictionStatus(imagePredictionId);

    if (status.status === "succeeded") {
      imageResult = status.output[0];
      setGeneratedImageUrl(imageResult);
      addLog(t("Logs.imageGenerated"), "success");
      break;
    }

    if (status.status === "failed") {
      throw new Error(t("Logs.imageGenerationFailed"));
    }
  }

  addLog(t("Logs.cooldown"));
  await sleep(3000);

  return imageResult as string;
}
