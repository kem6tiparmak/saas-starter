# Deep-Dive: Versicherungsmakler Schaden-/Posteingang-Assistent

**Datum:** 2026-07-24 | **Status in Pipeline:** In Prüfung | **Preis-Ziel:** 49–149 €/Monat

---

## Market Research

### 1. Direkte Mitbewerber in DACH

Der Markt ist relevanter als erwartet — ein direkt positionierter Incumbent existiert bereits:

**Afori** (afori.com) — *Exaktester Mitbewerber, zu kennen ist Pflicht.*
Speziell für Versicherungsmakler entwickelte KI-Plattform mit Branchenanspruch. Produkte: intelligente Outlook-Seitenleiste zur Posteingangs-Sortierung und -Priorisierung, MVP-Software-Integration, automatisches Abarbeiten offener Fälle und Dokumentenverarbeitung/-vollständigkeitsprüfung. Verarbeitung ausschließlich in der EU, DSGVO-konform, ISO 27001:2022-zertifiziert. **Preise: nicht öffentlich** — keine Preisliste auf der Website, vermutlich Enterprise-/Sales-gesteuertes Pricing.

**Insurgo** (insurgo.de) — *Nächstengster Mitbewerber.*
Cloud-Maklersoftware mit KI-gestützter Dokumentenverarbeitung: automatische Klassifizierung, Auslesen und Zuordnung von Dokumenten zum richtigen Kunden/Vertrag. Positionierung: MVP-Ersatz, nicht reines KI-Add-on. **Preis: 108 €/User/Monat (oder 89 €/User/Jahr bei Jahreszahlung)** — deutlich über Kemals Zielpreispunkt.

**VirtualWorkforce.ai** (virtualworkforce.ai/de/ki-assistent-fuer-versicherungsmakler/) — *Breiter KI-Assistent-Anbieter mit Versicherungs-Use-Case.*
Plattform für E-Mail-Kategorisierung, -Entwürfe, Claims-Triage, Dokumentenextraktion und Back-Office-Automatisierung. 14 Tage gratis Trial, Preise nicht öffentlich.

**abi consulting** (abiconsulting.io/branchen/versicherungsmakler) — *Eher Beratungsansatz* als fertige SaaS-Lösung. Maßgeschneiderte KI-Implementierungen für Maklerbüros.

**Pexon Consulting** (pexon-consulting.de) — Schadenbearbeitung per Document Intelligence, Beratungsdienstleister ohne SaaS-Preismodell.

**Bestehende MVPs mit KI-Ausbau:** Smart InsurTech, Kahado, VERA (AT) — alle etablierten Maklerverwaltungsprogramme bauen zunehmend KI-Features ein, positionieren sich aber als Komplettlösung (kein schlankes Add-on). Preise meist auf Anfrage.

**Markt-Fazit:** Afori ist der zu schlagende Incumbent. Dessen ISO-Zertifizierung + MVP-Integration sind hohe Einstiegshürden. Insulgo ist teuer und breit. Eine Preislücke unter 100 €/Monat mit klarem Fokus auf Schaden + Posteingang (ohne MVP-Replacement-Anspruch) wäre die differenzierbare Position.

---

### 2. Marktgröße — Potenzielle Kunden in DACH

- **Deutschland:** ~13.855 aktive Versicherungsmakler (Listflix, Stand Mai 2026), ~19.978 registrierte Maklerfirmen insgesamt (Stand Jan 2023, Datenmarkt.de). Gesamte Vermittlerbranche (inkl. Vertreter): ~26.678 (Listflix, Mai 2026).
- **Österreich:** ~926 Makler allein in Wien (WKO Firmendatenbank); bundesweit geschätzt 2.000–3.000 unabhängige Maklerbüros.
- **Schweiz:** geschätzt 1.500–2.000 unabhängige Makler (FINMA-Daten nicht direkt zugänglich, Schätzung auf Basis Verbandsgrössen).
- **Gesamt DACH:** ca. **16.000–20.000 realistische Zielkunden** (nur unabhängige Makler, keine gebundenen Vertreter).
- **Monetarisierungspotenzial:** Bei 5% Marktdurchdringung (800–1.000 Kunden) und 79 €/Monat Durchschnitt: **~750.000–950.000 € ARR**. Selbst 1% Penetration (160–200 Kunden) = ~150.000–190.000 € ARR — für ein Solo-Produkt ein realistisches Jahr-2-Ziel.

Quellen: [Listflix Versicherungsmakler Statistik](https://listflix.de/statistik/versicherungsmakler/), [Listflix Versicherungsvermittler](https://listflix.de/statistik/versicherungsvermittler/), [Datenmarkt.de](https://www.datenmarkt.de/anzahl-statistik-versicherungsmakler-deutschland/)

---

### 3. Wo sind die Kunden? — Verbände, Plattformen, Messen

**Verbände (mit direktem Zugang zu Maklergemeinschaft):**
- **BVK** (Bundesverband Deutscher Versicherungskaufleute, bvk.de) — ~12.500 Direktmitglieder, ~40.000 über Organmitgliedschaften. Größter Interessenverband für Vermittler. Hat LinkedIn-Präsenz und Regionalverbände.
- **AfW** (Bundesverband Finanzdienstleistung, afw-verband.de) — ~40.000 Makler aus 2.100+ Mitgliedsunternehmen. Ausdrücklich für unabhängige Makler und Finanzberater.
- **BDVM** (Bundesverband Deutscher Versicherungsmakler, bdvm.de) — kleinerer Verband für größere Maklerunternehmen; organisiert eigene Tagungen.
- **Verband der Fairsicherungsmakler** (fairsicherungsmakler.de) — bietet öffentliches Maklerverzeichnis.

**Fachmedien und Online-Communities:**
- Versicherungsbote.de — Hauptfachmedium, aktive Kommentarspalten
- Procontra-online.de — Vermittler-Fachmagazin
- maklerblog.de — Community-nahe, praxisorientiert
- DAS INVESTMENT — eher Finanzberater, aber mit Versicherungsanteil

**Messen:**
- **DKM** (Die Leitmesse, Dortmund) — 27.–28. Oktober 2026 — wichtigste Branchen-Messe für unabhängige Vermittler. Schnittstelle zu Versicherern, MVPs, InsurTechs. Ideal für erste Netzwerk-Gespräche und Demostände.
- BDVM-Kongress (jährlich, Termin 2026 noch nicht bestätigt)

**Digitale Kanäle:**
- LinkedIn: BDVM, BVK, AfW alle aktiv. Makler suchen aktiv nach Praxis-Content.
- Xing: in der älteren Maklergenerierung noch präsent, aber rückläufig.
- Regionale IHK-Vermittlerregister (öffentlich zugänglich).

---

### 4. Was zahlen Kunden heute? — Aktuelle Tools und Kosten

| Tool-Kategorie | Beispiel-Anbieter | Preis (ca.) |
|---|---|---|
| Maklerverwaltungsprogramm (MVP) | Smart InsurTech, Kahado, VERA (AT) | Auf Anfrage, typisch 50–200 €/User/Mo |
| KI-gestützte Maklersoftware | Insurgo | 108 €/User/Mo (89 € bei Jahres-Abo) |
| CRM-Systeme | Pipedrive, HubSpot | 15–100 €/User/Mo |
| Generische KI-Assistenten | Claude Pro, ChatGPT | 20–30 €/Mo — kein AVV = DSGVO-Problem |
| Status Quo für viele | Outlook + Excel + manuell | 0 € direkte Kosten, Stunden-Overhead |

Ein Nürnberger Makler mit 3 Mitarbeitern berichtete (Skill-Sprinters.de, 2026): Kundenkommunikation von 6 Stunden/Woche auf 45 Minuten reduziert durch KI-Einsatz — das entspricht ~5 Stunden gesparte Arbeit pro Woche × Stundensatz ~50 € = 250 €/Woche Zeitwert, ~1.000 €/Monat. Bei einem Tool-Preis von 79 €/Monat wäre das ein ROI von >10×.

---

### 5. Erstkunden-Strategie

1. **Lokal beginnen (Rhein-Neckar):** 5–10 Maklerbüros in Mannheim/Heidelberg/Weinheim persönlich ansprechen (Leads unten). Ziel: einen Pilot-Partner gewinnen, der anonymisierte Schaden-E-Mails für ein Demo bereitstellt (mit Datenschutzvertrag).

2. **Demo-Video vor Code:** Prompt schreiben, der 50 echte (anonymisierte) Schaden-Mails klassifiziert und zusammenfasst. Video aufnehmen. Das ist 2–3 Tage Arbeit ohne MVP-Integration.

3. **Landing Page mit Waitlist:** "Schaden-/Posteingang-Assistent für Versicherungsmakler — reduziert Backoffice-Zeit um bis zu 80%" mit klarem ROI-Rechner und E-Mail-Waitlist.

4. **Fachmedien anspielen:** Ein Praxisbericht auf Versicherungsbote.de oder Maklerblog.de ("Wie ich meinen Posteingang mit KI auf 45 Minuten reduziert habe") bringt qualifizierten Traffic.

5. **DKM Oktober 2026:** Netzwerk-Gespräche auf der Leitmesse, Demo mitbringen. Nicht für Sales, sondern für Feedback-Sammlung und Kontaktaufbau.

6. **Afori-Differenzierung klären:** Vor dem Build herausfinden, was Afori kostet und wie Nutzer es bewerten. Wenn Afori > 99 €/Monat und mittelmäßig bewertet → Preislücke. Wenn Afori gut und günstig → Idee auf Zurückgestellt.

---

### 6. Dealbreaker-Check

**Regulatorisch:**
- **EU-KI-Verordnung (KI-VO, ab August 2026 verpflichtend):** KI-Systeme, die im Versicherungsbereich Risiken bewerten, Anträge prüfen oder Schäden klassifizieren, könnten als Hochrisiko-Anwendungen eingestuft werden. Das bedeutet: Konformitätsbewertung, Dokumentationspflicht, EU-Datenbank-Registrierung, technische Robustheitsnachweise. Für einen Soloentwickler ohne Rechtsberatung potenziell ein echter Stopper. Quellen: [datenschutzticker.de](https://www.datenschutzticker.de/2026/07/ki-compliance-in-der-versicherungswirtschaft-mit-dora-dsgvo-und-ki-vo/), [kanzlei-michaelis.de](https://kanzlei-michaelis.de/ki-im-versicherungsvertrieb-neue-anforderungen-durch-die-eu-ki-verordnung/), [dvb.de](https://www.deutsche-versicherungsboerse.de/vertrieb/EU-KI-Verordnung-Was-Versicherungsmakler-beachten-m%C3%BCssen-mp_1201.html)
- **DSGVO:** Schadenmeldungen enthalten sensible Kundendaten. Auftragsverarbeitungsvertrag (AVV) zwingend, EU-only Datenverarbeitung, Datenschutz-Folgenabschätzung empfohlen. **Nicht verhandelbar** — kein Makler ohne AVV. Das ist lösbar (EU-Claude-Endpunkt), aber muss von Anfang an eingeplant werden. Quelle: [wirth-rae.de](https://wirth-rae.de/ratgeber/welche-pflichten-haben-versicherungsvermittler-im-datenschutz/)
- **IDD:** Beratungsdokumentation muss korrekt geführt werden. KI kann Protokolle vorentwürfen, aber nicht ersetzen. IDD stärkt eher das Produkt (automatisches Protokoll = Feature), als es blockiert.

**Technisch/Markt:**
- **MVP-Integration:** Ohne Anbindung an die dominanten Maklerverwaltungsprogramme (Smart InsurTech, Kahado, VERA) ist der Nutzen auf E-Mail-Assistenz beschränkt. Vollständige MVP-Integration ist komplex, von API-Verfügbarkeit abhängig und zeitaufwendig. Afori hat das bereits gelöst — für Kemal wäre das Monate Arbeit.
- **Incumbent:** Afori ist der direkte Konkurrent und hat Branchen-Know-how, ISO-Zertifizierung und vermutlich Kapital. Das ist kein Marktausschluss-Dealbreaker, aber es erhöht die Anforderungen an Differenzierung deutlich.
- **Konservative Zielgruppe:** Kleinere Maklerbüros (1–5 Personen) sind technikavers und datenschutzbewusst. "KI liest meinen Posteingang" löst Widerstand aus, besonders bei der älteren Generation. Der Sales-Prozess ist länger als im B2B-Tech-Bereich.

---

## LLM Council

*Fünf Perspektiven auf diese Idee — synthetisiert für Kemals Entscheidung.*

---

### Advisor 1: The Contrarian — Wo ist der fatale Fehler?

Das Problem ist nicht die Technologie — das Problem ist der Timing. Afori existiert bereits und löst exakt dieses Problem: Posteingang-Sortierung + Backoffice-Automatisierung + MVP-Integration, DSGVO-konform, ISO-zertifiziert. Ein Soloentwickler mit Next.js-Template tritt gegen ein finanziertes InsurTech mit Branchenanspruch an. Das ist asymmetrisch.

Dazu: Versicherungsmakler sind eine der konservativsten Berufsgruppen Deutschlands. Datenschutz-Reflex beim Thema "KI liest Kundendaten" ist real und verankert. Die EU-KI-Verordnung tritt 2026 verpflichtend in Kraft — mögliche Hochrisiko-Einstufung bedeutet Konformitätsbewertungen, Audit-Pflichten, Registrierungen. Für einen Solo-Dev ohne Compliance-Budget ist das eine echte Bremse.

Und selbst wenn Kemal Afori unterpreichtet: Der kleinste Makler (1–2 Personen) hat kein Budget für ein weiteres SaaS-Tool — er hat kein Geld, keinen IT-Verantwortlichen und keine Zeit für Onboarding. Größere Büros haben Afori oder Enterprise-MVPs. **Die Mitte ist eng.**

---

### Advisor 2: The First Principles Thinker — Was ist das echte Problem?

Makler verbringen 60–70% ihrer Zeit mit administrativem Overhead. Der Grund: Informationsfluss zwischen 200+ Versicherern und Kunden ist vollständig unstrukturiert. Jeder Versicherer schickt anders formatierte E-Mails, PDFs, Faxe (ja, wirklich). Posteingang = Datenchaos.

Das eigentliche Problem ist ein Mapping-Problem: "Aus diesem unstrukturierten Text ist das ein Schaden (Kfz), Policennummer 123456, Kunde Müller, Versicherer HUK, Dringlichkeit hoch." Wer dieses Mapping zuverlässig und versicherungsspezifisch löst, schafft echten Wert — nicht als generischer E-Mail-Sortierer, sondern als **Domainexperte in Code**.

Die entscheidende Frage ist nicht "Kann Claude das?" — die Antwort ist ja. Die Frage ist: "Ist Kemal bereit, die Versicherungsdomäne so tief zu lernen, dass das Produkt besser ist als Afori?" Ohne diese Bereitschaft entsteht ein teurer Claude-Wrapper. Mit ihr entsteht ein echter Graben.

---

### Advisor 3: The Expansionist — Was ist das versteckte Upside?

Der Posteingangs-Assistent ist der Einstiegspunkt in eine viel größere Datenschicht. Wenn strukturiert klar ist: Schadenmeldung von Versicherer X, Bearbeitungszeit Y, Regulierungsquote Z — entstehen Muster mit enormem Wert.

**Phase 2:** Makler-Dashboard: "Ihre HUK-Schäden werden im Schnitt 4,2 Tage schneller reguliert als Allianz-Schäden." Das ist Entscheidungshilfe für Policenempfehlungen.

**Phase 3:** Anonymisiertes Branchenaggregat: Welcher Versicherer reguliert Wasserschäden am schnellsten in Bayern? Das ist Datengold für Vergleichsportale, Verbände und Versicherer selbst.

**Nischenstärke:** 13.000 Makler ist klein genug für fokussierten Aufbau, groß genug für ein rentables SaaS. Die Datenschicht, die dabei entsteht, ist ein echter Burggraben — den Afori auch aufbaut, aber vielleicht nicht schnell genug. **Erste Aktion:** den Daten-Layer von Anfang an strukturiert aufbauen, auch wenn er erst in Phase 2 monetarisiert wird.

---

### Advisor 4: The Outsider — Bauchgefühl ohne Kontext

Erster Gedanke: "Noch ein KI-Inbox-Tool." Aber dann — diese Nische ist konkret genug, dass Domain-Expertise wirklich zählt. Ein generisches E-Mail-Tool versteht nicht: "Sachschaden, Kfz, §12 VVG, Deckungsanfrage Versicherungsbestätigung". Das macht den Unterschied zwischen nützlich und unverzichtbar.

Wenn das Produkt wirklich versicherungsspezifisch gebaut ist — Policy-Nummern erkennt, Schadenarten nach dem deutschen Spartensystem klassifiziert, IDD-konforme Notizen vorentwirft — hat es einen klaren Vorteil gegenüber Generic-AI-Lösungen. Wenn es nur ein Claude-Wrapper mit Versicherungs-Branding ist, verliert es gegen Afori und gegen direkte Claude-Nutzung.

Bauchgefühl: **WARM, kein HOT.** Markt ist real, aber ein ernsthafter Konkurrent existiert bereits. Der Differenzierungspunkt muss scharf sein. Einfachere Onboarding? Günstigerer Preis? Ein spezifischer Feature-Vorteil? Ohne das ist es schwer.

---

### Advisor 5: The Executor — Wie baut man das in einer Woche?

**Woche 1 — kein Code, kein MVP, kein DSGVO-Chaos:**

1. **Tag 1:** Afori-Preise und Kundenfeedback recherchieren (OMR Reviews, Google). Wenn Afori < 79 €/Monat und gut bewertet → Idee pausieren. Wenn Afori > 99 €/Monat oder schlecht bewertet → weitermachen.

2. **Tag 2–3:** Einen realen Makler in Mannheim/Heidelberg finden (Liste unten), der 30–50 anonymisierte Schaden-E-Mails teilt (einfacher NDA). Prompt schreiben: Klassifizierung nach Schadenart, Dringlichkeit, Versicherer, nächste Aktion.

3. **Tag 4:** Demo-Video aufnehmen: "Input: E-Mail-Screenshot → Output: strukturierte Zusammenfassung in 3 Sekunden." Kein echtes Produkt, nur Proof-of-Concept.

4. **Tag 5:** Landing Page (Next.js-Template!) mit ROI-Rechner und Waitlist. Ziel: 20 E-Mail-Anmeldungen in 2 Wochen als Go/No-Go-Signal.

**Erste Woche-Empfehlung:** Nicht bauen — validieren. Das Demo reicht für erste Gespräche.

---

### Council Verdict

**Wo alle übereinstimmen:**
- Das Problem ist real und schmerzhaft. Die Zeitersparnis-Daten (6h → 45min) sind überzeugend.
- Der Markt existiert und hat Zahlungsbereitschaft (Insurgo bei 108 €/Monat hat Kunden).
- Domain-spezifisches Know-how ist der entscheidende Qualitätsunterschied.

**Wo Widerspruch besteht:**
- Contrarian vs. Executor/Expansionist über die Lebensfähigkeit gegen Afori. Contrarian sagt: asymmetrischer Kampf, keine Chance. Executor sagt: erstmal Preisdaten sammeln, dann entscheiden.
- Expansionist sieht die Datenschicht als echten Burggraben. Contrarian sieht darin eine Ablenkung von der sofortigen Vertriebs-Herausforderung.

**Größter blinder Fleck:**
Afori. Alle Analyse läuft ins Leere, wenn Afori < 79 €/Monat und zufriedene Kunden hat. **Das muss als erstes recherchiert werden** — bevor ein weiterer Tag in diese Idee investiert wird.

**Empfehlung (direkt):**
Diese Idee ist nicht tot — aber sie braucht eine Differenzierungsstrategie gegen Afori, bevor sie laufähig ist. Der erste Schritt ist nicht Bauen, sondern Preisrecherche: Was kostet Afori? Wie sind Nutzer-Bewertungen? Gibt es eine Preislücke unter 79 €/Monat? Wenn ja → Validation-Funnel. Wenn nein → Zurückgestellt.

**Erste Aktion:**
5 Makler in der Rhein-Neckar-Region kontaktieren mit der Frage: "Nutzt ihr Afori oder ähnliche Tools? Was ist euer größter Schmerzpunkt im Posteingang?" — Antworten entscheiden über den weiteren Weg.

---

## Signal

**WARM**

Der Markt ist real und validiert — Afori und Insurgo beweisen, dass unabhängige Versicherungsmakler für KI-Posteingangs- und Dokumentenassistenz zahlen. Die quantifizierbare Zeitersparnis (bis zu 80% Backoffice-Reduzierung, dokumentiert aus der Praxis) macht das Wertversprechen leicht kommunizierbar.

Aber: Afori besetzt genau diese Position bereits, mit ISO-Zertifizierung, MVP-Integration und EU-DSGVO-Compliance als Differenzierungsmerkmalen. Die EU-KI-Verordnung (ab August 2026 verpflichtend) erhöht die Compliance-Hürden. Ohne klare Preisdaten zu Afori lässt sich keine Marktlücke bestätigen. Das Signal ist WARM, nicht HOT — die Idee ist prinzipiell fundiert, aber ein konkreter Differenzierungspunkt gegen den Incumbent fehlt noch. Sobald Afori-Preise und Nutzerbewertungen bekannt sind, lässt sich HOT oder COLD klar entscheiden.
