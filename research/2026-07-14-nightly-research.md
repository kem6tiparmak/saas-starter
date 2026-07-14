# Nightly Research 2026-07-14

---

## Idea 1: Bausachverstaendigen-Gutachten-Assistent

*Building/property surveyors dictate inspection reports via voice/photo; Claude generates the PDF draft. Price: 99–299 EUR/month.*

---

### Market Research

#### 1. Direct Competitors in DACH

The segment is more contested than expected. At least two direct AI-first competitors are already active:

- **baugutachten-ki.de** — "DSGVO-konformer Gutachten-Assistent", self-hosted, generates draft reports in minutes. No public pricing.
- **baugutachter.ai** — "End-to-End KI-Plattform für Bausachverständige", launched April 2026. Analyzes documents, recognizes defects, proposes text. No public pricing.
- **REZEN** (rezen.de) — AI image recognition for property photos, defect detection, damage annotation. Subscription with 20% annual discount. Focused on valuation (Verkehrswert) rather than inspection reports.

**Established non-AI players (significant moat via install base):**
- **Gutachten Manager** (waning-software.de) — market leader with 3,200+ active surveyors, claims 30% time savings. No voice/AI features.
- **Bauexpert** (bauexpert.com) — specialized Baugutachten software including photo documentation, claims up to 40% time savings.
- **Sprengnetter ProSa** — dominant in property valuation (Verkehrswertgutachten) with 9 billion data points and court-accepted outputs. No voice input.

**Key finding:** Voice dictation as the primary input modality is not yet an established feature in the dominant tools. The window exists, but it is narrowing.

#### 2. Market Size

- ~2,200 active Immobiliengutachter in Germany (listflix.de, 2025)
- ~3,500 öffentlich bestellte und vereidigte Sachverständige for real estate (BDSF)
- ~8,000 entries in the IHK Sachverständigenverzeichnis (all disciplines, svv.ihk.de)
- ~733,000 real estate transactions in Germany in 2023 (BBSR) — most requiring some form of assessment; plus court-ordered, insurance, and private reports
- AT + CH add approximately 15–20% additional market potential

**Realistic TAM (DACH):** 5,000–7,000 addressable solo surveyors and small offices. At €150/month average: ~€9–13M ARR at full penetration. Realistic SAM at 10–15% penetration: €900K–2M ARR. This is a niche, not a mass market.

#### 3. Where Are the Customers?

**Associations (primary channel):**
- **DGuSV** (Deutscher Gutachter und Sachverständigen Verband) — largest association; actively soliciting software co-developers (dgusv.de/news-blog — this is a direct partnership entry point)
- **BBauSV** (Bundesverband Deutscher Bausachverständiger e.V.)
- **VBD e.V.** (Verband der Bausachverständigen Deutschlands)
- **BDSF** (Bundesverband Deutscher Sachverständiger und Fachgutachter)
- **IVD** (Immobilien Verband Deutschland) — actively lists software for members

**Trade fairs:** Expo Real (Munich, October), BAU (Munich, January, biennial)

**Online:** IHK Sachverständigenverzeichnis (svv.ihk.de) — publicly searchable and filterable by discipline and region; excellent cold outreach database. LinkedIn and Xing groups for Sachverständige.

#### 4. What Do They Pay Today?

Most surveyors use Word templates combined with specialist software. Pricing landscape:
- **Gutachten Manager / Bauexpert**: No public pricing; likely one-time license model ~€300–800 (estimated, consistent with this software generation)
- **Sprengnetter ProSa**: Annual licenses, pricing on request, typically €1,000–3,000/year
- **Reference point (adjacent market):** autoiXpert, the leading Kfz-Gutachten software (similar user profile), publicly lists €69–99/month — a validated comparable

A price of €99–299/month is significantly above the status quo in one-time licenses but is justifiable if the time savings per report are demonstrable (surveyors charge €80–150/hour; saving 1–2 hours per report covers the monthly fee with one report).

#### 5. First Customer Strategy

1. **DGuSV partnership**: The association is actively seeking software co-creation partners. Contact directly via their news-blog call to action. One partnership = access to thousands of members.
2. **IHK SVV cold outreach**: Filter svv.ihk.de by Fachgebiet "Bau" and Bundesland. Send 20–30 personalized emails: "Kostenloser 30-Tage-Pilot — Sie diktieren ein echtes Gutachten, ich liefere den PDF-Entwurf."
3. **LinkedIn direct**: Search "Bausachverständiger", send a connection request with a message anchored on pain: "Wie lange sitzen Sie pro Gutachten am Schreibtisch?" — opens conversations, not pitches.

#### 6. Dealbreaker Check

- **DSGVO (solvable but mandatory Day 1):** The Verwaltungsgericht Schwerin confirmed that property inspection reports contain personal data even without naming the owner. Every AI-processing flow requires an Auftragsverarbeitungsvertrag (Art. 28 DSGVO), EU-server hosting (Hetzner/OVH/AWS Frankfurt), and clear data handling disclosure. Not optional. Not a dealbreaker, but not skippable either.
- **§839a BGB liability:** Sachverständige carry professional liability for incorrect reports submitted to courts. AI-generated draft text that contains a factual error amplifies this risk. The product must be marketed as "Entwurf zur manuellen Prüfung" — never as a finished product.
- **Competitive timing:** baugutachten-ki.de and baugutachter.ai are already live. The first-mover positioning window for an AI-first Baugutachten tool is closing. Differentiation must be sharper than "KI-PDF-Entwurf."
- **Certification fragmentation:** Multiple competing associations (DGuSV, BDSF, BBauSV, IHK) with no unified standard for report formatting. Regionalized templates will be required rather than a single national format.

---

### Council Verdict

**Where advisors agree:**
- Voice is the correct input modality — surveyors capture expert perception on-site; the bottleneck is translating that perception into formal German prose, not having the expertise.
- The market is real but small. €2M ARR at 15% penetration is achievable; €10M+ requires expanding to adjacent professions.
- Liability reframing is non-negotiable: "AI draft, human review" is the only positioning that works with German professional liability law.
- V1 is technically buildable in one week (Whisper + Claude Sonnet + react-pdf), and Monday's first action is clear: record a fake inspection, run through Whisper → Claude, evaluate output quality before writing any UI.

**Where advisors clash:**
- **Contrarian vs. everyone else on survivability:** The Contrarian argues Berufshaftpflicht insurers will simply prohibit unreviewed AI output on signed reports — making time savings illusory and the product a €299/month proofreading tool. First Principles and Expansionist counter that framing as "drafting assistant" navigates this entirely.
- **Expansionist vs. Contrarian on timing:** Expansionist sees a data moat at scale (10,000 reports/year = most granular German property defect database, licensable to Aareon/Haufe/ImmoScout). Contrarian says incumbents copy the voice-button before you get there.

**Biggest blind spot caught:**
Two direct AI competitors (baugutachten-ki.de, baugutachter.ai) are already operating, but no advisor had researched their pricing or positioning. Before writing one line of code, those two products need to be mystery-shopped as a fake customer. If they are undifferentiated, there is a gap to exploit. If they are already well-positioned with DSGVO-native German hosting, the gap is much smaller than assumed.

**Final recommendation:**
Do not build this as a standalone product without first mystery-shopping the two live competitors. If they have poor UX, no voice input, or non-German hosting, there is a viable wedge. If they are well-executed, the TAM (5,000–7,000 surveyors) is too small to justify entering a market with two established AI competitors. The expansionist multi-profession play (same product, five discipline packs) is the only route to a meaningful business — but that is a 12-month project, not a one-week MVP.

**One thing to do first:**
Spend 2 hours as a fake Bausachverständiger customer testing baugutachten-ki.de and baugutachter.ai — pricing, UX, voice input availability, hosting location, trial availability. This single research step decides whether to build or skip.

---

## Idea 2: Schicht-/Objektbericht fuer Sicherheits- und Reinigungsdienste

*Security guards/cleaning supervisors speak an end-of-shift report via voice; Claude generates the client-facing PDF. Price: 49–149 EUR/month.*

---

### Market Research

#### 1. Direct Competitors in DACH

**Security sector:**
- **COREDINATE** (coredinate.de) — Guard tour control, digital Wachbuch, lone-worker protection, DSGVO-compliant German servers. Entry pricing: **€29/month**. Focuses on patrol verification and logbook, not client-facing report generation or AI drafting.
- **SequriX** (Netherlands, German market) — Mobile patrol app, electronic Wachbuch replacing paper logbooks, real-time incident tracking. No public pricing (Capterra: "contact for pricing"). Strong monitoring focus, not AI-generated client reports.
- **EPRO³ Guardbook** (epro3.de) — Full enterprise suite: electronic Wachbuch, visitor management, key management. Mid-to-large enterprise target. No public pricing.
- **LogPro** (logpro.de) — Mobile guard control, patrol documentation. SMB focus.
- **Securo-Planer** — AI-assisted scheduling, digital guard book, full HR+operations bundle.

**Cleaning sector:**
- **LiteLog** (litelog.de) — Facility/cleaning software with time tracking and photo documentation. From **€39/month**. DSGVO-compliant German servers.
- **Profacilo** (profacilo.de) — Full cleaning management suite (quotes, invoicing, scheduling, app). **€349/month** standard license.
- **KleanApp** and **Hyginify** — Digital Reinigungsnachweis tools, simpler feature sets.

**Competitive gap confirmed:** None of the above offer voice input + AI-generated client-facing PDF report as the primary workflow. All existing tools require manual text entry or structured form input. The voice-to-professional-PDF differentiator is genuinely unoccupied in the DACH market.

#### 2. Market Size

**Security (Germany):**
- ~276,700 employees (Statista/BDSW, mid-2023)
- Industry revenue ~€14.1B (BDSW 2024 full sector estimate)
- Top-25 providers = €5.4B combined, growing 7.5% YoY (Lünendonk 2025)
- BDSW has 1,029 registered member companies; total market is wider as many small operators are not members

**Cleaning (Germany):**
- ~700,000 employees — largest skilled-trades sector in Germany by headcount
- ~68,900 registered businesses (2022, Statista); 83.5% are micro-enterprises (<€2M balance sheet)

**Combined DACH addressable market:** Conservatively 15,000–25,000 small/medium security and cleaning companies with 5–200 employees that write recurring Objektberichte for clients. At €49–149/month, the revenue ceiling for 1% penetration = €8–22M ARR.

#### 3. Where Are the Customers?

**Security:**
- **BDSW** (bdsw.de) — 1,029 member companies; public member directory with contact information
- **Security Essen** — Germany's largest security trade fair (biennial, September, Messe Essen); BDSW anchors Hall 8
- **Protector** and **GIT-Sicherheit** — the two dominant trade publications

**Cleaning:**
- **Bundesinnungsverband des Gebäudereiniger-Handwerks** — regional guilds (Innungen) hold member lists
- **GEBÄUDE.DIENSTE** — trade magazine
- **CleaningDays / CMS Berlin** — biennial trade fair (Messe Berlin)
- **Facebook groups:** "Reinigungsfirma Deutschland — Tipps & Erfahrungen" and similar (several thousand members, owner-operators active)

#### 4. What Do They Pay Today?

The majority of small security and cleaning companies still use paper Wachbücher, Word documents, or WhatsApp voice messages transcribed manually — confirmed by the volume of "Wachbuch Vorlage" download pages ranking well in organic search.

Companies that have digitized pay:
- €29–39/month for basic digital logbook tools (COREDINATE entry, LiteLog)
- €149–349/month for full management suites (Profacilo, Securo-Planer)

The typical small operator (10–50 guards or cleaners) currently spends €0–50/month on reporting tools — most spend nothing. The hidden cost is supervisor time: 20–45 minutes per shift composing Word documents or dictating to admins at the end of a 10-hour shift.

#### 5. First Customer Strategy

1. **Google Maps list-build:** Search "Sicherheitsdienst [city]" and "Gebäudereinigung [city]" across 3–5 medium-sized German cities. Collect 50 company names and owner/Geschäftsführer contacts.
2. **LinkedIn outreach:** Find the Inhaber directly. Message in German anchoring on the hidden time cost: "Wie lange braucht Ihr Vorarbeiter für den Objektbericht nach der Schicht?"
3. **WhatsApp live demo:** These owners use WhatsApp. Offer them this: "Sprechen Sie jetzt einen 2-minütigen Testbericht ein und ich schicke Ihnen in 3 Minuten das fertige PDF." A working prototype that closes the loop in one WhatsApp exchange collapses weeks of sales friction.
4. **BDSW member directory:** Filter by company size (10–50 employees) and region. Direct email listed for most members.
5. **Facebook groups:** Post a genuine question about current shift reporting pain before pitching. One thread can surface 10+ warm leads.

Target profile: owner-operated security or cleaning company, 15–80 employees, currently using Word or paper, where the owner is also the decision-maker with no procurement committee.

#### 6. Dealbreaker Check

- **BewachV §21 (solvable):** Wachbuch entries must be in German language and stored tamper-proof for 3 years. AI-generated PDFs need a tamper-evident audit log and timestamp storage. Implementable with standard database + immutable PDF storage, but must be built deliberately from day one — not retrofitted.
- **DSGVO (solvable):** Shift reports describe events at client premises — operational and potentially personal data. Customers will require an Auftragsverarbeitungsvertrag (AVV). German server location (Hetzner/AWS Frankfurt) is a strong selling point vs. US-hosted competitors. Standard SaaS practice; not a dealbreaker.
- **Multilingual workforce (most acute technical risk):** German security and cleaning sectors have a high proportion of non-native German speakers (Polish, Romanian, Turkish, Arabic). Voice ASR on heavily accented or non-German speech produces unreliable transcripts. Mitigation: position the product as a supervisor/Vorarbeiter tool (typically German-fluent), not a guard-on-the-floor tool.
- **Incumbent copy window:** COREDINATE and SequriX could add a voice-to-PDF feature within 12–18 months. They have distribution but move slowly. This is a real but bounded risk.

---

### Council Verdict

**Where advisors agree:**
- The real buyer is the company owner (Geschäftsführer), not the guard. The owner suffers from professional embarrassment (unprofessional client reports), contract risk (disputes without documentation), and hidden admin cost. The guard's pain is secondary.
- Voice is the right input because guards are physically exhausted after night shifts and often not fluent in formal written German.
- This is fundamentally a liability tool sold as a productivity tool — and that framing should drive the sales conversation.
- V1 is buildable in one week: MediaRecorder → Whisper → Claude Haiku → react-pdf. iOS audio format (AAC/m4a conversion to mp3) is the main technical risk to validate Monday morning.

**Where advisors clash:**
- **Contrarian vs. First Principles on the buyer-user gap:** Contrarian says the guard has zero incentive to use a new voice app after a 10-hour shift; First Principles says the owner can mandate the tool precisely because it solves their liability exposure (not the guard's convenience). Both are right — but the First Principles framing is the one that drives purchase decisions.
- **Contrarian on market size:** Too small to pay OR already served by incumbents. This ignores the 15,000–25,000 SMB companies in the documented research that fall in neither category.

**Biggest blind spot caught:**
The WhatsApp live demo insight from the Executor — "let them record a shift report right now and see the PDF in 3 minutes" — is simultaneously the best sales tactic and the minimum viable product validation test. No advisor framed it as both. This means the GTM motion and the prototype are the same artifact. Build the demo first, not the product.

**Final recommendation:**
**Build this one.** It is the only idea of the three where the competitive gap in voice-to-PDF is documented, the buyer is clearly identifiable, the sales tactic is testable in under a week, and there is no structural regulatory obstacle blocking adoption. The multilingual workforce challenge is real but manageable by targeting supervisors rather than line workers. The €49–149/month price point is below what the supervisor's 20–45 minutes of report-writing time actually costs the business.

**One thing to do first:**
Record a fake 2-minute shift report yourself in a noisy environment (outside works fine), run it through Whisper via a curl command, feed the transcript to Claude with a "write a professional German Objektbericht" prompt, and read the output. If it is passable in under 20 minutes of prompt iteration, start building. This test costs €0.02 and answers the only question that matters.

---

## Idea 3: Wohnungsuebergabe-Protokoll-Generator

*Landlords/property managers take photos and voice notes during apartment handover; Claude generates the handover protocol PDF. Price: 39–99 EUR/month.*

---

### Market Research

#### 1. Direct Competitors in DACH

The market is occupied. At least 6–8 dedicated apps already exist:

**Dedicated handover apps:**
- **Immo-Übergabe** (immo-uebergabe.de) — Pay-per-protocol: 10 protocols/year = €60 (€6/protocol); scales to €1/protocol at volume. Photo documentation, digital signatures, PDF export.
- **Immobilien Protokoll** (immobilien-protokoll.de) — Key management, defect tracking, PDF export. No public pricing.
- **SmartMiete** — Free tier includes photo upload and digital signature.
- **WohnungsCheck** (wohnungscheck.eu) — Explicitly local-only storage (DSGVO positioning), "Made in Germany."
- **uebergabeprotokoll.app** — New entrant, launched January 2026.
- **Protocol** by deep.rent — App Store presence, integrates with property management.

**Property management suites with integrated handover modules:**
- **Immoware24** — ~€15/month base + €0.30/unit/month. Professional-grade, targets Hausverwaltungen.
- **objego** — Free basic tier, paid tiers. Popular with small landlords.
- **immocloud** — Dedicated handover feature within its platform.
- **Aareon** — Enterprise tier for large housing companies.

**Pricing gap:** Dedicated tools cost €0–€60/year. The proposed €39–99/month is 5–10x higher — in full property management suite territory without offering a full suite. The only unoccupied differentiator is AI-generated protocol text from voice notes and photos. That gap is real, but it must be the entire value proposition at that price point.

#### 2. Market Size

Germany alone (Austria/Switzerland add ~15–20%):
- **43.8 million** total apartments (Destatis, end 2024)
- **~23–25 million** are rented
- **~3.6 million** tenant changes per year (at ~8–9% annual turnover) — each is a potential protocol event
- **5.5 million** private landlords controlling ~16 million units; ~9 million units held by institutional/professional providers
- **22,000–30,000** property management companies (Hausverwaltungen)
- **~35,000** licensed real estate agents (IVD estimate)
- 70% of Hausverwaltungen report being overloaded (VDIV Branchenbarometer 2025); 14% accept no new mandates — a direct signal for workflow automation demand

#### 3. Where Are the Customers?

- **Haus & Grund Deutschland** — 957,000-member property owner association with regional chapters. The single most concentrated audience of private landlords in DACH.
- **VDIV Deutschland** — Professional managers' trade body; annual congress, Branchenbarometer publication.
- **Vermieter-Forum.com** — Active online discussion community.
- **Facebook:** "Vermieter fragen Vermieter" group (active, real pain-point discussions); Haus & Grund regional pages.
- **ImmobilienScout24** — High-traffic portal with landlord knowledge section and community.
- **Vermietet.de** — Software platform with landlord community.
- **Expo Real** (Munich, October) — Largest European real estate trade fair.

#### 4. What Do They Pay Today?

In order of prevalence:
1. **Paper + Word template (dominant for private landlords):** Dozens of free downloads from Zurich, bonify, ImmobilienScout24. Cost: zero. Most private landlords (1–2 units) use these.
2. **Property management suites (professionals):** €5–15/unit/month; handover protocol is one feature of many.
3. **Standalone handover apps:** €0–€60/year.

Real pain points documented: manual photo embedding into Word is tedious; paper protocols get lost; legal completeness is uncertain; getting both parties to sign digitally is friction-heavy. No existing tool drafts the actual protocol text automatically from photos or voice — that gap is confirmed.

#### 5. First Customer Strategy

1. **Facebook "Vermieter fragen Vermieter":** Post a genuine question about current handover workflow pain (not a pitch). Reply in comments. Offer 3 months free to 5 respondents willing to give structured feedback.
2. **Cold email to 20 small Hausverwaltungen** (10–80 units, sourced from local business directories, Google Maps search "Hausverwaltung [city]"). Subject: "Übergabeprotokoll in 10 Minuten statt 45 — darf ich es zeigen?"
3. **Haus & Grund regional chapter:** Contact the local chapter secretary (Berlin, Munich, Hamburg have active chapters). Offer a free demo at a member meeting in exchange for beta tester access.
4. **Vermieter-Forum.com thread:** Post "Wie macht ihr aktuell eure Übergabeprotokolle?" — builds credibility before any product mention.
5. **LinkedIn outreach:** Search "Hausverwaltung" + city, target owners/managers of firms with 5–30 employees.

Ideal first customer: professional manager of 30–100 units who conducts handovers personally, currently uses a Word template, and handles at least one handover per month.

#### 6. Dealbreaker Check

- **No legal mandate (weakest urgency driver):** BGB §535/§546 require apartment return but impose no obligation to create a formal Übergabeprotokoll. The document's value is evidentiary (§548 BGB: 6-month damage claim limitation period). This is a convenience and defensibility sell, not a compliance sell — inherently weaker urgency than DSGVO tools.
- **Free alternatives dominate the low end:** High-quality free Word/PDF templates from bonify, Zurich, ImmobilienScout24 set the price floor at zero. Private landlords with 1–2 apartments will not pay €39/month for 1–2 handovers per year — the math simply does not work.
- **Market saturation at the low end:** 6–8 dedicated apps already exist. Without AI text generation, this is the ninth entrant in a low-willingness-to-pay segment.
- **DSGVO:** Tenant names, photos of living spaces, voice recordings are personal data requiring Art. 6 legal basis, in-app Datenschutzerklärung, and EU-hosted storage. WohnungsCheck's "local-only" positioning signals this is an active buyer concern. Must be addressed in sales materials from day one.
- **Pricing model mismatch:** €39–99/month works only for managers doing 10+ handovers/month. For the largest segment (private micro-landlords), per-protocol pricing (€5–15) or freemium (3 free/month) dramatically lowers the acquisition barrier and matches actual usage patterns.

---

### Council Verdict

**Where advisors agree:**
- AI-generated protocol text from photos and voice is genuinely novel and unoccupied by any current competitor. This is the only moat.
- Private landlords are the wrong primary target for a subscription model. Professional Hausverwaltungen (30+ units, regular handover volume) are the viable segment.
- The pricing model as stated (monthly subscription) is mismatched with how private landlords use the product. Either pivot to per-protocol or target professionals who do this regularly.
- V1 is buildable in one week: photo upload + voice note per room → Claude room-by-room JSON → react-pdf. Monday action: build one hardcoded protocol PDF in react-pdf with real German legal text before touching Claude — validate the PDF looks professional first.

**Where advisors clash:**
- **Contrarian vs. Expansionist on market viability:** Contrarian says the addressable paying customer is "vanishingly small" (tech-literate, large enough for a subscription, but too small for enterprise software — essentially an empty segment). Expansionist sees 30,000 Hausverwaltungen in Germany alone and a Trojan-horse land-and-expand motion: 40 protocols → 40 properties' damage history in your system → switching cost immediately high.
- **First Principles vs. the product brief on what to actually build:** First Principles argues the real product gap is qualified digital signatures (eIDAS), timestamped and geotagged photo hashing, and both-party consent capture — not PDF generation. The formatting pain is real but shallow; the evidence-in-dispute pain is deep and unsolved. This reframes the MVP significantly.

**Biggest blind spot caught:**
The Outsider raised the most actionable insight: "Charge per protocol instead. That pricing model matches how often people actually need this." This reframing converts the pricing model mismatch from a dealbreaker into a feature. A per-protocol model (€6–15) removes the subscription barrier for private landlords, mirrors the existing Immo-Übergabe pricing customers already accept, and still generates more per-event revenue than any current competitor's annual plan amortized per use.

**Final recommendation:**
Build only if you target Hausverwaltungen (10–100 units under management) as the primary customer, not private landlords. With the right segment, €39–99/month is defensible against the €5–15/unit/month alternatives because handover protocol generation — with AI text, structured room-by-room output, and photo documentation — replaces 45+ minutes of work per handover. For a manager doing 5 handovers/month, that is over 3 hours saved: self-evidently worth €39. For a private landlord doing 2 handovers/year, it is not. The private landlord segment is a dead end at subscription pricing. Consider a freemium tier (3 protocols free, then pay) as the acquisition motion, with subscription unlocking storage and multi-property features.

**One thing to do first:**
Cold email 20 small Hausverwaltungen (10–80 units, sourced from Google Maps) with this offer: "3 months free in exchange for 30 minutes of feedback after each handover." If 3 of 20 say yes, the segment is real. If 0 say yes, the product needs repositioning before any code is written.

---

## Overall Recommendation

**Idea 2 — Schicht-/Objektbericht fuer Sicherheits- und Reinigungsdienste has the strongest signal tonight.**

It is the only idea where the competitive gap in voice-to-PDF is documented and confirmed (no direct AI competitor found in DACH vs. two active competitors for Idea 1 and a saturated low-end for Idea 3), the buyer is clearly identifiable and controls the purchasing decision, and the sales motion collapses to a single WhatsApp interaction. The market is fragmented SMBs — 15,000–25,000 companies — with no established incumbent defending the space, and the documented supervisor time cost (20–45 minutes per shift writing reports) makes the ROI case self-evident to any owner whose supervisor earns €15+/hour.

Idea 1 is intellectually interesting but requires mystery-shopping two live competitors before committing. Idea 3 has a pricing model problem for the largest customer segment (private landlords) and requires a segment pivot to Hausverwaltungen to become viable — the pivot is probably correct but adds a validation step before building.

**Start with Idea 2. Validate with a WhatsApp voice message to 10 Sicherheitsdienst or Gebäudereinigung owners this week. If three respond positively, build the prototype on the existing Next.js template over the following weekend.**
