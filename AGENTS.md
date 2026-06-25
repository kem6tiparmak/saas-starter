# This is NOT the Next.js you know

Diese Next.js-Version (16.2.7) hat Breaking Changes — APIs, Conventions und
Dateistruktur können von deinen Trainingsdaten abweichen. **Lies den passenden
Guide in `node_modules/next/dist/docs/`, bevor du Code schreibst.** Beachte
Deprecation-Hinweise. Das Folgende sind die Fallen, die in der Praxis schon
zugeschnappt haben.

## Konkrete Fallen (aus echten Bugs)

- **`error.tsx` / `global-error.tsx`:** Die Retry-Prop heißt `unstable_retry: () => void`,
  **nicht** `reset`. Trainingsdaten sagen `reset` — das gibt hier einen stillen
  No-Op-Button. Siehe die beiden Dateien in `src/app/`.

- **Prisma auf v6 pinnen.** `prisma@^6.0.0` in `package.json` lassen. v7 unterstützt
  `url = env(...)` im Schema nicht mehr (verlangt `prisma.config.ts` + Driver-Adapter).
  Das ist ein bewusster Trade-off, kein Versehen.

- **Auth.js v5 JWT-Typen casten.** Die Typaugmentation aus `next-auth/jwt`
  (`src/types/next-auth.d.ts`) greift bei `tsc` nicht zuverlässig. In den Callbacks
  daher `token.organizationId as string` casten (siehe `src/lib/auth.ts`).

- **LLM-Output nie blind `JSON.parse`.** Claude (besonders Haiku) liefert JSON oft
  in Markdown-Fences (```` ```json ````), auch wenn der Prompt „nur JSON" verlangt.
  Immer `parseModelJson()` aus `src/lib/ai/json.ts` nutzen (strippt Fences +
  Fallback auf das äußerste `{…}`). War in einem Schwesterprojekt ein stiller
  Production-Bug (Calls gaben `null`).

- **bcrypt nicht in Middleware.** bcrypt braucht die Node-Runtime, Middleware läuft
  Edge. Routen-Schutz daher im Dashboard-Layout via `await auth()`, nicht in
  `middleware.ts`. Siehe `src/app/(dashboard)/layout.tsx`.

- **Claude-Calls nur server-seitig.** Der `ANTHROPIC_API_KEY` darf niemals im Client
  landen — nie `NEXT_PUBLIC_` davorsetzen, nie aus einer Client-Komponente importieren.
  Alle KI-Calls laufen über `src/lib/ai/*`.

- **Öffentliche Formulare absichern.** Jeder öffentlich erreichbare Endpoint, der
  bezahlte Arbeit auslösen kann (KI-Call, Mailversand), braucht: Rate-Limit
  (`checkRateLimit()` aus `src/lib/ratelimit.ts`), Input-Cap (~8000 Zeichen) und
  ein Honeypot-Feld gegen Bots (siehe `src/components/auth-form.tsx`).

- **Stripe-Webhook braucht den ROHEN Body.** `request.text()`, nicht `request.json()`
  — sonst bricht die Signaturprüfung. `runtime = "nodejs"` + `dynamic = "force-dynamic"`.
  Siehe `src/app/api/stripe/webhook/route.ts`.
