export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  return Boolean(
    url &&
      anonKey &&
      serviceKey &&
      url.startsWith("https://") &&
      !url.includes("[project-ref]") &&
      anonKey !== "your-anon-key" &&
      serviceKey !== "your-service-role-key",
  );
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey || !url.startsWith("https://")) {
    throw new Error(
      "Supabase non configuré. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env",
    );
  }

  return { url, key: anonKey };
}
