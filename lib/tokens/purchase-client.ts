import type { Locale } from "@/lib/i18n/config";

type PurchaseResponse = {
  balance?: number;
  creditsAdded?: number;
  error?: string;
};

export async function purchaseTokenPackage(
  packageId: string,
  locale: Locale,
): Promise<PurchaseResponse & { redirected?: boolean }> {
  const checkoutRes = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packageId, locale }),
  });

  const checkoutData = (await checkoutRes.json()) as PurchaseResponse & {
    url?: string;
    code?: string;
  };

  if (checkoutRes.ok && checkoutData.url) {
    window.location.assign(checkoutData.url);
    return { redirected: true };
  }

  if (
    checkoutRes.status === 503 &&
    checkoutData.code === "STRIPE_NOT_CONFIGURED"
  ) {
    const legacyRes = await fetch("/api/tokens/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageId }),
    });

    const legacyData = (await legacyRes.json()) as PurchaseResponse;

    if (!legacyRes.ok) {
      throw new Error(legacyData.error ?? "Purchase error");
    }

    return legacyData;
  }

  throw new Error(checkoutData.error ?? "Purchase error");
}
