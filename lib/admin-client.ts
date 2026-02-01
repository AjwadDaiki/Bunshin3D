import { createClient } from "@supabase/supabase-js";
import { getAdminTranslations } from "@/lib/admin/i18n";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function createAdminClient() {
  if (!serviceRoleKey) {
    const t = await getAdminTranslations("Admin.Errors");
    throw new Error(t("serviceRoleMissing"));
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export type AdminClient = Awaited<ReturnType<typeof createAdminClient>>;
