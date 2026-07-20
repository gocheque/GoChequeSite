import { headers } from "next/headers";
import {
  buildPageMetadata as buildPageMetadataBase,
  buildRootMetadata as buildRootMetadataBase,
  siteConfig,
} from "@/lib/seo/site";

/** Origine réelle de la requête (ngrok, prod, localhost). Serveur uniquement. */
export async function resolveRequestSiteUrl(): Promise<string> {
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
