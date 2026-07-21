import { NextResponse } from "next/server";

/**
 * Diagnostic (sans secrets) : les vars Supabase publiques sont-elles
 * visibles au runtime sur Vercel ?
 */
export async function GET() {
  const env = process.env;
  const url = env["NEXT_PUBLIC_SUPABASE_URL"]?.trim() ?? "";
  const anon = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]?.trim() ?? "";
  const site = env["NEXT_PUBLIC_SITE_URL"]?.trim() ?? "";

  return NextResponse.json({
    hasUrl: Boolean(url),
    hasAnonKey: Boolean(anon),
    hasSiteUrl: Boolean(site),
    urlLooksValid: url.startsWith("https://") && url.includes("supabase"),
    anonLooksValid: anon.length > 20,
    siteUrl: site || null,
  });
}
