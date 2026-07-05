# Wochenreport KW27 - B2B SaaS Ideen

## TL;DR

Diese Woche gab es nur eine Idee, dafür eine mit vollständigem Blueprint: ein KI-Gutachten-Assistent für Bausachverständige (DACH). Das Konzept ist solide – echter Marktschmerz, klares Pricing, 6-Tage-Bauplan liegt vor. Der Haken: mit Baugutachter.AI existiert bereits ein direkter KI-nativer Konkurrent. Kein anderes Research-Material lag diese Woche vor; keine weiteren Ideen wurden bewertet. Kemal sollte diese Woche **nicht coden**, sondern validieren: Baugutachter.AI testen, 2–3 Bausachverständige anrufen und fragen, was dort fehlt. Erst dann entscheiden, ob gebaut wird.

---

## Ideen-Rangliste diese Woche

### 1. Bausachverständigen-Gutachten-Assistent
**Preis:** FREE (3 Gutachten/Monat) · PRO 49 €/Monat

**Signal: WARM**

Das Marktproblem ist real (3–5 Std. Schreibarbeit pro Gutachten bei 80–200 €/h Stundensatz), und ein vollständiger Blueprint liegt vor. Aber Baugutachter.AI ist bereits am Markt mit KI-Diktat und Desktop-App – die Differenzierung gegenüber diesem Konkurrenten ist noch nicht scharf genug bewiesen.

**Größtes offenes Risiko:** Baugutachter.AI liefert möglicherweise schon 90 % dessen, was dieses Tool verspricht. Ohne direkten Vergleich und SV-Interviews ist unklar, ob eine Lücke existiert, die groß genug für ein neues Produkt ist.

**Empfehlung: WEITER PRÜFEN** – Blueprint ist bereit, aber erst nach Validierungsgesprächen bauen.

---

## Was die Council-Räte diese Woche sagten

Für diese Idee lag kein formales Council-Protokoll vor. Das Blueprint enthält jedoch eine interne Competitive-Analyse (Abschnitt 12c + 13), die folgende Kernpunkte liefert:

**Einigkeit:** Desktop-Legacy-Tools (Bauexpert, Gutachten Manager) sind angreifbar. Die KI-Diktat-to-Struktur-Extraktion ist der stärkste USP gegenüber ihnen.

**Schärfster Widerspruch:** Baugutachter.AI (baugutachter.ai) existiert als AI-native Cloud + Desktop-Lösung. Die ursprüngliche Annahme "kein KI-natives Tool für den deutschen Markt" ist falsch. Das ändert die Ausgangslage erheblich.

**Blindspot, den Kemal vermutlich übersehen hätte:** DSGVO ist bei Gutachten kein Soft-Blocker – Gutachten enthalten personenbezogene Daten von Eigentümern/Mietern. Viele freiberufliche SV sind cloud-skeptisch und werden einen Auftragsverarbeitungsvertrag (AVV) verlangen. Das ist kein technisches, sondern ein Verkaufsproblem, das im ersten Kundengespräch auftaucht.

---

## Machbarkeits-Check

**Blueprint vorhanden:** Ja – `blueprints/2026-07-04-bausachverstaendiger-gutachten-mvp.md`

**Week-1-Bauplan in 5 Punkten:**

- **Tag 1 (Mo):** Prisma-Schema um `Case`, `Defect`, `Report` erweitern; GET/POST `/api/cases` implementieren; Fallübersicht + Neuer-Fall-Formular bauen
- **Tag 2 (Di):** `src/lib/ai/gutachten.ts` mit `extractDefects` via Haiku schreiben; POST `/api/cases/[id]/defects` mit Quota-Check implementieren; Mangel-Erfassungs-UI bauen
- **Tag 3 (Mi):** `generateReport` via Sonnet implementieren; Gutachten-Vorschau mit Status-Polling (alle 2s bis `READY`) bauen; Case-Statusmaschine verdrahten
- **Tag 4 (Do):** PDF-Export via `@react-pdf/renderer`; GET `/api/cases/[id]/report/pdf` implementieren; Download-Button einbauen
- **Tag 5 (Fr):** Voice-Input via Browser `MediaRecorder` → OpenAI Whisper (`/api/transcribe`); Mikrofon-Button im Case-Detail

---

## Nächste Woche

1. **Baugutachter.AI kostenlos testen** – kompletten Flow durchlaufen (Diktat → Extraktion → Gutachten → PDF), UX fotografieren, Pricing notieren. Konkret: Was fehlt? Was nervt? Das ist die Basis für die Differenzierungsstrategie.

2. **2 Bausachverständige anrufen** – nicht per LinkedIn-Template, sondern telefonisch über ein SV-Verzeichnis (IHK oder BVSK). Einzige Frage: "Wie erstellt ihr heute ein Gutachten, und was kostet euch die meiste Zeit?" Dann: "Kennt ihr Baugutachter.AI – nutzt ihr das?" Antworten bestimmen, ob gebaut wird.

3. **Entscheidung dokumentieren** – nach den beiden Punkten oben: entweder Blueprint anpassen (schärfere Differenzierung) und coden, oder Idee verwerfen und eine neue These formulieren. Beides ist ein gutes Ergebnis.

---

## Zahlen der Woche

- **~18.000** zugelassene Bausachverständige in Deutschland (Zielmarktgröße)
- **80–200 €/h** Stundensatz freiberuflicher SV
- **3–5 Stunden** Schreibaufwand pro Gutachten (von 4–8h Gesamtaufwand)
- **399 €/Jahr (~33 €/Monat)** kostet Baugutachter.AI Desktop-App (direkter Konkurrent)
- **0,006 $/Minute** Kosten Whisper-API für Voice-Input (10 Min = 6 Cent)
