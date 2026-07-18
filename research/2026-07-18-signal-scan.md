# Signal Scan — 2026-07-18

Modus: Samstag → SIGNAL-SCAN MODE  
Recherchierte Nischen: Kfz-Werkstatt, Sozialarbeit/Jugendhilfe, Steuerberater, IT-Systemhaus, Fahrschule

---

## Kandidat 1 — Kfz-Werkstatt Schadensbericht-/Übergabeprotokoll-Generator

**Schmerz:** Kfz-Werkstätten verbringen 30–60 Minuten pro Schadensfall mit der manuellen Erstellung von Schadenberichten und Fahrzeugübergabeprotokollen — weil die marktführenden Kalkulations-Tools (DAT SilverDAT3, Audatex Qapter, GT Motive) nur Reparaturkosten berechnen, aber keine Fließtext-Berichte generieren. Aktuelle Praxis: kopierte Word-Vorlagen, teils Fax, teils Papier.

**Wer hat es:** ~38.000 Kfz-Werkstätten in Deutschland (ZDK: „rund 40.000 mittelständische Betriebe"), davon Großteil KMU und Inhaber-geführt.

**Warum aktuelle Tools versagen:** DAT/Audatex/GT Motive sind Kalkulations-Tools, keine Bericht-Generatoren. Narrative Schadensbeschreibungen, Übergabeprotokolle mit Unterschriftenfeld und versicherungsseitige Dokumentationszusammenfassungen werden weiterhin manuell erstellt. Spezialisierte Gutachtensoftware (EasyExpert, Sprintus Expert) ist nur für lizenzierte Sachverständige, nicht für normale Werkstätten. Kein führendes Werkstattverwaltungssystem enthält KI-Berichtsgenerierung.

**Preisbereitschaft:** SHK/Elektriker-Segment zahlt 39–99 €/Mo für Wartungsberichte — Kfz-Werkstätten mit Schadensfallvolumen und Versicherungsrelevanz eher 49–129 €/Mo.

**Wettbewerb:** Kein direkter KI-Bericht-Generator für Kfz-Werkstätten gefunden.

**Evidenz-Links:**
- https://www.kfzgewerbe.de/zdk-zum-buerokratieabbau-der-kfz-meister-wird-in-der-werkstatt-gebraucht — ZDK 18-seitiger Forderungskatalog Bürokratieabbau: „Schmerzgrenze längst überschritten"
- https://www.autoservicepraxis.de/nachrichten/autobranche/werkstattpraxis-aerger-im-schadenfall-2534638 — Fachjournalismus: mindestens 1 Stunde unbezahlter Aufwand pro Schadensfall bei Versicherungssplittung
- https://www.autoservicepraxis.de/nachrichten/autobranche/schadensteuerung-papier-ist-geduldig-der-kunde-nicht-2534947 — „Steinzeit und Star Wars": Doppeleingaben, Fax, individuelle Versichererprozesse
- https://www.kfz-betrieb.vogel.de/schaeden-digital-abwickeln-a-1087391/ — Kfz-betrieb.de (Leitmedium): „uralte Abläufe und kopierte Vorlagen", fehlende Dokumentation = Ertragsverlust
- https://dgd-direkt.de/werkstatt-alltag-digitalisierung-kfz-zukunft/ — bis zu 1 Tag Fahrzeug-Standzeit wegen unvollständiger Erstdokumentation
- https://crashify.de/welche-software-nutzen-kfz-gutachter-die-besten-programme-im-vergleich/ — Expertenvergleich bestätigt: Kalkulation ≠ Bericht-Erstellung, Werkstätten brauchen separate Lösung

---

## Kandidat 2 — Sozialarbeit/Jugendhilfe Fallbericht-Generator (freie Träger)

**Schmerz:** Fachkräfte bei freien Trägern (Caritas, Diakonie, AWO, private Träger) müssen Verlaufsberichte, Sozialberichte und Hilfepläne als Abrechnungsvoraussetzung für den Kostenträger (Jugendamt) erstellen — zeitintensive Pflichtdokumentation, die laut IW-Köln-Studie im Gesundheits- und Sozialwesen den stärksten Anstieg der Dokumentationslast aller Branchen verzeichnet.

**Wer hat es:** ~198.500 pädagogische Fachkräfte bei freien Trägern in der Kinder- und Jugendhilfe (Destatis 2022); 486.000 Erwerbstätige in Sozialarbeit/Sozialpädagogik gesamt.

**Warum aktuelle Tools versagen:** Bestehende Klientenverwaltungssoftware (OPEN/PROSOZ, SD Worx, Nolis) verwaltet Stammdaten, generiert aber keine kontextbezogenen Fließtext-Berichte. SoKI (sozial-ki.de, gegründet 2024) ist der einzige bekannte KI-Spezialist — 450 Nutzer, sehr junges Startup, kein etablierter Platzhirsch, Basispreis ~500 €/Mo für 50-Personen-Teams (kleinste Träger bleiben unterversorgt).

**Preisbereitschaft:** 49–149 €/Mo für Kleinst-Träger/Solo-Sozialarbeiter-Büros realistisch. SoKI validiert den Zahlungswillen auf Organisationsebene.

**Caveat:** Sozialdaten (SGB VIII, DSGVO) erfordern deutsche Server-Infrastruktur — erhöht Betriebskomplexität für den Entwickler.

**Wettbewerb:** SoKI (sozial-ki.de) — 450 Nutzer, Gründung 2024, sehr frühe Phase.

**Evidenz-Links:**
- https://www.iwkoeln.de/studien/andrea-hammermann-Klaus-heiner-roehl-ein-tag-pro-woche-fuer-buerokratie.html — IW Köln Studie: Sozialwesen führt bei Anstieg der Dokumentationslast aller Branchen
- https://www.ikj-online.de/ki-in-der-kinder-und-jugendhilfe/ — IKJ Institut (Mainz): gefördertes KI-Forschungsprojekt für pädagogische Dokumentation, Fachtagung März 2026
- https://www.caritas.de/neue-caritas/heftarchiv/jahrgang-2025/artikel/ki-veraendert-wie-soziale-arbeit-und-wohlfahrtspflege-funkti — Caritas 2025: KI für Dokumentation und Fallmanagement explizit gefordert
- https://www.vorwaerts.de/inland/sozialstaat-60-bis-80-prozent-der-arbeit-gehen-fuer-buerokratie-drauf — Prof. Katja Robinson (Ex-Leiterin Kölner Sozialamt, Jan 2026): 60–80 % Bürokratieanteil
- https://jugendhilfeportal.de/artikel/viele-beschaeftigte-in-der-sozialen-arbeit-vor-dem-burnout — 8.200 Befragte: 80 % hohe bis krankmachende Belastung, u.a. Dokumentationspflichten

---

## Kandidat 3 — Steuerberater Beratungsprotokoll-Generator

**Schmerz:** Nach jedem Mandantengespräch (Jahresabschluss-Besprechung, Quartals- oder Erstgespräch) rekonstruieren Steuerberater 30–60 Minuten lang ein revisionssicheres Beratungsprotokoll aus Gedächtnis und Handnotizen — DATEV hat diese Lücke trotz mehrerer KI-Features (Buchungsvorschläge, „Frag LEA") nicht geschlossen.

**Wer hat es:** ~53.000 Steuerkanzleien in Deutschland, davon >50 % Einzelkanzleien mit 1–3 Mitarbeitern. ICP: 36.000+ Inhaber, die diese Nachbereitungszeit persönlich tragen.

**Warum aktuelle Tools versagen:** DATEV bietet kein Meeting-Transkriptions- oder Protokoll-Generierungs-Feature. Practitioner-Thread in der DATEV Community bestätigt aktive Suche nach externen KI-Tools. Kanzleien nutzen heute ggf. Otter.ai (englisch) oder erstellen manuell.

**Preisbereitschaft:** Kanzleien zahlen 80–300 €/Mo für DATEV-Zusatzmodule. Sally.io (direkter Wettbewerber) hat zahlende Kunden, Preise nicht öffentlich.

**Wettbewerb:** Sally.io (sally.io) ist direkter, etablierter Wettbewerber mit DATEV DMS-Integration. Differenzierung nötig (z.B. deutlich günstiger, text-only ohne Audio-Recording, DSGVO-first).

**Evidenz-Links:**
- https://www.datev-community.de/t5/Freie-Themen/KI-Tool-f%C3%BCr-die-Protokollierung-und-Zusammenfassung-von/td-p/552103 — DATEV-Community: Praktiker suchen aktiv KI-Tool für Mandantengespräche (Forum-Thread)
- https://www.sally.io/de/meeting-transkription-steuerberater — Sally.io: direkter Wettbewerber, DATEV-Integration, Kundenzitate, beschreibt 30–60 Min Nachbereitungspain
- https://steuerboard.com/blog/steuerberatung-automatisieren — Formulierungsarbeit als größter Zeitaufwand bei Massenfällen
- https://www.ki-syndikat.de/usecases/steuern/02-mandantenkommunikation/ — KI-Beratungsfirma mit Klienten: 90–200 Min/Tag Korrespondenzaufwand in Kanzleien

---

## Kandidat 4 — IT-Systemhaus Servicebericht-Generator

**Schmerz:** IT-Außendiensttechniker dokumentieren Kundenbesuche abends zuhause in Word oder gar nicht — was zu ~60 nicht abgerechneten Stunden/Monat pro Techniker führt und in kleineren Systemhäusern weiterhin als Papier→Scan-Workflow läuft.

**Wer hat es:** ~2.976 IT-Systemhäuser in Deutschland; 53 % Kleinstunternehmen (<€2M Bilanzsumme).

**Warum aktuelle Tools versagen:** PSA-Tools (Autotask, ConnectWise, HaloPSA) — primär englischsprachig — handhaben Ticketing und Abrechnung, generieren aber keine formellen deutschsprachigen Serviceberichte mit Unterschriftenfeld. Lücke für den typischen DACH-Kleinbetrieb ist real.

**Preisbereitschaft:** 50–150 €/Mo je nach Teamgröße (SIMPL-Äquivalent).

**Wettbewerb:** SIMPL (simpl.de) und desk4 (desk4.de) sind spezialisierte DACH-Wettbewerber mit mehrjähriger Marktpräsenz. Eintrittsbarriere hoch ohne klare Differenzierung.

**Evidenz-Links:**
- https://www.it-business.de/problem-techniker-handling-a-860030/ — IT-Business (Trade-Press): Techniker buchen nur 4,3 von 8 h täglich ab, Dokumentation als Hauptursache
- https://www.simpl.de/it-dienstleister-systemhaeuser/ — SIMPL: Wettbewerber mit konkreten Kundenzitaten, erspart 30–45 Min/Einsatz
- https://administrator.de/forum/it-dokumentation-kundensystemen-274661.html — Practitioner-Forum: Excel + Word als aktueller Standard in kleinen Systemhäusern
- https://www.administrator.de/frage/serviceberichte-ort-unterschreiben-verschicken-mail-152900.html — Practitioner: Papier→Scan-Workflow, aktiv nach digitaler Lösung gesucht

---

## Nicht empfohlen: Fahrschule Ausbildungsdokumentation

Schmerz offiziell bestätigt (BMV-Reformvorschlag 2025 zur Reduktion der Dokumentationspflichten), aber Markt von 7+ Spezialtools bedient: Fahrschul-Manager, ClickClickDrive, AUTOVIO, easyADK, fahrschule.live, Fahrschulcockpit, Fahrschul Copilot. Kein erkennbarer Whitespace.
