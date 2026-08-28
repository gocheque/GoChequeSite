/**
 * Applique les modèles d'e-mail GoCheque dans Supabase (Management API).
 *
 * Prérequis :
 * 1) Token d'accès : https://supabase.com/dashboard/account/tokens
 * 2) Dans .env : SUPABASE_ACCESS_TOKEN=...
 * 3) NEXT_PUBLIC_SUPABASE_URL déjà configuré
 * 4) SMTP custom (Resend, etc.) — requis sur le plan gratuit pour les templates HTML
 *
 * Usage : npm run email:supabase
 *
 * Détail : supabase/EMAILS.md
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const envPath = resolve(root, ".env");
const templatesDir = resolve(root, "supabase/templates");
const subjectsPath = resolve(root, "supabase/email-subjects.json");

const PRODUCTION_ORIGINS = [
  "https://gocheque.ca",
  "https://www.gocheque.ca",
  "https://gocheque.com",
  "https://www.gocheque.com",
];

function loadEnv() {
  if (!existsSync(envPath)) return {};

  const vars = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

function readTemplate(name) {
  const path = resolve(templatesDir, `${name}.html`);
  if (!existsSync(path)) {
    throw new Error(`Modèle introuvable : ${path}`);
  }
  return readFileSync(path, "utf8");
}

function getProjectRef(supabaseUrl) {
  const match = supabaseUrl.match(/^https:\/\/([^.]+)\.supabase\.co\/?$/);
  if (!match) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL invalide (attendu https://xxxx.supabase.co)",
    );
  }
  return match[1];
}

function callbackPaths(origin) {
  const base = origin.replace(/\/$/, "");
  return [
    `${base}/auth/callback`,
    `${base}/fr/auth/callback`,
    `${base}/en/auth/callback`,
  ];
}

function buildRedirectAllowList(siteUrl) {
  const urls = new Set();
  for (const origin of [siteUrl, "http://localhost:3000", ...PRODUCTION_ORIGINS]) {
    for (const path of callbackPaths(origin)) {
      urls.add(path);
    }
  }
  return Array.from(urls).join(",");
}

function printSmtpHelp() {
  console.log("");
  console.log("Supabase (plan gratuit + e-mail par défaut) n'autorise pas les modèles custom.");
  console.log("");
  console.log("Solution — configurer un SMTP (ex. Resend) :");
  console.log("  1. https://resend.com → compte + clé API + domaine vérifié");
  console.log("  2. Supabase Dashboard → Authentication → SMTP Settings");
  console.log("     Host: smtp.resend.com  Port: 465  User: resend");
  console.log("     Password: votre clé re_...");
  console.log("     Sender: noreply@gocheque.ca (domaine vérifié)");
  console.log("  3. Relancer : npm run email:supabase");
  console.log("");
  console.log("Alternative manuelle : Dashboard → Authentication → Email Templates");
  console.log("  Coller le HTML de supabase/templates/*.html pour chaque type.");
}

async function patchAuthConfig(projectRef, accessToken, payload) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

async function main() {
  const env = loadEnv();
  const accessToken =
    env.SUPABASE_ACCESS_TOKEN?.trim() || process.env.SUPABASE_ACCESS_TOKEN?.trim();
  const supabaseUrl =
    env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const siteUrl = (
    env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://gocheque.ca"
  ).trim();

  if (!accessToken) {
    console.error("❌ SUPABASE_ACCESS_TOKEN manquant dans .env");
    console.log("");
    console.log("1. Créez un token : https://supabase.com/dashboard/account/tokens");
    console.log("2. Ajoutez dans .env : SUPABASE_ACCESS_TOKEN=sbp_...");
    console.log("3. Relancez : npm run email:supabase");
    console.log("");
    console.log(
      "Alternative manuelle : Dashboard Supabase > Authentication > Email Templates",
    );
    console.log("Copiez le HTML de supabase/templates/ (voir supabase/EMAILS.md)");
    process.exit(1);
  }

  if (!supabaseUrl) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL manquant dans .env");
    process.exit(1);
  }

  const subjects = JSON.parse(readFileSync(subjectsPath, "utf8"));
  const projectRef = getProjectRef(supabaseUrl);

  const payload = {
    site_url: siteUrl.replace(/\/$/, ""),
    uri_allow_list: buildRedirectAllowList(siteUrl),
    mailer_secure_email_change_enabled: true,
    mailer_subjects_confirmation: subjects.confirmation,
    mailer_templates_confirmation_content: readTemplate("confirmation"),
    mailer_subjects_recovery: subjects.recovery,
    mailer_templates_recovery_content: readTemplate("recovery"),
    mailer_subjects_magic_link: subjects.magic_link,
    mailer_templates_magic_link_content: readTemplate("magic_link"),
    mailer_subjects_invite: subjects.invite,
    mailer_templates_invite_content: readTemplate("invite"),
    mailer_subjects_email_change: subjects.email_change,
    mailer_templates_email_change_content: readTemplate("email_change"),
    mailer_subjects_reauthentication: subjects.reauthentication,
    mailer_templates_reauthentication_content: readTemplate("reauthentication"),
  };

  console.log(`→ Mise à jour des e-mails GoCheque sur le projet ${projectRef}...`);
  console.log(`  Site URL : ${payload.site_url}`);

  const result = await patchAuthConfig(projectRef, accessToken, payload);

  if (!result.ok) {
    console.error(`❌ Échec (${result.status})`);
    console.error(result.body);

    if (result.body.includes("free tier") || result.body.includes("custom SMTP")) {
      printSmtpHelp();
    }

    process.exit(1);
  }

  const notifyPayload = {
    mailer_notifications_password_changed_enabled: true,
  };
  const notify = await patchAuthConfig(projectRef, accessToken, notifyPayload);
  if (notify.ok) {
    console.log("✅ Notification « mot de passe modifié » activée côté Supabase Auth.");
  } else {
    console.log(
      "ℹ️  Notification mot de passe (API Auth) indisponible — GoCheque envoie déjà ce courriel via Resend après un changement réussi.",
    );
  }

  console.log("✅ Modèles Auth appliqués : confirmation, recovery, magic_link, invite, email_change, reauthentication.");
  console.log("");
  console.log("Vérifiez dans Supabase Dashboard > Authentication > URL Configuration :");
  console.log(`  Site URL : ${payload.site_url}`);
  console.log("  Redirect URLs : /auth/callback (et /fr /en), plus localhost en dev");
  console.log("");
  console.log("E-mails applicatifs (reçu, bienvenue, échec de paiement, mot de passe modifié) :");
  console.log("  RESEND_API_KEY=re_...   EMAIL_FROM=\"GoCheque <noreply@gocheque.ca>\"");
  console.log("  Voir supabase/EMAILS.md");
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});
