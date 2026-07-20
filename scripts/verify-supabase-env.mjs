/**
 * Vérifie que le fichier .env est correctement configuré pour Supabase.
 * Usage : npm run env:check
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env");

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error("❌ Fichier .env introuvable.");
    console.log("   copy .env.example .env");
    process.exit(1);
  }

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

function check(name, value, rules) {
  const issues = [];
  if (!value) {
    issues.push("vide ou manquant");
  } else {
    for (const rule of rules) {
      const err = rule(value);
      if (err) issues.push(err);
    }
  }
  if (issues.length === 0) {
    console.log(`✅ ${name}`);
    return true;
  }
  console.log(`❌ ${name} — ${issues.join(", ")}`);
  return false;
}

const env = loadEnv();
let ok = true;

console.log("\n🔍 Vérification Supabase pour eCheck.ca\n");

ok &&= check("NEXT_PUBLIC_SUPABASE_URL", env.NEXT_PUBLIC_SUPABASE_URL, [
  (v) =>
    v.startsWith("sb_")
      ? "c'est une clé API, pas l'URL — utilisez Project URL (https://xxx.supabase.co)"
      : null,
  (v) => (!v.startsWith("https://") ? "doit commencer par https://" : null),
  (v) => (!v.includes(".supabase.co") ? "doit contenir .supabase.co" : null),
]);

ok &&= check("NEXT_PUBLIC_SUPABASE_ANON_KEY", env.NEXT_PUBLIC_SUPABASE_ANON_KEY, [
  (v) => (v.startsWith("sb_") ? "utilisez la clé anon JWT (eyJ...), pas sb_publishable" : null),
  (v) => (v.length < 100 ? "clé anon trop courte" : null),
  (v) => (!v.startsWith("eyJ") ? "doit commencer par eyJ..." : null),
]);

ok &&= check("SUPABASE_SERVICE_ROLE_KEY", env.SUPABASE_SERVICE_ROLE_KEY, [
  (v) =>
    v.length < 30
      ? "clé service_role trop courte"
      : !v.startsWith("eyJ") && !v.startsWith("sb_secret_")
        ? "doit commencer par eyJ... (legacy) ou sb_secret_... (nouveau format)"
        : null,
]);

console.log("");

if (ok) {
  console.log("✅ Configuration OK ! Prochaines étapes :\n");
  console.log("   1. Supabase Dashboard > SQL Editor");
  console.log("      Copier/coller : supabase/migrations/001_initial.sql\n");
  console.log("   2. Authentication > URL Configuration");
  console.log("      Site URL      : http://localhost:3000");
  console.log("      Redirect URLs : http://localhost:3000/auth/callback\n");
  console.log("   3. npm run dev\n");
} else {
  console.log("⚠️  Corrigez le .env\n");
  console.log("   API keys → https://supabase.com/dashboard/project/_/settings/api\n");
  process.exit(1);
}
