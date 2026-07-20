/**
 * Config Supabase publique (URL + anon).
 * Priorité : injection runtime (serveur → page) puis process.env (build).
 * L'anon key est conçue pour le navigateur — ce n'est pas un secret.
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

function fromProcessEnv(): SupabasePublicConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
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
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

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
