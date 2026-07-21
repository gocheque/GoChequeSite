/**
 * Config Supabase publique (URL + anon).
 *
 * Important : ne pas lire process.env.NEXT_PUBLIC_* en accès direct
 * (Next.js l'inline au build). Utiliser process.env["…"] pour le runtime Vercel.
 */

export type SupabasePublicConfig = {
  url: string;
  key: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __GOCHEQUE_SB__: SupabasePublicConfig | undefined;
}

let runtimeConfig: SupabasePublicConfig | null = null;

export function setSupabasePublicConfig(config: SupabasePublicConfig | null) {
  if (!config?.url || !config?.key) {
    runtimeConfig = null;
    return;
  }

  const normalized = {
    url: config.url.trim().replace(/\/$/, ""),
    key: config.key.trim(),
  };

  runtimeConfig = normalized;

  if (typeof globalThis !== "undefined") {
    globalThis.__GOCHEQUE_SB__ = normalized;
  }
}

function fromInjectedGlobal(): SupabasePublicConfig | null {
  if (typeof globalThis === "undefined") return null;
  const injected = globalThis.__GOCHEQUE_SB__;
  if (!injected?.url?.trim() || !injected?.key?.trim()) return null;
  return {
    url: injected.url.trim().replace(/\/$/, ""),
    key: injected.key.trim(),
  };
}

/** Accès dynamique = non inliné par Next.js → lit vraiment Vercel au runtime. */
function fromProcessEnv(): SupabasePublicConfig | null {
  const env = process.env;
  const url = env["NEXT_PUBLIC_SUPABASE_URL"]?.trim();
  const key = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]?.trim();
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export function resolveSupabasePublicConfig(): SupabasePublicConfig | null {
  return runtimeConfig ?? fromInjectedGlobal() ?? fromProcessEnv();
}

export function readSupabasePublicConfigFromEnv(): SupabasePublicConfig | null {
  return fromProcessEnv();
}

/** Côté client + serveur : URL + clé anon uniquement. */
export function isSupabaseConfigured(): boolean {
  const config = resolveSupabasePublicConfig();
  if (!config) return false;

  return (
    config.url.startsWith("https://") &&
    !config.url.includes("[project-ref]") &&
    config.key !== "your-anon-key" &&
    config.key.length > 20
  );
}

/** Serveur uniquement : service_role présent. */
export function isSupabaseAdminConfigured(): boolean {
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"]?.trim();

  return Boolean(
    isSupabaseConfigured() &&
      serviceKey &&
      serviceKey !== "your-service-role-key",
  );
}

export function getSupabaseEnv(): SupabasePublicConfig {
  const config = resolveSupabasePublicConfig();

  if (!config || !config.url.startsWith("https://")) {
    throw new Error(
      "Supabase non configuré. Vérifiez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sur Vercel (projet GoCheque), puis Redeploy sans cache.",
    );
  }

  return config;
}
