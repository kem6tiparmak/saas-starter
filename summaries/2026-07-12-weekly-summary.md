# Wochenreport KW28 - B2B SaaS Ideen

## TL;DR

Drei Nächte Research (07., 09., 10. Juli) mit denselben drei Ideen – und ein frischer Blueprint. Der Wohnungsübergabe-Protokoll-Generator hat sich von "NO GO" zu zweimal "BUILD IT" entwickelt: nicht Privatvermieter, sondern Hausverwaltungen mit 10–20 Übergaben pro Monat sind der funktionierende ICP. Blueprint liegt seit gestern vor. Der Bausachverständige ist klar gefallen – drei KI-Konkurrenten existieren bereits, und ein Gericht hat das Honorar für ein AI-generiertes Gutachten auf null gesetzt. Der Schichtbericht bleibt interessant, braucht aber zuerst einen validierten Pain. Priorität diese Woche: 20 VDIV-Hausverwaltungen per LinkedIn kontaktieren. Noch kein Code.

---

## Ideen-Rangliste diese Woche

### 1. Wohnungsübergabe-Protokoll-Generator
**Preis:** 39 EUR/Monat (Hausverwaltungen) · 7,99 EUR/Protokoll (Privatvermieter)
**Signal: HOT**
Voice-Diktat + Claude-Sprachgenerierung ist unter 21+ Wettbewerbern echter Weißraum – niemand kombiniert beides. BGH VIII ZR 200/08 liefert emotionalen Kaufgrund. VDIV-Branchenbarometer: 50 % der Hausverwaltungen offen für Softwarewechsel, Ø-Zufriedenheit mit aktueller Software nur 2,8/5.
**Größtes Risiko:** X-CITE IMMO hat bereits kostenlose AI-Fotoanalyse für Enterprise und kann Voice nachbauen.
**Empfehlung: BAUEN**

### 2. Schicht-/Objektbericht für Reinigungsdienste
**Preis:** 49 EUR/Monat
**Signal: WARM**
~20.000 Reinigungsunternehmen in Deutschland, kein AI-Voice-Konkurrent. Targeting Reinigung (nicht Security) umgeht das Betriebsrat-Problem und reduziert die Haftungsexposition erheblich.
**Größtes Risiko:** Buyer-User-Trennung – Inhaber zahlt, Vorarbeiter spricht. Inputqualität unkontrollierbar.
**Empfehlung: WEITER PRÜFEN** – 10 Reinigungsbetriebe anrufen, Pain validieren.

### 3. Bausachverständigen-Gutachten-Assistent
**Preis:** 99–299 EUR/Monat
**Signal: COLD**
Drei KI-Konkurrenten seit 2025 (Baugutachter.AI, Baugutachten-KI.de, Entrich). LG Darmstadt Nov. 2025 setzte AI-assistiertes Gutachten auf 0 EUR Honorar. EU AI Act Art. 50 ab August 2026 als Pflichtaufwand. TAM nur 5.000–8.000 Sachverständige.
**Größtes Risiko:** Markt besetzt, Haftungsfalle für Kunden existiert in schriftlicher Rechtsprechung.
**Empfehlung: VERWERFEN**

---

## Was die Council-Räte diese Woche sagten

**Wohnungsübergabe:** Alle fünf Räte fanden unabhängig dasselbe Problem – Subscription passt nicht zur episodischen Nutzung. Der Fix (7,99 EUR/Protokoll für Privatvermieter, Flat für Hausverwaltungen) löst es sauber. Schärfster Streit: Contrarian sieht 234 EUR pro generiertem Protokoll als irrationale Rechnung für Kleinvermieter – Expansionist sieht 24 Millionen Mieteinheiten als Datenbasis für ein viel größeres Geschäft. Blindspot: X-CITE IMMO als kostenloser Enterprise-Konkurrent mit AI-Fotoanalyse wurde erst im dritten Durchlauf ernst genommen.

**Schichtbericht:** Blindspot des gesamten Councils: §201 StGB – Aufnehmen ohne Einwilligung ist eine Straftat. Muss als erstes Feature gebaut werden, vor jeder Voice-API-Integration.

**Bausachverständiger:** Das LG-Darmstadt-Urteil tauchte erst in Nacht drei auf, ist aber das schlagkräftigste Argument gegen das Produkt. Kein Rat hatte es in den ersten zwei Nächten auf dem Schirm.

---

## Machbarkeits-Check

Blueprint vorhanden: **Ja** – `blueprints/2026-07-11-wohnungsuebergabe-protokoll-mvp.md`

Week-1-Bauplan:
- **Mo:** Prisma-Schema (`Protocol`, `ProtocolPhoto`), GET/POST `/api/protocols`, Liste + Metadaten-Formular
- **Di:** Foto-Upload via `@vercel/blob`, Galerie mit Zimmerzuweisung pro Foto
- **Mi:** Whisper-Transkription (`/api/transcribe`), `structureRoomsFromTranscript` via Haiku, Mikrofon-Button
- **Do:** `generateProtocolText` via Sonnet, Vorschau-Screen mit 2s-Status-Polling
- **Fr:** PDF via `@react-pdf/renderer`, AI-Disclosure-Footer, End-to-End-Test + Stripe-Plan 39 EUR

---

## Nächste Woche

1. **20 VDIV-Hausverwaltungen per LinkedIn kontaktieren** mit 60-Sekunden-Loom-Video (Diktat sprechen → PDF öffnen). Ziel: 2 positive Antworten = grünes Licht für Code. Kein Code vorher.
2. **Haus & Grund Ortsvereinsleiter in einer Stadt anschreiben** – Demo-Slot beim nächsten Mitgliederabend anfragen. Kostet 30 Minuten, erreicht 20–50 Privatvermieter direkt.
3. **10 Reinigungsbetriebe aus den Gelben Seiten anrufen** – eine Frage: "Wie lange braucht Ihr Team, um den täglichen Bericht an den Kunden fertig zu machen?" Antwort über 20 Minuten = valider Pain.

---

## Zahlen der Woche

- **21+** direkte Wettbewerber im Übergabeprotokoll-Markt – keiner mit Voice + AI-Textgenerierung kombiniert
- **4.100+** VDIV-Mitgliedsunternehmen, Ø-Zufriedenheit aktuelle Software: **2,8 / 5**, 50 % wechselbereit
- **7,99 EUR/Protokoll** Referenzpreis (uebergabeprotokoll.app ohne AI, seit Januar 2026)
- **0 EUR** Honorar für AI-assistiertes Gutachten laut LG Darmstadt Nov. 2025 (§ 8a Abs. 2 JVEG)
- **5.000–8.000** aktive Bausachverständige DACH – zu kleiner Markt bei drei bestehenden KI-Konkurrenten
