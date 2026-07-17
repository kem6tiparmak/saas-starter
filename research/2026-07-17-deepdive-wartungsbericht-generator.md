# Deep-Dive: Wartungsbericht-Generator

**Idee:** KI-gestütztes Tool zur Erstellung von Wartungsberichten für SHK-Betriebe (Sanitär-Heizung-Klima) und Elektriker nach Wartungseinsätzen  
**Zielgruppe:** SHK-Betriebe und Elektrobetriebe (DACH), Schwerpunkt 1–10 Mitarbeiter  
**Preis:** 39–99 EUR/Monat  
**Datum:** 2026-07-17

---

## Market Research

### 1. Direkte Wettbewerber in DACH

**Kernbefund:** Es gibt keinen direkten Standalone-KI-Wartungsbericht-Generator. Der Markt wird von Full-ERP-Handwerkssoftware dominiert, die Berichte als ein Modul unter vielen enthält.

| Anbieter | Fokus | Preis | KI-Features |
|---|---|---|---|
| **ToolTime** (tooltime.app) | Cloud-ERP, beliebt bei SHK + Elektro | 89 EUR/Monat (Solo) | Nein |
| **openHandwerk** (openhandwerk.de) | Cloud-ERP, Wartungsverträge, digitale Unterschrift | 16–50 EUR/Nutzer/Monat | Nein |
| **Craftboxx** (craftboxx.de) | Auftragsverwaltung, Zeiterfassung | ab 9,99 EUR/Nutzer/Monat | Nein |
| **Plancraft** (plancraft.com) | Handwerkersoftware, Berichtsvorlagen | 59,90–74,90 EUR/Monat | Nein |
| **HERO Software** (hero-software.de/ai) | Vollumfängliches ERP + KI-Telefon, Spracheingabe | Auf Anfrage (Enterprise) | **Ja** — HERO AI (Sprache, Angebote, Doku) |
| **Label Software** (label-software.de) | SHK-Spezialist-ERP, 2024 KI-Textassistent integriert | Auf Anfrage | **Ja** — KI-Textassistent, KI-Telefon „IDA" (2026) |
| **STREIT Software** (streit-software.de) | ERP für SHK, Elektro, Kälte — Wartungsintervalle automatisierbar | Auf Anfrage (Enterprise) | Nein |
| **Operis** (operis-app.com) | DGUV-V3-Prüfprotokolle digital | Auf Anfrage | Nein |
| **Wartungsplaner.de** | DGUV-V3-Protokolle, Mängelmanagement | Auf Anfrage | Nein |
| **HeyKiki** (heykiki.de) | KI-Sekretärin für Handwerk (Anruf, Termin, Angebot) | Auf Anfrage | Ja — kein Wartungsbericht |

**Positionierungslücke:** Kein Anbieter bietet ein Standalone-Tool, das ausschließlich KI-generierte, normenkonforme Wartungsberichte (z. B. Heizungswartung nach DVGW G 600 oder DGUV-V3-Prüfprotokoll) per Spracheingabe erstellt — ohne ERP-Overhead. HERO und Label bewegen sich in diese Richtung, aber als Module in teuren Vollplattformen.

**Zeitfenster:** Die großen ERP-Anbieter bauen KI aktiv aus. Realistisches Standalone-Fenster: **18–36 Monate**, bevor die Lücke von ERP-Suites geschlossen wird.

Quellen: [ToolTime Preise](https://www.tooltime.app/preise), [openHandwerk Preise](https://openhandwerk.de/preise/), [Plancraft Preise](https://plancraft.com/de-de/preise), [HERO Software AI](https://hero-software.de/ai), [Label Software SHK](https://www.label-software.de/shk-handwerkersoftware), [Operis DGUV V3](https://www.operis-app.com/blog/dguv-v3-prufprotokoll-digital)

---

### 2. Marktgröße

**SHK-Betriebe Deutschland (2024):**
- ~48.050 Betriebe (leicht rückläufig von 48.300)
- ~388.334 Beschäftigte → Ø ~8 Mitarbeiter/Betrieb
- Jahresumsatz: ~60 Mrd. EUR
- Quellen: [ZVSHK Daten & Fakten](https://www.zvshk.de/presse/medien-center/daten-fakten), [ZVSHK Bilanz 2024](https://www.zvshk.de/presse/medien-center/pressemitteilungen/shk-handwerk-mit-verhaltener-bilanz-2024)

**E-Handwerk (Elektriker) Deutschland (2024):**
- ~48.178 Betriebe (-0,1% ggü. 2023)
- ~516.709 Beschäftigte → Ø ~10,7 Mitarbeiter/Betrieb
- Jahresumsatz: 84,3 Mrd. EUR (-4,0% ggü. 2023)
- Quellen: [ZVEH Branchenkennzahlen 2024](https://www.zveh.de/news/detailansicht/branchenkennzahlen-der-e-handwerke-fuer-2024-1.html), [Statista Elektrotechniker Betriebe](https://de.statista.com/statistik/daten/studie/328694/umfrage/betriebsbestand-der-elektrotechniker-in-deutschland/)

**DACH gesamt (Schätzung):**
- Deutschland: ~96.000 Zielbetriebe (SHK + Elektriker)
- Österreich + Schweiz: +15–20% proportional
- Gesamt DACH: **~110.000–115.000 Betriebe** im Zielgewerbe
- Bei 5% Durchdringung (5.500 Betriebe) × 59 EUR/Monat = **~3,9 Mio. EUR ARR** (hypothetisches Szenario)

---

### 3. Wo sind die Kunden?

**Verbände & Innungen:**
- **ZVSHK** — ~48.000 Mitgliedsbetriebe, Regionalverbände und lokale Innungen in jedem Bundesland; [Fachverband SHK NRW](https://www.shk-nrw.de/) mit 5.500 Betrieben in 55 Innungen
- **ZVEH** — ~48.000 Mitgliedsbetriebe, Landesinnungsverbände mit lokalen Veranstaltungen, Schulungen, Stammtischen

**Messen:**
- **SHK+E Essen** ([shke-essen.de](https://www.shke-essen.de)) — 17.–20. März 2026, Handwerkerforum als Kernzielgruppe
- **IFH/Intherm Nürnberg** ([ifh-intherm.de](https://www.ifh-intherm.de)) — 14.–17. April 2026, 400+ Aussteller, stark auf Handwerksbetriebe fokussiert
- **ISH Frankfurt** — Nächste Ausgabe 2027 (bi-annual)

**Online-Communities:**
- Facebook: [elektrikforum](https://www.facebook.com/elektrikforum/) (~große Community), [Handwerkerforum](https://www.facebook.com/handwerkerforum/)
- ZVSHK-Facebookseite (~10.000 Follower)
- [Volkshandwerker Forum](https://forum.volkshandwerker.de/forum/) — deutschsprachiges Forum
- Fachmagazine online: sbz-online.de (SHK), wattsup.de (Elektro)
- LinkedIn — wächst als Kanal, auch kleine Betriebsinhaber zunehmend vertreten

---

### 4. Was zahlen sie heute?

| Lösung | Kosten | Verbreitung |
|---|---|---|
| **Papier / Word-Vorlage** (von der Innung) | 0 EUR | Sehr hoch — Kleinstbetriebe dominiert |
| **Craftboxx** | ab 9,99 EUR/Nutzer/Monat | Mittelständisch |
| **openHandwerk** | 16–50 EUR/Nutzer/Monat | Wachsend, cloud-nativ |
| **ToolTime** | 89 EUR/Monat (Solo) | Beliebt bei SHK + Elektro |
| **Plancraft** | 59,90–139,90 EUR/Monat | Wachstum über Marketing |
| **HERO / STREIT / Label** | Auf Anfrage (Enterprise) | Größere Betriebe |

**Schlüsselzahl:** Nur **4% der Handwerksbetriebe** setzen KI ein (Bitkom/DHI 2024). Die große Mehrheit der Kleinstbetriebe (1–5 MA) dokumentiert Wartungen noch auf Papier oder in Word/Excel — und zahlt fast nichts für Software. Quellen: [Bitkom Digitalisierung Handwerk](https://www.bitkom.org/Bitkom/Publikationen/Digitalisierung-des-Handwerks), [Craftboxx Kleinbetriebe Blog](https://www.craftboxx.de/handwerker-blog/handwerkersoftware-fuer-kleinbetriebe)

---

### 5. First-Customer-Strategie

**Schritt 1 — Nische innerhalb der Nische wählen (nicht beides gleichzeitig):**
- (A) **SHK → Heizungswartungsprotokoll** (gesetzlich vorgeschrieben nach DVGW G 600, TRGI; saisonal wiederkehrend, klarer Schmerzpunkt)
- (B) **Elektriker → DGUV-V3-Prüfprotokoll** (gesetzlich vorgeschrieben, Pflichtinhalte normiert und bekannt — vereinfacht KI-Vorlage)

Empfehlung: Variante (B) hat den Vorteil, dass das Protokollformat stark standardisiert ist → einfachere KI-Generierung, höhere Qualitätssicherheit.

**Schritt 2 — Lokale Innung als Hebel:**
Regionalen Innungsgeschäftsführer per E-Mail kontaktieren, kostenloses 15-Minuten-Demoangebot für nächste Innungsversammlung anbieten. Positionierung: „KI in der Wartungsdokumentation — 10 Minuten Zeitersparnis pro Auftrag." Besser als Kaltakquise, weil Vertrauen der Mitglieder gegenüber der Innung hoch ist.

**Schritt 3 — Facebook-Gruppen:**
Post in „Handwerkerforum" oder „SHK Handwerker Deutschland" (~12.000 Mitglieder): „Ich baue ein Tool, das euren Wartungsbericht in 2 Minuten per Spracheingabe erstellt — suche 5 Betriebe zum kostenlosen Testen." Direkte Entscheider (Inhaber), kein Gatekeeper.

**Schritt 4 — Kostenpflichtiger Prototyp erst nach 3 echten Gesprächen.**
Montag 08:30: Gelbe Seiten → „Heizungsbau Mannheim" → 10 Betriebe anrufen. Skript: *„Ich entwickle ein Tool, das nach Wartungen automatisch den Bericht schreibt — drei Minuten statt dreißig. Darf ich zeigen, wie das aussieht?"* Kein Link, nur ein Muster-PDF, das heute noch manuell mit Claude erzeugt werden kann.

---

### 6. Dealbreaker-Check

**Regulatorisches:**
- **DGUV Vorschrift 3:** Pflichtfelder (Anlage, Datum, Art/Umfang/Ergebnis, Mängel, Folgemaßnahmen, Prüfer-Unterschrift), Aufbewahrung bis zur nächsten Prüfung (empfohlen 7–10 Jahre). **Kein Blocker** — einfache elektronische Signatur (eIDAS Art. 25) reicht rechtlich aus. Quellen: [KomNet NRW DGUV V3](https://www.komnet.nrw.de/_sitetools/dialog/27355), [Operis DGUV V3 digital](https://www.operis-app.com/blog/dguv-v3-prufprotokoll-digital)
- **SHK-Normen (DVGW G 600, TRGI):** Felder standardisiert und gut bekannt — gut für KI-Vorlagen. Kein Blocker, aber fehlerhafte Ausgaben exponieren den Betrieb haftungsrechtlich.

**Technisches:**
- **KI-Halluzination in sicherheitsrelevantem Kontext:** Größtes Produktrisiko. Mitigation: Tool als Schreibassistent positionieren (Monteur gibt Input, KI strukturiert/formatiert), nicht als autonomen Entscheider. Sicherheitsrelevante Felder müssen explizit vom Nutzer bestätigt werden.
- **ERP-Lock-in:** Betriebe mit bestehendem ERP (openHandwerk, ToolTime, Craftboxx) haben dort bereits Berichtsfunktionen → Doppeleingabe ist echter Widerstand. Standalone-Tool adressiert primär die ~40–60% Kleinstbetriebe ohne ERP.

**Marktrisiken:**
- **Preissensitivität:** 39–99 EUR/Monat für ein Standalone-Tool ist am oberen Rand. Einstieg mit 29 EUR/Monat empfohlen.
- **Konsolidierungsdruck:** HERO, Label, ToolTime bauen KI aktiv aus. Standalone-Fenster: schätzungsweise 18–36 Monate. [Einschätzung]
- **Marktstimmung:** SHK (-0,5% Betriebe) und E-Handwerk (-4% Umsatz) unter Kostendruck 2024. ROI-Nachweis muss sofort sichtbar sein. Quellen: [ZVSHK Bilanz 2024](https://www.zvshk.de/presse/medien-center/pressemitteilungen/shk-handwerk-mit-verhaltener-bilanz-2024), [ZVEH/PV Magazine](https://www.pv-magazine.de/2025/03/28/zveh-vier-prozent-umsatzrueckgang-bei-den-e-handwerken-in-2024/)

---

## Council Verdict

### Die fünf Stimmen

**Der Kontrahent** sieht eine fatale Schwäche: „Workflow Island Syndrome." Organisierte Betriebe mit ERP haben Wartungsberichte bereits darin — ein Standalone-Tool erzwingt Doppeleingabe. Betriebe ohne ERP lösen das mit einer kostenlosen Word-Vorlage der Innung. Das mittlere Segment, das weder ERP-User noch reiner Papierbetrieb ist, sei zu klein für ein tragfähiges Geschäftsmodell.

**Der Erste-Prinzipien-Denker** korrigiert den Rahmen: Das eigentliche Problem ist nicht Zeitersparnis — es ist **dokumentierte Haftungsübertragung**. Wartungsberichte sind der Moment, in dem die Rechtslage wechselt. Dazu kommt ein Vokabular-Mismatch: Handwerker wissen, was sie getan haben, können es aber nicht so formulieren, dass es DIN/VDE-Normen und Haftungsanforderungen genügt. Ein guter Bericht ist außerdem ein **Verkaufsinstrument** (Folgebedarfe, Wiedervorlagen). Die Frage ist: Erzeugt das Tool rechtssichere, normenkonforme Dokumentation — oder nur schnellere Prosa?

**Der Expansionist** sieht das Berichtswesen als Trojanisches Pferd: Nach sechs Monaten entsteht eine strukturierte Datenbank aller Heizungsanlagen und Elektroanlagen in Deutschland nach Baujahr, Hersteller, Fehlerhistorie und Postleitzahl — ein Data Asset, das Versicherer und Hersteller bezahlen würden. Schicht zwei: Ausweitung auf alle 130+ Handwerksgewerke. Schicht drei: Kundenportal (Wartungspass als QR-Code, Gebäudeakte für Hauseigentümer). Schicht vier: regulatorischer Rückenwind durch GEG und EU-Gebäuderichtlinie. Das €10M-Szenario existiert.

**Der Außenstehende** reagiert intuitiv positiv: Das Kernproblem ist sofort glaubwürdig (schmutzige Hände, Papierkram, Haftungsdruck). Wenn der Bericht regulatorisch vorgeschrieben ist, kauft man nicht Komfort, sondern Absicherung — das verschiebt die Preissensitivität erheblich. Hauptbedenken: Sind deutsche Handwerker bereit für SaaS-Abos? Und wie hoch sind die Qualitätsanforderungen an den Output, wenn Fehler rechtliche Konsequenzen haben?

**Der Umsetzer** ist pragmatisch: Das Tool ist in **zwei Tagen** auf dem bestehenden Next.js-Template baubar (Auth, Stripe, Claude bereits vorhanden, MVP = 3 Screens). Aber coden kommt nach der Validierung. **Erster konkreter Schritt Montagmorgen 08:30:** Gelbe Seiten → „Heizungsbau Mannheim" → 10 Betriebe anrufen. Parallel: Facebook-Post in „SHK Handwerker Deutschland" ohne Link, nur Frage: „Wie lange schreibt ihr einen Wartungsbericht? Noch von Hand?" Ziel: drei Gespräche, eine Person die sagt „ja, das wäre gut." Erst dann coden.

---

### Synthese

**Wo die Stimmen einig sind:**
- Die Dokumentationslast ist ein **echter, realer Schmerz** — nicht nur Bequemlichkeit, sondern Haftungsrisiko
- Der Markt ist groß (~96.000 DACH-Betriebe)
- **Distribution ist der Engpass**, nicht Technologie
- Es muss mit **einer** klar umrissenen Nische gestartet werden (SHK Heizungswartung ODER Elektriker DGUV-V3), nicht mit beiden gleichzeitig
- Erster Schritt ist Validierung, kein Code

**Wo sie sich widersprechen:**
- Der Kontrahent bestreitet das adressierbare Segment; der Expansionist und der Umsetzer sehen im „Paper Camp" (40–60% Kleinstbetriebe ohne ERP) genug Masse. Die Wahrheit liegt im Feldeinsatz.
- Der Kontrahent sieht das Produkt als kurzlebig; der Expansionist sieht ein Daten-Asset-Geschäft.

**Größtes blinder Fleck:**
Der Kontrahent unterschätzt möglicherweise die Größe des „kein-ERP"-Segments. Wenn 40–60% der Mikrobetriebe (<5 MA) noch kein ERP haben, gibt es für diese keine Doppeleingabe — das Standalone-Tool wäre ihr *erstes* digitales Werkzeug. Die echte Frage ist empirisch: Wie viele der ~50.000 kleinen SHK/Elektro-Betriebe nutzen heute kein ERP? Ein einziger Nachmittag Kaltakquise in Mannheim könnte das beantworten.

**Finale Empfehlung:**
**WARM, aber mit engem Zeitfenster.** Kernhypothese validieren vor dem ersten Commit: Gibt es 10 lokale Handwerksbetriebe ohne ERP, die 29 EUR/Monat zahlen würden, wenn der Bericht in 3 Minuten fertig ist? Wenn ja — Nische wählen (Empfehlung: DGUV-V3 Elektriker, normiertes Format, gesetzliche Pflicht), in einer Woche bauen, erste 3 Kunden mit 3 Monaten gratis onboarden.

**Eine Sache zuerst:**
Montag 08:30 Uhr — 10 SHK/Elektro-Betriebe in Mannheim anrufen. Ziel: drei Gespräche, eine Person, die bestätigt: „Ja, das Problem habe ich, dafür würde ich zahlen."

---

## Signal

**WARM**

Die Idee hat eine reale Marktlücke: Es gibt keinen direkten Standalone-KI-Wartungsbericht-Generator für DACH. Der Markt ist mit ~96.000 Zielbetrieben groß, und der regulatorische Bedarf (DGUV-V3, DVGW G 600, Haftungsdokumentation) ist intrinsisch — kein „nice-to-have"-Pitch erforderlich. Die technische Umsetzung auf dem bestehenden Template ist realistisch in zwei bis drei Tagen.

Drei Faktoren dämpfen auf WARM statt HOT: (1) ERP-Anbieter wie HERO Software und Label Software schließen die KI-Lücke aktiv — das Standalone-Fenster ist auf 18–36 Monate geschätzt, kein dauerhafter Graben. (2) Die Preissensitivität kleiner Betriebe unter Umsatzdruck ist real; 39 EUR/Monat für ein Standalone-Tool ohne ERP-Kontext ist eine harte Hürde. (3) Der größte Risikofaktor ist nicht Markt oder Technik, sondern Distribution: Kemals stärkster Hebel ist persönlicher Zugang im Rhein-Neckar-Kreis — aber die Frage, ob Handwerker ohne ERP bereit sind, für ein digitales Einzeltool zu zahlen, ist noch unbeantwortet. Diese eine Frage entscheidet über HOT oder COLD.
