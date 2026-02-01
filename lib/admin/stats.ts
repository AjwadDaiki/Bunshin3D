import { createAdminClient } from "@/lib/admin-client";
import { checkRole } from "./checkRole";

export async function getAdminStats() {
  await checkRole("admin");
  const adminClient = await createAdminClient();

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
    adminClient.from("generations").select("id", { count: "exact", head: true }),
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

