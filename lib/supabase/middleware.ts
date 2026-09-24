import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  // Ne pas solliciter Supabase si la requête ne possède aucun cookie de session Supabase
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"),
  );

  if (!hasAuthCookie) {
    return NextResponse.next({ request });
  }

  const { url, key } = getSupabaseEnv();

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
    global: {
      fetch: async (input, init) => {
        try {
          return await fetch(input, init);
        } catch {
          // Intercepter l'échec réseau (projet Supabase en pause, DNS ENOTFOUND, hors-ligne)
          // pour éviter les exceptions non gérées dans le sandbox Edge de Next.js
          return new Response(
            JSON.stringify({
              error: "supabase_unreachable",
              message: "Impossible de joindre le serveur d'authentification",
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

  try {
    const { error } = await supabase.auth.getUser();
    if (error) {
      // Session expirée ou invalide : nettoyer les cookies auth pour ne pas répéter les requêtes échouées
      for (const cookie of allCookies) {
        if (cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token")) {
          supabaseResponse.cookies.delete(cookie.name);
        }
      }
    }
  } catch {
    // Supabase indisponible — on laisse passer la requête
  }

  return supabaseResponse;
}
