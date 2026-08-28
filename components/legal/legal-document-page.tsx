import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

export type LegalSection = {
  title: string;
  body: string;
};

type LegalDocumentPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
};

export function LegalDocumentPage({
  locale,
  dictionary,
  title,
  lastUpdated,
  intro,
  sections,
}: LegalDocumentPageProps) {
  return (
    <>
      <HomeNavbar />
      <main className="mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:pb-24">
        <header className="border-b border-[#eeeae3] pb-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8a8073]">
            GoCheque
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0b1f33] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-[#8a8073]">{lastUpdated}</p>
          {intro ? (
            <p className="mt-6 whitespace-pre-line text-base leading-[1.7] text-[#3d4f63]">
              {intro}
            </p>
          ) : null}
        </header>

        <div className="divide-y divide-[#eeeae3]">
          {sections.map((section) => (
            <section key={section.title} className="py-10 first:pt-10">
              <h2 className="text-lg font-semibold tracking-tight text-[#0b1f33]">
                {section.title}
              </h2>
              <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-[1.75] text-[#3d4f63]">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </main>
      <HomeFooter locale={locale} dictionary={dictionary} />
    </>
  );
}
