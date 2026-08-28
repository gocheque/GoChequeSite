"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Coins, ExternalLink, Loader2, Plus } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { useAuth } from "@/components/providers/auth-provider";
import type { CreditTransaction } from "@/lib/tokens/types";
import { parseApiJson } from "@/lib/api/parse-json";

type Filter = "all" | "purchase" | "consume";

const PAGE_SIZE = 10;

function transactionLabel(
  txn: CreditTransaction,
  t: (key: string, params?: Record<string, string | number>) => string,
): string {
  if (txn.reason === "purchase") {
    return txn.delta > 1
      ? t("credits.txnPurchasePlural", { count: txn.delta })
      : t("credits.txnPurchase", { count: txn.delta });
  }
  if (txn.reason === "consume") {
    const amount = Math.abs(txn.delta);
    return amount > 1
      ? t("credits.txnConsumePlural", { count: amount })
      : t("credits.txnConsume", { count: amount });
  }
  if (txn.reason === "migration") {
    return t("credits.txnMigration");
  }
  return t("credits.txnAdjustment");
}

export function DashboardKeysList({ embedded = false }: { embedded?: boolean }) {
  const { t, path, dictionary, locale } = useLocale();
  const { tokensRevision } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const dateLocale = locale === "fr" ? "fr-CA" : "en-CA";

  const formatDate = useCallback(
    (iso: string) =>
      new Intl.DateTimeFormat(dateLocale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(iso)),
    [dateLocale],
  );

  const loadCredits = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tokens/list");
      const data = await parseApiJson<{
        balance?: number;
        transactions?: CreditTransaction[];
        error?: string;
      }>(res);

      if (!res.ok) {
        throw new Error(data.error ?? t("credits.loadError"));
      }

      setBalance(data.balance ?? 0);
      setTransactions(data.transactions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadCredits();
  }, [loadCredits, tokensRevision]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filter, transactions]);

  const stats = useMemo(() => {
    const purchased = transactions
      .filter((txn) => txn.reason === "purchase" || txn.reason === "migration")
      .reduce((sum, txn) => sum + Math.max(0, txn.delta), 0);
    const used = transactions
      .filter((txn) => txn.reason === "consume")
      .reduce((sum, txn) => sum + Math.abs(txn.delta), 0);
    return { balance, purchased, used };
  }, [transactions, balance]);

  const filteredTransactions = useMemo(() => {
    if (filter === "purchase") {
      return transactions.filter(
        (txn) => txn.reason === "purchase" || txn.reason === "migration",
      );
    }
    if (filter === "consume") {
      return transactions.filter((txn) => txn.reason === "consume");
    }
    return transactions;
  }, [transactions, filter]);

  const visibleTransactions = useMemo(
    () => filteredTransactions.slice(0, visibleCount),
    [filteredTransactions, visibleCount],
  );

  const hasMore = visibleCount < filteredTransactions.length;
  const remaining = filteredTransactions.length - visibleCount;

  const hasPurchases = useMemo(
    () =>
      transactions.some(
        (txn) => txn.reason === "purchase" || txn.reason === "migration",
      ),
    [transactions],
  );

  async function openStripeInvoices() {
    setPortalLoading(true);
    setPortalError(null);

    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      const data = await parseApiJson<{ url?: string; error?: string }>(res);

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? t("credits.invoicesError"));
      }

      window.location.href = data.url;
    } catch (err) {
      setPortalError(
        err instanceof Error ? err.message : t("credits.invoicesError"),
      );
      setPortalLoading(false);
    }
  }

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: t("credits.filterAll"), count: transactions.length },
    {
      id: "purchase",
      label: t("credits.filterPurchases"),
      count: transactions.filter(
        (txn) => txn.reason === "purchase" || txn.reason === "migration",
      ).length,
    },
    {
      id: "consume",
      label: t("credits.filterUses"),
      count: transactions.filter((txn) => txn.reason === "consume").length,
    },
  ];

  const content = (
    <section className="overflow-hidden rounded-md border border-[#e7e4de] bg-white">
      <div className="border-b border-[#e7e4de] px-5 py-5 sm:px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-[#e7e4de] bg-[#f6f4f0] px-4 py-3 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8a8074]">
              {t("credits.statsBalance")}
            </p>
            <p className="mt-1 text-2xl font-semibold text-[#0b1f33]">
              {loading ? "—" : stats.balance}
            </p>
          </div>
          <div className="rounded-md border border-[#e7e4de] bg-white px-4 py-3 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8a8074]">
              {t("credits.statsPurchased")}
            </p>
            <p className="mt-1 text-2xl font-semibold text-[#0b1f33]">
              {loading ? "—" : stats.purchased}
            </p>
          </div>
          <div className="rounded-md border border-[#e7e4de] bg-white px-4 py-3 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8a8074]">
              {t("credits.statsUsed")}
            </p>
            <p className="mt-1 text-2xl font-semibold text-[#0b1f33]">
              {loading ? "—" : stats.used}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-[#e7e4de] px-5 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                filter === item.id
                  ? "bg-[#0b1f33] text-white"
                  : "bg-[#f6f4f0] text-[#5c6b7a] hover:text-[#0b1f33]"
              }`}
            >
              {item.label}
              <span
                className={`ml-1.5 text-xs ${
                  filter === item.id ? "text-white/80" : "text-[#8a8074]"
                }`}
              >
                {loading ? "…" : item.count}
              </span>
            </button>
          ))}

          {!loading && hasPurchases ? (
            <button
              type="button"
              onClick={() => void openStripeInvoices()}
              disabled={portalLoading}
              className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-[#e7e4de] bg-white px-3 py-1.5 text-sm font-medium text-[#5c6b7a] transition hover:border-[#0b1f33]/30 hover:text-[#0b1f33] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {portalLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              )}
              {t("credits.viewInvoices")}
            </button>
          ) : null}
        </div>
        {portalError ? (
          <p className="mt-2 text-xs text-red-700">{portalError}</p>
        ) : null}
        {!loading && hasPurchases && filter === "purchase" ? (
          <p className="mt-2 text-xs text-[#8a8074]">{t("credits.invoicesHint")}</p>
        ) : null}
      </div>

      <div className="p-5 sm:p-6">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#5c6b7a]">
            <Loader2 className="h-8 w-8 animate-spin text-[#0b1f33]" />
            <p className="text-sm">{t("credits.loading")}</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-md border border-red-100 bg-red-50 px-4 py-6 text-center">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={loadCredits}
              className="mt-3 text-sm font-semibold text-[#0b1f33] hover:underline"
            >
              {t("credits.retry")}
            </button>
          </div>
        )}

        {!loading && !error && balance === 0 && transactions.length === 0 && (
          <div className="rounded-md border border-dashed border-[#e7e4de] bg-[#f6f4f0]/50 px-6 py-14 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-white text-[#8a8074]">
              <Coins className="h-6 w-6" />
            </span>
            <p className="mt-4 font-medium text-[#0b1f33]">{t("credits.empty")}</p>
            <p className="mt-1 text-sm text-[#5c6b7a]">{t("credits.emptyBuyHint")}</p>
            <Link
              href={path(`/#${dictionary.anchors.pricing}`)}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#0b1f33] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#16324c]"
            >
              <Plus className="h-4 w-4" />
              {t("dashboard.createCheque")}
            </Link>
          </div>
        )}

        {!loading && !error && transactions.length > 0 && filteredTransactions.length === 0 && (
          <div className="rounded-md border border-dashed border-[#e7e4de] bg-[#f6f4f0]/40 px-6 py-12 text-center">
            <p className="text-sm text-[#5c6b7a]">{t("credits.emptyFilter")}</p>
          </div>
        )}

        {!loading && !error && filteredTransactions.length > 0 && (
          <>
            <ul className="space-y-3">
              {visibleTransactions.map((txn) => {
                const isCredit = txn.delta > 0;

                return (
                  <li
                    key={txn.id}
                    className="rounded-md border border-[#e7e4de] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                            isCredit
                              ? "bg-[#0b1f33]/5 text-[#0b1f33]"
                              : "bg-[#f6f4f0] text-[#5c6b7a]"
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownLeft className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-[#0b1f33]">
                            {transactionLabel(txn, t)}
                          </p>
                          <p className="mt-1 text-xs text-[#5c6b7a]">
                            {t("credits.txnDate", { date: formatDate(txn.created_at) })}
                            {" · "}
                            {t("credits.txnBalanceAfter", {
                              balance: txn.balance_after,
                            })}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 text-sm font-semibold ${
                          isCredit ? "text-[#0b1f33]" : "text-[#5c6b7a]"
                        }`}
                      >
                        {isCredit ? `+${txn.delta}` : txn.delta}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            {hasMore && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="inline-flex items-center justify-center rounded-md border border-[#e7e4de] bg-white px-5 py-2.5 text-sm font-medium text-[#0b1f33] transition hover:border-[#0b1f33]/30"
                >
                  {t("credits.loadMore")}
                  <span className="ml-2 text-xs font-normal text-[#8a8074]">
                    {remaining > 1
                      ? t("credits.remainingPlural", { count: remaining })
                      : t("credits.remaining", { count: remaining })}
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8074]">
          {t("dashboard.label")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0b1f33] sm:text-4xl">
          {t("credits.listTitle")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#5c6b7a]">
          {t("credits.listSubtitle")}
        </p>
      </div>
      {content}
    </div>
  );
}
