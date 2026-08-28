"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
    <section className="relative px-4 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pt-36">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-10 flex justify-center">
          <AppLogo
            alt={t("hero.logoAlt")}
            priority
            className="h-14 w-auto max-w-[min(100%,16rem)] object-contain sm:h-16 sm:max-w-[18rem]"
          />
        </div>

        <h1
          className={
            isFrench
              ? "text-[2.15rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[#0b1f33] min-[480px]:text-5xl sm:text-[3.35rem]"
              : "text-[2.4rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[#0b1f33] sm:text-[3.5rem]"
          }
        >
          <span className="block">
            {t("hero.titleBefore")}{" "}
            <span className="text-[#ff6633]">{t("hero.titleHighlight")}</span>
          </span>
          <span className="mt-2 block font-medium text-[#0b1f33]">
            {t("hero.titleAfter")}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-[1.05rem] leading-relaxed text-[#5b6b7c]">
          {t("hero.subtitle")}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={handleTryNow}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-md bg-[#0b1f33] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#16324c] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {t("hero.ctaTry")}
          </button>
          <Link
            href={path(`/#${pricingAnchor}`)}
            className="inline-flex w-full items-center justify-center rounded-md border border-[#d9d4cc] bg-white px-8 py-3.5 text-sm font-semibold text-[#0b1f33] transition hover:border-[#0b1f33]/30 sm:w-auto"
          >
            {t("hero.ctaPricing")}
          </Link>
        </div>

        <div className="mt-16 opacity-40 sm:mt-20">
          <HeroMicrMarquee />
        </div>
      </div>
    </section>
  );
}
