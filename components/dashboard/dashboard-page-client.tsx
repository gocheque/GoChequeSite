"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChequeData } from "@/lib/cheque/cpa-format";
import { getDefaultCheque, getEmptyCheque } from "@/lib/cheque/default-cheque";
import { ChequeEditorSection } from "@/components/cheque/cheque-editor-section";
import { useLocale } from "@/components/providers/locale-provider";

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

export function DashboardPageClient() {
  const { t, locale } = useLocale();
  const [cheque, setCheque] = useState<ChequeData>(() => getDefaultCheque(locale));

  useEffect(() => {
    setCheque((prev) => ({
      ...prev,
      date: prev.date || todayIsoDate(),
    }));
  }, []);

  const updateField = useCallback(
    <K extends keyof ChequeData>(key: K, value: ChequeData[K]) => {
      setCheque((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleClear = useCallback(() => {
    setCheque({
      ...getEmptyCheque(),
      date: todayIsoDate(),
    });
  }, []);

  return (
    <section aria-label={t("editor.sectionLabel")} className="w-full">
      <header className="mb-8 max-w-2xl sm:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8074]">
          {t("dashboard.label")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0b1f33] sm:text-4xl">
          {t("dashboard.editorTitle")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#5c6b7a]">
          {t("dashboard.editorSubtitle")}
        </p>
      </header>
      <ChequeEditorSection
        cheque={cheque}
        onFieldChange={updateField}
        onClear={handleClear}
        variant="split"
      />
    </section>
  );
}
