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

const inputClass =
  "h-11 w-full rounded-md border border-[#e7e4de] bg-white px-3 text-sm text-[#0b1f33] placeholder:text-[#8a8074] focus:border-[#0b1f33] focus:outline-none focus:ring-2 focus:ring-[#0b1f33]/10";

const textareaClass =
  "min-h-[4.5rem] w-full resize-y rounded-md border border-[#e7e4de] bg-white px-3 py-2.5 text-sm leading-relaxed text-[#0b1f33] placeholder:text-[#8a8074] focus:border-[#0b1f33] focus:outline-none focus:ring-2 focus:ring-[#0b1f33]/10";

const labelClass = "mb-1.5 block text-xs font-medium text-[#5c6b7a]";

export function ChequeEditorBar({
  data,
  onChange,
  onClear,
  layout = "default",
}: ChequeEditorBarProps) {
  const { t } = useLocale();
  const [accountEditorOpen, setAccountEditorOpen] = useState(false);
  const isSplit = layout === "split";

  const gridClass = isSplit
    ? "grid grid-cols-1 gap-4"
    : "grid grid-cols-2 gap-3 sm:grid-cols-12 sm:gap-4";

  const accountButtonClass =
    "inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#e7e4de] bg-white px-3 text-sm font-medium text-[#0b1f33] transition hover:border-[#0b1f33]/30 hover:bg-[#0b1f33]/[0.03]";

  function renderAccountField(buttonId: string) {
    return (
      <div>
        <span className={labelClass}>{t("editor.fields.account")}</span>
        <button
          id={buttonId}
          type="button"
          onClick={() => setAccountEditorOpen(true)}
          className={accountButtonClass}
          aria-label={t("editor.account.editButton")}
        >
          <LayoutGrid className="h-4 w-4" aria-hidden />
          {t("editor.account.editButton")}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-md border border-[#e7e4de] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#0b1f33]">
          {t("editor.formTitle")}
        </p>
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label={t("editor.clearAriaLabel")}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#e7e4de] bg-white px-3 py-1.5 text-xs font-medium text-[#5c6b7a] transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <Eraser className="h-3.5 w-3.5" aria-hidden />
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
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
            <div className="sm:col-span-4">
              {renderAccountField("cheque-account-edit")}
            </div>
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
