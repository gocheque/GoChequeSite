import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function createAdminClient() {
  const { url } = getSupabaseEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquant dans .env (Settings > API > service_role)",
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
