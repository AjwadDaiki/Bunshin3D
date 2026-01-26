"use server";

import { createAdminClient } from "@/lib/admin-client";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) throw new Error("Not authorized");

  return user;
}

export async function grantCredits(userId: string, amount: number) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { data: profile, error: fetchError } = await adminClient
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  if (fetchError) throw new Error("User not found");

  const newCredits = (profile.credits || 0) + amount;

  const { error } = await adminClient
    .from("profiles")
    .update({ credits: newCredits })
    .eq("id", userId);

  if (error) throw new Error("Failed to grant credits");

  revalidatePath("/[locale]/admin", "page");
  return { success: true, newCredits };
}

export async function changeUserRole(
  userId: string,
  role: "user" | "moderator" | "admin",
) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const updateData: Record<string, boolean> = {
    is_admin: role === "admin",
    is_moderator: role === "moderator" || role === "admin",
  };

  const { error } = await adminClient
    .from("profiles")
    .update(updateData)
    .eq("id", userId);

  if (error) throw new Error("Failed to change role");

  revalidatePath("/[locale]/admin", "page");
  return { success: true };
}

export async function banUser(userId: string, banned: boolean) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("profiles")
    .update({ is_banned: banned })
    .eq("id", userId);

  if (error) throw new Error("Failed to update ban status");

  revalidatePath("/[locale]/admin", "page");
  return { success: true };
}

export async function deleteUser(userId: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error: genError } = await adminClient
    .from("generations")
    .delete()
    .eq("user_id", userId);

  if (genError) console.error("Failed to delete generations:", genError);

  const { error: profileError } = await adminClient
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) throw new Error("Failed to delete profile");

  const { error: authError } = await adminClient.auth.admin.deleteUser(userId);

  if (authError) console.error("Failed to delete auth user:", authError);

  revalidatePath("/[locale]/admin", "page");
  return { success: true };
}

export async function getUserGenerations(userId: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("generations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error("Failed to fetch generations");

  return data;
}

export async function getAllUsers(
  page: number = 1,
  limit: number = 20,
  search?: string,
) {
  await verifyAdmin();
  const adminClient = createAdminClient();

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

  if (error) throw new Error("Failed to fetch users");

  return { users: data || [], total: count || 0 };
}

export async function getAdminStats() {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const [
    usersCountReq,
    generationsCountReq,
    failedGensReq,
    payingUsersReq,
    settingsReq,
    todayUsersReq,
    todayGensReq,
  ] = await Promise.all([
    adminClient.from("profiles").select("id", { count: "exact", head: true }),
    adminClient
      .from("generations")
      .select("id", { count: "exact", head: true }),
    adminClient
      .from("generations")
      .select("id", { count: "exact", head: true })
      .eq("status", "failed"),
    adminClient
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gt("credits", 5),
    adminClient.from("app_settings").select("*").single(),
    adminClient
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date().toISOString().split("T")[0]),
    adminClient
      .from("generations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date().toISOString().split("T")[0]),
  ]);

  const totalUsers = usersCountReq.count || 0;
  const totalGenerations = generationsCountReq.count || 0;
  const failedGenerations = failedGensReq.count || 0;
  const payingUsers = payingUsersReq.count || 0;
  const revenue = settingsReq.data?.total_revenue || 0;
  const todayUsers = todayUsersReq.count || 0;
  const todayGenerations = todayGensReq.count || 0;

  const arpu = totalUsers > 0 ? (revenue / totalUsers).toFixed(2) : "0.00";
  const conversionRate =
    totalUsers > 0 ? ((payingUsers / totalUsers) * 100).toFixed(1) : "0.0";
  const errorRate =
    totalGenerations > 0
      ? ((failedGenerations / totalGenerations) * 100).toFixed(1)
      : "0.0";
  const gpuBurn = (totalGenerations * 0.05).toFixed(2);

  return {
    revenue,
    totalUsers,
    totalGenerations,
    payingUsers,
    arpu,
    conversionRate,
    errorRate,
    gpuBurn,
    todayUsers,
    todayGenerations,
    failedGenerations,
  };
}

export async function updateAppSettings(
  settings: Record<string, boolean | number | string>,
) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("app_settings")
    .update(settings)
    .eq("id", 1);

  if (error) throw new Error("Failed to update settings");

  revalidatePath("/[locale]/admin", "page");
  return { success: true };
}

export async function checkIsAdmin() {
  try {
    await verifyAdmin();
    return true;
  } catch {
    return false;
  }
}
