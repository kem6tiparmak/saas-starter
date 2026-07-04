# MVP Blueprint: Bausachverständigen-Gutachten-Assistent

**Datum:** 2026-07-04  
**Stack:** Next.js (App Router), Auth.js v5, Prisma v6, Stripe, Claude AI, Vercel  
**Modus:** FULL (kein Budget-Check)

---

## 1. Idea Summary

### Was es tut
Ein KI-gestützter Assistent, der Bausachverständigen hilft, professionelle Gutachten in einem Bruchteil der bisherigen Zeit zu erstellen. Auf der Baustelle dikitiert der SV seine Beobachtungen per Sprache oder Freitext; das System extrahiert daraus strukturierte Mängeleinträge (Bauteil, Schadensart, Schweregrad, Sanierungsempfehlung, Kostenschätzung) und generiert auf Knopfdruck ein vollständiges, rechtssicheres Gutachten auf Deutsch.

### Wer zahlt
**Primär:** Freiberufliche Bausachverständige (SV) und kleine Gutachterbüros (2-5 Personen) in DACH.  
- ~18.000 zugelassene Bausachverständige in Deutschland allein
- Stundensatz 80-200 €; ein Gutachten nimmt 4-8 Stunden → 3-5 Stunden davon ist Schreiben
- Pain: Routineberichte fressen die Kapazität, die eigentlich für Ortsbegehungen gebraucht wird

**Sekundär:** Versicherungsregulierer, Banken (Beleihungswertgutachten), Hausverwaltungen

### Preis
| Plan | Preis | Limit |
|------|-------|-------|
| FREE | 0 € | 3 Gutachten/Monat |
| PRO | 49 €/Monat | 50 Gutachten/Monat |

### Warum jetzt
- LLMs schreiben seit 2024/2025 fließendes juristisch-technisches Deutsch
- Kein AI-natives Tool für den deutschen Baugutachten-Markt (Stand 2026)
- Regulatorischer Druck (GEG, Sanierungspflichten) treibt Gutachten-Aufkommen
- Sachverständigenmangel → jeder SV braucht mehr Durchsatz

---

## 2. Prisma Schema — vollständige Erweiterungen

Die folgenden Modelle kommen **nach** den bestehenden Modellen in `prisma/schema.prisma`. Multi-Tenancy-Regel: jede fachliche Entität trägt `organizationId` und hat `@@index([organizationId])`.

```prisma
// ── Neue Enums ──────────────────────────────────────────────────────────────

enum CaseStatus {
  DRAFT       // angelegt, noch keine Mängel
  IN_PROGRESS // Mängel erfasst, Gutachten noch nicht generiert
  REVIEW      // Gutachten generiert, wird geprüft
  COMPLETED   // finalisiert, versandt
}

enum ReportStatus {
  GENERATING
  READY
  ERROR
}

// ── Auftrag (Gutachten-Fall) ─────────────────────────────────────────────────

model Case {
  id             String     @id @default(cuid())
  organizationId String

  // Auftragsdaten
  title          String              // "EFH Hauptstraße 12, München"
  address        String
  clientName     String
  clientEmail    String?
  caseNumber     String?             // eigene Fallnummer des SV
  inspectionDate DateTime?
  propertyType   String?             // "Einfamilienhaus", "Mehrfamilienhaus", etc.

  status         CaseStatus @default(DRAFT)

  defects        Defect[]
  report         Report?

  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([organizationId, status])
  @@index([organizationId, createdAt])
}

// ── Einzelner Mangel innerhalb eines Falls ───────────────────────────────────

model Defect {
  id             String   @id @default(cuid())
  organizationId String
  caseId         String

  // Strukturierte Daten (via Haiku aus Freitext extrahiert)
  component      String   // Bauteil: "Dach", "Keller", "Fassade", ...
  damageType     String   // Schadensart: "Rissbildung", "Feuchteschaden", ...
  severity       String   // "leicht" | "mittel" | "schwer" | "kritisch"
  description    String   // Kurzbeschreibung (~1-2 Sätze, Haiku-Extrakt)
  rawNotes       String   @db.Text  // Original-Diktat des SV (unveränderter Quelltext)

  // Empfehlung
  remediation    String?  // Sanierungsempfehlung
  estimatedCost  String?  // z. B. "800–1.200 €" als Freitext-String

  position       Int      @default(0)  // Sortierung innerhalb des Falls

  case           Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([organizationId])
  @@index([caseId])
}

// ── Generiertes Gutachten-Dokument ───────────────────────────────────────────

model Report {
  id             String       @id @default(cuid())
  organizationId String
  caseId         String       @unique  // 1 Report pro Case

  status         ReportStatus @default(GENERATING)

  // Generierter Inhalt (Sonnet) — gespeichert damit keine erneuten KI-Kosten
  executiveSummary  String?   @db.Text   // Zusammenfassung / Kurzgutachten
  defectNarrative   String?   @db.Text   // Ausführliche Mängelbeschreibung als Fließtext
  conclusion        String?   @db.Text   // Fazit & Handlungsempfehlungen

  tokensUsed     Int?
  generatedAt    DateTime?
  errorMessage   String?

  case           Case         @relation(fields: [caseId], references: [id], onDelete: Cascade)

  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([organizationId])
}
```

**Migration:**
```bash
npx prisma migrate dev --name add_gutachten_models
```

**Wichtig:** In `prisma/schema.prisma` die `Organization`-Relation ergänzen:
```prisma
model Organization {
  // ... bestehende Felder ...
  cases  Case[]
}
```

**`getActionUsage` anpassen** (`src/lib/quota.ts`):
```typescript
// Statt used = 0: Reports dieses Monats zählen (Report = teure Sonnet-Action)
const used = await prisma.report.count({
  where: { organizationId, createdAt: { gte: periodStart }, status: { not: "ERROR" } },
});
```

**`plans.ts` FREE-Limit anpassen:**
```typescript
export const FREE_ACTION_LIMIT = 3; // 3 Gutachten/Monat gratis (war 10)
```

---

## 3. plans.ts — Änderungen

```typescript
// src/lib/plans.ts — nur geänderte Teile

export const PAID_PLANS = {
  PRO: {
    priceId: process.env.STRIPE_PRICE_PRO,
    monthlyActionLimit: 50,          // 50 Gutachten/Monat
    label: "Pro",
    priceLabel: "49 €/Monat",
  },
} satisfies Record<"PRO", PlanConfig>;

export const FREE_ACTION_LIMIT = 3;  // 3 Gutachten gratis
```

---

## 4. `src/lib/ai/gutachten.ts` — Vollständige Server-seitige KI-Schicht

```typescript
// src/lib/ai/gutachten.ts
// WICHTIG: Server-only. Nie in Client-Komponenten importieren.
// API-Key bleibt in ANTHROPIC_API_KEY (kein NEXT_PUBLIC_).

import { complete, completeJson, HAIKU_MODEL, SONNET_MODEL } from "./client";

// ── Typen ────────────────────────────────────────────────────────────────────

export interface ExtractedDefect {
  component: string;     // Bauteil
  damageType: string;    // Schadensart
  severity: "leicht" | "mittel" | "schwer" | "kritisch";
  description: string;   // Kurzbeschreibung 1-2 Sätze
  remediation?: string;  // Sanierungsempfehlung
  estimatedCost?: string; // Kostenschätzung als Freitext
}

export interface CaseForReport {
  title: string;
  address: string;
  clientName: string;
  inspectionDate?: Date | null;
  propertyType?: string | null;
  defects: Array<{
    component: string;
    damageType: string;
    severity: string;
    description: string;
    remediation?: string | null;
    estimatedCost?: string | null;
  }>;
}

export interface GeneratedReport {
  executiveSummary: string;
  defectNarrative: string;
  conclusion: string;
  tokensUsed?: number;
}

// ── Mängel-Extraktion via Haiku (günstig + schnell) ──────────────────────────

const DEFECT_COMPONENTS = [
  "Dach", "Dachstuhl", "Dacheindeckung", "Dachrinne",
  "Fassade", "Außenwand", "Putz", "WDVS",
  "Keller", "Fundament", "Bodenplatte", "Kellerwand",
  "Fenster", "Türen", "Verglasung",
  "Elektroinstallation", "Heizungsanlage", "Sanitärinstallation",
  "Innenausbau", "Trockenbau", "Estrich", "Parkett", "Fliesen",
  "Treppe", "Balkon", "Terrasse", "Garage", "Sonstiges",
];

const DAMAGE_TYPES = [
  "Rissbildung", "Haarriss", "Setzungsriss", "Strukturriss",
  "Feuchteschaden", "Durchfeuchtung", "Schimmelbefall", "Kondensatschäden",
  "Schäden durch Frost-Tau-Wechsel", "Abplatzungen", "Hohlstellen",
  "Korrosion", "Holzfäule", "Holzschädlingsbefall",
  "Undichtigkeit", "Wassereinbruch", "Leckage",
  "Putzschäden", "Anstrichschäden", "Verfärbungen",
  "Standsicherheitsmängel", "Tragfähigkeitsmängel",
  "Wärmebrücken", "Energieversorgungsmängel",
  "Sonstige Mängel",
];

export async function extractDefects(
  rawNotes: string,
): Promise<ExtractedDefect[]> {
  const result = await completeJson<{ defects: ExtractedDefect[] }>({
    model: HAIKU_MODEL,
    maxTokens: 1024,
    system: `Du bist ein Assistent für Bausachverständige in Deutschland. 
Extrahiere aus dem Freitext alle beschriebenen Baumängel als strukturierte JSON-Liste.

Gültige Bauteile (component): ${DEFECT_COMPONENTS.join(", ")}
Gültige Schadensarten (damageType): ${DAMAGE_TYPES.join(", ")}
Gültige Schweregrade (severity): "leicht", "mittel", "schwer", "kritisch"

Antworte NUR mit validem JSON in diesem Format (keine Markdown-Fences, kein Prosatext):
{
  "defects": [
    {
      "component": "<Bauteil>",
      "damageType": "<Schadensart>",
      "severity": "<Schweregrad>",
      "description": "<Kurzbeschreibung 1-2 Sätze auf Deutsch>",
      "remediation": "<Sanierungsempfehlung oder null>",
      "estimatedCost": "<Kostenschätzung z.B. '800–1.200 €' oder null>"
    }
  ]
}

Verwende immer die nächstpassende Kategorie aus den Vorgabelisten.
Wenn mehrere Mängel beschrieben werden, erstelle mehrere Einträge.`,
    user: rawNotes.slice(0, 8000),
  });

  return result?.defects ?? [];
}

// ── Gutachten-Generierung via Sonnet (nutzerseitig sichtbarer Text) ───────────

export async function generateReport(
  caseData: CaseForReport,
): Promise<GeneratedReport | null> {
  const defectList = caseData.defects
    .map(
      (d, i) =>
        `${i + 1}. ${d.component} — ${d.damageType} (${d.severity}): ${d.description}` +
        (d.remediation ? `\n   Empfehlung: ${d.remediation}` : "") +
        (d.estimatedCost ? `\n   Kostenschätzung: ${d.estimatedCost}` : ""),
    )
    .join("\n\n");

  const inspectionDateStr = caseData.inspectionDate
    ? new Date(caseData.inspectionDate).toLocaleDateString("de-DE")
    : "nicht angegeben";

  const result = await completeJson<GeneratedReport>({
    model: SONNET_MODEL,
    maxTokens: 2048,
    system: `Du bist ein erfahrener Bausachverständiger in Deutschland und verfasst professionelle Baugutachten.
Schreibe sachlich, präzise und in korrektem Deutsch. Verwende Fachbegriffe korrekt.
Halte dich an die übliche Struktur von Baugutachten gemäß DIN-Normen und HOAI.
Antworte ausschließlich mit validem JSON (kein Markdown, keine Erklärungen).`,
    user: `Erstelle das Gutachten für folgenden Auftrag:

Objekt: ${caseData.title}
Adresse: ${caseData.address}
Auftraggeber: ${caseData.clientName}
Begehungsdatum: ${inspectionDateStr}
Gebäudetyp: ${caseData.propertyType ?? "nicht angegeben"}

Festgestellte Mängel:
${defectList}

Erstelle folgende drei Abschnitte und gib sie als JSON zurück:
{
  "executiveSummary": "<Zusammenfassung des Gutachtens, 2-4 Absätze, Überblick über Auftrag und wesentliche Feststellungen>",
  "defectNarrative": "<Ausführliche Mängelbeschreibung, jeden Mangel als eigenen Absatz, mit Verweis auf Normen wo sinnvoll (z.B. DIN 18195, DIN 4108, VOB)>",
  "conclusion": "<Fazit: Zusammenfassung der wesentlichen Mängel, Dringlichkeitsbewertung, Gesamteinschätzung des Gebäudezustands und Handlungsempfehlungen>"
}`,
  });

  return result;
}
```

---

## 5. API Routes

| Datei | Methode | Funktion |
|-------|---------|----------|
| `src/app/api/cases/route.ts` | GET | Liste aller Cases der Organisation |
| `src/app/api/cases/route.ts` | POST | Neuen Case anlegen |
| `src/app/api/cases/[id]/route.ts` | GET | Case-Detail mit Mängeln |
| `src/app/api/cases/[id]/route.ts` | PATCH | Case aktualisieren (Status, Felder) |
| `src/app/api/cases/[id]/defects/route.ts` | POST | Mängel aus Freitext extrahieren + speichern |
| `src/app/api/cases/[id]/defects/[defectId]/route.ts` | DELETE | Einzelnen Mangel löschen |
| `src/app/api/cases/[id]/report/route.ts` | POST | Gutachten generieren (Sonnet-Call) |
| `src/app/api/cases/[id]/report/route.ts` | GET | Gespeichertes Gutachten abrufen |
| `src/app/api/cases/[id]/report/pdf/route.ts` | GET | PDF-Download |
| `src/app/api/transcribe/route.ts` | POST | Audio → Whisper → Text |

---

## 6. Dashboard UI — 5 Screens

### Screen 1: Fallübersicht `/dashboard/cases`
- Tabelle aller Cases mit: Titel, Adresse, Auftraggeber, Status-Badge (Draft/In Progress/Review/Completed), Datum
- "+ Neuer Fall" Button oben rechts
- Klick auf Row → Case-Detail

### Screen 2: Neuer Fall `/dashboard/cases/new`
- Formular: Titel, Adresse, Auftraggeber, E-Mail, Gebäudetyp, Begehungsdatum, Fallnummer
- Validate + POST /api/cases → redirect zu Case-Detail

### Screen 3: Case-Detail `/dashboard/cases/[id]`
- Header: Fallinformationen, Status-Badge
- Linke Hälfte: Mängelliste (Karten mit Bauteil, Schadensart, Schweregrad-Badge, Beschreibung, Lösch-Button)
- Rechte Hälfte: Erfassungsbereich
  - Textarea für Freitext-Diktat
  - Mikrofon-Button (Sprachaufnahme via MediaRecorder → /api/transcribe → füllt Textarea)
  - "Mängel extrahieren" Button → POST /api/cases/[id]/defects
  - Lade-Spinner während KI arbeitet
- Footer: "Gutachten generieren" Button (aktiv wenn ≥1 Mangel vorhanden), führt zu Screen 4

### Screen 4: Gutachten-Vorschau `/dashboard/cases/[id]/report`
- Generierungs-Spinner (SSE oder Polling alle 2s auf /api/cases/[id]/report bis status=READY)
- Fertiges Gutachten: Zusammenfassung, Mängelbeschreibung, Fazit — formatiert wie echtes Dokument
- "PDF herunterladen" Button → GET /api/cases/[id]/report/pdf
- "Zurück" Button → Case-Detail

### Screen 5: Billing `/dashboard/billing` (existiert schon, nur anpassen)
- Usage: "X von 3 Gutachten diesen Monat verwendet" (FREE) oder "X von 50" (PRO)
- Upgrade-Button wenn FREE

---

## 7. Week 1 Build Order

### Tag 1 (Montag) — Datenmodell + CRUD
- Prisma-Schema ergänzen, Migration laufen lassen
- `plans.ts` und `quota.ts` anpassen
- GET/POST `/api/cases` implementieren
- GET `/api/cases/[id]` implementieren
- Fallübersicht + Neuer-Fall-Formular bauen

### Tag 2 (Dienstag) — KI-Extraktion + Mangelerfassung
- `src/lib/ai/gutachten.ts` schreiben (`extractDefects` via Haiku)
- POST `/api/cases/[id]/defects` implementieren (inkl. Quota-Check)
- Case-Detail-Screen mit Textarea + Extraktions-Button bauen
- DELETE `/api/cases/[id]/defects/[defectId]` hinzufügen

### Tag 3 (Mittwoch) — Gutachten-Generierung
- `generateReport` via Sonnet implementieren
- POST `/api/cases/[id]/report` implementieren (async via Status-Polling)
- Gutachten-Vorschau-Screen bauen
- Status-Badge + Case-Status-Maschine verdrahten

### Tag 4 (Donnerstag) — PDF-Export
- `npm install @react-pdf/renderer`
- `src/components/pdf/GutachtenDocument.tsx` bauen
- GET `/api/cases/[id]/report/pdf` implementieren
- Download-Button in Vorschau einbauen

### Tag 5 (Freitag) — Voice Input
- `npm install` kein Package nötig (native MediaRecorder API)
- POST `/api/transcribe` mit Whisper-API implementieren
- Mikrofon-Button im Case-Detail bauen (Start/Stop/Loading-State)
- OPENAI_API_KEY in .env.local ergänzen

### Tag 6 (Samstag) — Billing + Limits + Deploy
- Quota-Check in Report-Route testen
- Stripe: PRO-Plan mit 50er-Limit konfigurieren
- Vercel deploy + env vars setzen
- End-to-end Test: Anmelden → Fall anlegen → Diktat → Extraktion → Gutachten → PDF

### Tag 7 (Sonntag) — Erster Kunde
- Outreach starten (Script unten)
- Loom-Video aufnehmen (5 Min, zeigt kompletten Flow)
- Landing Page: ein klarer CTA "Kostenlos testen"

---

## 8. First Customer Script

**Kanal:** LinkedIn-Direktnachricht oder E-Mail via XING / Website  
**Zielgruppe:** Bausachverständige, die öffentlich als freiberuflich oder mit kleinem Büro erkennbar sind

---

**Betreff:** Gutachten in 20 Minuten statt 4 Stunden — testest du das?

> Hallo [Name],
>
> ich entwickle gerade ein Tool, das Bausachverständigen die Schreibarbeit bei Gutachten abnimmt: Freitext oder Diktat aus der Ortsbegehung eingeben, KI strukturiert die Mängel automatisch und generiert das fertige Gutachten auf Deutsch — inklusive PDF-Export.
>
> Ich suche 3 Sachverständige, die das kostenlos testen und mir ehrliches Feedback geben. Zeitaufwand: ein echter Fall, 30 Minuten Gespräch danach.
>
> Passt das gerade? Ich schicke dir dann einen kostenlosen Zugang.
>
> Viele Grüße,  
> Kemal

**Follow-up (nach 5 Tagen ohne Antwort):**
> Kurze Nachfrage — hattest du Gelegenheit, draufzuschauen? Würde mich sehr über dein Urteil als Praktiker freuen.

**Kanäle:**
- LinkedIn: Suche nach "Bausachverständiger" + Location DE/AT/CH
- XING: Fachgruppe "Sachverständige im Bauwesen"
- Facebook-Gruppe: "Bausachverständige Deutschland" (~3.000 Mitglieder)
- Direkt aus Sachverständigenverzeichnissen (IHK, DIHK, PerKon, BVSK)

---

## 9. Open Questions — ohne Code validieren

1. **Pro-Gutachten vs. monatliches Abo?**  
   Sachverständige, die 2x/Monat ein großes Gutachten schreiben, fühlen 49 €/Monat teuer an — würden aber 12 € pro Gutachten sofort zahlen. Validieren per Interviewfrage: "Was wäre fair — Flatrate oder Pay-per-Report?"

2. **DSGVO-Blocker: Wo liegen die Daten?**  
   Gutachten enthalten personenbezogene Daten (Eigentümer, Mieter, Adresse, Gebäudezustand). Viele SV sind sensibel für Cloud-Datenhaltung. Validieren: "Wäre Verarbeitung auf EU-Servern (Vercel Frankfurt) ausreichend, oder brauchst du einen Auftragsverarbeitungsvertrag (AVV)?"

3. **Akzeptanz der KI-Qualität ohne Fachkorrektur?**  
   Ein Gutachten hat rechtliche Relevanz. Werden SV das generierte Ergebnis vertrauen oder immer komplett umschreiben? Validieren: Einen echten Fall durch das Tool laufen lassen und SV direkt fragen: "Was würdest du ändern, was übernimmst du 1:1?"

---

## 10. Vollständige API-Routen (Produktionsreif)

### Route A: `POST /api/cases/[id]/defects` — Mängel extrahieren

```typescript
// src/app/api/cases/[id]/defects/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/tenant";
import { getActionUsage } from "@/lib/quota";
import { extractDefects } from "@/lib/ai/gutachten";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  rawNotes: z.string().min(10).max(8000),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { organizationId } = await requireOrg();
  const { id: caseId } = await params;

  // Case muss dieser Organisation gehören
  const case_ = await prisma.case.findFirst({
    where: { id: caseId, organizationId },
    select: { id: true },
  });
  if (!case_) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Extraktion via Haiku (zählt NICHT als Report-Action, ist billig)
  const extracted = await extractDefects(parsed.data.rawNotes);
  if (!extracted || extracted.length === 0) {
    return NextResponse.json(
      { error: "Keine Mängel aus dem Text erkannt. Bitte konkretere Beschreibung." },
      { status: 422 },
    );
  }

  // Bestehende Position für Sortierung ermitteln
  const lastDefect = await prisma.defect.findFirst({
    where: { caseId },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  const startPosition = (lastDefect?.position ?? -1) + 1;

  // Mängel speichern + Case-Status aktualisieren
  const [defects] = await prisma.$transaction([
    prisma.defect.createManyAndReturn({
      data: extracted.map((d, i) => ({
        organizationId,
        caseId,
        component: d.component,
        damageType: d.damageType,
        severity: d.severity,
        description: d.description,
        rawNotes: parsed.data.rawNotes,
        remediation: d.remediation ?? null,
        estimatedCost: d.estimatedCost ?? null,
        position: startPosition + i,
      })),
    }),
    prisma.case.update({
      where: { id: caseId },
      data: { status: "IN_PROGRESS" },
    }),
  ]);

  return NextResponse.json({ defects, count: defects.length }, { status: 201 });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { organizationId } = await requireOrg();
  const { id: caseId } = await params;

  const defects = await prisma.defect.findMany({
    where: { caseId, organizationId },
    orderBy: { position: "asc" },
  });

  return NextResponse.json({ defects });
}
```

### Route B: `POST /api/cases/[id]/report` — Gutachten generieren

```typescript
// src/app/api/cases/[id]/report/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/tenant";
import { getActionUsage } from "@/lib/quota";
import { generateReport } from "@/lib/ai/gutachten";
import { isEntitled } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { organizationId } = await requireOrg();
  const { id: caseId } = await params;

  // Case mit Mängeln laden — immer über organizationId scopen
  const case_ = await prisma.case.findFirst({
    where: { id: caseId, organizationId },
    include: {
      defects: { orderBy: { position: "asc" } },
      report: { select: { id: true, status: true } },
      organization: {
        select: { plan: true, subscriptionStatus: true },
      },
    },
  });

  if (!case_) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (case_.defects.length === 0) {
    return NextResponse.json(
      { error: "Mindestens ein Mangel erforderlich." },
      { status: 400 },
    );
  }

  // Quota-Check (Report = kostenpflichtige Aktion)
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

  // Laufenden Report nicht doppelt starten (Idempotenz)
  if (case_.report?.status === "GENERATING") {
    return NextResponse.json(
      { message: "Gutachten wird bereits generiert.", reportId: case_.report.id },
      { status: 202 },
    );
  }

  // Report-Datensatz anlegen / zurücksetzen
  const report = await prisma.report.upsert({
    where: { caseId },
    create: {
      caseId,
      organizationId,
      status: "GENERATING",
    },
    update: {
      status: "GENERATING",
      executiveSummary: null,
      defectNarrative: null,
      conclusion: null,
      errorMessage: null,
      generatedAt: null,
    },
  });

  // Sonnet-Call (kann 5-15s dauern) — Fire-and-forget, Client pollt
  void (async () => {
    try {
      const generated = await generateReport({
        title: case_.title,
        address: case_.address,
        clientName: case_.clientName,
        inspectionDate: case_.inspectionDate,
        propertyType: case_.propertyType,
        defects: case_.defects,
      });

      if (!generated) throw new Error("KI-Antwort war null");

      await prisma.report.update({
        where: { id: report.id },
        data: {
          status: "READY",
          executiveSummary: generated.executiveSummary,
          defectNarrative: generated.defectNarrative,
          conclusion: generated.conclusion,
          generatedAt: new Date(),
        },
      });

      // Case-Status auf REVIEW setzen
      await prisma.case.update({
        where: { id: caseId },
        data: { status: "REVIEW" },
      });
    } catch (err) {
      console.error("[report] Generierung fehlgeschlagen:", err);
      await prisma.report.update({
        where: { id: report.id },
        data: {
          status: "ERROR",
          errorMessage:
            err instanceof Error ? err.message : "Unbekannter Fehler",
        },
      });
    }
  })();

  return NextResponse.json(
    { message: "Generierung gestartet.", reportId: report.id },
    { status: 202 },
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { organizationId } = await requireOrg();
  const { id: caseId } = await params;

  const report = await prisma.report.findFirst({
    where: { caseId, organizationId },
  });

  if (!report) {
    return NextResponse.json({ error: "Kein Gutachten vorhanden" }, { status: 404 });
  }

  return NextResponse.json({ report });
}
```

---

## 11. React-Komponente: Case-Detail-Screen (Kernkomponente)

```tsx
// src/app/(dashboard)/cases/[id]/page.tsx
// Server Component — lädt Daten, übergibt an Client-Komponenten

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/tenant";
import { CaseDetailClient } from "./case-detail-client";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { organizationId } = await requireOrg();
  const { id } = await params;

  const case_ = await prisma.case.findFirst({
    where: { id, organizationId },
    include: {
      defects: { orderBy: { position: "asc" } },
      report: { select: { id: true, status: true } },
    },
  });

  if (!case_) notFound();

  return <CaseDetailClient case_={case_} />;
}
```

```tsx
// src/app/(dashboard)/cases/[id]/case-detail-client.tsx
"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Case, Defect, Report } from "@prisma/client";

type CaseWithRelations = Case & {
  defects: Defect[];
  report: Pick<Report, "id" | "status"> | null;
};

const SEVERITY_COLORS = {
  leicht: "bg-green-100 text-green-800",
  mittel: "bg-yellow-100 text-yellow-800",
  schwer: "bg-orange-100 text-orange-800",
  kritisch: "bg-red-100 text-red-800",
};

export function CaseDetailClient({ case_ }: { case_: CaseWithRelations }) {
  const router = useRouter();
  const [rawNotes, setRawNotes] = useState("");
  const [isExtracting, startExtraction] = useTransition();
  const [isGenerating, startGeneration] = useTransition();
  const [isRecording, setIsRecording] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.start();
      setIsRecording(true);
    } catch {
      alert("Mikrofon-Zugriff verweigert. Bitte Berechtigung erteilen.");
    }
  }

  async function stopRecording() {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    return new Promise<void>((resolve) => {
      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        recorder.stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);

        const form = new FormData();
        form.append("audio", blob, "recording.webm");

        try {
          const res = await fetch("/api/transcribe", { method: "POST", body: form });
          const data = await res.json();
          if (data.text) setRawNotes((prev) => (prev ? `${prev}\n${data.text}` : data.text));
        } catch {
          alert("Transkription fehlgeschlagen. Bitte erneut versuchen.");
        }
        resolve();
      };
      recorder.stop();
    });
  }

  function handleExtract() {
    if (!rawNotes.trim() || rawNotes.length < 10) return;
    setExtractError(null);

    startExtraction(async () => {
      const res = await fetch(`/api/cases/${case_.id}/defects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawNotes }),
      });
      const data = await res.json();

      if (!res.ok) {
        setExtractError(data.error ?? "Extraktion fehlgeschlagen.");
        return;
      }

      setRawNotes("");
      router.refresh();
    });
  }

  function handleGenerateReport() {
    startGeneration(async () => {
      const res = await fetch(`/api/cases/${case_.id}/report`, { method: "POST" });
      const data = await res.json();

      if (res.status === 402) {
        alert(`Limit erreicht: ${data.error}`);
        return;
      }
      if (!res.ok) {
        alert(data.error ?? "Gutachten-Generierung fehlgeschlagen.");
        return;
      }

      router.push(`/dashboard/cases/${case_.id}/report`);
    });
  }

  async function handleDeleteDefect(defectId: string) {
    if (!confirm("Diesen Mangel wirklich löschen?")) return;
    await fetch(`/api/cases/${case_.id}/defects/${defectId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{case_.title}</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {case_.address} · Auftraggeber: {case_.clientName}
          </p>
        </div>
        <StatusBadge status={case_.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linke Spalte: Mängelliste */}
        <section>
          <h2 className="text-lg font-semibold mb-3">
            Mängel ({case_.defects.length})
          </h2>
          {case_.defects.length === 0 ? (
            <p className="text-neutral-400 text-sm">
              Noch keine Mängel erfasst. Diktat eingeben und extrahieren.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {case_.defects.map((d) => (
                <li
                  key={d.id}
                  className="rounded-lg border border-neutral-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      {d.component} — {d.damageType}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          SEVERITY_COLORS[d.severity as keyof typeof SEVERITY_COLORS] ??
                          "bg-neutral-100 text-neutral-800"
                        }`}
                      >
                        {d.severity}
                      </span>
                      <button
                        onClick={() => handleDeleteDefect(d.id)}
                        className="text-neutral-400 hover:text-red-500 text-xs"
                        aria-label="Mangel löschen"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600">{d.description}</p>
                  {d.remediation && (
                    <p className="text-xs text-neutral-400 mt-1">
                      → {d.remediation}
                    </p>
                  )}
                  {d.estimatedCost && (
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Kosten: {d.estimatedCost}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Rechte Spalte: Erfassung */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Diktat / Freitext</h2>

          {/* Voice-Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isRecording
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {isRecording ? "⏹ Aufnahme stoppen" : "🎙 Aufnahme starten"}
            </button>
            {isRecording && (
              <span className="text-red-500 text-sm animate-pulse">● Aufnahme läuft</span>
            )}
          </div>

          <textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Hier Beobachtungen eingeben oder Aufnahme starten...&#10;&#10;Beispiel: Im Keller sichtbare Feuchteschäden an der nördlichen Außenwand, ca. 30 cm Höhe, Schimmelbildung erkennbar. Estrich im Bereich der Kellertür weist Risse auf, Breite ca. 2-3mm."
            rows={8}
            maxLength={8000}
            className="w-full rounded-lg border border-neutral-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">{rawNotes.length}/8000</span>
          </div>

          {extractError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {extractError}
            </p>
          )}

          <button
            onClick={handleExtract}
            disabled={isExtracting || rawNotes.trim().length < 10}
            className="w-full rounded-lg bg-black text-white py-2.5 text-sm font-medium hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isExtracting ? "Mängel werden extrahiert…" : "Mängel extrahieren"}
          </button>
        </section>
      </div>

      {/* Footer: Gutachten generieren */}
      <div className="border-t border-neutral-200 pt-4 flex justify-end">
        <button
          onClick={handleGenerateReport}
          disabled={case_.defects.length === 0 || isGenerating}
          className="rounded-lg bg-blue-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isGenerating ? "Gutachten wird generiert…" : "Gutachten generieren →"}
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: "bg-neutral-100 text-neutral-600",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    REVIEW: "bg-purple-100 text-purple-700",
    COMPLETED: "bg-green-100 text-green-700",
  };
  const labels: Record<string, string> = {
    DRAFT: "Entwurf",
    IN_PROGRESS: "In Bearbeitung",
    REVIEW: "Prüfung",
    COMPLETED: "Abgeschlossen",
  };
  return (
    <span className={`text-xs px-3 py-1 rounded-full font-medium ${styles[status] ?? styles.DRAFT}`}>
      {labels[status] ?? status}
    </span>
  );
}
```

---

## 12. Sub-Agent Research Findings

### 12a. PDF-Generierung in Next.js (Vercel)

**Empfehlung:** `@react-pdf/renderer` (v3.x)

- Install: `npm install @react-pdf/renderer`
- ~15 MB komprimiert — kein Chromium, funktioniert auf Vercel Hobby + Pro
- API: React-Komponenten (`<Document>`, `<Page>`, `<View>`, `<Text>`, `<Image>`)
- Server-Route: `export const runtime = "nodejs"` + `renderToBuffer(<GutachtenDocument />)`

```typescript
// src/app/api/cases/[id]/report/pdf/route.ts
import { renderToBuffer } from "@react-pdf/renderer";
import { GutachtenDocument } from "@/components/pdf/GutachtenDocument";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/tenant";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { organizationId } = await requireOrg();
  const { id: caseId } = await params;

  const report = await prisma.report.findFirst({
    where: { caseId, organizationId, status: "READY" },
    include: { case: { include: { defects: { orderBy: { position: "asc" } } } } },
  });

  if (!report) return new Response("Kein Gutachten verfügbar", { status: 404 });

  const buffer = await renderToBuffer(<GutachtenDocument report={report} />);
  const filename = `Gutachten-${report.case.caseNumber ?? report.case.id}.pdf`;

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
```

### 12b. Voice-Input: Browser → Whisper API

**Empfehlung:** Browser `MediaRecorder` (webm) → POST `/api/transcribe` → OpenAI Whisper API

- Endpoint: `POST https://api.openai.com/v1/audio/transcriptions`
- Parameter: `model=whisper-1`, `language=de`, akzeptiert `audio/webm`
- Kosten: **$0,006/Minute** — 10 Minuten = 6 Cent
- Kein Free-Tier; neue OpenAI-Accounts erhalten $5 Trial-Guthaben
- Rate-Limit in `/api/transcribe`: 20 Calls/Stunde/User (bereits im Blueprint implementiert)
- `OPENAI_API_KEY` in `.env.local` eintragen

### 12c. Deutsche Baugutachten-Taxonomie

**Bauteilkategorien (component):**
Dach, Dachstuhl, Dacheindeckung, Dachrinne/Entwässerung, Fassade, Außenwand, Wärmedämmverbundsystem (WDVS), Keller, Fundament/Bodenplatte, Kellerwand, Fenster, Türen/Tore, Elektroinstallation, Heizungsanlage, Sanitärinstallation, Innenausbau, Estrich, Bodenbeläge, Trockenbauarbeiten, Treppe, Balkon/Terrasse, Garage/Carport, Sonstiges

**Schadensarten (damageType):**
Rissbildung (Haarriss, Setzungsriss, Strukturriss), Feuchteschaden, Durchfeuchtung, Schimmelbefall, Kondensat, Frost-Tau-Schäden, Abplatzungen, Hohlstellen, Korrosion, Holzfäule, Holzschädlingsbefall (Hausbockkäfer, Hausschwamm), Undichtigkeit/Leckage, Putzschäden, Anstrichschäden, Verfärbungen/Ausblühungen, Standsicherheitsmangel, Wärmebrücken, Schallschutzmängel, Brandschutzmängel, Maßtoleranzen nach DIN 18202

**Schweregrade:**
- `leicht` — kosmetischer Mangel, keine sofortige Handlungspflicht
- `mittel` — Substanzgefährdung mittelfristig, Sanierung innerhalb 12 Monate
- `schwer` — erhebliche Substanzgefährdung, Sanierung innerhalb 3 Monate
- `kritisch` — unmittelbare Standsicherheit/Gesundheitsgefährdung, Sofortmaßnahme

**Relevante Normen:**
DIN 18195 (Bauwerksabdichtungen), DIN 4108 (Wärmeschutz), DIN 1045 (Beton), VOB/C, HOAI (Honorarordnung), BGB §634 (Mängelrechte), Energieeinsparverordnung (GEG)

**Wettbewerb (recherchiert Juli 2026):**

| Tool | Typ | Schwäche / unsere Lücke |
|------|-----|------------------------|
| **Bauexpert** | Desktop + iPad, ~30 Jahre am Markt, Sirados-Preisintegration | Kein KI, Desktop-first, kein Diktat-zu-Struktur-Flow |
| **Gutachten Manager** (Waning Software, 3.200+ User) | Desktop-SaaS, Word-Template-basiert, FixFoto-Fotos | Kein KI, Template-abhängig, altmodische UX |
| **Baugutachter.AI** ⚠️ | AI-native Cloud + Desktop, Diktat + Fotolabel, AktenKlarheit-Desktop 399€/Jahr | Existiert! Erste KI-native Lösung — Details unten |
| **PlanRadar** | Enterprise-SaaS für große Firmen | Nicht Gutachten-spezifisch, falsches Segment |

**⚠️ Wichtig: Baugutachter.AI (baugutachter.ai)** ist ein direkter KI-nativer Konkurrent. Bevor gebaut wird: deren UX analysieren, Preismodell prüfen, 3 SV-Interviews führen, um herauszufinden, was Baugutachter.AI nicht liefert. Die Differenzierung muss schärfer sein als „auch KI".

---

## 13. Competitive Moat — Was macht das in 6 Monaten schwer zu kopieren?

**Kontext:** Baugutachter.AI existiert als direkter Konkurrent. Der Moat muss spezifisch gegen deren Stärken positioniert sein, nicht nur gegen Desktop-Legacy-Tools.

1. **Strukturierte Taxonomie als Datenbankschicht, nicht nur als Dokument:** Bauexpert und Baugutachter.AI generieren Dokumente. Dieses Tool speichert jeden Mangel als strukturierten Datensatz (component, damageType, severity). Das ermöglicht nach 6 Monaten: "Welche Bauteile scheitern am häufigsten bei Gebäuden Baujahr 1970-1990?" — kein Konkurrent hat diese Query.

2. **Preis-Differenzierung:** Baugutachter.AI Desktop kostet 399€/Jahr (~33€/Monat) — unsere 49€/Monat-Cloud ist teurer. Entweder: unter 30€/Monat mit mehr Volumen anbieten, oder auf Differenzierung durch mobile Voice-First-UX setzen (Desktop-App ist mobil unbrauchbar).

3. **Voice-First auf der Baustelle:** Diktat via Whisper → sofortige strukturierte Extraktion → ohne Desktop-App. Das ist der einzige Flow, der auf einem Smartphone auf dem Dach funktioniert.

4. **Offene Web-App, kein Desktop-Download:** Baugutachter.AI hat eine Desktop-App. Keine Installation = kein Friction = schnellerer Trial. Vercel-URL reicht zum Testen.

5. **BVSK-Netzwerk-Effekt:** Wenn 3 einflussreiche SV das Tool öffentlich empfehlen (LinkedIn, BVSK-Forum), folgt die Community. Baugutachter.AI ist noch nicht in dieser Community verankert — als Solo-Gründer mit persönlicher Beziehung zu den ersten 20 Usern schlägt man jede Sales-Org.

**Validierungs-Hausaufgabe vor Build:** baugutachter.ai kostenlos testen, ihren Flow dokumentieren, 3 SV fragen "Was fehlt euch dort?" — dann diesen Blueprint anpassen.

---

## 14. Week 2–4 Roadmap — Nach dem MVP

### Woche 2: Foto-KI
- Bildupload im Case-Detail (bis 10 Fotos/Mangel)
- Claude Vision (Sonnet) analysiert Foto → automatische Beschreibung als Vorschlag
- Fotos eingebettet im PDF-Export
- Ziel: SV kann kompletten Gutachten-Flow mobil abschließen

### Woche 3: PDF-Professionalisierung
- Briefkopf-Upload (Logo, Kontaktdaten des SV)
- DIN-A4-konforme Formatierung mit automatischen Seitenzahlen
- Inhaltsverzeichnis und Mängeltabelle mit automatischer Nummerierung
- Mehrere PDF-Vorlagen (kurzes Kurzgutachten vs. ausführliches Vollgutachten)

### Woche 4: Team-Features + Retention
- Mehrere Sachverständige pro Organisation (Team-Abo: 149 €/Monat)
- Case-Zuweisung an Teammitglieder
- Monats-Report-Dashboard: welche Bauteile scheitern am häufigsten (aggregiert über alle Cases)
- E-Mail-Workflow: automatisches PDF-Versand an Auftraggeber direkt aus dem Tool

---

## Umgebungsvariablen (`.env.local` Ergänzungen)

```bash
# Bereits vorhanden in Template:
# ANTHROPIC_API_KEY=...
# DATABASE_URL=...
# STRIPE_PRICE_PRO=...

# Neu für dieses Produkt:
OPENAI_API_KEY=sk-...    # Für Whisper-Transkription (~0,006$/Min)
```

---

## Kritische Architektur-Checks

- [x] Alle Prisma-Queries über `organizationId` gescoped + `requireOrg()` in jeder Route
- [x] Haiku für Extraktion (günstig, hochvolumig), Sonnet nur für Report (nutzersichtbar)
- [x] `parseModelJson()` via `completeJson()` — kein rohes `JSON.parse`
- [x] Idempotenz beim Report: `upsert` + Status-Check verhindert doppelte Sonnet-Calls
- [x] Rate-Limit auf `/api/transcribe` (20/Stunde/User)
- [x] Input-Cap 8000 Zeichen auf allen Text-Inputs
- [x] `export const runtime = "nodejs"` in allen Routen mit bcrypt/PDF/Whisper
- [x] Stripe-Quota als harte Grenze (402-Response mit Upgrade-Link)
- [x] Prisma v6 gepinnt — nicht upgraden
