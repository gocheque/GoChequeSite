"use client";

import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { CONTACT_EMAIL } from "@/lib/site/contact";

type ContactPageContentProps = {
  title: string;
  message: string;
};

export function ContactPageContent({ title, message }: ContactPageContentProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeNavbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:pb-16 lg:pt-36">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
            {message}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-[#ff6633] underline-offset-2 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
