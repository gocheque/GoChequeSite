/** Canonical production host for metadata, sitemap, robots, and JSON-LD. */
export const PRIMARY_SITE_URL = "https://gocheque.ca";
/** Live alternate host (same product). Listed as Organization.sameAs — never used as canonical. */
export const ALTERNATE_SITE_URL = "https://gocheque.com";

const PRODUCTION_HOSTS = new Set([
  "gocheque.ca",
  "www.gocheque.ca",
  "gocheque.com",
  "www.gocheque.com",
]);

function normalizeHost(host: string): string {
  return host.trim().toLowerCase().split(":")[0] ?? "";
}

export function isProductionPublicHost(host: string | null | undefined): boolean {
  if (!host) return false;
  return PRODUCTION_HOSTS.has(normalizeHost(host));
}

export function isPreviewOrLocalHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const normalized = normalizeHost(host);
  return (
    normalized.includes("localhost") ||
    normalized.startsWith("127.") ||
    normalized.endsWith(".vercel.app") ||
    normalized === "vercel.app"
  );
}

export function hostFromUrl(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}
