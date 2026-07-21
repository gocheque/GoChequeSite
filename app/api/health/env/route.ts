import { NextResponse } from "next/server";

function stripEnvQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

/**
 * Diagnostic (sans secrets) : les vars Supabase publiques sont-elles
 * visibles au runtime sur Vercel ?
 */
export async function GET() {
  const env = process.env;
  const rawUrl = env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
  const rawAnon = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ?? "";
  const url = stripEnvQuotes(rawUrl);
  const anon = stripEnvQuotes(rawAnon);
  const site = stripEnvQuotes(env["NEXT_PUBLIC_SITE_URL"] ?? "");

  return NextResponse.json({
    hasUrl: Boolean(url),
    hasAnonKey: Boolean(anon),
    hasSiteUrl: Boolean(site),
    urlLooksValid: url.startsWith("https://") && url.includes("supabase"),
    anonLooksValid: anon.length > 20 && (anon.startsWith("eyJ") || anon.startsWith("sb_")),
    urlHadQuotes: rawUrl.trim().startsWith('"') || rawUrl.trim().startsWith("'"),
    anonHadQuotes: rawAnon.trim().startsWith('"') || rawAnon.trim().startsWith("'"),
    urlHostPreview: (() => {
      try {
        return url.startsWith("https://") ? new URL(url).host : url.slice(0, 40);
      } catch {
        return url.slice(0, 40);
      }
    })(),
    siteUrl: site || null,
  });
}
