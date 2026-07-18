# MVP Blueprint: Wartungsbericht-Generator

> ⚠️ VALIDIERUNGSPHASE — kein Build vor 3 echten Kundengesprächen (Schritt 8).
> Erst wenn 1 Person sagt „Ja, dafür zahle ich", ist der Code an der Reihe.

**Datum:** 2026-07-18  
**Stack:** Next.js (App Router), Auth.js v5, Prisma v6, Stripe, Claude AI, Vercel  
**Signal:** WARM — Deep-Dive 2026-07-17  
**Leads:** `research/2026-07-17-leads-wartungsbericht-generator.md`

---

## 1. Idea Summary

### Was es tut

Handwerksbetriebe (SHK + Elektriker) dokumentieren Wartungseinsätze in 3 Minuten statt 30:

1. Techniker gibt Stichworte ein (Texteingabe oder diktiert): _„Brenner gereinigt, Elektrode verschlissen, Abgaswert 8,2 % CO₂ OK, Dichtung am Schauglas undicht — empfehle Austausch nächste Saison"_
2. Claude (Haiku) extrahiert strukturierte Daten: Tätigkeiten, Mängel mit Schweregrad, Messwerte, Empfehlungen
3. Claude (Sonnet) generiert einen fachsprachlich korrekten, haftungsrechtlich belastbaren Deutsch-Bericht
4. Techniker prüft, korrigiert bei Bedarf, markiert als fertig → druckbares PDF

Das Protokoll ist rechtssicher formuliert: klare Mängelbewertung, dokumentierte Empfehlungen, Techniker-Name — alles, was bei einer DGUV-V3-Prüfung oder Heizungswartung nach DVGW G 600 erwartet wird.

### Wer zahlt

**Primär:** Kleinstbetriebe (1–10 MA) ohne ERP-Software — Inhaber = Entscheider = Techniker.  
Für diese ist das Standalone-Tool das *erste* digitale Werkzeug, keine Doppeleingabe.

**Sekundär:** Betriebe mit ToolTime/Craftboxx, die den KI-Assistenten als schnelleres Interface nutzen und das PDF manuell ablegen.

### Preis

| Plan | Preis | Limit | Zielgruppe |
|---|---|---|---|
| FREE | 0 EUR | 3 Berichte/Monat | Trial, Kleinstbetriebe |
| STARTER | 29 EUR/Monat | 50 Berichte/Monat | Solo-Handwerker 1–2 MA |
| PRO | 59 EUR/Monat | Unbegrenzt | Betrieb 3–10 MA |

Einstiegspreis 29 EUR bewusst unter 39 EUR: Preissensitivität der Branche ist hoch, erster Abschluss wichtiger als Margin.

### Warum jetzt

- Kein direkter Standalone-KI-Wartungsbericht-Generator in DACH (verifiziert, Deep-Dive 2026-07-17)
- Nur 4 % der Handwerksbetriebe nutzen KI (Bitkom/DHI 2024) — First-Mover-Vorteil unter Kleinstbetrieben
- DGUV-V3 und DVGW G 600 sind gesetzliche Pflicht — Kaufentscheidung braucht kein „nice-to-have"-Argument
- ERP-Anbieter (HERO, Label Software) bauen KI aktiv aus — Standalone-Fenster schätzungsweise 18–36 Monate

---

## 2. Prisma Schema

Ergänzungen zu `prisma/schema.prisma`. Bestehende Modelle und Plan-Enum werden erweitert. Neue Relations auf Organization hinzufügen.

```prisma
// Plan-Enum um STARTER erweitern (Migration erforderlich)
enum Plan {
  FREE
  STARTER  // NEU: 29 EUR/Monat, 50 Berichte
  PRO      // 59 EUR/Monat, unbegrenzt
}

enum WartungsObjektTyp {
  HEIZUNG
  ELEKTRO
  KLIMA
  SANITAER
}

enum BerichtStatus {
  ENTWURF     // KI-Entwurf erstellt, noch nicht geprüft
  GEPRUEFT    // Techniker hat geprüft und freigegeben
  FERTIG      // Final, PDF vorhanden
  ARCHIVIERT
}

// Anlage / Gerät, für die Wartungsberichte erstellt werden
model WartungsObjekt {
  id             String            @id @default(cuid())
  organizationId String
  organization   Organization      @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  name           String            // z.B. "Heizungsanlage EG", "UV-Anlage Keller"
  typ            WartungsObjektTyp
  hersteller     String?
  baujahr        Int?
  seriennummer   String?
  standort       String?           // z.B. "Keller", "EG links", "Dach"
  kundeAdresse   String?

  berichte       WartungsBericht[]

  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  @@index([organizationId])
}

model WartungsBericht {
  id             String          @id @default(cuid())
  organizationId String
  organization   Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  objektId       String?
  objekt         WartungsObjekt? @relation(fields: [objektId], references: [id])

  // Techniker-Input (Rohnotizen, max. 8000 Zeichen — Input-Cap in der Route)
  notizen        String          @db.Text

  // KI-generierter Output
  berichtText    String?         @db.Text
  mangelListe    Json?           // [{ beschreibung: string, schwere: "GERING"|"MITTEL"|"KRITISCH" }]

  // Metadaten
  techniker      String
  kundeName      String?
  kundeAdresse   String?
  wartungsDatum  DateTime        @default(now())

  status         BerichtStatus   @default(ENTWURF)
  pdfUrl         String?

  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  @@index([organizationId])
  @@index([objektId])
  @@index([organizationId, createdAt]) // für Monats-Quota-Count
}
```

**Relationen auf Organization-Modell ergänzen:**

```prisma
model Organization {
  // ... bestehende Felder bleiben unverändert ...
  wartungsObjekte  WartungsObjekt[]
  wartungsBerichte WartungsBericht[]
}
```

**Migration ausführen:**

```bash
npx prisma migrate dev --name add-wartungsbericht
```

---

## 3. plans.ts Changes

`src/lib/plans.ts` — STARTER-Plan hinzufügen, FREE-Limit auf 3 senken, PRO als unbegrenzt markieren.

```typescript
export const PAID_PLANS = {
  STARTER: {
    priceId: process.env.STRIPE_PRICE_STARTER,
    monthlyActionLimit: 50,
    label: "Starter",
    priceLabel: "29 €/Monat",
  },
  PRO: {
    priceId: process.env.STRIPE_PRICE_PRO,
    monthlyActionLimit: 999999, // "unbegrenzt" — kein separater Branch nötig
    label: "Pro",
    priceLabel: "59 €/Monat",
  },
} satisfies Record<"STARTER" | "PRO", PlanConfig>;

export type PaidPlan = keyof typeof PAID_PLANS;

export const FREE_ACTION_LIMIT = 3; // 3 Berichte/Monat für FREE

export function actionLimitForPlan(plan: Plan): number {
  if (plan === "STARTER") return PAID_PLANS.STARTER.monthlyActionLimit;
  if (plan === "PRO") return PAID_PLANS.PRO.monthlyActionLimit;
  return FREE_ACTION_LIMIT;
}
```

**Neue .env-Variablen:**

```
STRIPE_PRICE_STARTER=price_xxx   # Im Stripe Dashboard anlegen: 29 EUR/Monat, recurring
STRIPE_PRICE_PRO=price_xxx       # 59 EUR/Monat, recurring
```

**Stripe-Webhook-Handler** (`src/app/api/stripe/webhook/route.ts`) — STARTER-Fall in der `planForPriceId`-Logik ergänzen. Sonst kein Umbau nötig, die bestehende Status-Maschine übernimmt alles.

---

## 4. src/lib/ai/wartungsbericht.ts

```typescript
import { complete, completeJson, HAIKU_MODEL, SONNET_MODEL } from "./client";

type WartungsTyp = "HEIZUNG" | "ELEKTRO" | "KLIMA" | "SANITAER";

interface WartungsInput {
  notizen: string;
  typ: WartungsTyp;
  techniker: string;
  kundeName?: string;
  kundeAdresse?: string;
  wartungsDatum: string;
  objektDetails?: { name?: string; hersteller?: string | null; baujahr?: number | null };
}

interface MangelEintrag {
  beschreibung: string;
  schwere: "GERING" | "MITTEL" | "KRITISCH";
}

interface ExtractedDaten {
  arbeiten: string[];
  maengel: MangelEintrag[];
  empfehlungen: string[];
  messwerte: { bezeichnung: string; wert: string; einheit: string }[];
  sicherheitshinweise: string[];
}

export interface WartungsberichtResult {
  berichtText: string;
  mangelListe: MangelEintrag[];
}

const TYP_BEZEICHNUNG: Record<WartungsTyp, string> = {
  HEIZUNG: "Heizungsanlage (gem. DVGW G 600 / TRGI)",
  ELEKTRO: "Elektroanlage (DGUV Vorschrift 3 / VDE 0105)",
  KLIMA: "Klimaanlage",
  SANITAER: "Sanitäranlage",
};

export async function generateWartungsbericht(
  input: WartungsInput
): Promise<WartungsberichtResult | null> {
  // Schritt 1: Strukturierte Extraktion mit Haiku (günstig, schnell)
  const extracted = await completeJson<ExtractedDaten>({
    model: HAIKU_MODEL,
    maxTokens: 1024,
    system:
      "Du analysierst Techniker-Notizen nach einem Wartungseinsatz. " +
      "Extrahiere strukturierte Daten als reines JSON, keine Markdown-Fences.",
    user: `Wartungstyp: ${TYP_BEZEICHNUNG[input.typ]}
Techniker-Notizen:
${input.notizen}

Extrahiere:
{
  "arbeiten": ["Liste der durchgeführten Tätigkeiten als kurze Aktionssätze"],
  "maengel": [{"beschreibung": "string", "schwere": "GERING|MITTEL|KRITISCH"}],
  "empfehlungen": ["Empfehlungen für den Kunden"],
  "messwerte": [{"bezeichnung": "string", "wert": "string", "einheit": "string"}],
  "sicherheitshinweise": ["Sicherheitsrelevante Befunde — leer wenn keine"]
}`,
  });

  if (!extracted) return null;

  // Schritt 2: Professionellen Berichtstext mit Sonnet generieren (nutzersichtbar)
  const hasMaengel = extracted.maengel.length > 0;

  const berichtText = await complete({
    model: SONNET_MODEL,
    maxTokens: 2000,
    system:
      "Du bist ein technischer Redakteur für Handwerksbetriebe in Deutschland. " +
      "Erstelle professionelle, normenkonforme Wartungsberichte in klarem Deutsch. " +
      "Haftungsrechtlich korrekte Formulierungen: 'festgestellt', 'empfohlen', 'dokumentiert' — nicht 'muss' oder 'ist defekt'. " +
      "Kein Markdown, nur Fließtext mit Absatzumbrüchen.",
    user: `Erstelle einen Wartungsbericht mit diesen Angaben:

Anlage: ${TYP_BEZEICHNUNG[input.typ]}
${input.objektDetails?.name ? `Bezeichnung: ${input.objektDetails.name}` : ""}
${input.objektDetails?.hersteller ? `Hersteller: ${input.objektDetails.hersteller}` : ""}
${input.objektDetails?.baujahr ? `Baujahr: ${input.objektDetails.baujahr}` : ""}
Datum: ${input.wartungsDatum}
Techniker: ${input.techniker}
${input.kundeName ? `Kunde: ${input.kundeName}` : ""}
${input.kundeAdresse ? `Adresse: ${input.kundeAdresse}` : ""}

Durchgeführte Arbeiten:
${extracted.arbeiten.map((a) => `• ${a}`).join("\n") || "• Routinewartung"}

${
  hasMaengel
    ? `Festgestellte Mängel:\n${extracted.maengel.map((m) => `• [${m.schwere}] ${m.beschreibung}`).join("\n")}`
    : "Mängel: Keine Mängel festgestellt."
}

Empfehlungen:
${extracted.empfehlungen.map((e) => `• ${e}`).join("\n") || "• Nächste Wartung gemäß Wartungsplan"}

${
  extracted.messwerte.length > 0
    ? `Messwerte:\n${extracted.messwerte.map((m) => `• ${m.bezeichnung}: ${m.wert} ${m.einheit}`).join("\n")}`
    : ""
}

${
  extracted.sicherheitshinweise.length > 0
    ? `SICHERHEITSHINWEISE:\n${extracted.sicherheitshinweise.map((s) => `• ${s}`).join("\n")}`
    : ""
}

Struktur (ohne Überschriften, als Fließtext-Absätze):
1. Anlagenbeschreibung und Zustand bei Ankunft (1–2 Sätze)
2. Durchgeführte Wartungsarbeiten (detailliert, fachsprachlich)
3. Festgestellte Mängel und Bewertung
4. Empfehlungen und Folgemaßnahmen
5. Abschlussbewertung (1 Satz — Anlage betriebsbereit ja/nein)`,
  });

  if (!berichtText) return null;

  return {
    berichtText,
    mangelListe: extracted.maengel,
  };
}
```

---

## 5. API Routes

| Datei | Methode | Funktion |
|---|---|---|
| `src/app/api/berichte/route.ts` | GET | Alle Berichte der Org auflisten (paginiert, org-scoped) |
| `src/app/api/berichte/generate/route.ts` | POST | KI-Bericht generieren (Rate-Limit + Quota-Check) |
| `src/app/api/berichte/[id]/route.ts` | GET | Einzelnen Bericht abrufen (org-scoped) |
| `src/app/api/berichte/[id]/route.ts` | PATCH | Berichtstext editieren / Status vorwärtsschieben |
| `src/app/api/objekte/route.ts` | GET | Wartungsobjekte der Org auflisten |
| `src/app/api/objekte/route.ts` | POST | Neues Wartungsobjekt anlegen |
| `src/app/api/objekte/[id]/route.ts` | PATCH | Wartungsobjekt aktualisieren |
| `src/app/api/objekte/[id]/route.ts` | DELETE | Wartungsobjekt löschen (nur wenn keine Berichte) |

---

## 6. Dashboard UI — 4 Screens

**Screen 1 — Berichte-Übersicht (`/dashboard/berichte`)**  
Tabelle: Datum | Objekt | Techniker | Mängel-Badge | Status-Badge | „Öffnen →"-Link  
Kopfzeile: Monats-Quota-Anzeige „14 / 50 Berichte diesen Monat"  
Button: „+ Neuer Bericht" → öffnet Screen 2 als Modal

**Screen 2 — Neuer Bericht (Modal)**  
Dropdown: Wartungstyp (Heizung / Elektro / Klima / Sanitär)  
Felder: Techniker-Name (Pflicht), Datum, Kundename, Adresse (optional)  
Textarea: Notizen / Diktat, maxLength=8000, Zeichenzähler  
Optional: Verknüpfung mit Wartungsobjekt (Autocomplete)  
Button: „Bericht generieren" → Loading-State → Redirect auf Screen 3

**Screen 3 — Bericht prüfen & finalisieren (`/dashboard/berichte/[id]`)**  
Links: Rohe Notizen (readonly, grau hinterlegt)  
Rechts: KI-generierter Berichtstext (editierbar, Textarea mit Auto-Save)  
Unten: Mängelliste als Badges (GERING=gelb, MITTEL=orange, KRITISCH=rot)  
Buttons: „Freigeben" (ENTWURF → GEPRUEFT → FERTIG), „Drucken" (`window.print()`)  
CSS-`@media print` blendet Navigation aus, formatiert Bericht als A4

**Screen 4 — Wartungsobjekte (`/dashboard/objekte`)**  
Tabelle aller Anlagen der Org: Name | Typ | Hersteller | Baujahr | Standort  
Pro Eintrag: Link „X Berichte anzeigen" → gefilterte Berichte-Übersicht  
Button: „+ Neue Anlage" → Inline-Form

---

## 7. Week 1 Build Order

**Tag 1 (Mo) — Schema + AI-Funktion**
- Prisma-Schema-Ergänzungen, `npx prisma migrate dev --name add-wartungsbericht`
- `src/lib/ai/wartungsbericht.ts` implementieren
- Manuell testen: `generateWartungsbericht()` mit 3 echten Beispiel-Notizen (SHK Heizung, DGUV-V3 Elektro, Klima)

**Tag 2 (Di) — Generate-Route + Quota**
- `POST /api/berichte/generate` vollständig (Quota, Rate-Limit, Validierung, DB-Write)
- `GET /api/berichte` mit paginierter Org-Scope-Query
- plans.ts anpassen, STRIPE_PRICE_STARTER in .env.local setzen

**Tag 3 (Mi) — PATCH-Route + Objekte**
- `PATCH /api/berichte/[id]` mit Status-Maschine
- `GET + POST /api/objekte` und `PATCH /api/objekte/[id]`
- `@media print`-CSS für Screen 3 (kein PDF-Server in Woche 1)

**Tag 4 (Do) — Dashboard UI**
- Screen 1: Berichte-Übersicht (Server Component)
- Screen 2: NeuerBerichtDialog (Client Component)
- Screen 3: Bericht-Detail mit editierbarem Textfeld und Status-Buttons

**Tag 5 (Fr) — Stripe + Deploy**
- STARTER-Plan in Stripe Dashboard anlegen (29 EUR/Monat recurring)
- Webhook-Handler: STARTER-Fall in `planForPriceId` ergänzen
- Vercel-Deploy, End-to-End-Smoke-Test mit echten Notizen
- Screen 4: Wartungsobjekte-Liste (vereinfacht, nur Tabelle)

---

## 8. First Customer Script

**Montag 08:30 — Kaltakquise Telefon (nicht E-Mail, nicht LinkedIn)**

Zielgruppe: 10 Betriebe aus `research/2026-07-17-leads-wartungsbericht-generator.md`  
Beginn mit Stärkstem-Wartungsprofil: Haustechnik Rinnhofer (SHK) und ERT Elektrotechnik (DGUV-V3)

**Skript:**

> „Guten Morgen, mein Name ist Kemal Altiparmak, ich bin Softwareentwickler aus Mannheim.
> Ich entwickle gerade ein Tool für Handwerksbetriebe, das nach einem Wartungseinsatz
> automatisch den Bericht schreibt — der Techniker gibt kurz ein, was er gemacht hat,
> und das System generiert den fertigen Bericht in 2–3 Minuten. Kein ERP, nur ein Browser.
>
> Ich suche Betriebe, die mir 15 Minuten ihre Zeit schenken und mir ehrlich sagen,
> ob das für sie Sinn ergibt — und was es können müsste, damit sie dafür zahlen würden.
> Das kostet nichts, ich verkaufe heute nichts.
> Hätten Sie diese Woche kurz Zeit?"

Ziel: **3 Gespräche, 1 Person die sagt „Ja, das würde ich nutzen und dafür zahlen."**  
Danach erst: Code-Start.

**Parallel (Facebook, gleicher Tag):**  
Gruppe „SHK Handwerker Deutschland" oder „Handwerkerforum":

> „Kurze Frage an SHK- und Elektro-Betriebe: Wie lange braucht ihr nach einem Wartungseinsatz für den Bericht? Noch in Word oder habt ihr schon was Digitales? Ich baue gerade etwas und würde mich über ehrliche Einschätzungen freuen — keine Links, nur eine Frage."

---

## 9. Open Questions (vor dem ersten Commit ohne Code klären)

1. **Wie viele Berichte schreibt ein 2-Mann-SHK-Betrieb pro Monat?**  
   5? 20? 50? Das bestimmt, ob das STARTER-Limit von 50 realistisch ist oder ob Kunden sofort upgraden müssen. Antwort aus den ersten 3 Gesprächen ableiten.

2. **DGUV-V3-Elektriker oder Heizungs-SHK als erste Nische?**  
   DGUV-V3-Format ist stärker normiert → einfachere KI-Vorlage. SHK-Heizungswartung ist saisonal (Hauptgeschäft Herbst) → Markteinstieg im August/September ideal. Die ersten 3 Gespräche entscheiden.

3. **Welches Output-Format bevorzugen Handwerker?**  
   PDF per E-Mail an Kunden? Papierausdruck vor Ort? QR-Code-Link? Antwort entscheidet über die PDF-Infrastruktur (window.print() vs. Server-PDF). Direkt fragen: „Wie geben Sie den Bericht heute an den Kunden?"

---

## 10. Implementation Code — 2 Complex API Routes

### Route A: `src/app/api/berichte/generate/route.ts`

Die kritischste Route: Rate-Limit, org-scoped Quota-Check (Monats-Zähler), Input-Validierung, zweistufiger KI-Aufruf, DB-Write.

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/tenant";
import { checkRateLimit } from "@/lib/ratelimit";
import { generateWartungsbericht } from "@/lib/ai/wartungsbericht";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INPUT_CAP = 8000;
const VALID_TYPEN = ["HEIZUNG", "ELEKTRO", "KLIMA", "SANITAER"] as const;
type WartungsTyp = (typeof VALID_TYPEN)[number];

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { organizationId } = await requireOrg();

  // IP-Rate-Limit: max. 30 Generierungen pro Stunde pro IP
  const allowed = await checkRateLimit("berichte-gen", 30, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte in einer Stunde erneut versuchen." },
      { status: 429 }
    );
  }

  // Monats-Quota der Organisation prüfen
  const [org, usedThisMonth] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: { monthlyActionLimit: true },
    }),
    prisma.wartungsBericht.count({
      where: {
        organizationId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  if (org && usedThisMonth >= org.monthlyActionLimit) {
    return NextResponse.json(
      {
        error: `Monatliches Limit von ${org.monthlyActionLimit} Berichten erreicht. Bitte Plan upgraden.`,
        limitReached: true,
      },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Request-Body" }, { status: 400 });
  }

  const { notizen, typ, techniker, kundeName, kundeAdresse, wartungsDatum, objektId } =
    body as Partial<{
      notizen: string;
      typ: string;
      techniker: string;
      kundeName: string;
      kundeAdresse: string;
      wartungsDatum: string;
      objektId: string;
    }>;

  if (!notizen?.trim()) {
    return NextResponse.json({ error: "Notizen fehlen" }, { status: 400 });
  }
  if (notizen.length > INPUT_CAP) {
    return NextResponse.json(
      { error: `Notizen dürfen maximal ${INPUT_CAP} Zeichen enthalten` },
      { status: 400 }
    );
  }
  if (!typ || !(VALID_TYPEN as readonly string[]).includes(typ)) {
    return NextResponse.json(
      { error: `Ungültiger Wartungstyp. Erlaubt: ${VALID_TYPEN.join(", ")}` },
      { status: 400 }
    );
  }
  if (!techniker?.trim()) {
    return NextResponse.json({ error: "Techniker-Name fehlt" }, { status: 400 });
  }

  // Wartungsobjekt-Lookup org-scoped — niemals fremde Objekte laden
  let objektDetails:
    | { name: string; hersteller: string | null; baujahr: number | null }
    | undefined;
  if (objektId) {
    const objekt = await prisma.wartungsObjekt.findFirst({
      where: { id: objektId, organizationId },
      select: { name: true, hersteller: true, baujahr: true },
    });
    if (!objekt) {
      return NextResponse.json({ error: "Wartungsobjekt nicht gefunden" }, { status: 404 });
    }
    objektDetails = objekt;
  }

  const result = await generateWartungsbericht({
    notizen,
    typ: typ as WartungsTyp,
    techniker,
    kundeName,
    kundeAdresse,
    wartungsDatum: wartungsDatum ?? new Date().toISOString().split("T")[0],
    objektDetails,
  });

  if (!result) {
    return NextResponse.json(
      { error: "KI-Generierung fehlgeschlagen. Bitte erneut versuchen." },
      { status: 500 }
    );
  }

  const bericht = await prisma.wartungsBericht.create({
    data: {
      organizationId,
      objektId: objektId ?? null,
      notizen,
      berichtText: result.berichtText,
      mangelListe: result.mangelListe,
      techniker,
      kundeName: kundeName ?? null,
      kundeAdresse: kundeAdresse ?? null,
      wartungsDatum: wartungsDatum ? new Date(wartungsDatum) : new Date(),
      status: "ENTWURF",
    },
    select: {
      id: true,
      berichtText: true,
      mangelListe: true,
      status: true,
      techniker: true,
      kundeName: true,
      wartungsDatum: true,
    },
  });

  return NextResponse.json({ bericht }, { status: 201 });
}
```

### Route B: `src/app/api/berichte/[id]/route.ts`

Status-Maschine + org-scoped Zugriff. Enthält GET und PATCH.

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/tenant";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { organizationId } = await requireOrg();

  const bericht = await prisma.wartungsBericht.findFirst({
    where: { id: params.id, organizationId },
    include: {
      objekt: {
        select: { name: true, typ: true, hersteller: true, baujahr: true, standort: true },
      },
    },
  });

  if (!bericht) {
    return NextResponse.json({ error: "Bericht nicht gefunden" }, { status: 404 });
  }

  return NextResponse.json({ bericht });
}

// Status-Maschine: ENTWURF → GEPRUEFT → FERTIG → ARCHIVIERT
const VALID_TRANSITIONS: Record<string, string[]> = {
  ENTWURF: ["GEPRUEFT", "ARCHIVIERT"],
  GEPRUEFT: ["FERTIG", "ENTWURF"],
  FERTIG: ["ARCHIVIERT"],
  ARCHIVIERT: [],
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { organizationId } = await requireOrg();

  // Org-scoped Read vor dem Write — verhindert Cross-Tenant-Write
  const existing = await prisma.wartungsBericht.findFirst({
    where: { id: params.id, organizationId },
    select: { id: true, status: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Bericht nicht gefunden" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Request-Body" }, { status: 400 });
  }

  const { berichtText, status: newStatus } = body as {
    berichtText?: unknown;
    status?: unknown;
  };

  if (newStatus !== undefined) {
    if (typeof newStatus !== "string") {
      return NextResponse.json({ error: "Ungültiger Status" }, { status: 400 });
    }
    const allowed = VALID_TRANSITIONS[existing.status] ?? [];
    if (!allowed.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Statuswechsel ${existing.status} → ${newStatus} nicht erlaubt. Erlaubt: ${allowed.join(", ") || "keine"}`,
        },
        { status: 422 }
      );
    }
  }

  const updated = await prisma.wartungsBericht.update({
    where: { id: existing.id },
    data: {
      ...(typeof berichtText === "string" && berichtText.trim()
        ? { berichtText: berichtText.trim() }
        : {}),
      ...(typeof newStatus === "string" ? { status: newStatus } : {}),
    },
    select: {
      id: true,
      berichtText: true,
      status: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ bericht: updated });
}
```

---

## 11. Core Dashboard Screen

### `src/app/(dashboard)/berichte/page.tsx` (Server Component)

```tsx
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/tenant";
import { NeuerBerichtDialog } from "@/components/neuer-bericht-dialog";

export default async function BerichtePage() {
  const { organizationId } = await requireOrg();

  const [berichte, org] = await Promise.all([
    prisma.wartungsBericht.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        techniker: true,
        kundeName: true,
        wartungsDatum: true,
        status: true,
        mangelListe: true,
        objekt: { select: { name: true, typ: true } },
      },
    }),
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: { monthlyActionLimit: true },
    }),
  ]);

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const usedThisMonth = berichte.filter((b) => b.wartungsDatum >= monthStart).length;
  const limit = org?.monthlyActionLimit ?? 3;
  const limitReached = usedThisMonth >= limit;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Wartungsberichte</h1>
          <p className="text-sm text-neutral-500">
            {usedThisMonth} / {limit} Berichte diesen Monat
            {limitReached && (
              <span className="ml-2 text-red-500">· Limit erreicht</span>
            )}
          </p>
        </div>
        <NeuerBerichtDialog disabled={limitReached} />
      </div>

      {berichte.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 p-10 text-center">
          <p className="text-neutral-500">Noch keine Berichte. Erstellen Sie den ersten!</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3 text-left">Datum</th>
                <th className="px-4 py-3 text-left">Objekt / Kunde</th>
                <th className="px-4 py-3 text-left">Techniker</th>
                <th className="px-4 py-3 text-left">Mängel</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {berichte.map((b) => {
                const maengel = (b.mangelListe as { schwere: string }[] | null) ?? [];
                const kritisch = maengel.filter((m) => m.schwere === "KRITISCH").length;
                return (
                  <tr key={b.id} className="hover:bg-neutral-50">
                    <td className="whitespace-nowrap px-4 py-3">
                      {b.wartungsDatum.toLocaleDateString("de-DE")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{b.objekt?.name ?? "—"}</span>
                      {b.kundeName && (
                        <span className="block text-xs text-neutral-400">{b.kundeName}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{b.techniker}</td>
                    <td className="px-4 py-3">
                      {maengel.length === 0 ? (
                        <span className="text-neutral-400">—</span>
                      ) : (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            kritisch > 0
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {maengel.length} Mangel{maengel.length !== 1 ? "mängel" : ""}
                          {kritisch > 0 && ` (${kritisch} krit.)`}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/dashboard/berichte/${b.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Öffnen →
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    ENTWURF: { label: "Entwurf", className: "bg-neutral-100 text-neutral-600" },
    GEPRUEFT: { label: "Geprüft", className: "bg-blue-100 text-blue-700" },
    FERTIG: { label: "Fertig", className: "bg-green-100 text-green-700" },
    ARCHIVIERT: { label: "Archiviert", className: "bg-neutral-100 text-neutral-400" },
  };
  const c = config[status] ?? config.ENTWURF;
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  );
}
```

### `src/components/neuer-bericht-dialog.tsx` (Client Component)

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPEN = [
  { value: "HEIZUNG", label: "Heizungsanlage (DVGW G 600)" },
  { value: "ELEKTRO", label: "Elektroanlage (DGUV-V3)" },
  { value: "KLIMA", label: "Klimaanlage" },
  { value: "SANITAER", label: "Sanitäranlage" },
];

export function NeuerBerichtDialog({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      notizen: form.get("notizen") as string,
      typ: form.get("typ") as string,
      techniker: form.get("techniker") as string,
      kundeName: (form.get("kundeName") as string) || undefined,
      kundeAdresse: (form.get("kundeAdresse") as string) || undefined,
      wartungsDatum: form.get("wartungsDatum") as string,
    };

    try {
      const res = await fetch("/api/berichte/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unbekannter Fehler");
        return;
      }
      setOpen(false);
      router.push(`/dashboard/berichte/${data.bericht.id}`);
      router.refresh();
    } catch {
      setError("Netzwerkfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        disabled={disabled}
        title={disabled ? "Monatliches Limit erreicht — bitte Plan upgraden" : undefined}
        className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {disabled ? "Limit erreicht" : "+ Neuer Bericht"}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Neuer Wartungsbericht</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-neutral-400 hover:text-neutral-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                Wartungstyp *
              </label>
              <select
                name="typ"
                required
                className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
              >
                {TYPEN.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                Datum *
              </label>
              <input
                type="date"
                name="wartungsDatum"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Techniker *
            </label>
            <input
              type="text"
              name="techniker"
              required
              placeholder="Max Mustermann"
              className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                Kundenname
              </label>
              <input
                type="text"
                name="kundeName"
                placeholder="optional"
                className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                Adresse
              </label>
              <input
                type="text"
                name="kundeAdresse"
                placeholder="optional"
                className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Notizen / Diktat * (max. 8.000 Zeichen)
            </label>
            <textarea
              name="notizen"
              required
              maxLength={8000}
              rows={6}
              placeholder="Brenner gereinigt, Elektrode geprüft OK, Abgaswert 8,1 % CO₂, Dichtung am Schauglas zeigt leichte Ausblühungen — Austausch bei nächster Wartung empfohlen..."
              className="w-full resize-none rounded-md border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {loading ? "Generiere Bericht…" : "Bericht generieren"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## 12. Technische Recherche

**PDF-Generierung in Next.js App Router (server-seitig):**
- `@react-pdf/renderer` läuft auf Node.js, erzeugt PDFs aus React-Komponenten — empfohlene Wahl ab Woche 2
- `html-pdf`, `wkhtmltopdf` und `puppeteer` haben System-Abhängigkeiten, die auf Vercel nicht funktionieren
- **MVP-Woche 1:** `window.print()` mit `@media print`-CSS — null Abhängigkeiten, A4-Ausgabe reicht für Validierung

**Voice-Eingabe:**
- Browser Web Speech API (kostenlos, kein Backend, funktioniert in Chrome/Edge): `const rec = new webkitSpeechRecognition()` → prefilled Textarea → Nutzer korrigiert
- Whisper API: ~0,006 USD/Minute, besser bei Umgebungslärm — für Premium-Tier in Woche 3
- **MVP:** Web Speech API als optionaler Button neben der Textarea, kein API-Call

**Stripe Events (bereits im Template-Webhook, STARTER-Fall ergänzen):**
- `customer.subscription.created` + `customer.subscription.updated` → `planForPriceId()` schon vorhanden, STARTER-Branch ergänzen
- `customer.subscription.deleted` → Plan auf FREE, Limit auf 3 setzen
- Keine weiteren Events nötig

---

## 13. Competitive Moat

Basierend auf Deep-Dive 2026-07-17 — was in 6 Monaten schwer zu kopieren ist:

**1. Normenkenntnis in den Prompts durch echtes Nutzer-Feedback**  
Die haftungsrechtlich korrekten Formulierungen für DGUV-V3 und DVGW G 600 entstehen durch Feedbackschleifen mit echten Handwerkern: Welche Formulierungen lehnt der Elektromeister ab? Was ergänzt der SHK-Meister immer? Dieses implizite Wissen steckt nicht in öffentlichen Dokumenten. ERP-Anbieter haben die Entwickler, aber nicht die Fachsprache-Feedbackschleife — die entsteht nur durch enge Kunden-Nähe.

**2. Historisierte Anlage-Datenbank als Wechselkosten**  
Nach 6 Monaten Nutzung hat jeder Betrieb eine strukturierte Datenbank seiner Anlagen (Hersteller, Baujahr, Fehlerhistorie). Churn erfordert manuelle Portierung aller Anlagendaten. ERP-Anbieter haben ähnliche Lock-ins — aber nur bei den ~60 % der Betriebe, die bereits ERP nutzen. Die anderen 40 % (Solo-Betriebe ohne ERP) bauen ihre Anlagenhistorie hier zum ersten Mal auf.

**3. Solo-Handwerker als unterversorgtes ICP**  
ToolTime (89 EUR/Monat), openHandwerk (16–50 EUR/Nutzer), Plancraft (60–140 EUR/Monat) zielen alle auf 5–20+ MA-Betriebe. Solo-Betriebe und Duos sind für ERP-Anbieter wegen des Support-Aufwands zu kleinteilig. Das Segment bleibt underserved, bis KI-gestützte Einfachheit zum Branchenstandard wird — und das dauert laut Deep-Dive 18–36 Monate.

**Kein Moat:** UI/UX, Preis, Technologie — alles kopierbar in 4 Wochen.

---

## 14. Week 2–4 Roadmap

**Woche 2 — Retention-Hooks (Kunden behalten)**
- `@react-pdf/renderer` als Server-Route: `GET /api/berichte/[id]/pdf` → echtes PDF mit Org-Briefkopf
- Org-Logo-Upload für den PDF-Briefkopf (Vercel Blob, max. 1 MB)
- WartungsObjekt + `naechsteWartung: DateTime?` — Erinnerungsdatum im UI setzen

**Woche 3 — Vertriebsbeschleuniger (Kunden akquirieren)**
- Voice-Diktat: Mikrofon-Button in NeuerBerichtDialog → Web Speech API → Textarea-Prefill
- Bericht per E-Mail an Kunden senden (Nodemailer, bereits im Template vorhanden)
- Öffentlicher Bericht-Link `GET /b/[shareToken]` (ohne Auth, 24h gültig) — Kunde kann Protokoll einsehen

**Woche 4 — Upsell-Vorbereitung (STARTER → PRO)**
- Wartungsvertrags-Modul: Welche Kunden haben Jahresverträge? Welche Anlagen sind fällig?
- Mängel-Dashboard: alle offenen KRITISCH-Mängel der Org auf einen Blick
- Stripe STARTER→PRO Upgrade-Flow: In-App-Banner wenn Quota > 80 % ausgeschöpft

**Upsell-Hypothese für Monat 3–6:**  
Betriebe, die das Tool intensiv nutzen (15+ Berichte/Monat), stoßen organisch an das STARTER-Limit. Das ist der natürliche Upgrade-Trigger — kein Sales-Call nötig, nur eine klare Upgrade-Seite.
