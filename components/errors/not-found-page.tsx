import type { Metadata } from "next";
import { NotFoundContent } from "@/components/errors/not-found-content";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getNotFoundLocale } from "@/lib/i18n/get-not-found-locale";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateNotFoundMetadata(): Promise<Metadata> {
  const locale = await getNotFoundLocale();
  const dict = getDictionary(locale);

  return buildPageMetadata({
    title: dict.notFound.metaTitle,
    description: dict.notFound.metaDescription,
    path: `/${locale}`,
    locale,
    noIndex: true,
  });
}

export async function NotFoundPage() {
  const locale = await getNotFoundLocale();
  const dict = getDictionary(locale);

  return <NotFoundContent locale={locale} dict={dict} />;
}
