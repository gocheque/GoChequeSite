/**
 * Variables Supabase.
 * Les NEXT_PUBLIC_* sont inlinées au build Next.js — un redeploy
 * (idéalement sans cache) est requis après tout changement sur Vercel.
 */

function readPublicUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
}

function readAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
}

/** Côté client + serveur : URL + clé anon uniquement (pas de service_role). */
export function isSupabaseConfigured(): boolean {
  const url = readPublicUrl();
  const anonKey = readAnonKey();

  return Boolean(
    url &&
      anonKey &&
      url.startsWith("https://") &&
      !url.includes("[project-ref]") &&
      anonKey !== "your-anon-key",
  );
}

/** Serveur uniquement : service_role présent. */
export function isSupabaseAdminConfigured(): boolean {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  return Boolean(
    isSupabaseConfigured() &&
      serviceKey &&
      serviceKey !== "your-service-role-key",
  );
}

export function getSupabaseEnv() {
  const url = readPublicUrl();
  const anonKey = readAnonKey();

  if (!url || !anonKey || !url.startsWith("https://")) {
    throw new Error(
      "Supabase non configuré. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env",
    );
  }

  return { url, key: anonKey };
}
