"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HeroMicrMarquee } from "@/components/home/hero-micr-marquee";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";

export function HomeHero() {
  const router = useRouter();
  const { user, isLoading, openAuthModal } = useAuth();
  const { locale, t, path, dictionary } = useLocale();
  const pricingAnchor = dictionary.anchors.pricing;
  const isFrench = locale === "fr";

  function handleTryNow() {
    if (user) {
      router.push(path("/dashboard"));
      return;
    }

    openAuthModal();
  }

  return (
    <section className="relative px-4 pb-4 pt-28 sm:px-6 sm:pb-6 sm:pt-32 lg:px-8 lg:pt-36">
      <div className="mx-auto max-w-5xl text-center">
        {/* Top trust pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/70 px-4 py-1.5 text-xs font-semibold text-[#ff6633] shadow-xs backdrop-blur-xs transition hover:bg-orange-100/70">
          <span className="flex h-2 w-2 rounded-full bg-[#ff6633] animate-pulse" />
          <span>{t("hero.badge")}</span>
        </div>

        <h1
          className={
            isFrench
              ? "mx-auto max-w-5xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.25rem]"
              : "text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.25rem]"
          }
        >
          <span className="block">
            {t("hero.titleBefore")}{" "}
            <span className="text-[#ff6633]">{t("hero.titleHighlight")}</span>
          </span>
          <span className="mt-1 block text-slate-900 sm:mt-2">{t("hero.titleAfter")}</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {t("hero.subtitle")}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={handleTryNow}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6633] px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-[#ea5522] hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {t("hero.ctaTry")}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <Link
            href={path(`/#${pricingAnchor}`)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-8 py-3.5 text-base font-semibold text-slate-700 shadow-xs backdrop-blur-xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
          >
            {t("hero.ctaPricing")}
          </Link>
        </div>

        {/* Reassurance points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>{t("hero.trustPoints.noCard")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>{t("hero.trustPoints.private")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>{t("hero.trustPoints.banks")}</span>
          </div>
        </div>

        <div className="mt-12 sm:mt-14">
          <HeroMicrMarquee />
        </div>
      </div>
    </section>
  );
}

