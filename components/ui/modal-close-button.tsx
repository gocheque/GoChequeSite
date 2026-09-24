"use client";

import { X } from "lucide-react";

type ModalCloseButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  label?: string;
};

export function ModalCloseButton({
  onClick,
  disabled = false,
  className = "absolute right-4 top-4",
  label = "Fermer",
}: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`group z-20 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50/90 text-slate-500 shadow-sm backdrop-blur-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <X
        className="h-4 w-4 transition group-hover:scale-105"
        strokeWidth={2.25}
        aria-hidden
      />
    </button>
  );
}
