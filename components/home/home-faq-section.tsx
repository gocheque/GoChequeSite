"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

type HomeFaqSectionProps = {
  dictionary: Dictionary;
};

export function HomeFaqSection({ dictionary }: HomeFaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <section id={dictionary.anchors.faq} className="border-t border-[#eeeae3] bg-[#fbfaf7] py-24 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#ff6633]">
            {dictionary.faq.label}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0b1f33] sm:text-4xl">
            {dictionary.faq.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5b6b7c]">{dictionary.faq.subtitle}</p>
        </div>

        <ul className="mt-14 divide-y divide-[#e7e4de] border-y border-[#e7e4de]">
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
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-sm font-medium text-[#0b1f33] sm:text-base">
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
                    <p className="pb-5 pr-8 text-sm leading-relaxed text-[#5b6b7c]">
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
