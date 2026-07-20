/**
 * Applique les modèles d'e-mail GoCheque dans Supabase (Management API).
 *
 * Prérequis :
 * 1) Token d'accès : https://supabase.com/dashboard/account/tokens
 * 2) Dans .env : SUPABASE_ACCESS_TOKEN=...
 * 3) NEXT_PUBLIC_SUPABASE_URL déjà configuré
 *
 * Usage : npm run email:supabase
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const envPath = resolve(root, ".env");
const templatesDir = resolve(root, "supabase/templates");
const subjectsPath = resolve(root, "supabase/email-subjects.json");

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

function buildRedirectAllowList(siteUrl) {
  const base = siteUrl.replace(/\/$/, "");
  const local = "http://localhost:3000";
  const urls = new Set([
    `${base}/auth/callback`,
    `${base}/fr/auth/callback`,
    `${base}/en/auth/callback`,
    `${local}/auth/callback`,
    `${local}/fr/auth/callback`,
    `${local}/en/auth/callback`,
  ]);
  return Array.from(urls).join(",");
}

async function main() {
  const env = loadEnv();
  const accessToken = env.SUPABASE_ACCESS_TOKEN?.trim();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim();

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
    console.log("Copiez le contenu de supabase/templates/confirmation.html");
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
    mailer_subjects_confirmation: subjects.confirmation,
    mailer_templates_confirmation_content: readTemplate("confirmation"),
    mailer_subjects_recovery: subjects.recovery,
    mailer_templates_recovery_content: readTemplate("recovery"),
  };

  console.log(`→ Mise à jour des e-mails GoCheque sur le projet ${projectRef}...`);

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
  if (!res.ok) {
    console.error(`❌ Échec (${res.status})`);
    console.error(body);

    if (body.includes("free tier") || body.includes("custom SMTP")) {
      console.log("");
      console.log("Supabase (plan gratuit + e-mail par défaut) n'autorise pas les modèles custom.");
      console.log("");
      console.log("Solution — configurer un SMTP (ex. Resend, gratuit pour démarrer) :");
      console.log("  1. https://resend.com → créer un compte + clé API");
      console.log("  2. Supabase Dashboard → Authentication → SMTP Settings");
      console.log("     Host: smtp.resend.com  Port: 465  User: resend");
      console.log("     Password: votre clé re_...");
      console.log("     Sender: onboarding@resend.dev (test) ou noreply@votre-domaine.com");
      console.log("  3. Relancer : npm run email:supabase");
      console.log("");
      console.log(
        "Alternative : coller manuellement supabase/templates/confirmation.html",
      );
      console.log("  dans Authentication → Email Templates (après SMTP activé).");
    }

    process.exit(1);
  }

  console.log("✅ Modèles d'inscription et de réinitialisation appliqués.");
  console.log("");
  console.log("Vérifiez aussi dans Supabase Dashboard > Authentication > URL Configuration :");
  console.log(`  Site URL : ${payload.site_url}`);
  console.log("  Redirect URLs : inclure /auth/callback");
  console.log("");
  console.log(
    "Optionnel — expéditeur personnalisé : Authentication > SMTP Settings (ex. Resend)",
  );
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});
