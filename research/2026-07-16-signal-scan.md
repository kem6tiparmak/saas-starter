# Signal Scan — 2026-07-16

SIGNAL-SCAN MODE (Donnerstag). Suche nach neuen Schmerzsignalen im DACH-B2B-Raum,
die NICHT bereits in der `ideas-pipeline.md` abgedeckt sind.

Abgedeckte Pipeline-Ideen (zur Referenz): Wartungsbericht SHK/Elektriker,
Nebenkostenabrechnungs-Erklärer, Versicherungsmakler Posteingang, Bausachverständigen-Gutachten,
Schicht-/Objektbericht, Wohnungsübergabe-Protokoll, Therapiebericht Physio/Ergo/Logo,
WEG-Versammlungsprotokoll.

---

## Signal 1 — Ambulante Pflege: Pflegebericht-Assistent (Text)

**Schmerz in einem Satz:** Pflegekräfte in ambulanten Diensten verbringen bis zu 13 von 40
Wochenstunden mit manueller Pflegedokumentation, statt zu pflegen.

**Wer hat es:** ~14.000 ambulante Pflegedienste in Deutschland, typisch 5–30 Mitarbeitende.
Die Pflegekraft notiert sich nach jedem Hausbesuch Stichworte und schreibt abends den
vollständigen Pflegebericht — sachlich, ICD-konfom, nachvollziehbar.

**Warum aktuelle Tools scheitern:**
- `voize.de` (Sprachassistent, May 2026 Series A $50M, 75.000 Nutzer) löst das Problem
  per Voice-Input — aber das Produkt ist primär auf stationäre Einrichtungen zugeschnitten
  und erfordert Smartphone-Mikrofon im Pflegealltag (Umgebungslärm, Hygiene).
- `MediFox`, `Vivendi PD` und `myneva` sind Vollsysteme (ERP-Preis, mehrmonatige
  Einführung) — keine einfache KI-Textassistenz für kleine Pflegedienste.
- **Lücke:** Ein einfaches Web-UI, in das die Pflegekraft nach dem Besuch 3–5
  Stichpunkte eingibt und daraus einen korrekten, strukturierten Pflegebericht erhält —
  ohne Voice, ohne ERP-Lizenz.

**Plausible Zahlungsbereitschaft:** 49–99 €/Mo pro Pflegedienst.

**Evidenz-Links:**
- https://www.myneva.eu/de/blog/zeitraubende-dokumentation-in-der-pflege-hintergruende-und-loesungen
  — "13 Stunden von 40 Stunden Regelarbeitszeit entfallen auf Dokumentation"
- https://www.voize.de/erfahrungsbericht/papierlose-dokumentation-in-der-ambulanten-pflege-wie-geht-das
  — Voize selbst beschreibt den Pain (und die eigene Voice-Lösung)
- https://www.dmrz.de/ueber-uns/presse/die-messeneuheit-eine-mobile-pflegedokumentation-die-kosten-und-zeit-spart
  — DMRZ Messeneuheit: Mobile Pflegedokumentation spart Kosten und Zeit

**Risikohinweis:** Voize hat $50M und wächst schnell. Der Verdrängungsdruck ist real.
Differenzierung müsste über Einfachheit und Preis laufen.

---

## Signal 2 — Finanzanlagenvermittler §34f: Geeignetheitserklärung-Generator

**Schmerz in einem Satz:** Jeder unabhängige Finanzanlagenvermittler (§34f GewO) muss
nach jedem Beratungsgespräch eine individualisierte Geeignetheitserklärung erstellen,
die darlegt, WARUM die Empfehlung zum Kunden passt — rechtssicher, MiFID-II-konform,
sofort aushändigbar.

**Wer hat es:** ~37.000 registrierte §34f-Vermittler in DACH. Die meisten arbeiten als
Einzelkämpfer oder in kleinen Büros (<5 Personen). Jede Beratungssitzung löst die
Dokumentationspflicht aus.

**Warum aktuelle Tools scheitern:**
- CRM-Systeme (Maklerverwaltungsprogramme wie `blau direkt`, `Jung, DMS & Cie`) bieten
  Vorlagen, aber keine KI-generierten individuellen Begründungstexte.
- Die Erklärung muss auf Kundenprofil, Anlageziel, Risikotoleranz und die konkrete
  Empfehlung eingehen — boilerplate reicht aufsichtsrechtlich nicht.
- Die MiFID-II/FinVermV-Reform hat den Aufwand erhöht (Beratungsprotokoll → detailliertere
  Geeignetheitserklärung). Quelle: dasinvestment.com.
- Kein spezifisches KI-Tool gefunden, das §34f-konforme Geeignetheitserklärungen
  aus Gesprächsdaten generiert.

**Plausible Zahlungsbereitschaft:** 49–149 €/Mo. Vermittler fakturieren oft 1.000+ €/Beratung;
Compliance-Kosten sind übliche Ausgabe.

**Evidenz-Links:**
- https://www.gesetze-im-internet.de/finvermv/BJNR100610012.html
  — FinVermV §18: Geeignetheitserklärung Pflichtinhalt (Originalgesetz)
- https://www.dasinvestment.com/provisionen-transparenz-dokumentation-so-veraendert-mifid-ii-die-anlageberatung-in-deutschland/
  — "Dokumentation zum Albtraum geworden" — beschreibt erhöhten Aufwand post-MiFID II
- https://www.ihk-bonn.de/fileadmin/dokumente/Downloads/Recht_und_Steuern/Finanzanlagenvermittler/Informationspflichten_FAV.pdf
  — IHK: Detaillierte Informations- und Dokumentationspflichten für §34f-Vermittler

**Risikohinweis:** Regulatorisches Risiko: Wenn BaFin oder IHK ein von LLM erzeugtes
Dokument als unzureichend einstuft, haftet der Vermittler. Müsste als "Entwurf zur
manuellen Prüfung" positioniert werden.

---

## Signal 3 — BAFA Unternehmensberater: Beratungsbericht-Assistent

**Schmerz in einem Satz:** BAFA-zugelassene Unternehmensberater müssen nach jeder
geförderten KMU-Beratung einen formellen Beratungsbericht (§8 BAFA Rahmenkonzept)
einreichen, der exakte Pflichtangaben enthält — ohne ihn gibt es keine Förderung.

**Wer hat es:** ~3.500+ BAFA-zugelassene Berater in DACH. Sie beraten KMU im
BAFA-Förderprogramm (max. 3.500 € Tageshonorar als Berechnungsgrundlage), oft als
Solo-Selbstständige.

**Warum aktuelle Tools scheitern:**
- Allgemeine Projektmanagement-Software (Macooa, MOCO) kennt die BAFA-Anforderungen
  nicht (Pflichtgliederung: Ausgangssituation, Ziele, Maßnahmen, Ergebnisse, Empfehlungen,
  Beraterunterschrift, Unternehmerbestätigung).
- Berater kopieren alte Berichte und passen manuell an — Fehler im Gliederungsformat
  führen zu Rückfragen oder Förderablehnung.
- Kein KI-Tool gefunden, das BAFA-Pflichtformat kennt und aus Projektnotizen einen
  konformen Bericht entwirft.

**Plausible Zahlungsbereitschaft:** 39–99 €/Mo. BAFA-Berater fakturieren 800–1.500 €/Tag;
ein Tool, das ihnen pro Bericht 2–3 Stunden spart, rechnet sich sofort.

**Evidenz-Links:**
- https://www.coach-pilot.de/bafa-berater-werden
  — "BAFA-Berater müssen Beratungsbericht einreichen" — beschreibt Prozess und Anforderungen
- https://www.leitstelle.org/beratungsinhalte-und-bericht
  — Leitstelle für Unternehmensberatungen: Genaue Inhalte und Gliederung des Beratungsberichts
- https://www.bafa.de/DE/Wirtschaft/Beratung_Finanzierung/Unternehmensberatung/unternehmensberatung_node.html
  — BAFA offiziell: Fördervoraussetzungen und Berichtspflicht

**Risikohinweis:** Marktgröße (3.500 Berater) ist klein für SaaS. Erfordert enges Nischen-Marketing
über BAFA-Verbände (KMU-Berater e.V., DIHK). Monetarisierung eher per Einzelbericht oder
kleines Abo.

---

## Signal 4 — Kindertagespflege: Entwicklungsbericht-Generator

**Schmerz in einem Satz:** Tagesmütter/-väter müssen für jedes betreute Kind in
regelmäßigen Abständen Entwicklungsberichte für Eltern und Jugendamt erstellen —
ein zeitaufwendiger Schreibprozess, für den es kaum KI-Unterstützung gibt.

**Wer hat es:** ~48.000 zugelassene Kindertagespflegepersonen in Deutschland (viele
als Einzelkraft, 1–5 Kinder gleichzeitig). Regulatorisch verpflichtet durch §22–§24 SGB VIII.

**Warum aktuelle Tools scheitern:**
- Keine KI-gestützte Lösung gefunden, die speziell für Entwicklungsberichte in der
  Tagespflege entwickelt wurde.
- Vorhandene Kita-Software (wie `Kita-App`, `Little Bird`) ist für Einrichtungen,
  nicht für Solo-Tagesmütter.
- Tagesmütter nutzen Word-Vorlagen oder handschreiben — und suchen online nach Mustersätzen
  (Nachfrage nach "Entwicklungsbericht Muster" sehr hoch).

**Plausible Zahlungsbereitschaft:** 19–39 €/Mo. Vorsicht: Tagesmütter haben geringeres
Einkommen als typische B2B-SaaS-Kunden; Preissensitivität ist höher. Muss sehr günstig
oder freemium sein.

**Evidenz-Links:**
- https://www.berufsvereinigung.de/glossar/entwicklungsbericht/
  — Berufsvereinigung der Kindertagespflegepersonen: Definition und Anforderungen Entwicklungsbericht
- https://www.familienfreunde.de/blog/dokumentation-in-der-kindertagespflege/
  — Familienfreunde Blog: Dokumentation in der Kindertagespflege als laufende Aufgabe beschrieben
- https://www.lvr.de/media/wwwlvrde/jugend/kinderundfamilien/tageseinrichtungenfrkinder/dokumente_88/201012-dokumentation-und-dokumente-kindertagesbetreuung-lwl-lvr.pdf
  — LVR/LWL: Amtliche Dokumentation zu Pflichten der Kindertagespflege-Dokumentation

---

## Geprüft & Ausgeschlossen

**Psychotherapeut Kassengutachten:** Sehr starker Schmerz (6,5h pro Erstantrag,
84% der Therapeuten unzufrieden mit dem Aufwand, Quelle: psy-dak.de). ABER der Markt ist
bereits saturiert: `tippsie.ai`, `psynex.de`, `duktus-pro.de`, `onlinekit.app/antragspilot`
alle adressieren exakt diesen Pain. → Kein neuer Eintrag.

**Kfz-Sachverständige:** Gutachtensoftware (autoiXpert, EasyExpertPro, neXtsoft) bereits
etabliert. Gap nicht klar genug für reinen KI-Textgenerator.

**Logistik/Spediteur Frachtpapiere:** Primär Konzernkunden (SAP-Umfeld), nicht SMB.
Pilots durch GS1/T-Systems laufen. Nicht Kemals Zielgruppe.
