/** ID du formulaire éditeur — utilisé pour l'autocomplétion navigateur (aucune donnée serveur). */
export const CHEQUE_EDITOR_FORM_ID = "cheque-editor-form";

/**
 * Déclenche une soumission native vers une iframe cachée afin que le navigateur
 * puisse proposer d'enregistrer adresse / coordonnées (Chrome, Edge, Safari…).
 * Comportement héuristique : non garanti, aucune donnée n'est envoyée à GoCheque.
 */
export function promptBrowserSaveChequeData(): void {
  if (typeof document === "undefined") return;

  const form = document.getElementById(CHEQUE_EDITOR_FORM_ID);
  if (!(form instanceof HTMLFormElement)) return;

  const iframe = document.createElement("iframe");
  iframe.name = "cheque-autofill-save-target";
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(iframe);

  const previousTarget = form.target;
  const previousAction = form.action;
  const previousMethod = form.method;

  form.target = iframe.name;
  form.action = "about:blank";
  form.method = "post";

  try {
    form.submit();
  } catch {
    // Certains navigateurs bloquent about:blank — sans impact sur l'impression.
  } finally {
    form.target = previousTarget;
    form.action = previousAction;
    form.method = previousMethod;
    window.setTimeout(() => iframe.remove(), 2000);
  }
}

/** Attributs name + autocomplete (HTML / paiements) pour l'autofill navigateur. */
export const CHEQUE_FIELD_AUTOCOMPLETE = {
  emitterName: "billing organization",
  emitterAddr: "billing street-address",
  chqNum: "off",
  date: "off",
  payee: "section-payee name",
  bankName: "section-bank organization",
  bankAddr: "section-bank street-address",
  amount: "transaction-amount",
  transit: "off",
  inst: "off",
  account: "off",
  memo: "off",
} as const;
