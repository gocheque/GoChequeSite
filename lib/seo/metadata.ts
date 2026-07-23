import { headers } from "next/headers";
import {
  buildPageMetadata as buildPageMetadataBase,
  buildRootMetadata as buildRootMetadataBase,
  siteConfig,
} from "@/lib/seo/site";

/**
 * URL canonique pour metadata / OG.
 * En prod (NEXT_PUBLIC_SITE_URL hors localhost) : toujours l'URL configurée,
 * pour éviter que Host / preview Vercel pollue les canonicals.
 * En local / ngrok : origine de la requête.
 */
export async function resolveRequestSiteUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(
    /\/$/,
    "",
  );
  if (
    configured &&
    !configured.includes("localhost") &&
    !configured.includes("127.0.0.1")
  ) {
    return configured;
  }

  try {
    const headerStore = await headers();
    const host =
      headerStore.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      headerStore.get("host")?.trim();
    if (!host) return siteConfig.url;

    const protoHeader = headerStore
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim();
    const proto =
      protoHeader ||
      (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");

    return `${proto}://${host}`.replace(/\/$/, "");
  } catch {
    return siteConfig.url;
  }
}

export async function buildRootMetadata() {
  const siteUrl = await resolveRequestSiteUrl();
  return buildRootMetadataBase(siteUrl);
}

export async function buildPageMetadata(
  options: Parameters<typeof buildPageMetadataBase>[0],
) {
  const siteUrl = options.siteUrl ?? (await resolveRequestSiteUrl());
  return buildPageMetadataBase({ ...options, siteUrl });
}
