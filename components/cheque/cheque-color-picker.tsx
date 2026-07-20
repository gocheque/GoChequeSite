"use client";

import {
  CHEQUE_COLORS,
  type ChequeColorId,
} from "@/lib/cheque/cheque-colors";

type ChequeColorPickerProps = {
  value: ChequeColorId;
  onChange: (color: ChequeColorId) => void;
};

export function ChequeColorPicker({ value, onChange }: ChequeColorPickerProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2">
      <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
        Couleur
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CHEQUE_COLORS.map((color) => {
          const isSelected = value === color.id;

          return (
            <button
              key={color.id}
              type="button"
              aria-label={color.label}
              aria-pressed={isSelected}
              onClick={() => onChange(color.id)}
              className={`h-7 w-7 rounded-full transition-all duration-200 hover:scale-110 ${
                isSelected
                  ? "scale-110 ring-2 ring-slate-400 ring-offset-1"
                  : "ring-1 ring-black/10"
              }`}
              style={{ backgroundColor: color.swatch }}
            />
          );
        })}
      </div>
    </div>
  );
}
