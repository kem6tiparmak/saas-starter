# Signal Scan — 2026-07-20

Nightly scan für neue DACH-B2B-Dokumentationsschmerzen, die noch nicht in der Ideas Pipeline oder Ideas Inbox abgedeckt sind. Quellen: geb-info.de, kzvnr.de, dachdecker.org, lehrerforen.de, capterra.de, autoixpert.de, gripsware.de, forum-speditionen.de, isfp-software.de, findskill.ai u. a.

---

## Kandidat 1 — Energieberater iSFP: Narrative Berichterstellung ★ STRONG

**Schmerz:** BAFA-zugelassene Energieberater verbringen 20–25 Stunden mit dem Schreiben eines einzigen individuellen Sanierungsfahrplans (iSFP) — die Vor-Ort-Begehung dauert 2–4 h, aber der eigentliche narrative Bericht (Maßnahmenbeschreibungen, Priorisierungsbegründungen, Wirtschaftlichkeitsanalyse, mandantenseitige Zusammenfassung) frisst mehrere volle Bürotage.

**Zielgruppe:** ~11.000 BAFA-gelistete Energieberater in Deutschland (70 % der ~15.400 zertifizierten Berater), Solo- und Kleinstbüros dominieren; 80.000 iSFP-Anträge H1 2024 (Rekordwert, getrieben durch 5 %-BEG-Bonus für iSFP-Inhaber).

**Evidenz:**
- https://www.geb-info.de/forum/frage/praxis/zeitaufwand-isfp — aktiver Praxis-Thread: „Ich kalkuliere ca. 25 Stunden für einen iSFP bei einem EFH." Mehrere Antworten bestätigen 20–30 h für Einsteiger.
- https://isfp-software.de/fuer-solo-energieberater — SaaS-Startup, dessen gesamtes Value-Prop auf iSFP-Geschwindigkeitsoptimierung aufbaut (€29–199/Monat für Workflow-Automation). Beweist kommerzielle Validierung des Schmerzes.
- https://www.future-watt.de/fachwissen/entwicklung-des-energieberatungsmarkts-boom-im-rueckblick-ernuechterung-im-ausblick — Markt +50 % 2023, jetzt Konsolidierung; Produktivität pro Bericht ist der zentrale Wettbewerbsfaktor.

**Warum aktuelle Tools versagen:** iSFP-Turbo (Marktführer für Workflow) automatisiert Berechnungen und Dateneingabe, generiert aber keinen narrativen Berichtstext. Legacy-Desktop-Tools (Hottgenroth €799+, BKI €599+) sind noch weiter von KI-Texterstellung entfernt. Die individuell formulierten Maßnahmenbeschreibungen, Budgetabwägungen und BAFA-konformen Begründungstexte bleiben vollständig manuell.

**Preisbereitschaft:** €49–129/Monat. Bei 25 h × €80/h Opportunitätskosten entspricht eine eingesparte iSFP-Woche ~€2.000 entgangener Beratungszeit — selbst eine Halbierung der Schreibzeit rechtfertigt erhebliche SaaS-Ausgaben.

**KI-Wettbewerber:** Kein Produkt mit KI-generiertem iSFP-Narrativtext identifiziert. iSFP-Turbo = Workflow, kein Text. reduco.ai = nur Vor-Beratungs-Screening. Greenfield.

---

## Kandidat 2 — Zahnarztpraxen: HKP-Begründungstexte & Behandlungsdokumentation ★ STRONG

**Schmerz:** Deutsche Zahnarztpraxen verbrauchen rechnerisch 96 volle Arbeitstage pro Jahr mit Bürokratie — davon entfällt ein erheblicher Teil auf Heil- und Kostenplan-Begründungstexte (GKV-Pflicht), narrative Behandlungsdokumentation und QM-Pflichtnachweise, ohne dass ein dominierendes KI-Tool existiert.

**Zielgruppe:** 62.874 Vertragszahnärzte in Deutschland (KZBV Jahrbuch 2025), durchschnittlicher Praxisumsatz €677.000/Jahr. Die 96-Tage-Zahl stammt aus einer offiziellen KZV-Kampagne — kein Randkritiker, sondern die Standesvertretung.

**Evidenz:**
- https://www.kzvnr.de/aktuelles/presse/pressemeldungen/detail/zaehne-zeigen-gegen-buerokratie — offizieller KZV-Aktionstag (25.9.2024): „Pro Praxis ist eine Person 96 Tage mit der Bewältigung bürokratischer Vorgaben beschäftigt." 96 % der Praxen berichten spürbaren Rückgang der Behandlungszeit durch Dokumentationslast.
- https://www.kzvnr.de/fileadmin/user_upload/PDF/Zahnaerzteseite/Pressemitteilungen/PM_Hintergrundinformationen_zum_Aktionstag_gegen_Buerokratie.pdf — Detailaufschlüsselung: 28 Tage Allgemein-Doku, 13 Tage G-BA-QM, 51 Tage Aufklärungs-/Informationspflichten. 962 Einzelregelungen treffen den Praxisalltag.
- https://www.dental-wirtschaft.de/rechtundsteuern/behandlungsdokumentation-das-sind-die-rechtlichen-grundlagen-fuer-den-zahnarzt — HKP-Begründungstexte mit strengen GKV-Anforderungen; häufige Quelle für Rückläufer und Nacharbeit.
- https://www.getnelly.de/blog/ki-dokumentation-zahnarztpraxis — Zahnarzt-Startup Nelly framt KI-Dokumentation als nächsten Frontier (2024), adressiert aber nur Voice-to-Text für Behandlungsnotizen — Lücke für strukturierte HKP-Begründungstexte bleibt.

**Warum aktuelle Tools versagen:** Praxisverwaltungssoftware (Dampsoft, Evident, CGM Z1) deckt Abrechnung und Terminplanung ab, generiert aber keine Begründungstexte für GKV-Anträge und keine QM-narrativen Behandlungsdokumentationen. Das ist genau das structured-to-narrative-Muster, das LLMs stark lösen.

**Preisbereitschaft:** €79–179/Monat pro Praxis. Bei €677K Jahresumsatz ist 2 eingesparte Bürostunden/Monat betriebswirtschaftlich trivial — weit weniger als bestehende Praxissoftware kostet.

**KI-Wettbewerber:** Kein dominanter KI-Doku-Anbieter für deutsche Zahnärzte identifiziert. getnelly.de ist Frühphase/Voice-only. Greenfield für Text-Generierung.

---

## Kandidat 3 — Unabhängige Kfz-Sachverständige: Gutachten-Narrativ ★ MEDIUM-STRONG

**Schmerz:** Unabhängige Kfz-Gutachter werden nach Schadenswert, nicht nach Zeitaufwand vergütet — d. h. jede Minute im Büro beim Gutachten-Schreiben ist Verlust; die narrative Schadensbeschreibung, Haftungsanalyse und technische Zustandsbeurteilung sind der verbleibende manuelle Flaschenhals nach Digitalisierung der Kalkulation.

**Zielgruppe:** ~5.000–6.000 unabhängige Kfz-Sachverständige in Deutschland (dgusv.de-Schätzung; daten-krake.de listet 3.727 verifizierende Adressen). Kein Markteintrittsschutz → viele Solo-Selbstständige mit hohem Kostendruck.

**Evidenz:**
- https://wissen.autoixpert.de/hc/de/articles/360021033980-Das-bietet-moderne-KFZ-Sachverstaendigen-Software — autoiXpert (2.000+ Nutzer) dokumentiert explizit: „Ein Gutachter, der nicht nach Zeitaufwand, sondern nach dem ermittelten Schadenswert vergütet wird, hat ein großes Interesse, den Zeitaufwand pro Gutachten für Verwaltungstätigkeiten zu minimieren." Das Produkt hat bereits ein AI-Feature für Schadenbeschreibungen.
- https://crashify.de/welche-software-nutzen-kfz-gutachter-die-besten-programme-im-vergleich/ — Marktübersicht: autoiXpert, EasyExpert, Sprintus Expert, UltraExpert (€150–400/Monat). „Die Erstellung eines rechtssicheren Gutachtens kann Stunden dauern."
- https://www.mindocu.de — deutsches KI-Gutachten-Startup in der Frühphase, positioniert als „sichere KI Gutachtensoftware für Sachverständige."

**Warum aktuelle Tools versagen:** autoiXpert und DAT/Audatex automatisieren Schadenkalkulation und Fahrzeugbewertung; das verbleibende manuelle Stück ist der Narrativtext — Haftungsbeurteilung, technische Zustandsbeschreibung, Unfallrekonstruktionssprache. autoiXpert hat ein KI-Feature, aber ~60–80 % der Sachverständigen nutzen keine der Plattformen mit KI-Funktion.

**Preisbereitschaft:** €79–149/Monat für Standalone-Tool. Caveat: autoiXpert ist marktführend mit 2.000 Nutzern und eigenem AI-Feature — Differenzierung erfordert klare Positionierung (z. B. günstiger, DAT/Audatex-integriert, kein Full-Suite-Lock-in).

**KI-Wettbewerber:** autoiXpert (AI-Feature, Marktführer). mindocu.de (Frühphase). Kein Greenfield, aber ~60–80 % des Marktes unversorgt.

---

## Kandidat 4 — Dachdecker: Abnahmeprotokoll & Aufmaß-Berichtstext ★ MEDIUM

**Schmerz:** Dachdecker-Betriebe erfassen Aufmaße auf Papier vor Ort und tippen sie nachträglich ins Büro ein; das Abnahmeprotokoll (VOB/B-konforme Abnahmesprache, Materialnachweise, Abweichungen vom Leistungsverzeichnis) wird per Word-Vorlage manuell ausgefüllt, ohne dass ein KI-Texttool existiert.

**Zielgruppe:** ~7.500 Dachdeckerbetriebe in Deutschland (ZVDH), Mehrheit KMU 5–20 MA; zusätzlich ~2.000–3.000 Gerüstbauer mit ähnlichen Abnahme-Pflichten.

**Evidenz:**
- https://dachdecker.org/dachdeckerhandwerk-gegen-verschaerfte-aufzeichnungspflichten-9412449/ — ZVDH kämpft offiziell gegen verschärfte Aufzeichnungspflichten; Praktiker-Zitat: „Ich brauche bei einem einwöchigen Projekt zwei Tage am Schreibtisch — das rechnet sich nicht mehr."
- https://www.handwerk.com/buerokratie-was-handwerkern-besonders-zu-schaffen-macht — ZDH-Umfrage: >50 % der Handwerksbetriebe verbringen über 100 h/Jahr mit rein bürokratischen Aufgaben (Angebote, Aufmaße, Zeitnachweise, Gefährdungsbeurteilungen).
- https://www.streit-software.de/wissen/aufmass-dachdecker — Marktartikel: Aufmaße werden überwiegend auf Papier erfasst und manuell nachgetippt; Übertragungsfehler und Doppelerfassung sind die Hauptquellen von Nacharbeit.

**Warum aktuelle Tools versagen:** plancraft.com, PDS, streit-software decken Aufmaß-Kalkulation und Rechnungsstellung ab. Keines generiert den narrativen Abnahmeprotokoll-Text (Werkbeschreibung, Materialnachweis, VOB/B-Abnahmeklauseln). Dieser bleibt Word-Vorlage.

**Preisbereitschaft:** €29–69/Monat. Preis-sensitives Handwerk — ROI-Framing entscheidend (1 h gespart/Auftrag × 5 Aufträge/Woche).

**KI-Wettbewerber:** Kein dediziertes KI-Abnahmeprotokoll-Tool für Dachdecker identifiziert. plancraft und meisterwerk.app fügen Features hinzu, aber keine KI-Narrativ-Generierung.

---

## Kandidat 5 — Architekturbüros: Bauüberwachungsprotokoll / Bautagebuch (HOAI LP8) ★ MEDIUM (Wettbewerb beachten!)

**Schmerz:** HOAI Leistungsphase 8 verlangt tagesaktuelle Baubesprechungsprotokolle und Bautagebücher — von Architekten als „unbeliebteste Aufgabe auf der Baustelle" bezeichnet, typischerweise aus dem Gedächtnis am Feierabend in Excel oder auf Papier geschrieben.

**Zielgruppe:** 38.278 Architekturbüros in Deutschland, 142.215 eingetragene Architekten (Bundesarchitektenkammer Jan 2024). LP8-Dienstleistungen: schätzungsweise 40–60 % aller Büros.

**Evidenz:**
- https://gripsware.de/blogpost/bauueberwachung-baudokumentation/ — „Für Architekten und Bauleiter gehört das Bautagebuch führen zu den unbeliebtesten Aufgaben auf der Baustelle — oft am Ende eines langen Tages schnell noch aus dem Gedächtnis protokolliert."
- https://planer-am-bau.de/artikel/dokumentation-des-bauablaufs-grundlagen-einer-rechtskonformen-objektueberwachung-bauleitung-in-der-praxis-6 — Gerichtlich werden Bauverzugsstreitigkeiten auf Basis LP8-Dokumentationsqualität entschieden; Haftungsdruck als Motivator.
- https://www.capterra.com.de/reviews/199412/capmo — Capmo-Reviews: „aufwendige Exports" und Schwierigkeiten, Subunternehmer in digitale Workflows zu integrieren, als persistente Pain Points.

**Warum aktuelle Tools versagen:** Capmo, BauMaster, PlanRadar decken Foto-Dokumentation und Mängellisten gut ab. Keines generiert den Freitext-Baubesprechungsbericht (Meeting-Protokoll, Weisungsnachweise, Wetter-/Fortschrittsprosa), der der eigentliche LP8-Kern-Deliverable ist.

**Wichtiger Caveat — aktiver KI-Wettbewerb:** baukraft.co (Spracheingabe → KI → Protokoll), Phase0/Compa (WhatsApp → KI → Bautagebuch, 1.300 Nachrichten in erster Woche), easyarchitekt.de, Weise Software Bautagebuch 2025 (KI für Bauberichte). Das Fenster für Neueintritt engt sich schnell.

**Preisbereitschaft:** €49–99/Monat/User. Bestehende Software ab €79/Monat.

---

## Kurz notiert: Signale unterhalb der Schwelle

**Logistik CMR-Schadensbericht (WEAK):** Schmerz real (Berichte unter Zeitdruck, unvollständige Meldungen verlieren Haftungsansprüche), aber sporadisches Ereignis-Muster, situationsspezifische Texte schwer zu templatisieren, zu schmale TAM für Standalone-SaaS. Belege: forum-speditionen.de, logistik.studio.

**Lehrer Zeugnistexte (WEAK für Neueintritt):** Valider Schmerz (1–3 h/Kind, 30–90 h/Klassenleiter/Halbjahr), aber Markt bereits besetzt: edoop (70.000 Nutzer), fobizz (staatliche Lizenzen Bayern/RLP/Hamburg), ZEUFIX, Zeugio, Schevi, revodocs. ChatGPT-DIY-Adoption hoch. Kein strategischer Angriffspunkt für Kemal.
