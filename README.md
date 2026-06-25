# B2B SaaS Template

Lauffähiges Next.js-Startgerüst für Multi-Tenant-B2B-SaaS.

**Stack:** Next.js 16 · Auth.js v5 (Credentials, JWT) · Prisma v6 (Postgres) ·
Stripe (Trial + Abo + Webhook) · Nodemailer · Sentry · server-seitige Claude-Schicht.

## Schnellstart
```bash
npm install
cp .env.example .env      # mit eigenen Werten füllen
npx prisma migrate dev --name init
npm run dev
```

## Doku
- **`SETUP.md`** — vollständiger Workflow von der Idee bis live (für Menschen).
- **`AGENTS.md`** — Next.js-Fallen dieser Version (für den nächsten Claude). Zuerst lesen.
- **`CLAUDE.md`** — Architekturregeln (Multi-Tenancy, Kostenkontrolle, Lessons Learned).

## Kernprinzipien
- **Multi-Tenancy:** jede Query über `requireOrg()` + `organizationId` scopen.
- **Routen-Schutz** im Dashboard-Layout (`auth()`), nicht in Middleware.
- **Kostenkontrolle:** Anthropic-Spend-Limit, Haiku fürs Günstige, Sonnet fürs Sichtbare.
