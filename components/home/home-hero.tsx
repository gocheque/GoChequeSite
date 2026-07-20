"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AppLogo } from "@/components/brand/app-logo";
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
    <section className="relative px-4 pb-6 pt-28 sm:px-6 sm:pb-8 sm:pt-32 lg:px-8 lg:pt-36">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-8 flex justify-center">
          <AppLogo
            alt={t("hero.logoAlt")}
            priority
            className="h-16 w-auto max-w-[min(100%,20rem)] object-contain sm:h-20 sm:max-w-[24rem] lg:h-24 lg:max-w-[28rem]"
          />
        </div>

        <h1
          className={
            isFrench
              ? "mx-auto max-w-5xl text-[2.35rem] font-bold leading-[1.08] tracking-tight text-slate-900 min-[480px]:text-5xl sm:text-6xl lg:text-[4.5rem]"
              : "text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.5rem]"
          }
        >
          <span
            className={
              isFrench
                ? "block min-[480px]:whitespace-nowrap"
                : "block sm:whitespace-nowrap"
            }
          >
            {t("hero.titleBefore")}{" "}
            <span className="text-[#ff6633]">{t("hero.titleHighlight")}</span>
          </span>
          <span className="mt-1 block sm:mt-2">{t("hero.titleAfter")}</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
          {t("hero.subtitle")}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={handleTryNow}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {t("hero.ctaTry")}
          </button>
          <Link
            href={path(`/#${pricingAnchor}`)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
          >
            {t("hero.ctaPricing")}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-14 sm:mt-16">
          <HeroMicrMarquee />
        </div>
      </div>
    </section>
  );
}
