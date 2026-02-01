"use server";

import {
  banUser as banUserImpl,
  changeUserRole as changeUserRoleImpl,
  deleteUser as deleteUserImpl,
  getAllUsers as getAllUsersImpl,
  grantCredits as grantCreditsImpl,
} from "@/lib/admin/users";
import { getAdminStats as getAdminStatsImpl } from "@/lib/admin/stats";
import { updateAppSettings as updateAppSettingsImpl } from "@/lib/admin/settings";
import { checkIsAdmin as checkIsAdminImpl } from "@/lib/admin/check";

export async function grantCredits(userId: string, amount: number) {
  return grantCreditsImpl(userId, amount);
}

export async function changeUserRole(
  userId: string,
  role: "user" | "moderator" | "admin",
) {
  return changeUserRoleImpl(userId, role);
}

export async function banUser(userId: string, banned: boolean) {
  return banUserImpl(userId, banned);
}

export async function deleteUser(userId: string) {
  return deleteUserImpl(userId);
}

export async function getAllUsers(
  page: number = 1,
  limit: number = 20,
  search?: string,
) {
  return getAllUsersImpl(page, limit, search);
}

export async function getAdminStats() {
  return getAdminStatsImpl();
}

export async function updateAppSettings(
  settings: Record<string, boolean | number | string>,
) {
  return updateAppSettingsImpl(settings);
}

export async function checkIsAdmin() {
  return checkIsAdminImpl();
}

