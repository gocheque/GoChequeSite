"use client";

import { Check, X } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { getPasswordStrength } from "@/lib/auth/password-strength";

type PasswordStrengthCheckerProps = {
  password: string;
};

const RULE_IDS = ["length", "upper", "lower", "digit", "special"] as const;

export function PasswordStrengthChecker({ password }: PasswordStrengthCheckerProps) {
  const { t } = useLocale();
  const { results, score, isStrong } = getPasswordStrength(password);

  if (!password) return null;

  const barColor = isStrong
    ? "bg-green-500"
    : score >= 60
      ? "bg-amber-500"
      : "bg-red-400";

  const strengthLabel = isStrong
    ? t("auth.passwordStrong")
    : score >= 60
      ? t("auth.passwordMedium")
      : t("auth.passwordWeak");

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-600">
          {t("auth.passwordStrengthLabel")}
        </p>
        <span
          className={`text-xs font-semibold ${
            isStrong ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-500"
          }`}
        >
          {strengthLabel}
        </span>
      </div>

      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>

      <ul className="space-y-1">
        {results.map((rule) => (
          <li
            key={rule.id}
            className={`flex items-center gap-2 text-xs ${
              rule.passed ? "text-green-700" : "text-slate-500"
            }`}
          >
            {rule.passed ? (
              <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
            ) : (
              <X className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            )}
            {RULE_IDS.includes(rule.id as (typeof RULE_IDS)[number])
              ? t(`auth.passwordRules.${rule.id}`)
              : rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
