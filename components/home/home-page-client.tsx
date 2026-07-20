"use client";

import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeHero } from "@/components/home/home-hero";
import { HomeMockupGallery } from "@/components/home/home-mockup-gallery";
import { HomeScrollShowcase } from "@/components/home/home-scroll-showcase";
import { HomeFeaturesSection } from "@/components/home/home-features-section";
import { HomePricingSection } from "@/components/home/home-pricing-section";
import { HomeFaqSection } from "@/components/home/home-faq-section";
import { HomeFooter } from "@/components/home/home-footer";
import { useLocale } from "@/components/providers/locale-provider";

export function HomePageClient() {
  const { t } = useLocale();

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-lg focus-visible:bg-slate-900 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white"
      >
        {t("nav.skipToContent")}
      </a>
      <HomeNavbar />

      <main id="contenu">
        <HomeHero />
        <HomeMockupGallery />
        <HomeScrollShowcase />
        <HomeFeaturesSection />
        <HomePricingSection />
        <HomeFaqSection />
      </main>

      <HomeFooter />
    </>
  );
}
