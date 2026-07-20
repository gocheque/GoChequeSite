"use client";

import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";

export type LegalSection = {
  title: string;
  body: string;
};

type LegalDocumentPageProps = {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
};

export function LegalDocumentPage({
  title,
  lastUpdated,
  intro,
  sections,
}: LegalDocumentPageProps) {
  return (
    <>
      <HomeNavbar />
      <main className="mx-auto max-w-3xl px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:pb-16 lg:pt-36">
        <header className="border-b border-slate-100 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-slate-500">{lastUpdated}</p>
          {intro ? (
            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-600">
              {intro}
            </p>
          ) : null}
        </header>

        <div className="divide-y divide-slate-100">
          {sections.map((section) => (
            <section key={section.title} className="py-8 first:pt-8">
              <h2 className="text-lg font-semibold text-slate-900">
                {section.title}
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </main>
      <HomeFooter />
    </>
  );
}
