import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildHomeJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { HomePageClient } from "@/components/home/home-page-client";
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
      <HomePageClient />
    </>
  );
}
