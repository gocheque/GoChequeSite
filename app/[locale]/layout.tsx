import { notFound } from "next/navigation";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { ClientProviders } from "@/components/providers/client-providers";
import { getAuthUser } from "@/lib/auth/get-user";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);
  const user = await getAuthUser();

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <ClientProviders initialUser={user}>{children}</ClientProviders>
    </LocaleProvider>
  );
}
