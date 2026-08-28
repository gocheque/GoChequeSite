import {
  EMAIL_CREAM,
  EMAIL_LINE,
  EMAIL_MUTED,
  EMAIL_NAVY,
  EMAIL_ORANGE,
} from "@/lib/email/brand";
import type { Locale } from "@/lib/i18n/config";

export type BrandedEmailContent = {
  locale: Locale;
  preheader: string;
  heading: string;
  paragraphs: string[];
  cta?: { href: string; label: string };
  footer: string;
  ignore?: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderBrandedEmail(content: BrandedEmailContent): string {
  const lang = content.locale === "en" ? "en" : "fr";
  const paragraphs = content.paragraphs
    .map(
      (text) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${EMAIL_MUTED};">${escapeHtml(text)}</p>`,
    )
    .join("");

  const cta = content.cta
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:8px 0 24px;">
                <tr>
                  <td style="border-radius:8px;background:${EMAIL_NAVY};">
                    <a href="${escapeHtml(content.cta.href)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 26px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                      ${escapeHtml(content.cta.label)}
                    </a>
                  </td>
                </tr>
              </table>`
    : "";

  const ignore = content.ignore
    ? `<p style="margin:0;font-size:12px;line-height:1.6;color:#8a8073;">${escapeHtml(content.ignore)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(content.heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:${EMAIL_CREAM};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${EMAIL_NAVY};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(content.preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${EMAIL_CREAM};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid ${EMAIL_LINE};border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 20px;background:${EMAIL_NAVY};">
              <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:-0.03em;color:#ffffff;">GoCheque</p>
              <p style="margin:8px 0 0;font-size:13px;color:#d7cfc4;">${lang === "en" ? "Canadian bank cheques, ready to print" : "Chèques bancaires canadiens, prêts à imprimer"}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${EMAIL_ORANGE};">GoCheque</p>
              <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${EMAIL_NAVY};">${escapeHtml(content.heading)}</h1>
              ${paragraphs}
              ${cta}
              ${ignore}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:${EMAIL_CREAM};border-top:1px solid ${EMAIL_LINE};">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#8a8073;text-align:center;">
                ${escapeHtml(content.footer)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
