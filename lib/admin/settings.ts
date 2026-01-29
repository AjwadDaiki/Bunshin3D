import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/admin-client";
import { checkRole } from "./checkRole";
import { getAdminTranslations } from "./i18n";

export async function updateAppSettings(
  settings: Record<string, boolean | number | string>,
) {
  const t = await getAdminTranslations("Admin.Errors");
  await checkRole("admin");
  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from("app_settings")
    .update(settings)
    .eq("id", 1);

  if (error) {
    throw new Error(t("updateSettingsFailed"));
  }

  revalidatePath("/[locale]/admin", "page");
  return { success: true };
}

