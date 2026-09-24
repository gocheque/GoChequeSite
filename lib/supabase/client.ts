import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { getSupabaseEnv } from "@/lib/supabase/env";

let browserClient: SupabaseClient<Database> | undefined;

export function createClient() {
  if (!browserClient) {
    const { url, key } = getSupabaseEnv();
    browserClient = createBrowserClient<Database>(url, key, {
      global: {
        fetch: async (input, init) => {
          try {
            return await fetch(input, init);
          } catch {
            return new Response(
              JSON.stringify({
                error: "supabase_unreachable",
                message: "Serveur Supabase inaccessible",
              }),
              {
                status: 503,
                headers: { "Content-Type": "application/json" },
              },
            );
          }
        },
      },
    });
  }
  return browserClient;
}
