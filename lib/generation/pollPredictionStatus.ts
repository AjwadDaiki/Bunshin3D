export async function pollPredictionStatus(predictionId: string) {
  const response = await fetch(`/api/check-status/${predictionId}`, {
    cache: "no-store",
  });
  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const message =
      typeof data?.error === "string"
        ? data.error
        : `Status check failed (${response.status})`;
    throw new Error(message);
  }
  return data;
}
