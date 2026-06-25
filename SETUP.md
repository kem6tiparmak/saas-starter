# SETUP — Von der Idee bis live

Dieser Leitfaden bringt dich Schritt für Schritt von einer validierten Idee zu
einem live deployten SaaS auf Basis dieses Templates. Arbeite die Phasen der
Reihe nach ab. Was du nicht brauchst (z. B. Stripe am Anfang), kannst du leer
lassen — die App läuft auch ohne.

---

## Phase 1 — Idee validieren

Bevor auch nur eine Zeile angefasst wird: drei Fragen ehrlich beantworten (gleiche
Kriterien wie im „Business Ideas"-Projekt).

1. **Wer zahlt?** Eine konkrete Gruppe, die *heute schon* Geld/Zeit/Personal in
   das Problem steckt. „Alle KMU" ist keine Zielgruppe. „Catering-Betriebe mit
   1–5 Mitarbeitern, die Anfragen per Mail bekommen" schon.
2. **Was ist das Problem?** In einem Satz, ohne „und außerdem". Wenn du drei Sätze
   brauchst, ist der Scope noch zu groß.
3. **MVP-Scope:** Die kleinste Version, die *einen* Schmerz löst. Schreib auf, was
   bewusst NICHT drin ist. Faustregel: in ~1 Woche baubar.

Erst wenn alle drei klar sind, weiter zu Phase 2.

---

## Phase 2 — Accounts & Schlüssel anlegen

Reihenfolge ist bewusst gewählt: Datenbank zuerst (ohne sie startet nichts),
Stripe/Sentry später (optional am Anfang). Alle Schlüssel kommen am Ende in die
`.env` (lokal) bzw. in die Vercel-Projekt-Settings (live). Vorlage: `.env.example`.

| # | Dienst | Wofür | Was du holst | Wohin (ENV) |
|---|--------|-------|--------------|-------------|
| 1 | **Datenbank** (Supabase oder Neon) | Postgres | Pooled + Direct Connection String | `DATABASE_URL`, `DIRECT_DATABASE_URL` |
| 2 | **Auth-Secret** | Sessions signieren | `npx auth secret` (lokal generieren) | `AUTH_SECRET` |
| 3 | **Anthropic** | Claude-API | API-Key — **vorher Spend-Limit in der Console setzen!** | `ANTHROPIC_API_KEY` |
| 4 | **E-Mail** (Gmail App-Passwort, später Resend) | Mailversand | Gmail-Adresse + App-Passwort (2FA nötig) | `GMAIL_USER`, `GMAIL_APP_PASSWORD` |
| 5 | **Stripe** | Billing | Restricted Key (`rk_`), Produkt + Preis anlegen → Price-ID | `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PRO` |
| 6 | **Sentry** | Error-Monitoring | DSN (+ optional Org/Project/Auth-Token für Source Maps) | `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, … |
| 7 | **Vercel** | Hosting | Projekt importieren (kommt in Phase 5) | — |

**Wichtig zur Datenbank:** Supabase/Neon geben dir zwei Connection Strings. Der
**Pooled** (über PgBouncer) kommt in `DATABASE_URL` (normale Queries), der
**Direct** in `DIRECT_DATABASE_URL` (für Migrationen). Beide brauchst du.

**Wichtig zu Stripe:** Nimm einen **Restricted Key** (`rk_`, minimale Rechte),
nicht den vollen Secret Key. Lege im Dashboard ein Produkt mit einem
wiederkehrenden monatlichen Preis an, kopiere die `price_…`-ID nach
`STRIPE_PRICE_PRO`. Den Webhook-Secret (`whsec_…`) bekommst du erst in Phase 5
(bzw. lokal via `stripe listen`).

**Wichtig zu Anthropic:** ZUERST in der Console ein Workspace-Spend-Limit setzen,
DANN den Key benutzen. Das ist deine harte Kostenbremse.

---

## Phase 3 — Template klonen & anpassen

```bash
# Template in den neuen Projektordner kopieren (ohne .git):
cp -R "/Users/ali-kemalaltiparmak/Documents/Claude/b2b-saas-template" \
      "/Users/ali-kemalaltiparmak/Documents/Claude/<DEIN-PROJEKT>"
cd "/Users/ali-kemalaltiparmak/Documents/Claude/<DEIN-PROJEKT>"

# Abhängigkeiten installieren, eigene .env anlegen:
npm install
cp .env.example .env      # dann mit deinen Werten aus Phase 2 füllen

# Datenbank-Schema anlegen:
npx prisma migrate dev --name init

# Lokal starten:
npm run dev
```

**Was du ÄNDERST:**
- `package.json` → `name` auf dein Projekt.
- `prisma/schema.prisma` → deine fachlichen Entitäten ergänzen (immer mit
  `organizationId` + Index, dem Muster der bestehenden Modelle folgend). Danach
  `npx prisma migrate dev`.
- `src/lib/plans.ts` → Plan-Namen, Preise, Limits an dein Produkt anpassen.
- `src/lib/ai/client.ts` → eigene Prompt-Funktionen ergänzen (Haiku fürs Günstige,
  Sonnet fürs Sichtbare).
- `src/app/page.tsx` + Dashboard → dein Produkt.
- `CLAUDE.md` → Produktname, Domäne, konkrete Entitäten.

**Was BLEIBT (nicht anfassen ohne Grund):**
- `src/lib/auth.ts`, `src/lib/tenant.ts` — das Multi-Tenancy-/Auth-Fundament.
- `src/lib/db.ts`, `src/lib/ratelimit.ts`, `src/lib/ai/json.ts` — bewährte Helfer.
- `src/app/api/stripe/webhook/route.ts` — Billing-Sync.
- `error.tsx` / `global-error.tsx` — die `unstable_retry`-Prop (siehe AGENTS.md).
- `AGENTS.md` — die Sammlung der Next.js-Fallen.

**Eigenes GitHub-Repo** (jedes Projekt bekommt eins, im Zweifel privat):
```bash
git init && git add -A && git commit -m "chore: bootstrap from b2b-saas-template"
gh repo create <DEIN-PROJEKT> --private --source=. --remote=origin --push
```

---

## Phase 4 — VS-Code-Terminal-Profil anlegen

Damit `claude` direkt im neuen Ordner startet (und die CLAUDE.md automatisch lädt),
in **beiden** Konfig-Dateien ein Profil ergänzen. Wichtig: **kein `cwd`-Feld** —
diese VS-Code-Version ignoriert es; der Ordnerwechsel muss im Startbefehl (`cd …`)
stehen.

**Datei 1:** `~/Library/Application Support/Code/User/settings.json`
Unter `terminal.integrated.profiles.osx` ein neues Profil einfügen (vor `"Plain"`):

```jsonc
"<DEIN-PROJEKT>": {
  "path": "zsh",
  "icon": "rocket",
  "args": ["-l", "-c", "printf '\\033]0;🟢 <DEIN-PROJEKT>\\007'; cd '/Users/ali-kemalaltiparmak/Documents/Claude/<DEIN-PROJEKT>' && claude; exec zsh -i"]
}
```

**Datei 2:** `~/Documents/Claude/claude-projects.code-workspace`
Dort an zwei Stellen ergänzen — identisch halten zu Datei 1:
1. unter `folders` einen Eintrag `{ "name": "<DEIN-PROJEKT>", "path": "./<DEIN-PROJEKT>" }`,
2. unter `settings.terminal.integrated.profiles.osx` dasselbe Profil wie oben.

Danach: **Terminal neu öffnen** (Dropdown hinterm `⌄` neben dem `+` → dein Profil).
Änderungen greifen nur in neu geöffneten Terminals. Icon frei wählbar
(`rocket`, `lightbulb`, `beaker`, …).

---

## Phase 5 — Deploy-Checkliste

1. **Vercel-Projekt** anlegen: Repo importieren (Vercel erkennt Next.js automatisch).
2. **Env-Vars in Vercel** setzen — alle aus deiner `.env`. Beachte:
   - `SENTRY_AUTH_TOKEN` als **Build**-Env (nicht Runtime).
   - `NEXT_PUBLIC_APP_URL` auf die echte Produktions-Domain (ohne Slash am Ende).
   - Stripe: **Live**-Keys für Production, Test-Keys nur lokal/Preview.
3. **DB-Migration** läuft automatisch: der `build`-Script macht
   `prisma migrate deploy`. Stelle sicher, dass `DIRECT_DATABASE_URL` in Vercel
   gesetzt ist (Migrationen brauchen die direkte Verbindung).
4. **Stripe-Webhook live schalten:**
   - Stripe-Dashboard → Developers → Webhooks → Endpoint hinzufügen:
     `https://<deine-domain>/api/stripe/webhook`.
   - Events abonnieren: `checkout.session.completed`,
     `customer.subscription.created/updated/deleted`.
   - Das erzeugte Signing-Secret (`whsec_…`) als `STRIPE_WEBHOOK_SECRET` in Vercel
     eintragen und neu deployen.
   - **Lokal testen** vor live: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
     — gibt dir ein temporäres `whsec_…` für die `.env`.
5. **Rauchtest live:** Registrieren → einloggen → Dashboard sehen → (falls Billing)
   Trial starten → in Stripe prüfen, dass die Subscription ankommt und der Webhook
   den Plan in der DB auf `PRO` setzt.

Fertig. Ab hier: Feedback von echten Nutzern holen, iterieren.
