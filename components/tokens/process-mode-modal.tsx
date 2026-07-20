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
  }, [processModeModalOpen, refreshBalance]);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-8 pb-6 pt-7 text-center">
          <ModalCloseButton onClick={closeModal} className="absolute right-5 top-5" />
          <h2 className="text-2xl font-bold text-slate-900">
            {t("process.titleCheque")}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-slate-500">
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
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-[#ff6633]" />
            </div>
          ) : hasCredits ? (
            <>
              <div className="rounded-xl border border-orange-100 bg-orange-50/50 px-4 py-4 text-center">
                <p className="text-sm text-slate-600">{t("process.currentBalance")}</p>
                <p className="mt-1 text-2xl font-bold text-[#ff6633]">
                  {displayBalance! > 1
                    ? t("credits.balancePlural", { count: displayBalance! })
                    : t("credits.balance", { count: displayBalance! })}
                </p>
                <p className="mt-2 text-xs text-slate-500">{t("process.oneCreditOnePrint")}</p>
              </div>

              <button
                type="button"
                disabled={consumeLoading}
                onClick={() => void handlePrint()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6633] py-3.5 text-base font-semibold text-white transition hover:bg-[#e05526] disabled:cursor-not-allowed disabled:opacity-50"
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
                <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">
                  {consumeError}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-center text-sm text-slate-500">
                {t("process.noCredits")}
              </p>
              <button
                type="button"
                onClick={continueToPurchase}
                className="w-full rounded-xl border border-[#ff6633]/30 bg-orange-50/60 px-6 py-4 text-base font-semibold text-[#ff6633] transition hover:border-[#ff6633]/50 hover:bg-orange-50"
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
