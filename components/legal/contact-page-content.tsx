import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { CONTACT_EMAIL } from "@/lib/site/contact";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

type ContactPageContentProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function ContactPageContent({
  locale,
  dictionary,
}: ContactPageContentProps) {
  const { contact } = dictionary;

  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent label={dictionary.nav.skipToContent} />
      <HomeNavbar />
      <main
        id="contenu"
        className="mx-auto w-full max-w-2xl flex-1 px-4 pb-20 pt-28 sm:px-6 sm:pt-32"
      >
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#ff6633]">
          {contact.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0b1f33] sm:text-4xl">
          {contact.title}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-[#3d4f63]">
          {contact.message}{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-semibold text-[#0b1f33] underline decoration-[#ff6633] underline-offset-4 hover:text-[#ff6633]"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>

        <div className="mt-12 space-y-10 border-t border-[#eeeae3] pt-10">
          <section>
            <h2 className="text-lg font-semibold text-[#0b1f33]">
              {contact.privacyTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5b6b7c]">
              {contact.privacyBody}
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[#0b1f33]">
              {contact.billingTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5b6b7c]">
              {contact.billingBody}
            </p>
          </section>
        </div>
      </main>
      <HomeFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
