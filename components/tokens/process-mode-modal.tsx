"use client";

import { useEffect, useState } from "react";
import { Loader2, Printer, Smartphone } from "lucide-react";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { isCoarsePointerDevice } from "@/lib/cheque/is-coarse-pointer";
import { printCheque } from "@/lib/cheque/print-cheque";
import { parseApiJson } from "@/lib/api/parse-json";

export function ProcessModeModal() {
  const { t, locale } = useLocale();
  const {
    processModeModalOpen,
    closeProcessModal,
    continueToPurchase,
    tokenBalance,
    refreshBalance,
  } = useAuth();

  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [consumeLoading, setConsumeLoading] = useState(false);
  const [consumeError, setConsumeError] = useState<string | null>(null);
  const [isTouchMode, setIsTouchMode] = useState(false);

  useEffect(() => {
    setIsTouchMode(isCoarsePointerDevice());
  }, []);

  useEffect(() => {
    if (!processModeModalOpen) {
      setBalance(null);
      setBalanceLoading(false);
      return;
    }

    let cancelled = false;
    setBalanceLoading(true);

    void (async () => {
      try {
        const res = await fetch("/api/tokens/balance");
        const data = await parseApiJson<{ balance?: number }>(res);

        if (cancelled) return;

        if (res.ok) {
          const nextBalance = data.balance ?? 0;
          setBalance(nextBalance);
          void refreshBalance();
          return;
        }

        setBalance(tokenBalance ?? 0);
      } catch {
        if (!cancelled) {
          setBalance(tokenBalance ?? 0);
        }
      } finally {
        if (!cancelled) {
          setBalanceLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [processModeModalOpen, refreshBalance, tokenBalance]);

  if (!processModeModalOpen) return null;

  const displayBalance = balance ?? tokenBalance;
  const isResolvingBalance = balanceLoading && displayBalance === null;
  const hasCredits = !isResolvingBalance && (displayBalance ?? 0) > 0;

  function closeModal() {
    closeProcessModal();
    setConsumeError(null);
  }

  async function handlePrint() {
    setConsumeLoading(true);
    setConsumeError(null);

    try {
      const res = await fetch("/api/tokens/consume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await parseApiJson<{ error?: string; message?: string }>(res);

      if (!res.ok) {
        if (
          data.error === "INSUFFICIENT_CREDITS" ||
          data.error === "INSUFFICIENT_TOKENS"
        ) {
          throw new Error(t("credits.insufficient"));
        }
        throw new Error(data.message ?? t("process.consumeGeneric"));
      }

      await refreshBalance();
      closeModal();
      printCheque(locale);
    } catch (err) {
      setConsumeError(
        err instanceof Error ? err.message : t("process.consumeGeneric"),
      );
    } finally {
      setConsumeLoading(false);
    }
  }

  return (
    <div className="marketing-shell fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-[#0b1f33]/40 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-[#e7e4de] bg-white shadow-[0_24px_80px_rgba(11,31,51,0.18)]">
        <div className="border-b border-[#e7e4de] px-8 pb-6 pt-7 text-center">
          <ModalCloseButton onClick={closeModal} className="absolute right-5 top-5" />
          <h2 className="text-2xl font-semibold tracking-tight text-[#0b1f33]">
            {t("process.titleCheque")}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-[#5c6b7a]">
            {isResolvingBalance
              ? t("credits.loading")
              : hasCredits
                ? isTouchMode
                  ? t("process.subtitleCreditsTouch")
                  : t("process.subtitleCredits")
                : t("process.subtitleNoCredits")}
          </p>
        </div>

        <div className="space-y-6 px-8 py-8">
          {isResolvingBalance ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-[#5c6b7a]">
              <Loader2 className="h-8 w-8 animate-spin text-[#0b1f33]" />
            </div>
          ) : hasCredits ? (
            <>
              <div className="rounded-md border border-[#e7e4de] bg-[#f6f4f0] px-4 py-4 text-center">
                <p className="text-sm text-[#5c6b7a]">{t("process.currentBalance")}</p>
                <p className="mt-1 text-2xl font-semibold text-[#0b1f33]">
                  {displayBalance! > 1
                    ? t("credits.balancePlural", { count: displayBalance! })
                    : t("credits.balance", { count: displayBalance! })}
                </p>
                <p className="mt-2 text-xs text-[#8a8074]">{t("process.oneCreditOnePrint")}</p>
              </div>

              <button
                type="button"
                disabled={consumeLoading}
                onClick={() => void handlePrint()}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0b1f33] py-3.5 text-base font-semibold text-white transition hover:bg-[#16324c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {consumeLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {isTouchMode ? (
                      <Smartphone className="h-5 w-5" />
                    ) : (
                      <Printer className="h-5 w-5" />
                    )}
                    {isTouchMode
                      ? t("process.printTouch")
                      : t("process.print")}
                  </>
                )}
              </button>

              {consumeError && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-center text-sm text-red-700">
                  {consumeError}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="rounded-md border border-dashed border-[#e7e4de] bg-[#f6f4f0] px-4 py-3 text-center text-sm text-[#5c6b7a]">
                {t("process.noCredits")}
              </p>
              <button
                type="button"
                onClick={continueToPurchase}
                className="w-full rounded-md border border-[#e7e4de] bg-white px-6 py-4 text-base font-semibold text-[#0b1f33] transition hover:border-[#0b1f33]/35"
              >
                {t("process.buyCredits")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
