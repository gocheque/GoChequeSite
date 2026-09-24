"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";

export function HomeCtaBanner() {
  const router = useRouter();
  const { user, isLoading, openAuthModal } = useAuth();
  const { t, path, dictionary } = useLocale();
  const pricingAnchor = dictionary.anchors.pricing;

  function handleStart() {
    if (user) {
      router.push(path("/dashboard"));
      return;
    }
    openAuthModal();
  }

  return (
    <section className="relative bg-white pb-20 pt-4 sm:pb-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-center text-white shadow-2xl sm:px-12 sm:py-20">
          {/* Subtle Ambient Radial Glows */}
          <div
            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#ff6633]/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#ff6633]/15 blur-3xl"
            aria-hidden
          />

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-300 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#ff6633]" />
              <span>{t("ctaBanner.badge")}</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              {t("ctaBanner.title")}
            </h2>

            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              {t("ctaBanner.subtitle")}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={handleStart}
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6633] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-[#ea5522] hover:shadow-orange-500/40 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
              >
                {t("ctaBanner.cta")}
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href={path(`/#${pricingAnchor}`)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-xs transition hover:bg-slate-800 hover:text-white sm:w-auto"
              >
                {t("ctaBanner.secondaryCta")}
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-400">
              {t("ctaBanner.guarantee")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
