"use client";

import { useState } from "react";
import type { ChequeData } from "@/lib/cheque/cpa-format";
import {
  CPA_CHEQUE_SERIAL_MAX_DIGITS,
  sanitizeChequeNumberInput,
} from "@/lib/cheque/cpa-format";
import { CHEQUE_FIELD_AUTOCOMPLETE } from "@/lib/cheque/cheque-form-autofill";
import { useLocale } from "@/components/providers/locale-provider";
import { AccountNumberEditorModal } from "@/components/cheque/account-number-editor-modal";
import { LayoutGrid, Eraser } from "lucide-react";

type ChequeEditorBarProps = {
  data: ChequeData;
  onChange: <K extends keyof ChequeData>(key: K, value: ChequeData[K]) => void;
  onClear?: () => void;
  layout?: "default" | "split";
};

export function ChequeEditorBar({
  data,
  onChange,
  onClear,
  layout = "default",
}: ChequeEditorBarProps) {
  const { t } = useLocale();
  const [accountEditorOpen, setAccountEditorOpen] = useState(false);
  const isSplit = layout === "split";

  const inputClass = isSplit
    ? "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#ff6633] focus:outline-none focus:ring-2 focus:ring-[#ff6633]/20"
    : "h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#ff6633] focus:outline-none focus:ring-1 focus:ring-[#ff6633]/30";

  const textareaClass = isSplit
    ? "min-h-[4.5rem] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-[#ff6633] focus:outline-none focus:ring-2 focus:ring-[#ff6633]/20"
    : "min-h-[2.75rem] w-full resize-none rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs leading-snug text-slate-800 placeholder:text-slate-400 focus:border-[#ff6633] focus:outline-none focus:ring-1 focus:ring-[#ff6633]/30";

  const labelClass = isSplit
    ? "mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500"
    : "mb-0.5 block text-[9px] font-semibold uppercase tracking-wide text-slate-400";

  const gridClass = isSplit
    ? "grid grid-cols-1 gap-3"
    : "grid grid-cols-2 gap-2 sm:grid-cols-12";

  const accountButtonClass = isSplit
    ? "inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-[#ff6633]/40 hover:bg-orange-50 hover:text-[#ff6633]"
    : "inline-flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition hover:border-[#ff6633]/40 hover:bg-orange-50 hover:text-[#ff6633]";

  function renderAccountField(buttonId: string) {
    return (
      <div>
        <span className={labelClass}>{t("editor.fields.account")}</span>
        <button
          id={buttonId}
          type="button"
          onClick={() => setAccountEditorOpen(true)}
          className={`${accountButtonClass} ${isSplit ? "h-10" : "h-8"}`}
          aria-label={t("editor.account.editButton")}
        >
          <LayoutGrid className={isSplit ? "h-3.5 w-3.5" : "h-3 w-3"} aria-hidden />
          {t("editor.account.editButton")}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-xl border border-slate-200 bg-white shadow-sm ${
        isSplit ? "p-4 sm:p-5" : "p-3"
      }`}
    >
      <div
        className={`flex items-center justify-between gap-3 ${
          isSplit ? "mb-4" : "mb-2"
        }`}
      >
        <p
          className={`font-semibold text-slate-500 ${
            isSplit ? "text-sm" : "text-[11px]"
          }`}
        >
          {t("editor.formTitle")}
        </p>
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label={t("editor.clearAriaLabel")}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 ${
              isSplit
                ? "px-3 py-1.5 text-xs"
                : "px-2.5 py-1 text-[10px]"
            }`}
          >
            <Eraser
              className={isSplit ? "h-3.5 w-3.5" : "h-3 w-3"}
              aria-hidden
            />
            {t("editor.clear")}
          </button>
        ) : null}
      </div>
      <div className={gridClass}>
        <div className={isSplit ? undefined : "col-span-2 sm:col-span-12"}>
          <label className={labelClass} htmlFor="cheque-emitter-name">
            {t("editor.fields.emitter")}
          </label>
          <input
            id="cheque-emitter-name"
            name="emitterName"
            autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.emitterName}
            className={inputClass}
            value={data.emitterName}
            onChange={(e) => onChange("emitterName", e.target.value)}
          />
        </div>

        <div className={isSplit ? undefined : "col-span-2 sm:col-span-12"}>
          <label className={labelClass} htmlFor="cheque-emitter-addr">
            {t("editor.fields.emitterAddr")}
          </label>
          <textarea
            id="cheque-emitter-addr"
            name="emitterAddr"
            autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.emitterAddr}
            rows={isSplit ? 3 : 2}
            className={textareaClass}
            value={data.emitterAddr}
            onChange={(e) => onChange("emitterAddr", e.target.value)}
          />
        </div>

        {!isSplit && (
          <>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="cheque-chq-num">
                {t("editor.fields.chqNum")}
              </label>
              <input
                id="cheque-chq-num"
                name="chqNum"
                autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.chqNum}
                className={inputClass}
                maxLength={CPA_CHEQUE_SERIAL_MAX_DIGITS}
                inputMode="numeric"
                value={data.chqNum}
                onChange={(e) =>
                  onChange("chqNum", sanitizeChequeNumberInput(e.target.value))
                }
              />
            </div>
            <div className="sm:col-span-4">
              <label className={labelClass} htmlFor="cheque-date">
                {t("editor.fields.date")}
              </label>
              <input
                id="cheque-date"
                name="date"
                type="date"
                autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.date}
                suppressHydrationWarning
                className={`cheque-date-input ${inputClass}`}
                value={data.date}
                onChange={(e) => onChange("date", e.target.value)}
              />
            </div>
          </>
        )}

        {isSplit && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="cheque-chq-num">
                {t("editor.fields.chqNum")}
              </label>
              <input
                id="cheque-chq-num"
                name="chqNum"
                autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.chqNum}
                className={inputClass}
                maxLength={CPA_CHEQUE_SERIAL_MAX_DIGITS}
                inputMode="numeric"
                value={data.chqNum}
                onChange={(e) =>
                  onChange("chqNum", sanitizeChequeNumberInput(e.target.value))
                }
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="cheque-date">
                {t("editor.fields.date")}
              </label>
              <input
                id="cheque-date"
                name="date"
                type="date"
                autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.date}
                suppressHydrationWarning
                className={`cheque-date-input ${inputClass}`}
                value={data.date}
                onChange={(e) => onChange("date", e.target.value)}
              />
            </div>
          </div>
        )}

        <div className={isSplit ? undefined : "col-span-2 sm:col-span-12"}>
          <label className={labelClass} htmlFor="cheque-payee">
            {t("editor.fields.payee")}
          </label>
          <input
            id="cheque-payee"
            name="payee"
            autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.payee}
            className={inputClass}
            value={data.payee}
            onChange={(e) => onChange("payee", e.target.value)}
          />
        </div>

        <div className={isSplit ? undefined : "col-span-2 sm:col-span-6"}>
          <label className={labelClass} htmlFor="cheque-bank-name">
            {t("editor.fields.bankName")}
          </label>
          <input
            id="cheque-bank-name"
            name="bankName"
            autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.bankName}
            className={inputClass}
            value={data.bankName}
            onChange={(e) => onChange("bankName", e.target.value)}
          />
        </div>

        <div className={isSplit ? undefined : "col-span-2 sm:col-span-6"}>
          <label className={labelClass} htmlFor="cheque-bank-addr">
            {t("editor.fields.bankAddr")}
          </label>
          <textarea
            id="cheque-bank-addr"
            name="bankAddr"
            autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.bankAddr}
            rows={isSplit ? 3 : 2}
            className={textareaClass}
            value={data.bankAddr}
            onChange={(e) => onChange("bankAddr", e.target.value)}
          />
        </div>

        {isSplit ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="cheque-amount">
                {t("editor.fields.amount")}
              </label>
              <input
                id="cheque-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.amount}
                className={inputClass}
                value={data.amount === 0 ? "" : data.amount}
                onChange={(e) =>
                  onChange("amount", parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="cheque-transit">
                {t("editor.fields.transit")}
              </label>
              <input
                id="cheque-transit"
                name="transit"
                autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.transit}
                className={inputClass}
                maxLength={5}
                inputMode="numeric"
                value={data.transit}
                onChange={(e) => onChange("transit", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="cheque-inst">
                {t("editor.fields.inst")}
              </label>
              <input
                id="cheque-inst"
                name="inst"
                autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.inst}
                className={inputClass}
                maxLength={3}
                inputMode="numeric"
                value={data.inst}
                onChange={(e) => onChange("inst", e.target.value)}
              />
            </div>
            <div>{renderAccountField("cheque-account-edit")}</div>
          </div>
        ) : (
          <>
            <div className="sm:col-span-3">
              <label className={labelClass} htmlFor="cheque-amount">
                {t("editor.fields.amount")}
              </label>
              <input
                id="cheque-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.amount}
                className={inputClass}
                value={data.amount === 0 ? "" : data.amount}
                onChange={(e) =>
                  onChange("amount", parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div className="sm:col-span-3">
              <label className={labelClass} htmlFor="cheque-transit">
                {t("editor.fields.transit")}
              </label>
              <input
                id="cheque-transit"
                name="transit"
                autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.transit}
                className={inputClass}
                maxLength={5}
                inputMode="numeric"
                value={data.transit}
                onChange={(e) => onChange("transit", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="cheque-inst">
                {t("editor.fields.inst")}
              </label>
              <input
                id="cheque-inst"
                name="inst"
                autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.inst}
                className={inputClass}
                maxLength={3}
                inputMode="numeric"
                value={data.inst}
                onChange={(e) => onChange("inst", e.target.value)}
              />
            </div>
            <div className="sm:col-span-4">{renderAccountField("cheque-account-edit")}</div>
          </>
        )}

        <div className={isSplit ? undefined : "col-span-2 sm:col-span-12"}>
          <label className={labelClass} htmlFor="cheque-memo">
            {t("editor.fields.memo")}
          </label>
          <input
            id="cheque-memo"
            name="memo"
            autoComplete={CHEQUE_FIELD_AUTOCOMPLETE.memo}
            className={inputClass}
            value={data.memo}
            onChange={(e) => onChange("memo", e.target.value)}
          />
        </div>
      </div>

      <AccountNumberEditorModal
        open={accountEditorOpen}
        account={data.account}
        accountMicrSlots={data.accountMicrSlots}
        onClose={() => setAccountEditorOpen(false)}
        onApply={(accountDigits, accountMicrSlots) => {
          onChange("account", accountDigits);
          onChange("accountMicrSlots", accountMicrSlots);
          setAccountEditorOpen(false);
        }}
      />
    </div>
  );
}
