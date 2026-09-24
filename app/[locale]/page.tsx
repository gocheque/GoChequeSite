import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildHomeJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeHero } from "@/components/home/home-hero";
import { HomeMockupGallery } from "@/components/home/home-mockup-gallery";
import { HomeScrollShowcase } from "@/components/home/home-scroll-showcase";
import { HomeFeaturesSection } from "@/components/home/home-features-section";
import { HomePricingSection } from "@/components/home/home-pricing-section";
import { HomeFaqSection } from "@/components/home/home-faq-section";
import { HomeCtaBanner } from "@/components/home/home-cta-banner";
import { HomeFooter } from "@/components/home/home-footer";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale, type Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};

  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return buildPageMetadata({
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    path: `/${locale}`,
    locale,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <JsonLd data={buildHomeJsonLd(dict, locale)} />
      <SkipToContent label={dict.nav.skipToContent} />
      <HomeNavbar />

      <main id="contenu">
        <HomeHero />
        <HomeMockupGallery />
        <HomeScrollShowcase />
        <HomeFeaturesSection dictionary={dict} />
        <HomePricingSection />
        <HomeFaqSection dictionary={dict} />
        <HomeCtaBanner />
      </main>

      <HomeFooter locale={locale} dictionary={dict} />
    </>
  );
}
