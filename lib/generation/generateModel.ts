import { resolveModelUrl, sleep } from "@/lib/generation-utils";
import { pollPredictionStatus } from "./pollPredictionStatus";

type AddLog = (message: string, type?: "info" | "success" | "error") => void;
type Translator = (key: string, values?: Record<string, string | number>) => string;
type SetCredits = (value: number | ((current: number) => number)) => void;
type SetModelUrl = (value: string | null) => void;

type Quality = "standard" | "premium";

type Args = {
  quality: Quality;
  imageUrl: string;
  userId: string;
  costInCredits: number;
  addLog: AddLog;
  setModelUrl: SetModelUrl;
  setCredits: SetCredits;
  t: Translator;
};

export async function generateModel({
  quality,
  imageUrl,
  userId,
  costInCredits,
  addLog,
  setModelUrl,
  setCredits,
  t,
}: Args) {
  addLog(t("Logs.buildingMesh"));
  const apiEndpoint = quality === "premium" ? "/api/premium-3d/create" : "/api/text-to-3d/generate-model";

  const maxAttempts = 5;
  let attempt = 0;
  let modelRes: Response;

  while (true) {
    modelRes = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, userId }),
    });

    if (modelRes.status !== 429) break;

    attempt += 1;
    addLog(t("Logs.serverBusy"), "error");
    await sleep(5000);

    if (attempt >= maxAttempts) {
      throw new Error(t("Logs.rateLimited"));
    }
  }

  const modelData = await modelRes.json();
  if (!modelRes.ok) throw new Error(modelData.error || t("Logs.generationFailed"));

  const modelPredictionId = modelData.predictionId;
  let modelResult: string | null = null;
  let pollCount = 0;

  while (!modelResult) {
    await sleep(4000);
    pollCount += 1;

    if (pollCount === 2) addLog(t("Logs.applyingTextures"));
    if (pollCount === 5) addLog(t("Logs.optimizingGeometry"));

    const status = await pollPredictionStatus(modelPredictionId);

    if (status.status === "succeeded") {
      modelResult = resolveModelUrl(status.output) || status.output;
      setModelUrl(modelResult);
      addLog(t("Logs.complete"), "success");
      setCredits((current) => current - costInCredits);
      break;
    }

    if (status.status === "failed") {
      throw new Error(t("Logs.serverSideFailure"));
    }
  }

  return modelResult as string;
}
