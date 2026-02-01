import { checkRole } from "./checkRole";

export async function checkIsAdmin() {
  try {
    await checkRole("admin");
    return true;
  } catch {
    return false;
  }
}

