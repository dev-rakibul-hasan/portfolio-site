import { isAdminEmail, hasConfiguredAdminEmails } from "@/lib/admin-access";
import { getServerSupabase } from "@/lib/supabase/server";

export async function requireAdmin(): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const supabase = getServerSupabase();
  if (!supabase) {
    return { ok: false, status: 500, message: "Supabase auth is not configured." };
  }

  if (!hasConfiguredAdminEmails()) {
    return { ok: false, status: 500, message: "Admin access is not configured." };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  if (!isAdminEmail(user.email)) {
    return { ok: false, status: 403, message: "Forbidden" };
  }

  return { ok: true };
}
