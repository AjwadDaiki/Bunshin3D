export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const sanitizeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9.]/g, "");

export const resolveModelUrl = (output: any): string | null => {
  if (!output) return null;
  if (typeof output === "string") return output;
  if (output.model_file) return output.model_file;
  if (output.glb) return output.glb;
  if (Array.isArray(output)) {
    return output.find((val) => typeof val === "string" && val.includes(".glb")) || null;
  }
  if (typeof output === "object") {
    const values = Object.values(output);
    const match = values.find(
      (val) => typeof val === "string" && val.includes(".glb"),
    );
    return (match as string) || null;
  }
  return null;
};
