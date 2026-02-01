import type { SupabaseClient } from "@supabase/supabase-js";

type AddLog = (message: string, type?: "info" | "success" | "error") => void;
type Translator = (key: string, values?: Record<string, string | number>) => string;

type Args = {
  supabase: SupabaseClient;
  filePath: string;
  imageFile: File;
  addLog: AddLog;
  t: Translator;
};

export async function uploadImage({ supabase, filePath, imageFile, addLog, t }: Args) {
  addLog(t("Logs.uploadingImage"));
  const { error: uploadError } = await supabase.storage.from("uploads").upload(filePath, imageFile);
  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("uploads").getPublicUrl(filePath);

  addLog(t("Logs.imageUploaded"), "success");
  return publicUrl;
}
