@AGENTS.md

# CLAUDE.md — B2B-SaaS-Template

Globale Konventionen: `../CLAUDE.md`. Hier nur Projekt-Spezifisches. Wenn aus
diesem Template ein echtes Projekt wird, diese Datei an das Produkt anpassen
(Name, Domäne, konkrete Entitäten) — die Architekturregeln bleiben.

## Was ist das
Lauffähiges Next.js-Startgerüst für Multi-Tenant-B2B-SaaS: Auth.js v5
(Credentials, JWT), Prisma v6 (Postgres), Stripe-Billing (Trial + Abo + Webhook),
Nodemailer, Sentry und eine server-seitige Claude-Schicht. Ziel: in ~1 Woche von
der Idee zum lauffähigen MVP. Workflow im `SETUP.md`.

## Architektur-Regeln (nicht verhandelbar)
- **Multi-Tenancy:** Jede fachliche Query MUSS über `organizationId` gescoped sein.
  Immer `requireOrg()` (`src/lib/tenant.ts`) nutzen, nie eine Entität allein per
  `id` laden. So sieht Tenant A nie die Daten von Tenant B.
- **Routen-Schutz** über das Dashboard-Layout (`await auth()` in
  `src/app/(dashboard)/layout.tsx`), NICHT über Middleware (bcrypt = Node,
  Middleware = Edge).
- **Claude-Calls nur server-seitig** (`src/lib/ai/*`). API-Key nie im Client,
  nie als `NEXT_PUBLIC_*`.

## Kostenkontrolle (kritisch)
- **Spend-Limit in der Anthropic Console** ist die harte Bremse — vor dem ersten
  echten Call setzen.
- Öffentliche Endpoints: Rate-Limit (`checkRateLimit()`) + Input-Cap (~8000 Zeichen)
  + Honeypot.
- **Modellwahl:** günstiges/häufiges Extrahieren & Klassifizieren mit **Haiku**
  (`HAIKU_MODEL`), nutzerseitig sichtbarer Text mit **Sonnet** (`SONNET_MODEL`).
  `max_tokens` klein halten. Siehe `src/lib/ai/client.ts`.
- **Idempotenz:** Teure Operationen nur einmal ausführen (Status-Maschine statt
  blindem Retry); max. 1–2 Retries.

## Stack-Notizen
- Prisma auf **v6** gepinnt (v7 verlangt `prisma.config.ts` + Driver-Adapter —
  bewusst vermieden, siehe AGENTS.md).
- Auth.js v5 (Credentials, JWT-Session). `organizationId` liegt im JWT/Session.
- Stripe ist Quelle der Wahrheit fürs Abo; der Webhook spiegelt Plan/Limit/Status
  in die `Organization`. Webhook setzt absoluten Zustand (idempotent).

## Obsidian

Nach jeder Session mit echten Änderungen:
- `/Users/ali-kemalaltiparmak/Documents/Obsidian Vault/Claude/ActionLog.md` — Eintrag oben einfügen: `## YYYY-MM-DD — <Titel>`
- `/Users/ali-kemalaltiparmak/Documents/Obsidian Vault/Claude/Accomplishments.md` — bei Meilensteinen updaten

WICHTIG: Immer den vollen absoluten Pfad benutzen. `~` wird von Claude-Tools nicht expandiert.

---

## Lessons Learned (aus OfferFlow übernommen)
- **Prisma 7** unterstützt `url = env(...)` im Schema nicht mehr → auf v6 gepinnt.
- **Auth.js v5** JWT-Typaugmentation (`next-auth/jwt`) greift bei `tsc` nicht
  zuverlässig → `token.organizationId as string` casten.
- Diese **Next-Version** nutzt in `error.tsx`/`global-error.tsx` die Prop
  `unstable_retry`, nicht `reset` (Trainingsdaten-Falle). Vor Conventions immer
  `node_modules/next/dist/docs/` lesen (AGENTS.md).
- **LLM-Output** kommt oft in Markdown-Fences → nie blind `JSON.parse`, immer
  `parseModelJson()` aus `src/lib/ai/json.ts`. War ein stiller Production-Bug.
