import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/admin-client";
import { deleteUserGenerations } from "@/lib/admin/deleteUserGenerations";
import { checkRole } from "./checkRole";
import { getAdminTranslations } from "./i18n";

export async function grantCredits(userId: string, amount: number) {
  const t = await getAdminTranslations("Admin.Errors");
  await checkRole("admin");
  const adminClient = await createAdminClient();

  const { data: profile, error: fetchError } = await adminClient
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  if (fetchError) {
    throw new Error(t("userNotFound"));
  }

  const newCredits = (profile?.credits || 0) + amount;

  const { error } = await adminClient
    .from("profiles")
    .update({ credits: newCredits })
    .eq("id", userId);

  if (error) {
    throw new Error(t("grantCreditsFailed"));
  }

  revalidatePath("/[locale]/admin", "page");
  return { success: true, newCredits };
}

export async function changeUserRole(
  userId: string,
  role: "user" | "moderator" | "admin",
) {
  const t = await getAdminTranslations("Admin.Errors");
  await checkRole("admin");
  const adminClient = await createAdminClient();

  const updateData: Record<string, boolean> = {
    is_admin: role === "admin",
    is_moderator: role === "moderator" || role === "admin",
  };

  const { error } = await adminClient
    .from("profiles")
    .update(updateData)
    .eq("id", userId);

  if (error) {
    throw new Error(t("changeRoleFailed"));
  }

  revalidatePath("/[locale]/admin", "page");
  return { success: true };
}

export async function banUser(userId: string, banned: boolean) {
  const t = await getAdminTranslations("Admin.Errors");
  await checkRole("admin");
  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from("profiles")
    .update({ is_banned: banned })
    .eq("id", userId);

  if (error) {
    throw new Error(t("banUpdateFailed"));
  }

  revalidatePath("/[locale]/admin", "page");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const t = await getAdminTranslations("Admin.Errors");
  await checkRole("admin");
  const adminClient = await createAdminClient();

  const genError = await deleteUserGenerations(adminClient, userId);

  if (genError) {
    console.error(genError);
  }

  const { error: profileError } = await adminClient
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) {
    throw new Error(t("deleteProfileFailed"));
  }

  const { error: authError } = await adminClient.auth.admin.deleteUser(userId);

  if (authError) {
    console.error(authError);
  }

  revalidatePath("/[locale]/admin", "page");
  return { success: true };
}

export async function getAllUsers(
  page: number = 1,
  limit: number = 20,
  search?: string,
) {
  const t = await getAdminTranslations("Admin.Errors");
  await checkRole("admin");
  const adminClient = await createAdminClient();

  const offset = (page - 1) * limit;

  let query = adminClient
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike("email", `%${search}%`);
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(t("fetchUsersFailed"));
  }

  return { users: data || [], total: count || 0 };
}

