"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Mail } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

type HomeFaqSectionProps = {
  dictionary?: Dictionary;
};

export function HomeFaqSection({ dictionary: propDict }: HomeFaqSectionProps = {}) {
  const { t, dictionary: ctxDict, path } = useLocale();
  const dictionary = propDict ?? ctxDict;
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <section id={dictionary.anchors.faq} className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/70 px-3.5 py-1 text-xs font-semibold text-[#ff6633]">
            {t("faq.label")}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {t("faq.title")}
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">{t("faq.subtitle")}</p>
        </div>

        <ul className="mt-12 space-y-3">
          {dictionary.faq.items.map((item) => {
            const isOpen = openId === item.id;

            return (
              <li key={item.id}>
                <button
                  id={`faq-question-${item.id}`}
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border bg-white px-6 py-4 text-left shadow-2xs transition-all ${
                    isOpen
                      ? "border-[#ff6633]/50 ring-2 ring-[#ff6633]/10"
                      : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <span className="text-sm font-bold text-slate-900 sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#8a8073] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>

                <div
                  id={`faq-answer-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-question-${item.id}`}
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 pt-2 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Support Callout */}
        <div className="mt-12 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 text-center sm:p-8">
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
            {dictionary.faq.needHelp}
          </h3>
          <div className="mt-4">
            <Link
              href={path("/contact")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-800 shadow-2xs transition hover:border-[#ff6633]/40 hover:text-[#ff6633] sm:text-sm"
            >
              <Mail className="h-4 w-4 text-[#ff6633]" />
              <span>{dictionary.faq.contactSupport}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
