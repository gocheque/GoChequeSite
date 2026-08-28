# Transactional emails

GoCheque sends two families of mail:

1. **Auth** (Supabase Auth templates) — confirm signup, reset password, magic link, invite, email change, reauthentication.
2. **App** (Resend) — welcome, purchase receipt, payment failed, password-changed notice.

Do not commit tokens, SMTP passwords, or `RESEND_API_KEY`.

## Brand and locale

HTML follows the marketing system: navy `#0b1f33`, orange `#ff6633`, cream `#fbfaf7`.

Auth templates live in `supabase/templates/`. They pick French or English with Go template syntax:

```
{{ if eq .Data.locale "en" }} … {{ else }} … {{ end }}
```

`locale` is stored on the user at signup / OAuth callback (`user_metadata.locale`). Missing locale defaults to French.

App emails use the same look via `lib/email/render.ts` and the locale on the user or Stripe checkout session.

## Auth templates — apply with the script

```bash
# .env
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SITE_URL="https://gocheque.ca"
SUPABASE_ACCESS_TOKEN="sbp_…"   # https://supabase.com/dashboard/account/tokens

npm run email:supabase
```

The script (`scripts/apply-supabase-email-templates.mjs`) PATCHes the Supabase Management API (`/v1/projects/{ref}/config/auth`) with:

| Template file | Auth type | Used in this app |
| --- | --- | --- |
| `confirmation.html` | Signup / email verify | Yes (`signUp`) |
| `recovery.html` | Forgot / reset password | Yes (auth modal) |
| `magic_link.html` | Magic link | Not used in UI (template still applied) |
| `invite.html` | Invite user | Not used in UI (template still applied) |
| `email_change.html` | Email changed | Yes (account settings) |
| `reauthentication.html` | Sensitive-action OTP | Applied for Auth completeness |
| `password_changed.html` | Dashboard paste only | App also sends this via Resend |

It also sets:

- **Site URL** from `NEXT_PUBLIC_SITE_URL` (production: `https://gocheque.ca`)
- **Redirect allow list**: `/auth/callback` on `gocheque.ca`, `www.gocheque.ca`, `gocheque.com`, `www`, and `http://localhost:3000`, including `/fr` and `/en` prefixes
- Secure email change (`mailer_secure_email_change_enabled`)

Custom HTML on the Supabase free plan requires **custom SMTP**. Resend works:

1. Create a Resend account, verify `gocheque.ca`, copy the API key.
2. Supabase Dashboard → Authentication → SMTP Settings  
   Host `smtp.resend.com`, port `465`, user `resend`, password `re_…`, sender `noreply@gocheque.ca`.
3. Run `npm run email:supabase` again.

### Dashboard fallback (if the API cannot write templates)

Authentication → Email Templates. For each type, paste the matching file from `supabase/templates/` and the subject from `supabase/email-subjects.json`.

`password_changed.html` is not always exposed on the Management API. Paste it under Authentication → Email Templates / security notifications if that panel exists. The app still sends a branded notice through Resend after a successful password change.

Local Auth (`supabase start`) reads the `[auth.email.template.*]` entries in `supabase/config.toml`.

## App emails — Resend

```bash
RESEND_API_KEY="re_…"
EMAIL_FROM="GoCheque <noreply@gocheque.ca>"
NEXT_PUBLIC_SITE_URL="https://gocheque.ca"
```

| Email | When | Code |
| --- | --- | --- |
| Welcome | First confirmed session (email verify or Google) | `lib/email/lifecycle.ts`, `/api/email/welcome` |
| Purchase receipt | Stripe checkout fulfilled | `fulfillStripeCheckoutSession` |
| Payment failed | `checkout.session.async_payment_failed` | Stripe webhook |
| Password changed | Account or reset-password success | `/api/email/password-changed` |

If `RESEND_API_KEY` is missing, app emails are skipped (logged) and checkout still fulfills. Stripe invoice emails may still go out because checkout uses `invoice_creation`.

Webhook events to enable besides `checkout.session.completed`:

- `checkout.session.async_payment_failed`

## Redirect URLs (Auth)

Production Site URL: `https://gocheque.ca`

Allow:

- `https://gocheque.ca/auth/callback`
- `https://gocheque.ca/fr/auth/callback`
- `https://gocheque.ca/en/auth/callback`
- the `www` and `gocheque.com` equivalents
- `http://localhost:3000/auth/callback` (and `/fr`, `/en`) for local

Signup, recovery, and email-change links use `/auth/callback?next=/fr/…` (or `/en/…`). Recovery `next` is `/[locale]/auth/reset-password`.
