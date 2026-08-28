import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeNavbar } from "@/components/home/home-navbar";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

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
    title: dict.auth.resetTitle,
    description: dict.auth.resetSubtitle,
    path: `/${locale}/auth/reset-password`,
    locale,
    noIndex: true,
  });
}

export default async function ResetPasswordPage({
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
      <SkipToContent label={dict.nav.skipToContent} />
      <HomeNavbar />
      <main id="contenu" className="marketing-shell bg-[#fbfaf7] px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto w-full max-w-md rounded-lg border border-[#eeeae3] bg-white px-6 py-8 shadow-[0_18px_50px_-28px_rgba(11,31,51,0.25)]">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0b1f33]">
            {dict.auth.resetTitle}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5b6b7c]">
            {dict.auth.resetSubtitle}
          </p>
          <div className="mt-8">
            <ResetPasswordForm />
          </div>
        </div>
      </main>
      <HomeFooter locale={locale} dictionary={dict} />
    </>
  );
}
