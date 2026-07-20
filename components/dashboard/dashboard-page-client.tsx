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
      <ChequeEditorSection
        cheque={cheque}
        onFieldChange={updateField}
        onClear={handleClear}
        variant="split"
      />
    </section>
  );
}
