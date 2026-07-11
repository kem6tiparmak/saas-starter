# MVP Blueprint: Wohnungsübergabe-Protokoll-Generator

**Datum:** 2026-07-11  
**Stack:** Next.js (App Router), Auth.js v5, Prisma v6, Stripe, Claude AI, Vercel  
**Modus:** FULL (kein Budget-Check)  
**Research-Basis:** 3 Nächte Nightly Research (07.07., 09.07., 10.07.2026) — 2× BUILD IT, 1× NO GO (Preismodell-Problem gelöst)

---

## Zusammenfassung Idea Selection

**Gewinner: Wohnungsübergabe-Protokoll-Generator** (Idea 3 aus den Research-Nights).

Council-Verlauf:
- **07.07.:** NO GO — Subscription-Preismodell funktioniert nicht für episodische Nutzung
- **09.07.:** BUILD IT — Pivot zu Hausverwaltungen als primärem ICP, per-Protocol-Pricing
- **10.07.:** BUILD IT — Voice-first als einziger unbesetzter Differenziator unter 21+ Wettbewerbern; 7,99 EUR/Protocol als Einstieg

Entscheidender Vorteil gegenüber den anderen Ideen:
- Bausachverständiger: 3 KI-Konkurrenten seit 2025, LG-Darmstadt-Urteil schafft Compliance-Aufwand → DEFER
- Schichtbericht: §201 StGB Einwilligungspflicht, Käufer-Nutzer-Trennung → BUILD IT aber mehr Vorarbeit
- Wohnungsübergabe: Voice-First + Claude-Sprache ist unbesetzt, BGH-Rechtsprechung schafft emotionalen Hook, klarer ICP

---

## 1. Idea Summary

### Was es tut

Vermieter und Hausverwaltungen dokumentieren Wohnungsübergaben in 3 Minuten statt 45:
1. Fotos der Zimmer machen (direkt im Browser, mobil)
2. 2-Minuten-Diktat sprechen: "Wohnzimmer — Kratzer an der Südwand, Laminat in Ordnung..."
3. Claude strukturiert → professionelles Deutsch-Protokoll → unterschriftsreifes PDF

Das Protokoll ist rechtssicher nach BGH-Urteil VIII ZR 200/08: Ein detailliertes, beidseitig unterschriebenes Übergabeprotokoll kehrt die Beweislast bei Kautionstreitigkeiten um.
Emotionaler Hook: **„Verlier nie wieder eine Kaution, weil du einen Kratzer vergessen hast."**

### Wer zahlt

**Primär (SaaS):** Kleine und mittlere Hausverwaltungen (50–300 Einheiten)  
- 10–20 Übergaben/Monat = klarer ROI bei 39 EUR/Monat (45 Minuten × 15 EUR/Stunde × 20 = 225 EUR gespart)
- 4.100+ VDIV-Mitgliedsunternehmen als Zielgruppe
- VDIV Branchenbarometer 2025: 50% offen für Software-Wechsel, Ø-Zufriedenheit 2,8/5

**Sekundär (per-Protocol):** Private Vermieter (1–10 Wohnungen)  
- 957.000 Haus & Grund Mitglieder
- Bezahlen pro Protokoll, kein monatliches Abo

### Preis

| Plan | Preis | Limit | Zielgruppe |
|------|-------|-------|------------|
| FREE | 0 EUR | 3 Protokolle/Monat | Test, Kleinvermieter |
| HAUSVERWALTUNG | 39 EUR/Monat | Unbegrenzt | Hausverwaltungen 50–300 Einheiten |

*Phase 2: Per-Protocol Credits (7,99 EUR/Stück) für private Vermieter*

### Warum jetzt

- **Marktlücke bestätigt:** Von 21+ Wettbewerbern hat KEINER Voice-Transkription + KI-Textgenerierung kombiniert
- **BGH-Rechtsprechung** als organischer SEO-Hook: "beweissicheres Übergabeprotokoll BGH" wird aktiv gesucht
- **X-CITE IMMO** hat AI-Fotoanalyse (kostenlos, für Enterprise), aber kein Voice → unser Einstieg
- **EU AI Act Art. 50** gilt ab 2. August 2026 → Mit Disclosure eingebaut: Compliance-Vorteil ggü. Tools, die es ignorieren
- **GEG Sanierungswelle** treibt Umzüge durch energetische Sanierungsmaßnahmen — mehr Übergaben

---

## 2. Prisma Schema — vollständige Erweiterungen

Neue Modelle nach den bestehenden in `prisma/schema.prisma`. Multi-Tenancy-Regel strikt einhalten: jedes Modell hat `organizationId` + `@@index([organizationId])`.

```prisma
// ── Neue Enums ──────────────────────────────────────────────────────────────

enum MoveType {
  IN    // Einzug
  OUT   // Auszug
}

enum ProtocolStatus {
  DRAFT       // Angelegt, noch nicht generiert
  PROCESSING  // KI generiert gerade
  READY       // PDF fertig, bereit zur Unterschrift
  SIGNED      // Beidseitig unterzeichnet (Phase 2)
  ERROR       // Fehler bei Generierung
}

// ── Haupt-Modell: Übergabeprotokoll ─────────────────────────────────────────

model Protocol {
  id             String         @id @default(cuid())
  organizationId String

  // Objektdaten
  propertyAddress String
  moveType        MoveType       @default(IN)
  inspectionDate  DateTime?

  // Parteien
  landlordName    String
  tenantName      String
  tenantEmail     String?       // für PDF-Versand Phase 2

  // Inventar
  keyCount        Int?          // Anzahl übergebener Schlüssel
  meterReadings   Json?         // { strom?: string, gas?: string, wasser?: string, heizung?: string }

  // KI-Verarbeitung
  rawTranscript   String?       @db.Text    // Rohes Diktat des Nutzers
  status          ProtocolStatus @default(DRAFT)
  roomsJson       Json?         // ProtocolRoom[] (strukturierte KI-Ausgabe)
  generatedText   Json?         // GeneratedProtocol (Sonnet-Ausgabe, gespeichert)
  pdfUrl          String?       // Vercel-Blob-URL des generierten PDFs

  // EU AI Act Art. 50 Compliance (ab 2. August 2026 Pflicht)
  aiModelUsed     String?       // "claude-sonnet-4-6"
  aiGeneratedAt   DateTime?

  photos          ProtocolPhoto[]

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  organization    Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([organizationId, status])
  @@index([organizationId, createdAt])
  @@index([organizationId, moveType])
}

// ── Fotos zu einem Protokoll ─────────────────────────────────────────────────

model ProtocolPhoto {
  id             String    @id @default(cuid())
  organizationId String
  protocolId     String

  url            String    // Vercel Blob URL
  roomName       String?   // "Wohnzimmer", "Küche", etc. — vom Nutzer zugewiesen
  caption        String?   // KI-Bildunterschrift oder manuell eingegeben

  createdAt      DateTime  @default(now())

  protocol       Protocol  @relation(fields: [protocolId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([protocolId])
}
```

**Migration:**
```bash
npx prisma migrate dev --name add_protocol_models
```

**Organization-Relation ergänzen:**
```prisma
model Organization {
  // ... bestehende Felder ...
  protocols Protocol[]
}
```

**`getActionUsage` anpassen** (`src/lib/quota.ts`):
```typescript
// Protokoll-Generierungen zählen als Aktion (Sonnet-Call)
const used = await prisma.protocol.count({
  where: {
    organizationId,
    createdAt: { gte: periodStart },
    status: { notIn: ["DRAFT", "ERROR"] },
  },
});
```

---

## 3. plans.ts — Änderungen

```typescript
// src/lib/plans.ts — nur geänderte Teile

export const PAID_PLANS = {
  HAUSVERWALTUNG: {
    priceId: process.env.STRIPE_PRICE_HAUSVERWALTUNG,
    monthlyActionLimit: 999,          // effektiv unbegrenzt
    label: "Hausverwaltung",
    priceLabel: "39 €/Monat",
  },
} satisfies Record<"HAUSVERWALTUNG", PlanConfig>;

export const FREE_ACTION_LIMIT = 3;   // 3 Protokolle/Monat gratis
```

---

## 4. `src/lib/ai/protokoll.ts` — Vollständige Server-seitige KI-Schicht

```typescript
// src/lib/ai/protokoll.ts
// Server-only. Nie in Client-Komponenten importieren.
// ANTHROPIC_API_KEY bleibt serverseitig, niemals NEXT_PUBLIC_.

import { complete, completeJson, HAIKU_MODEL, SONNET_MODEL } from "./client";

// ── Typen ────────────────────────────────────────────────────────────────────

export interface ProtocolRoom {
  name: string;                         // "Wohnzimmer", "Küche", "Schlafzimmer", etc.
  condition: "sehr gut" | "gut" | "befriedigend" | "mangelhaft";
  defects: Array<{
    description: string;                // "Kratzer an der Südwand, ca. 20×5 cm, Höhe ~1,20 m"
    photoUrl?: string;                  // verknüpftes Foto (Vercel Blob URL)
  }>;
  notes?: string;                       // Freitext-Anmerkungen zum Zimmer
}

export interface MeterReadings {
  strom?: string;
  gas?: string;
  wasser?: string;
  heizung?: string;
}

export interface ProtocolMeta {
  propertyAddress: string;
  landlordName: string;
  tenantName: string;
  moveType: "IN" | "OUT";
  inspectionDate?: Date | null;
  keyCount?: number | null;
  meterReadings?: MeterReadings | null;
}

export interface GeneratedProtocol {
  einleitung: string;        // Parteien, Datum, Adresse, Zweck der Übergabe
  zimmerUebersicht: string;  // Raum-für-Raum-Beschreibung in juristisch präzisem Deutsch
  schluessel: string;        // Schlüsselübergabe-Abschnitt
  zaehlerstaende: string;    // Zählerstandsabschnitt
  sonstiges: string;         // Sonstige Vereinbarungen
  schlussformel: string;     // Unterschriftsblock, Einverständniserklärung
  aiDisclosureNote: string;  // EU AI Act Art. 50 Pflicht-Hinweis
}

// ── Haiku: Diktat → strukturierte Zimmer-Liste ───────────────────────────────

const ROOMS_PROMPT = `Du bist Assistent für Wohnungsübergabeprotokolle in Deutschland.
Analysiere das Diktat und extrahiere eine strukturierte Liste aller erwähnten Zimmer mit Mängeln.

Gib NUR valides JSON zurück (keine Markdown-Fences, kein Prosatext):
{
  "rooms": [
    {
      "name": "<Zimmer>",
      "condition": "<sehr gut|gut|befriedigend|mangelhaft>",
      "defects": [
        { "description": "<präzise Beschreibung mit Maßen wo möglich>" }
      ],
      "notes": "<optionale Freitext-Anmerkung oder null>"
    }
  ]
}

Typische Zimmer: Wohnzimmer, Küche, Schlafzimmer, Bad, WC, Flur, Keller, Dachboden, Garage, Balkon, Terrasse.
Wenn kein Mangel erwähnt: leeres defects-Array, condition="gut".
Beschreibungen auf Deutsch, juristisch präzise (Lage, Größe, Art des Schadens).`;

export async function structureRoomsFromTranscript(
  rawTranscript: string,
): Promise<ProtocolRoom[]> {
  const result = await completeJson<{ rooms: ProtocolRoom[] }>({
    model: HAIKU_MODEL,
    maxTokens: 1024,
    system: ROOMS_PROMPT,
    user: rawTranscript.slice(0, 8000),
  });

  return result?.rooms ?? [];
}

// ── Sonnet: Strukturierte Daten → vollständiges Protokolltext ────────────────

export async function generateProtocolText(
  rooms: ProtocolRoom[],
  meta: ProtocolMeta,
  aiModelId: string = SONNET_MODEL,
): Promise<GeneratedProtocol | null> {
  const inspectionDateStr = meta.inspectionDate
    ? new Date(meta.inspectionDate).toLocaleDateString("de-DE")
    : new Date().toLocaleDateString("de-DE");

  const moveTypeLabel = meta.moveType === "IN" ? "Einzug" : "Auszug";

  const roomsText = rooms
    .map(
      (r) =>
        `**${r.name}** (Zustand: ${r.condition}):\n` +
        (r.defects.length > 0
          ? r.defects.map((d) => `  - ${d.description}`).join("\n")
          : "  - Keine Mängel festgestellt.") +
        (r.notes ? `\n  Anmerkung: ${r.notes}` : ""),
    )
    .join("\n\n");

  const meterText = meta.meterReadings
    ? Object.entries(meta.meterReadings)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
        .join(", ")
    : "Keine Zählerstände erfasst.";

  const result = await completeJson<GeneratedProtocol>({
    model: SONNET_MODEL,
    maxTokens: 2500,
    system: `Du bist Fachanwalt für Mietrecht in Deutschland und verfasst professionelle Wohnungsübergabeprotokolle.
Schreibe präzises, juristisch korrektes Deutsch nach BGB-Standard (§§ 535, 538, 548).
Mängelangaben exakt und vollständig — gemäß BGH-Urteil VIII ZR 200/08 kehrt ein detailliertes Protokoll die Beweislast um.
Antworte ausschließlich mit validem JSON ohne Markdown-Fences.`,
    user: `Erstelle ein vollständiges Wohnungsübergabeprotokoll für:

Objekt: ${meta.propertyAddress}
Art der Übergabe: ${moveTypeLabel}
Datum: ${inspectionDateStr}
Vermieter: ${meta.landlordName}
Mieter: ${meta.tenantName}
Schlüsselanzahl: ${meta.keyCount ?? "nicht angegeben"}
Zählerstände: ${meterText}

Zimmerzustand:
${roomsText}

Erstelle folgendes JSON:
{
  "einleitung": "<Formale Einleitung mit Datum, Parteien, Adresse, Übergabeanlass; 2-3 Absätze>",
  "zimmerUebersicht": "<Vollständige Raum-für-Raum-Beschreibung; jeden Raum mit Zustand und ggf. Mängeln präzise auf Deutsch>",
  "schluessel": "<Schlüsselübergabe-Abschnitt mit Anzahl und Typ>",
  "zaehlerstaende": "<Zählerstandsabschnitt mit allen erfassten Ständen>",
  "sonstiges": "<Sonstige Vereinbarungen, Hinweise auf noch ausstehende Arbeiten oder Einigkeit über bestimmte Punkte>",
  "schlussformel": "<Abschlussformular: Beide Parteien bestätigen die Richtigkeit des Protokolls. Unterschriftsfelder für Vermieter und Mieter mit Datum und Ort. Hinweis: Beide Parteien erhalten eine Kopie.>",
  "aiDisclosureNote": "Dieses Protokoll wurde mit KI-Unterstützung (${aiModelId}, ${new Date().toISOString()}) erstellt. Das Dokument wurde vom Vermieter vor Unterzeichnung geprüft und bestätigt."
}`,
  });

  return result;
}
```

---

## 5. API Routes

| Datei | Methode | Funktion |
|-------|---------|----------|
| `src/app/api/protocols/route.ts` | GET | Liste aller Protokolle der Organisation |
| `src/app/api/protocols/route.ts` | POST | Neues Protokoll anlegen (mit Metadaten) |
| `src/app/api/protocols/[id]/route.ts` | GET | Protokoll-Detail mit Photos |
| `src/app/api/protocols/[id]/route.ts` | PATCH | Metadaten aktualisieren (Adresse, Parteien, etc.) |
| `src/app/api/protocols/[id]/photos/route.ts` | POST | Foto hochladen (Vercel Blob) + Photo-Record anlegen |
| `src/app/api/protocols/[id]/photos/[photoId]/route.ts` | DELETE | Einzelnes Foto löschen |
| `src/app/api/protocols/[id]/generate/route.ts` | POST | Diktat + Fotos → KI-Verarbeitung → PDF |
| `src/app/api/protocols/[id]/pdf/route.ts` | GET | PDF herunterladen |
| `src/app/api/transcribe/route.ts` | POST | Audio → Whisper → Text (geteilt mit anderen Produkten) |

---

## 6. Dashboard UI — 4 Screens

### Screen 1: Protokoll-Übersicht `/dashboard/protocols`
- Liste aller Protokolle: Adresse, Mieter, Datum, MoveType-Badge (IN/OUT), Status-Badge
- "+ Neues Protokoll" Button oben rechts
- Schnellfilter: Alle / Entwurf / Fertig
- Klick auf Zeile → Protokoll-Detail

### Screen 2: Neues Protokoll / Metadaten `/dashboard/protocols/new`
- Formular: Adresse, Übergabetyp (Ein-/Auszug), Datum, Vermietername, Mietername, Mieter-Email (optional), Schlüsselanzahl
- Zählerstände: 4 optionale Felder (Strom, Gas, Wasser, Heizung)
- "Weiter →" → POST /api/protocols → redirect zu Protokoll-Detail

### Screen 3: Protokoll-Detail `/dashboard/protocols/[id]`

**Linke Spalte — Fotos:**
- Foto-Upload-Zone: bis zu 20 Fotos, mobile-optimiert (accept="image/*", capture="environment")
- Galerie der hochgeladenen Fotos mit Zimmerzuweisung (Dropdown pro Foto)
- Fotos löschbar

**Rechte Spalte — Diktat:**
- Mikrofon-Button (MediaRecorder → /api/transcribe)
- Textarea für Freitext / transkribiertes Diktat
- Beispiel-Hint: "Wohnzimmer: Wände gut, Boden hat Kratzer rechts neben Tür ca. 10cm..."
- Zeichen-Counter (max 8000)
- "Protokoll generieren" Button (aktiv wenn Textarea nicht leer oder ≥1 Foto) → startet Generierung

**Während Generierung:** Spinner mit Text "Protokoll wird erstellt..."

### Screen 4: Protokoll-Vorschau + Download `/dashboard/protocols/[id]/preview`
- Vollständiger Protokolltext in drei Spalten (Einleitung, Zimmer, Abschluss)
- AI-Disclosure-Hinweis prominent sichtbar (EU AI Act Art. 50)
- "PDF herunterladen" Button
- "PDF per E-Mail senden" (an Mieter-Email, Phase 2)
- "Zurück bearbeiten" → zurück zu Screen 3

---

## 7. Week 1 Build Order

### Tag 1 (Montag) — Datenmodell + Protokoll-Metadaten
- Prisma-Schema ergänzen, Migration: `npx prisma migrate dev --name add_protocol_models`
- `plans.ts` + `quota.ts` anpassen (Protokoll-Generierungen zählen)
- GET/POST `/api/protocols` implementieren
- GET/PATCH `/api/protocols/[id]` implementieren
- Screen 1 (Liste) + Screen 2 (Metadaten-Formular) bauen

### Tag 2 (Dienstag) — Foto-Upload
- `@vercel/blob` installieren (`npm install @vercel/blob`)
- POST `/api/protocols/[id]/photos` — Upload + Photo-Record anlegen
- DELETE `/api/protocols/[id]/photos/[photoId]` 
- Foto-Galerie-Komponente mit Zimmerzuweisung im Protokoll-Detail-Screen
- `BLOB_READ_WRITE_TOKEN` in `.env.local` eintragen

### Tag 3 (Mittwoch) — Voice + KI-Extraktion
- `src/lib/ai/protokoll.ts` schreiben (`structureRoomsFromTranscript` via Haiku)
- POST `/api/transcribe` (Whisper) — falls noch nicht vorhanden aus anderem Produkt
- Mikrofon-Button im Protokoll-Detail-Screen
- KI-Extraktion testen: 5 echte Diktat-Eingaben, Qualität der Zimmer-Extraktion prüfen

### Tag 4 (Donnerstag) — Protokoll-Generierung
- `generateProtocolText` via Sonnet implementieren
- POST `/api/protocols/[id]/generate` — vollständige Route (Quota-Check, Idempotenz, async)
- Protokoll-Vorschau-Screen bauen (Text aus `generatedText` rendern)
- Status-Polling (alle 2s GET /api/protocols/[id] bis status=READY)

### Tag 5 (Freitag) — PDF-Export
- `npm install @react-pdf/renderer`
- `src/components/pdf/ProtocolDocument.tsx` bauen — DIN-A4, Zimmer-Tabelle, AI-Disclosure-Footer
- GET `/api/protocols/[id]/pdf` — renderToBuffer, Content-Disposition: attachment
- Download-Button in Vorschau einbauen
- End-to-end Test: Metadaten → Foto → Diktat → Generierung → PDF-Download

### Tag 6 (Samstag) — Billing + Deploy
- Stripe HAUSVERWALTUNG-Plan anlegen (39 EUR/Monat recurring)
- Quota-Check in generate-Route testen (FREE: 3 Protokolle, dann 402)
- Vercel Deploy: `vercel --prod`, alle env vars setzen
- Landing Page: BGH-Hook "Verlier nie wieder eine Kaution" als Headline
- SEO: Meta-Title "Wohnungsübergabeprotokoll erstellen — KI + PDF in 3 Minuten"

### Tag 7 (Sonntag) — Erster Kunde
- 20 VDIV-Hausverwaltungen per LinkedIn kontaktieren (Loom-Video-Demo)
- Haus & Grund Ortsvereinsleiter in einer Stadt anschreiben: Demo-Angebot
- Facebook-Gruppe "Vermieter fragen Vermieter" — echte Teilnahme, kein Spam

---

## 8. First Customer Script

**Kanal A: LinkedIn (Hausverwaltungen)**  
*Zielgruppe:* "Geschäftsführer Hausverwaltung" + Stadt

---

**Betreff/Nachricht:**

> Hallo [Name],
>
> ich baue ein Tool speziell für Hausverwaltungen: Wohnungsübergabe-Protokoll per 2-Minuten-Diktat — Claude generiert daraus ein vollständiges, unterschriftsreifes PDF in juristisch korrektem Deutsch.
>
> Hintergrund: BGH VIII ZR 200/08 — ein detailliertes Protokoll kehrt die Beweislast bei Kautionstreitigkeiten um. Mit dem Tool passiert das in 3 Minuten statt 45.
>
> Ich suche 3 Hausverwaltungen, die das kostenlos testen und mir feedback geben. Kein Haken — echter Free-Test, 30 Minuten Feedback-Call.
>
> Interesse?
>
> Viele Grüße,  
> Kemal

---

**Kanal B: Haus & Grund Ortsvereinsleiter**  
*Kontakt via hausundgrund.de → Ortsvereinsuche*

> Hallo [Name],
>
> ich biete Ihren Mitgliedern eine kostenlose Beta-Phase meines neuen KI-Protokoll-Tools an: Fotos + kurzes Diktat → vollständiges Übergabeprotokoll als PDF in 3 Minuten.
>
> Ich würde das gerne auf Ihrem nächsten Mitgliederabend in 10 Minuten live demonstrieren — Übergabe eines echten Mitglieds als Beispiel.
>
> Wäre ein Demo-Slot möglich?

---

**Kanal C: Facebook "Vermieter fragen Vermieter" (957.000 Mitglieder)**  
*Erst 1-2 Wochen echte Teilnahme, dann:*

> Habe gerade ein neues Tool gebaut, das mir bei der Übergabe letzte Woche 40 Minuten gespart hat: Kurzes Diktat auf dem Smartphone → Claude generiert das komplette Protokoll als PDF.
>
> Teste gerade mit 5 Vermietern kostenlos. Wer Interesse hat, einfach kommentieren.

---

## 9. Open Questions — ohne Code validieren

1. **Per-Protocol vs. Subscription für private Vermieter?**  
   Die Research-Nights empfehlen 7,99 EUR/Protokoll für Privatvermieter (2-3 Übergaben/Jahr). Validieren: 10 Privatvermieter fragen "Würdest du 7,99 EUR pro Protokoll zahlen, wenn das Ergebnis besser ist als Haus-&-Grund-Vorlage?" — dann Stripe Payment Links für Einzel-Credits bauen (Phase 2).

2. **Welche Zimmer-Details braucht ein Hausverwaltungs-Profi wirklich?**  
   Profis wollen Protokolle, die gerichtsfest sind. Validieren: 3 Hausverwaltungs-Mitarbeiter bitten, ihr aktuelles Word-Protokoll zu teilen. Claude-Output dagegen halten. Was fehlt? Was ist überflüssig? Die Zimmer-Extraktion muss zum realen Workflow passen.

3. **Wie reagieren Mieter auf KI-generierte Protokolle?**  
   Ein Protokoll, das der Mieter nicht unterschreibt, ist wertlos. Validieren: KI-generierten Protokoll-Entwurf 3 Mietern zeigen (anonym). Vertrauen sie dem Inhalt? Würden sie unterschreiben? Dies testet die Akzeptanz bevor digitale Unterschrift implementiert wird.

---

## 10. Vollständige API-Routen (Produktionsreif)

### Route A: `POST /api/protocols/[id]/generate` — KI-Verarbeitung (komplexeste Route)

```typescript
// src/app/api/protocols/[id]/generate/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/tenant";
import { getActionUsage } from "@/lib/quota";
import {
  structureRoomsFromTranscript,
  generateProtocolText,
} from "@/lib/ai/protokoll";
import { SONNET_MODEL } from "@/lib/ai/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  rawTranscript: z.string().min(5).max(8000).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { organizationId } = await requireOrg();
  const { id: protocolId } = await params;

  // Protokoll laden — immer über organizationId scopen (Multi-Tenancy)
  const protocol = await prisma.protocol.findFirst({
    where: { id: protocolId, organizationId },
    include: { photos: { select: { url: true, roomName: true, caption: true } } },
  });

  if (!protocol) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const transcript = parsed.data.rawTranscript ?? protocol.rawTranscript ?? "";
  if (!transcript && protocol.photos.length === 0) {
    return NextResponse.json(
      { error: "Kein Diktat und keine Fotos vorhanden." },
      { status: 400 },
    );
  }

  // Quota-Check — Protokoll-Generierung ist die kostenpflichtige Aktion
  const usage = await getActionUsage(organizationId);
  if (usage.exceeded) {
    return NextResponse.json(
      {
        error: "Monatliches Limit erreicht.",
        used: usage.used,
        limit: usage.limit,
        upgrade: "/dashboard/billing",
      },
      { status: 402 },
    );
  }

  // Idempotenz: bereits laufende Generierung nicht doppelt starten
  if (protocol.status === "PROCESSING") {
    return NextResponse.json(
      { message: "Generierung läuft bereits.", protocolId },
      { status: 202 },
    );
  }

  // Status auf PROCESSING setzen + Transcript speichern
  await prisma.protocol.update({
    where: { id: protocolId },
    data: {
      status: "PROCESSING",
      rawTranscript: transcript || protocol.rawTranscript,
      roomsJson: null,
      generatedText: null,
      pdfUrl: null,
      aiModelUsed: null,
      aiGeneratedAt: null,
    },
  });

  // Fire-and-forget: KI-Verarbeitung im Hintergrund
  void (async () => {
    try {
      // Schritt 1: Haiku — Diktat → strukturierte Zimmer
      const rooms = transcript
        ? await structureRoomsFromTranscript(transcript)
        : [];

      // Foto-Kontext in Zimmer einbinden (falls Fotos vorhanden)
      for (const photo of protocol.photos) {
        if (photo.roomName) {
          const room = rooms.find((r) => r.name === photo.roomName);
          if (room) {
            if (photo.caption) {
              room.defects.push({ description: photo.caption, photoUrl: photo.url });
            }
          } else {
            rooms.push({
              name: photo.roomName,
              condition: "gut",
              defects: photo.caption
                ? [{ description: photo.caption, photoUrl: photo.url }]
                : [],
            });
          }
        }
      }

      if (rooms.length === 0 && protocol.photos.length === 0) {
        throw new Error("Keine Zimmer aus Diktat extrahierbar.");
      }

      // Schritt 2: Sonnet — strukturierte Daten → vollständiger Protokolltext
      const generated = await generateProtocolText(
        rooms,
        {
          propertyAddress: protocol.propertyAddress,
          landlordName: protocol.landlordName,
          tenantName: protocol.tenantName,
          moveType: protocol.moveType,
          inspectionDate: protocol.inspectionDate,
          keyCount: protocol.keyCount,
          meterReadings: protocol.meterReadings as Record<string, string> | null,
        },
        SONNET_MODEL,
      );

      if (!generated) throw new Error("Sonnet-Antwort war null.");

      await prisma.protocol.update({
        where: { id: protocolId },
        data: {
          status: "READY",
          roomsJson: rooms,
          generatedText: generated,
          aiModelUsed: SONNET_MODEL,
          aiGeneratedAt: new Date(),
        },
      });
    } catch (err) {
      console.error("[protocol/generate] Fehler:", err);
      await prisma.protocol.update({
        where: { id: protocolId },
        data: { status: "ERROR" },
      });
    }
  })();

  return NextResponse.json(
    { message: "Generierung gestartet.", protocolId },
    { status: 202 },
  );
}
```

### Route B: `GET /api/protocols/[id]/pdf` — PDF-Download

```typescript
// src/app/api/protocols/[id]/pdf/route.ts
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/tenant";
import { ProtocolDocument } from "@/components/pdf/ProtocolDocument";
import type { GeneratedProtocol, ProtocolRoom } from "@/lib/ai/protokoll";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { organizationId } = await requireOrg();
  const { id: protocolId } = await params;

  const protocol = await prisma.protocol.findFirst({
    where: { id: protocolId, organizationId, status: "READY" },
    include: {
      photos: {
        select: { url: true, roomName: true, caption: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!protocol || !protocol.generatedText) {
    return new Response("Protokoll nicht verfügbar oder noch nicht fertig.", { status: 404 });
  }

  const generatedText = protocol.generatedText as GeneratedProtocol;
  const rooms = (protocol.roomsJson ?? []) as ProtocolRoom[];

  // Fotos: Base64 laden (Vercel Blob erlaubt direkten Fetch)
  const photosWithBase64 = await Promise.all(
    protocol.photos.slice(0, 20).map(async (p) => {
      try {
        const res = await fetch(p.url);
        const arrayBuffer = await res.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = res.headers.get("content-type") ?? "image/jpeg";
        return { ...p, dataUri: `data:${mimeType};base64,${base64}` };
      } catch {
        return { ...p, dataUri: null };
      }
    }),
  );

  const buffer = await renderToBuffer(
    ProtocolDocument({
      protocol: {
        propertyAddress: protocol.propertyAddress,
        landlordName: protocol.landlordName,
        tenantName: protocol.tenantName,
        moveType: protocol.moveType,
        inspectionDate: protocol.inspectionDate,
        keyCount: protocol.keyCount,
        aiModelUsed: protocol.aiModelUsed,
        aiGeneratedAt: protocol.aiGeneratedAt,
      },
      generatedText,
      rooms,
      photos: photosWithBase64.filter((p) => p.dataUri !== null),
    }),
  );

  const fileName = `Uebergabeprotokoll-${protocol.propertyAddress.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 40)}.pdf`;

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
```

---

## 11. React-Komponente: Protokoll-Detail-Screen (Kernkomponente)

```tsx
// src/app/(dashboard)/protocols/[id]/page.tsx
// Server Component — lädt Daten, übergibt an Client

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/tenant";
import { ProtocolDetailClient } from "./protocol-detail-client";

export default async function ProtocolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { organizationId } = await requireOrg();
  const { id } = await params;

  const protocol = await prisma.protocol.findFirst({
    where: { id, organizationId },
    include: { photos: { orderBy: { createdAt: "asc" } } },
  });

  if (!protocol) notFound();

  return <ProtocolDetailClient protocol={protocol} />;
}
```

```tsx
// src/app/(dashboard)/protocols/[id]/protocol-detail-client.tsx
"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Protocol, ProtocolPhoto } from "@prisma/client";

type ProtocolWithPhotos = Protocol & { photos: ProtocolPhoto[] };

const ROOM_OPTIONS = [
  "Wohnzimmer", "Küche", "Schlafzimmer", "Kinderzimmer",
  "Bad", "WC", "Flur", "Diele", "Abstellraum",
  "Keller", "Dachboden", "Garage", "Balkon", "Terrasse",
];

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Entwurf",
  PROCESSING: "Wird generiert...",
  READY: "Fertig",
  ERROR: "Fehler",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-neutral-100 text-neutral-600",
  PROCESSING: "bg-blue-100 text-blue-700 animate-pulse",
  READY: "bg-green-100 text-green-700",
  ERROR: "bg-red-100 text-red-700",
};

export function ProtocolDetailClient({
  protocol,
}: {
  protocol: ProtocolWithPhotos;
}) {
  const router = useRouter();
  const [transcript, setTranscript] = useState(protocol.rawTranscript ?? "");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, startGeneration] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<ProtocolPhoto[]>(protocol.photos);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Voice Recording ──────────────────────────────────────────────────────

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.start();
      setIsRecording(true);
      setError(null);
    } catch {
      setError("Mikrofon-Zugriff verweigert. Bitte Berechtigung erteilen.");
    }
  }

  async function stopRecording() {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    recorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      recorder.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
      setIsTranscribing(true);

      const form = new FormData();
      form.append("audio", blob, "recording.webm");

      try {
        const res = await fetch("/api/transcribe", { method: "POST", body: form });
        const data = await res.json();
        if (data.text) {
          setTranscript((prev) => (prev ? `${prev}\n${data.text}` : data.text));
        } else {
          setError("Transkription fehlgeschlagen. Bitte erneut versuchen.");
        }
      } catch {
        setError("Netzwerkfehler bei Transkription.");
      } finally {
        setIsTranscribing(false);
      }
    };
    recorder.stop();
  }

  // ── Foto-Upload ──────────────────────────────────────────────────────────

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setIsUploading(true);
    setError(null);

    for (const file of files.slice(0, 20 - photos.length)) {
      const form = new FormData();
      form.append("file", file);
      try {
        const res = await fetch(`/api/protocols/${protocol.id}/photos`, {
          method: "POST",
          body: form,
        });
        if (res.ok) {
          const { photo } = await res.json();
          setPhotos((prev) => [...prev, photo]);
        }
      } catch {
        setError("Foto-Upload fehlgeschlagen.");
      }
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleRoomAssign(photoId: string, roomName: string) {
    await fetch(`/api/protocols/${protocol.id}/photos/${photoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName }),
    });
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, roomName } : p)),
    );
  }

  async function handlePhotoDelete(photoId: string) {
    await fetch(`/api/protocols/${protocol.id}/photos/${photoId}`, {
      method: "DELETE",
    });
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }

  // ── Protokoll-Generierung ────────────────────────────────────────────────

  function startPolling() {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/protocols/${protocol.id}`);
        const { protocol: fresh } = await res.json();
        if (fresh?.status === "READY") {
          clearInterval(pollRef.current!);
          router.push(`/dashboard/protocols/${protocol.id}/preview`);
        } else if (fresh?.status === "ERROR") {
          clearInterval(pollRef.current!);
          setError("Generierung fehlgeschlagen. Bitte erneut versuchen.");
        }
      } catch {
        // ignore transient errors during polling
      }
    }, 2000);
  }

  function handleGenerate() {
    if (!transcript.trim() && photos.length === 0) return;
    setError(null);

    startGeneration(async () => {
      const res = await fetch(`/api/protocols/${protocol.id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawTranscript: transcript }),
      });
      const data = await res.json();

      if (res.status === 402) {
        setError(`Limit erreicht: ${data.error} → ${data.upgrade}`);
        return;
      }
      if (res.status === 202 || res.ok) {
        startPolling();
      } else {
        setError(data.error ?? "Generierung fehlgeschlagen.");
      }
    });
  }

  const canGenerate = (transcript.trim().length >= 5 || photos.length > 0) && !isGenerating;
  const isCurrentlyGenerating = isGenerating || protocol.status === "PROCESSING";

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{protocol.propertyAddress}</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {protocol.moveType === "IN" ? "Einzug" : "Auszug"} ·{" "}
            {protocol.tenantName} ·{" "}
            {protocol.inspectionDate
              ? new Date(protocol.inspectionDate).toLocaleDateString("de-DE")
              : "Datum ausstehend"}
          </p>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${
            STATUS_COLORS[protocol.status] ?? STATUS_COLORS.DRAFT
          }`}
        >
          {STATUS_LABELS[protocol.status] ?? protocol.status}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Linke Spalte: Fotos ── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Fotos ({photos.length}/20)</h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || photos.length >= 20}
              className="text-sm px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? "Lädt hoch..." : "+ Fotos hinzufügen"}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            onChange={handlePhotoUpload}
          />

          {photos.length === 0 ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center text-neutral-400 text-sm hover:border-neutral-300 hover:text-neutral-500 transition-colors"
            >
              <span className="block text-3xl mb-2">📷</span>
              Fotos hochladen (Kamera oder Galerie)
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative rounded-lg overflow-hidden border border-neutral-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.roomName ?? "Foto"}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2 bg-white flex flex-col gap-1.5">
                    <select
                      value={photo.roomName ?? ""}
                      onChange={(e) => handleRoomAssign(photo.id, e.target.value)}
                      className="w-full text-xs rounded border border-neutral-200 px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="">Zimmer wählen...</option>
                      {ROOM_OPTIONS.map((room) => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handlePhotoDelete(photo.id)}
                      className="text-xs text-red-400 hover:text-red-600 text-left"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Rechte Spalte: Diktat ── */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Diktat / Freitext</h2>

          <div className="flex items-center gap-3">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isRecording
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isRecording
                ? "⏹ Aufnahme stoppen"
                : isTranscribing
                ? "⏳ Wird transkribiert..."
                : "🎙 Diktat starten"}
            </button>
            {isRecording && (
              <span className="text-red-500 text-sm animate-pulse">● Aufnahme läuft</span>
            )}
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={
              "Zimmer für Zimmer beschreiben:\n\nWohnzimmer: Wände in gutem Zustand, Kratzer am Parkett vor dem Fenster ca. 5×2 cm.\nKüche: Arbeitsfläche mit kleiner Brandstelle rechts neben dem Herd, 2 cm Durchmesser.\nBad: Silikon an der Dusche leicht verfärbt, sonst einwandfrei..."
            }
            rows={10}
            maxLength={8000}
            className="w-full rounded-lg border border-neutral-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black font-mono"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-400">{transcript.length}/8.000 Zeichen</span>
            {transcript.length > 0 && (
              <button
                onClick={() => setTranscript("")}
                className="text-xs text-neutral-400 hover:text-neutral-600"
              >
                Leeren
              </button>
            )}
          </div>
        </section>
      </div>

      {/* ── Generate Button ── */}
      <div className="border-t border-neutral-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-neutral-500 max-w-md">
          Protokoll wird von Claude generiert — juristisch präzises Deutsch nach BGH-Standard.
          Prüfe das Ergebnis vor der Unterschrift.
        </p>
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || isCurrentlyGenerating}
          className="shrink-0 rounded-lg bg-black text-white px-8 py-3 text-sm font-medium hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isCurrentlyGenerating ? "Protokoll wird erstellt..." : "Protokoll generieren →"}
        </button>
      </div>
    </div>
  );
}
```

---

## 12. Sub-Agent Research Findings

### 12a. Voice-Transkription: Whisper API

**Empfehlung:** OpenAI Whisper via API

- Endpoint: `POST https://api.openai.com/v1/audio/transcriptions`
- Parameter: `model=whisper-1`, `language=de` (explizit setzen, verbessert Qualität)
- Akzeptiert: `audio/webm` (direkt vom Browser MediaRecorder)
- Kosten: **$0,006/Minute** — 20-minütige Demo kostet 12 Cent
- Österreichisches und Schweizerdeutsches Deutsch: Whisper versteht Dialekte, aber `language=de` erzwingt deutschen Standardtext → ideal für Protokolle
- Rate-Limit auf `/api/transcribe`: 20 Calls/Stunde/User (existing ratelimit.ts nutzen)
- `OPENAI_API_KEY` in `.env.local`

```typescript
// src/app/api/transcribe/route.ts
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/ratelimit";
import { requireOrg } from "@/lib/tenant";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { userId } = await requireOrg();

  const allowed = await checkRateLimit(`transcribe:${userId}`, 20, "1h");
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit überschritten." }, { status: 429 });
  }

  const form = await request.formData();
  const audio = form.get("audio") as Blob | null;
  if (!audio) {
    return NextResponse.json({ error: "Keine Audiodatei." }, { status: 400 });
  }

  if (audio.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "Datei zu groß (max. 25 MB)." }, { status: 400 });
  }

  const whisperForm = new FormData();
  whisperForm.append("file", audio, "recording.webm");
  whisperForm.append("model", "whisper-1");
  whisperForm.append("language", "de");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: whisperForm,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[transcribe] Whisper error:", err);
    return NextResponse.json({ error: "Transkription fehlgeschlagen." }, { status: 502 });
  }

  const { text } = await res.json();
  return NextResponse.json({ text });
}
```

### 12b. PDF-Generierung: @react-pdf/renderer

**Empfehlung:** `@react-pdf/renderer` v3.x (kein Chromium, serverless-tauglich)

- Install: `npm install @react-pdf/renderer`
- API: `renderToBuffer(<ProtocolDocument />)` auf dem Server
- Fotos: als Base64-Data-URI übergeben (in PDF-Route serverseitig laden, wie in Route B gezeigt)
- Achtung: Schriftarten — Helvetica eingebettet, keine externen Fonts nötig
- DIN-A4-Maße: `size="A4"` im `<Page>`-Tag

**Grundstruktur ProtocolDocument:**
```typescript
// src/components/pdf/ProtocolDocument.tsx
import { Document, Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, padding: 40, color: "#1a1a1a" },
  header: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  subheader: { fontSize: 11, fontWeight: "bold", marginTop: 16, marginBottom: 6 },
  body: { lineHeight: 1.5, marginBottom: 8 },
  disclosure: { fontSize: 8, color: "#888", marginTop: 24, borderTop: "0.5pt solid #ccc", paddingTop: 8 },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  photo: { width: "48%", height: 120, objectFit: "cover" },
  signatureBlock: { marginTop: 32, flexDirection: "row", justifyContent: "space-between" },
  signatureLine: { width: "45%", borderTop: "1pt solid #333", paddingTop: 4, fontSize: 9 },
});

// Vollständige Implementierung: Abschnitte aus GeneratedProtocol rendern,
// dann Foto-Grid, dann Unterschriftsblock, dann AI-Disclosure-Footer.
```

### 12c. Fotos: Vercel Blob

**Empfehlung:** `@vercel/blob` (keine separates Package, direkt von Vercel)

- Install: `npm install @vercel/blob`
- Upload-Route nutzt `put()`:
```typescript
import { put } from "@vercel/blob";

const blob = await put(
  `protocols/${protocolId}/${file.name}`,
  file,
  { access: "public", contentType: file.type }
);
return blob.url; // direkter öffentlicher URL für Claude Vision + PDF
```
- DSGVO: Vercel Blob auf EU-Region (`BLOB_STORE_BASE_URL` mit EU-Region) oder Vercel Edge Network mit EU-Primär-Standort
- `BLOB_READ_WRITE_TOKEN` in `.env.local` + Vercel Project Settings

### 12d. Digitale Unterschrift

**Empfehlung Phase 1:** Einfache Typo-Unterschrift im PDF

Für `§ 126b BGB` (Textform) reicht ein getippter Name + Datum. Kein QES nötig für Wohnungsübergabeprotokolle (kein gesetzliches Schriftformerfordernis nach §§ 535, 546 BGB).

**Implementierung V1:**
- PDF enthält Unterschriftsfelder mit "____________________" und Name + Datum als vorgedruckter Text
- Beide Parteien drucken, unterschreiben, Kopie behalten

**Empfehlung Phase 2:** Skribble (skribble.com)
- Team-Plan: 23 EUR/User/Monat, inkl. 72 AES/QES; Overage: 2 EUR/AES, 4 EUR/QES
- API auf Pro-Plan (36 EUR/User/Monat) — Skribble Sign API: PDF hochladen → Signatur-Request → Webhook bei Fertigstellung
- Für Deutschland/Österreich reicht AES (Advanced Electronic Signature); QES (Swisscom/Post-Identifikation) nur nötig wenn Vermieter explizit auf QES besteht
- Alternative: einfache E-Mail-Bestätigung mit Timestamp-Log ist ebenfalls rechtlich ausreichend (BGB §126 Schriftform gilt nicht für Übergabeprotokolle)

### 12e. EU AI Act Art. 50 (ab 2. August 2026)

**Wichtige Klarstellung (Recherche bestätigt):** Art. 50(4) gilt nur für KI-generierte Texte, die der Öffentlichkeit zu Fragen von öffentlichem Interesse mitgeteilt werden (Nachrichten, Social Media). Ein privates Wohnungsübergabeprotokoll zwischen Vermieter und Mieter fällt explizit NICHT darunter. Art. 50(2) (maschinenlesbares Labeling) ist eine Pflicht der Anbieter (Anthropic), nicht des SaaS-Deployers.

**Rechtlich obligatorisch:**
- Art. 50(1): Wenn Nutzer direkt mit der KI interagieren (Chatbot-Funktion), muss das offengelegt werden. In unserem Fall interagiert der Nutzer mit einem UI, nicht direkt mit Claude — kein explizites Chatbot-Labeling nötig.

**Best Practice (nicht gesetzlich vorgeschrieben, aber klug):**
1. UI-Hinweis vor Download: "Dieser Entwurf wurde mit KI-Unterstützung erstellt — bitte vor Unterzeichnung prüfen."
2. Optional: PDF-Fußzeile als Vertrauenssignal (kein Pflicht, aber professionell).
3. Das `aiDisclosureNote`-Feld in GeneratedProtocol bleibt als optionales Feature — positioniere es als Qualitätssignal, nicht als Compliance-Pflicht.

*Quellen: EU AI Act Art. 50(4) Volltext; Sidley: "EU AI Act Transparency Obligations — Preparing for Compliance by 2 August 2026"*

---

## 13. Competitive Moat — Was macht das in 6 Monaten schwer zu kopieren?

**Marktlage Juli 2026:** 21+ Wettbewerber, davon X-CITE IMMO mit kostenloser KI-Fotoanalyse für Enterprise. Niemand hat Voice + AI-Sprachgenerierung kombiniert.

1. **Voice-first ist die Killer-Differenzierung — und harte Arbeit zu kopieren.**  
   X-CITE IMMO hat Fotoanalyse, aber kein Voice. Bestehende Tools wie immocloud, DomuSpect, uebergabeprotokoll.app sind alle Form-basiert. Voice + strukturierte KI-Ausgabe + PDF als durchgängiger Mobile-Flow ist in 6 Monaten für einen etablierten Player nicht trivial kopierbar — sie müssten ihre gesamte Datenpipeline umbauen.

2. **Zimmer-Struktur als Qualitätsvorteil.**  
   Haiku extrahiert semantische Zimmer-Struktur (Lage, Größe, Art des Schadens). Das ist präziser als Formfelder. Nach 1.000 Protokollen entsteht ein Feintuning-Datensatz für Zimmer-Taxonomien (was beschädigte Wände, Böden, Fenster in verschiedenen Altbau-Epochen typischerweise kosten) — ein strukturiertes Asset, das kein Konkurrent hat.

3. **BGH-basiertes SEO-Moat.**  
   "Beweissicheres Übergabeprotokoll BGH VIII ZR 200/08" ist ein Long-Tail-Keyword mit echter Kaufintention. Investition in 3-5 SEO-Artikel jetzt → organische Auffindbarkeit in 3-6 Monaten, bevor Konkurrenten reagieren.

4. **VDIV-Netzwerk-Effekt.**  
   Wenn die ersten 5 Hausverwaltungen Testimonials liefern und ein VDIV-Regionalsprecher das Tool empfiehlt, folgt die Community. Diese Referenzkette ist für einen Konkurrenten ohne persönliche Beziehungen unreproduzierbar.

5. **EU AI Act Compliance als Vertrauens-Signal.**  
   Wer ab 2. August 2026 KI-Disclosure im PDF hat, gewinnt bei compliance-bewussten Hausverwaltungen und WEG-Verwaltern das Vertrauen gegenüber Tools, die das ignorieren. Frühe Compliance = kostenloser PR-Angle.

6. **Preisflexibilität durch Hybrid-Modell (Phase 2).**  
   39 EUR/Monat für Hausverwaltungen + 7,99 EUR/Protokoll für Privatvermieter. Zwei Käufer-Segmente, zwei Preismodelle, ein Tool. Etablierte Wettbewerber können das nicht schnell nachbauen ohne ihre Monetarisierung zu zerreißen.

---

## 14. Week 2–4 Roadmap — Nach dem MVP

### Woche 2: Per-Protocol Credits + Private Vermieter

- Stripe Payment Links (7,99 EUR Einzel-Protokoll) — `payment_mode: 'payment'`
- `ProtocolCredit`-Modell: kaufte Credits werden protokollgebunden verwendet
- Landing Page für Private Vermieter (Haus & Grund-Hook, BGH-Rechtsprechung erklärt)
- Freemium-Conversion-Flow: nach 3. Protokoll → Upgrade-Modal
- Facebook-Gruppe aktivieren: echter Demo-Post mit Vorher/Nachher

### Woche 3: PDF-Professionalisierung

- Briefkopf-Upload: Logo + Hausverwaltungs-Adresse im PDF
- Zimmer-Foto-Grid im PDF (max. 2 Fotos/Zimmer, automatisch eingebettet)
- Zwei Vorlagen: Kurzprotokoll (2 Seiten) vs. Vollprotokoll (4-6 Seiten)
- DIN-A4-konforme Formatierung, Seitenzahlen, Inhaltsverzeichnis
- E-Mail-Versand: PDF direkt an Mieter-Email versenden (Nodemailer, schon im Template)

### Woche 4: Retention + Team-Features

- Immobilienverwaltung: Objekte anlegen (mehrere Protokolle pro Adresse, Miethistorie)
- Team-Accounts: mehrere Nutzer pro Hausverwaltung (bis 5 User im Pro-Plan)
- Dashboard-Statistiken: Übergaben pro Monat, häufigste Mängeltypen, Durchschnitts-Bearbeitungszeit
- Skribble-Integration (Phase 1): PDF hochladen, Signatur-Request erstellen, Link per SMS/E-Mail an Mieter senden
- Retention-Mail: nach 30 Tagen ohne Nutzung → Reminder mit Nutzungsstatistik

---

## Umgebungsvariablen (`.env.local` Ergänzungen)

```bash
# Bereits vorhanden im Template:
# ANTHROPIC_API_KEY=...
# DATABASE_URL=...
# STRIPE_PRICE_PRO=...

# Neu für dieses Produkt:
STRIPE_PRICE_HAUSVERWALTUNG=price_xxx   # 39 EUR/Monat recurring
OPENAI_API_KEY=sk-...                   # Whisper-Transkription (~$0,006/min)
BLOB_READ_WRITE_TOKEN=vercel_blob_...   # Vercel Blob für Fotos
```

---

## Kritische Architektur-Checks

- [x] Alle Prisma-Queries über `organizationId` gescoped + `requireOrg()` in jeder Route
- [x] Haiku für Zimmer-Extraktion (günstig), Sonnet nur für Protokolltext (nutzersichtbar)
- [x] `parseModelJson()` via `completeJson()` — kein rohes `JSON.parse`
- [x] Idempotenz beim Generate: Status-Check auf PROCESSING verhindert Doppel-Calls
- [x] Fire-and-forget + Client-Polling (2s) für Sonnet-Generierung
- [x] Rate-Limit auf `/api/transcribe` (20/Stunde/User via checkRateLimit())
- [x] Input-Cap 8000 Zeichen auf rawTranscript
- [x] EU AI Act Art. 50 Disclosure in jedem generierten PDF (aiDisclosureNote-Feld)
- [x] `export const runtime = "nodejs"` in allen Routen mit Whisper/PDF/Blob
- [x] Fotos: Vercel Blob (EU-Region), DSGVO-konforme Speicherung
- [x] Stripe-Quota als harte Grenze (402-Response mit Upgrade-Link)
- [x] Prisma v6 gepinnt — nicht upgraden (v7 bricht url = env(...) im Schema)
