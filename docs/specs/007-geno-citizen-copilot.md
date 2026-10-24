# Feature Specification: Citizen Mobile Copilot (Sahatna-Aligned Web Experience)

**Feature Identifier**: `007-geno-citizen-copilot`  
**Created**: 2026-10-23  
**Status**: Ready for Implementation  
**Specification Owner**: GENO-BRIDGE Frontend & Patient Experience Team  
**Primary Standards**: 
- UAE Department of Health (DoH) / Abu Dhabi Public Health Center (ADPHC) Premarital Care Standards
- General Authority of Islamic Affairs & Endowments (UAE Fatwa Council) Bioethics Ruling on Assisted Reproduction and PGT-M
- Mediora Design System (DESIGN.md) & Feature-Sliced Design (FSD)

---

## 1. Summary & Objectives

The **Citizen Mobile Copilot** is a mobile-first, culturally attuned web application tailored for Emirati citizens and couples undergoing mandatory 570-gene premarital genomic screening in Abu Dhabi. Designed in harmony with the **Sahatna** digital health aesthetic, it eliminates patient anxiety, fatalistic misconceptions, and social stigma by transforming raw laboratory sequencing codes into empathetic, actionable clarity.

Key capabilities delivered:
1. **Premarital Wellness & Compatibility Starting Hub (`GenoCitizenStartPage`):** A trauma-informed, empathetic welcome hub that eliminates cognitive panic by providing clear intent-driven pathways before exposing clinical risk, complete with UAE Fatwa Council & DoH trust badges.
2. **Plain-Language Variant Translator:** Translates clinical genetic nomenclature (*HBB:c.93-21G>A*, *PAH:c.1066-11G>A*) into reassuring, non-pathologizing education emphasizing that carrier status is normal and healthy.
3. **Interactive 4-Quadrant Mendelian Simulator:** Dynamically demonstrates the 25% affected, 50% carrier, and 25% unaffected probabilities, explicitly disproving the common Gambler's Fallacy ("1 in 4 total children").
4. **Pre-Engagement SafeMatch Mobile Interface:** A dual-consent, peer-to-peer verification flow powered by client-side Bloom filter hashing, delivering instant binary compatibility reassurance before public family engagement.
5. **Halal PGT-M & Thiqa Care Navigator:** Step-by-step guidance on Pre-implantation Genetic Testing for Monogenic Disorders (PGT-M), featuring direct citations from the UAE Fatwa Council and DoH-certified fertility centers (Cleveland Clinic Abu Dhabi, Fakih IVF).
6. **Scenario CPL-09 (Pre-Engagement Consanguineous Check):** Showcases first-cousin partners (Tariq & Reem) discovering a shared *PAH* (PKU) carrier state privately before engagement, seamlessly connecting to Halal PGT-M.

---

## 2. User Scenarios & Prioritized User Stories

### User Story 1 - Plain-Language Genomic Education & Normalization (Priority: P0)
As an engaged citizen receiving a premarital genomic screening alert,  
I want to read my carrier results in clear, non-stigmatizing English and Arabic terminology,  
So that I understand that being a carrier is completely normal and does not mean I am ill.

- **Why this priority:** Psychological safety. Prevents panic, depression, and unwarranted marital breakups upon reading raw genomic lab slips.
- **Independent Test:** Render component with known carrier variants and verify that stigmatizing keywords ("mutant", "diseased", "defective") are 100% absent, replaced by validated reassuring copy.
- **Acceptance Scenarios:**
  1. **Given** a user heterozygous for *HBB* c.93-21G>A, **When** viewing the Copilot home screen, **Then** display: *"You are a healthy carrier of one Beta-Thalassemia gene copy. Carrying gene variants is normal—nearly every person carries 3 to 5 recessive variants with zero symptoms."*
  2. **Given** the user toggles language or views medical definitions, **When** clicking 'View Clinical Lab Details', **Then** expand an accordion showing the exact HGVS code, gene locus, and ClinVar ID with an explanatory tooltip.
  3. **Given** any screen in the Copilot, **When** rendered, **Then** display the persistent medical disclaimer: *"GENO-BRIDGE is a preconception decision support tool. All care decisions must be confirmed with a licensed DoH genetic counselor."*

---

### User Story 2 - Interactive 4-Quadrant Mendelian Inheritance Simulator (Priority: P0)
As a couple identified as carriers of the same recessive gene (*HBB* or *SMN1*),  
I want an interactive 4-quadrant visualizer demonstrating per-pregnancy probabilities,  
So that my partner and I clearly understand that the 25% risk applies independently to every pregnancy.

- **Why this priority:** Dismantles the pervasive cognitive bias that having one affected child guarantees the next three will be healthy.
- **Independent Test:** Interactive simulation runs 10 trials, updating probability visualizations and rendering a clear visual legend.
- **Acceptance Scenarios:**
  1. **Given** an incompatible carrier match, **When** navigating to the Risk Simulator, **Then** display an interactive 4-quadrant Punnett matrix:
     - Quadrant 1 (25%, Emerald): Unaffected Non-Carrier ($AA$)
     - Quadrants 2 & 3 (50%, Slate/Blue): Healthy Carrier ($Aa$)
     - Quadrant 4 (25%, Crimson/Amber): Affected Child ($aa$)
  2. **When** clicking the *"Simulate Pregnancy Outcome"* button, **Then** an animated dice-roll/spinner selects one quadrant at random, updates a cumulative family outcome tracker, and displays: *"Notice: Previous outcomes do not change the 25% probability of your next pregnancy."*
  3. **When** reviewing the affected disorder profile, **Then** display a compassionate disease briefing (e.g. daily realities, available therapies) without catastrophic fear-mongering.

---

### User Story 3 - Pre-Engagement SafeMatch Peer-to-Peer Flow (Priority: P0)
As a prospective couple considering marriage before informing our families,  
I want to pair our mobile devices via QR code or session link to run SafeMatch,  
So that we learn whether we share a carrier risk without either of us viewing each other's genetic data.

- **Why this priority:** Addresses the core social barrier in Gulf societies where public testing results can compromise family reputations.
- **Independent Test:** Execute the 3-step pairing flow across two mock user sessions in browser tabs or mobile simulator.
- **Acceptance Scenarios:**
  1. **Partner A (Initiator):** Clicks *"Start SafeMatch Session"*, generating a temporary 6-digit code and QR code with a 15-minute countdown timer.
  2. **Partner B (Joiner):** Scans QR or enters code, authenticates their simulated local screening payload, and clicks *"Authorize Dual-Blinded Match"*.
  3. **Cryptographic Execution:** Both browsers compute local SHA-256 Bloom filters and evaluate the intersection bitmask.
  4. **Outcome Display:**
     - If compatible: *"Compatible — No shared recessive risk detected. You are cleared for confident next steps."*
     - If incompatible: *"Specialist Consultation Advised — An overlapping carrier trait was identified. Safe, modern reproductive pathways are available."* (Gene names remain strictly hidden).

---

### User Story 4 - Halal PGT-M & Thiqa Healthcare Navigator (Priority: P0)
As an incompatible couple seeking a healthy pregnancy,  
I want to explore the Halal Pre-implantation Genetic Testing (PGT-M) pathway with religious and financial clarity,  
So that we feel morally safe and know how to book our Thiqa-covered fertility care.

- **Why this priority:** Bridges the gap between screening discovery and medical intervention; removes religious hesitation.
- **Independent Test:** Verify that all 4 UAE Fatwa Council bioethical criteria are displayed with official reference numbers.
- **Acceptance Scenarios:**
  1. **Given** an incompatible couple, **When** viewing the Reproductive Options roadmap, **Then** highlight PGT-M as the primary clinical standard.
  2. **When** opening the *"Islamic Bioethics & Fatwa Clearance"* card, **Then** render the official ruling from the General Authority of Islamic Affairs & Endowments:
     - Condition 1: Biological gametes exclusively from legal husband and wife.
     - Condition 2: Implantation exclusively into the biological wife's uterus.
     - Condition 3: Medical necessity (preventing severe hereditary disease).
     - Condition 4: Ethical handling of unselected embryos according to approved regulatory standards.
  3. **When** clicking *"View Accredited Centers"*, **Then** display DoH-licensed centers (Cleveland Clinic Abu Dhabi, Fakih IVF, HealthPlus Fertility) with estimated Thiqa coverage details (100% covered for eligible UAE citizens) and a *"Request Priority Booking"* CTA.

---

### User Story 5 - Anonymous Cascade Risk Alert Generator (Priority: P1)
As an identified carrier of a severe recessive condition,  
I want to send an anonymous digital alert to my adult siblings and first cousins,  
So that they can request targeted carrier screening before their own engagements.

- **Acceptance Scenarios:**
  1. **When** clicking *"Alert Family Members"*, **Then** prompt the user to select relationship (Sibling or First Cousin).
  2. System generates an encrypted, non-traceable shareable link and WhatsApp-ready message copy:
     *"A family member has been identified as a healthy carrier for a recessive genetic trait. As a first-degree relative, you have a 50% chance of carrying the same trait. Free, confidential premarital screening is available under DoH Abu Dhabi."*
  3. The link opens a dedicated family education landing page with zero identifiable patient information.

---

## 3. UI/UX Architecture & Component Hierarchy

```
frontend/src/
├── pages/
│   └── geno-citizen/
│       └── ui/
│           └── GenoCitizenPage.tsx          # Mobile container with tabbed sub-views & Hub navigation
├── widgets/
│   ├── geno-citizen-start/                  # Premarital Wellness Hub & Onboarding Gateway
│   ├── geno-mendelian-simulator/            # 4-Quadrant interactive Punnett simulator
│   ├── geno-safematch-card/                 # ZKP session card with QR / peer code
│   ├── geno-halal-roadmap/                  # Step-by-step PGT-M clinic roadmap
│   └── geno-carrier-summary/                # Plain-language variant translation card
├── entities/
│   └── genomics/                            # Types, local store, and synthetic cohort (CPL-01 to CPL-09)
```

---

## 4. Mobile Layout & Theme Tokens

- **Palette:** Mediora Emerald (`#0F766E` / `emerald-700`), Mint Accent (`#14B8A6`), Slate Surface (`#0F172A` / `#F8FAFC`), Warning Ochre (`#D97706`), Alert Crimson (`#BE123C`).
- **Typography:** Inter (English) and IBM Plex Sans Arabic (Arabic terminology).
- **Mobile Container:** Max-width `430px` (iPhone 16 Pro Max viewport) centered on desktop, with responsive expanding layouts for tablet screens.

---

## 5. Acceptance Criteria & Verification Strategy

- [ ] **AC-007-1 (Mobile Responsiveness):** Citizen interface renders cleanly at `375px`, `390px`, and `430px` viewports without horizontal scrolling or text clipping.
- [ ] **AC-007-2 (Copy Rigor):** Zero occurrences of pejorative or fatalistic genetic terms in consumer copy.
- [ ] **AC-007-3 (Simulator Accuracy):** Interactive simulator accurately displays $25\%$ affected, $50\%$ carrier, $25\%$ unaffected proportions.
- [ ] **AC-007-4 (Peer SafeMatch Execution):** SafeMatch simulation completes peer comparison in $<1.5\text{s}$ using Web Crypto API.
- [ ] **AC-007-5 (Fatwa Compliance):** Official UAE Fatwa Council conditions are permanently rendered within the PGT-M navigator.
