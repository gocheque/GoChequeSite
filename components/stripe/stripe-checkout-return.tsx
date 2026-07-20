"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { parseApiJson } from "@/lib/api/parse-json";

export function StripeCheckoutReturn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, path } = useLocale();
  const { showCreditsPurchased } = useAuth();
  const handledRef = useRef<string | null>(null);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    const sessionId = searchParams.get("session_id");

    if (checkout !== "success" || !sessionId) return;
    if (handledRef.current === sessionId) return;
    handledRef.current = sessionId;

    let cancelled = false;
    let attempts = 0;

    async function pollSession() {
      while (!cancelled && attempts < 12) {
        attempts += 1;

        try {
          const res = await fetch(
            `/api/stripe/session?session_id=${encodeURIComponent(sessionId!)}`,
          );
          const data = await parseApiJson<{
            status?: string;
            balance?: number;
            creditsAdded?: number;
            error?: string;
          }>(res);

          if (!res.ok) {
            throw new Error(data.error ?? t("common.errorPurchase"));
          }

          if (data.status === "completed") {
            showCreditsPurchased(data.balance ?? 0, data.creditsAdded ?? 0);
            router.replace(path("/dashboard/keys"));
            return;
          }
        } catch {
          if (attempts >= 12) {
            router.replace(`${path("/dashboard/keys")}?checkout=error`);
            return;
          }
        }

        await new Promise((resolve) => window.setTimeout(resolve, 1500));
      }
    }

    void pollSession();

    return () => {
      cancelled = true;
    };
  }, [searchParams, showCreditsPurchased, router, t, path]);

  return null;
}
