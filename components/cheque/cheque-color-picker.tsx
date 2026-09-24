"use client";

import {
  CHEQUE_COLORS,
  type ChequeColorId,
} from "@/lib/cheque/cheque-colors";
import { useLocale } from "@/components/providers/locale-provider";

type ChequeColorPickerProps = {
  value: ChequeColorId;
  onChange: (color: ChequeColorId) => void;
};

export function ChequeColorPicker({ value, onChange }: ChequeColorPickerProps) {
  const { t } = useLocale();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-md border border-[#e7e4de] bg-white px-4 py-3 sm:justify-start">
      <span className="text-xs font-medium text-[#5c6b7a]">
        {t("editor.color.label")}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {CHEQUE_COLORS.map((color) => {
          const isSelected = value === color.id;

          return (
            <button
              key={color.id}
              type="button"
              aria-label={color.label}
              aria-pressed={isSelected}
              onClick={() => onChange(color.id)}
              className={`h-8 w-8 rounded-full transition ${
                isSelected
                  ? "ring-2 ring-[#0b1f33] ring-offset-2"
                  : "ring-1 ring-[#0b1f33]/15 hover:ring-[#0b1f33]/40"
              }`}
              style={{ backgroundColor: color.swatch }}
            />
          );
        })}
      </div>
    </div>
  );
}
