"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";

export function HomeFaqSection() {
  const { t, dictionary } = useLocale();
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <section id={dictionary.anchors.faq} className="bg-transparent py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#ff6633]">
            {t("faq.label")}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            {t("faq.title")}
          </h2>
          <p className="mt-3 text-base text-slate-500">{t("faq.subtitle")}</p>
        </div>

        <ul className="mt-10 space-y-3">
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
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border bg-white px-5 py-4 text-left shadow-sm transition hover:border-[#ff6633]/25 hover:shadow-md ${
                    isOpen
                      ? "border-[#ff6633]/40 ring-2 ring-[#ff6633]/10"
                      : "border-slate-200/80"
                  }`}
                >
                  <span className="text-sm font-semibold text-slate-900 sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#ff6633] transition-transform duration-200 ${
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
                    <p className="px-5 pb-4 pt-1 text-sm leading-relaxed text-slate-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
