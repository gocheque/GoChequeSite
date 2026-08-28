import { headers } from "next/headers";
import {
  buildPageMetadata as buildPageMetadataBase,
  buildRootMetadata as buildRootMetadataBase,
  siteConfig,
} from "@/lib/seo/site";
import {
  PRIMARY_SITE_URL,
  hostFromUrl,
  isPreviewOrLocalHost,
} from "@/lib/seo/hosts";

/**
 * Canonical site URL for metadata / OG / JSON-LD.
 * Production always uses https://gocheque.ca (primary), never a Vercel preview host.
 * Localhost keeps the request origin so OG images work in development.
 */
export async function resolveRequestSiteUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(
    /\/$/,
    "",
  );

  if (configured) {
    const host = hostFromUrl(configured);
    if (isPreviewOrLocalHost(host) && host.includes("localhost")) {
      return configured;
    }
    if (isPreviewOrLocalHost(host) && host.startsWith("127.")) {
      return configured;
    }
    return PRIMARY_SITE_URL;
  }

  try {
    const headerStore = await headers();
    const host =
      headerStore.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      headerStore.get("host")?.trim();
    if (!host) return siteConfig.url;

    if (isPreviewOrLocalHost(host) && (host.includes("localhost") || host.startsWith("127."))) {
      const protoHeader = headerStore
        .get("x-forwarded-proto")
        ?.split(",")[0]
        ?.trim();
      const proto =
        protoHeader ||
        (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");
      return `${proto}://${host}`.replace(/\/$/, "");
    }

    return PRIMARY_SITE_URL;
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
