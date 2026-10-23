# Feature Specification: Clinical Genetics Counselor Workspace

**Feature Identifier**: `008-geno-counselor-workspace`  
**Created**: 2026-10-23  
**Status**: Ready for Implementation  
**Specification Owner**: GENO-BRIDGE Clinical Decision Support (CDS) Team  
**Primary Standards**: 
- ACMG/AMP 2015 Sequence Variant Interpretation Guidelines
- National Society of Genetic Counselors (NSGC) Practice Guidelines
- Department of Health (DoH) Abu Dhabi Premarital Clinical Triage Protocols
- Malaffi Health Information Exchange (HIE) Clinical Documentation Standards

---

## 1. Summary & Objectives

The **Clinical Genetics Counselor Workspace** is a high-efficiency clinical decision support portal built for licensed geneticists, genetic counselors, and premarital clinical teams across Abu Dhabi. With only a limited number of certified genetic counselors serving the emirate's mandatory premarital screening population, this workspace automates pre-consultation record review, reducing clinician preparation time from **45 minutes to $<3$ minutes** per high-risk couple (an 85% efficiency gain).

Key capabilities delivered:
1. **Prioritized Couple Triage Queue:** Automatically segments and ranks incompatible carrier couples based on disease lethality (Tier 1 Infantile Lethal vs Tier 2 Chronic Debilitating) and wedding proximity.
2. **1-Click AI Clinical Brief Generator:** Instant synthesis of ACMG classifications, ClinVar accession IDs, OMIM disorder descriptions, inheritance patterns, and evidence-based pre-consultation talking points.
3. **Variants of Uncertain Significance (VUS) Review Board:** Dedicated clinical interface displaying unmasked VUS variants with ClinVar evidence links, safely sequestered from lay patient views.
4. **1-Click DoH Fertility Center Referral:** Direct generation of structured PGT-M / IVF referral orders for Cleveland Clinic Abu Dhabi, Fakih IVF, and HealthPlus.
5. **Population Carrier Epidemiology Heatmap:** Geospatial analysis of synthetic carrier frequencies and projected healthcare expenditure savings across Abu Dhabi, Al Ain, and Al Dhafra.

---

## 2. User Scenarios & Prioritized User Stories

### User Story 1 - Severity-Tiered Couple Triage Queue (Priority: P0)
As a DoH genetic counselor with 20 newly screened couples waiting this week,  
I want an automated triage table prioritizing couples by clinical severity and wedding date,  
So that urgent cases (e.g. wedding in 10 days with lethal SMA carrier overlap) are counseled immediately.

- **Why this priority:** Maximizes clinical impact by directing scarce counseling hours to couples facing imminent marriage contracts with the highest pediatric mortality risk.
- **Independent Test:** Feed synthetic cohort with varying wedding dates and severity tiers; verify sort ordering strictly places Tier 1 urgent cases at the top.
- **Acceptance Scenarios:**
  1. **Given** 10 couples in the registry, **When** the triage queue loads, **Then** categorize each couple into:
     - `TIER_1_URGENT` (Red Badge): Infantile lethal or neonatal crisis (*SMN1*, *HBB*, *CYP21A2*) with wedding $< 30$ days.
     - `TIER_1_ROUTINE` (Amber Badge): Infantile lethal with wedding $> 30$ days.
     - `TIER_2_MODERATE` (Blue Badge): Chronic debilitating (*CFTR*, *PCDH15*).
     - `COMPATIBLE_CLEARED` (Green Badge): Non-overlapping carrier profiles.
  2. **When** filtering by region, **Then** allow instant toggling between `All Abu Dhabi`, `Abu Dhabi Central`, `Al Ain`, and `Al Dhafra`.
  3. **When** searching, **Then** support instant lookup by Emirates ID hash, Couple ID, or Gene symbol.

---

### User Story 2 - 1-Click Automated AI Clinical Brief Generator (Priority: P0)
As a genetic counselor preparing for a 30-minute consultation with an incompatible couple,  
I want to click *"Generate Clinical Brief"* to receive a pre-compiled, guideline-cited counseling summary,  
So that I do not spend 45 minutes manually cross-referencing ClinVar, OMIM, and lab PDFs.

- **Why this priority:** Unlocks the 500% clinical throughput objective of GENO-BRIDGE.
- **Independent Test:** Trigger brief generation for an *HBB* dual-carrier case; verify inclusion of HGVS notation, ClinVar IDs, OMIM #603902, and tailored discussion points.
- **Acceptance Scenarios:**
  1. **When** clicking *"Generate Clinical Brief"* for a selected couple, **Then** render a formatted clinical document in $<1\text{s}$ containing:
     - Patient Demographics & Consent Timestamps.
     - Matched Autosomal Recessive Gene (*e.g. HBB*) & Condition Name (*Beta-Thalassemia Major*).
     - Partner A Variant (*c.93-21G>A*, Pathogenic, Heterozygous, ClinVar: VCV000015444).
     - Partner B Variant (*c.118C>T*, Pathogenic, Heterozygous, ClinVar: VCV000015456).
     - Inheritance Probability Summary (25% affected, 50% carrier, 25% unaffected).
     - Recommended Counseling Script: Non-directive framing, Halal PGT-M pathway, cascade testing for first-degree relatives.
  2. **When** clicking *"Copy for Malaffi HIE"*, **Then** copy a cleanly formatted markdown text version directly to the system clipboard.
  3. **When** clicking *"Export PDF"*, **Then** trigger a print-ready clinical summary document.

---

### User Story 3 - Clinician VUS Audit Panel (Priority: P1)
As a clinical geneticist,  
I want to inspect Variants of Uncertain Significance (VUS) detected during the 570-gene NGS panel,  
So that I can evaluate whether emerging clinical literature warrants tracking without causing lay patient distress.

- **Acceptance Scenarios:**
  1. **Given** a patient possessing a VUS in *CFTR* (*c.1521_1523delCTT* variant with conflicting evidence), **When** viewed in the Counselor Workspace, **Then** display in an amber *"VUS Secondary Audit"* tab.
  2. **When** confirmed that this is hidden from the Citizen Copilot, **Then** display an explicit status tag: *"Protected: Hidden from Citizen Mobile View (Rule BR-05)"*.
  3. Clinician can add a private clinical annotation: *"Follow-up in 12 months for ClinVar reclassification"*.

---

### User Story 4 - 1-Click DoH PGT-M Referral Dispatcher (Priority: P1)
As a counselor completing a session with a couple electing to pursue assisted reproduction,  
I want to dispatch an electronic PGT-M referral to a DoH-accredited fertility center,  
So that the couple receives an expedited intake consultation under Thiqa coverage.

- **Acceptance Scenarios:**
  1. **When** clicking *"Dispatch PGT-M Referral"*, **Then** open a referral modal pre-populated with:
     - Target Fertility Center (Cleveland Clinic Abu Dhabi, Fakih IVF Abu Dhabi, HealthPlus).
     - Indication: Recessive carrier incompatibility for *HBB* / *SMN1*.
     - Urgency: High (wedding within 60 days).
     - Insurance Authorization Flag: Thiqa Full Coverage Pre-Certification Requested.
  2. **When** confirmed, **Then** update the couple's status badge to `REFERRED_FOR_PGTM`.

---

### User Story 5 - Population Carrier Analytics & Economic ROI Heatmap (Priority: P2)
As a Department of Health population health strategist,  
I want to view geospatial carrier distributions and projected national cost savings,  
So that health authorities can allocate prenatal genetics resources efficiently.

- **Acceptance Scenarios:**
  1. **When** viewing the Population Dashboard tab, **Then** display an interactive map/chart of Abu Dhabi regions showing:
     - Screened Couples Count (Total, Compatible, Incompatible).
     - Carrier Frequency by Gene (*HBB*: 8.4%, *SMN1*: 2.2%, *CFTR*: 1.9%, *CYP21A2*: 1.3%).
  2. **When** reviewing the Health Economics card, **Then** display:
     - Projected avoided pediatric cases (e.g. 48 averted severe cases annually).
     - Total estimated 10-year healthcare cost savings ($> \text{AED } 240,000,000$, calculated at AED 5,000,000 per lifetime pediatric ESKD/SMA/Thalassemia case).

---

## 3. UI/UX Architecture & Component Layout

```
frontend/src/
├── pages/
│   └── geno-counselor/
│       ├── ui/
│       │   ├── GenoCounselorDashboardPage.tsx  # Main dashboard layout
│       │   └── GenoCoupleDetailPage.tsx         # In-depth clinical brief & case manager
├── widgets/
│   ├── geno-triage-table/                      # Prioritized couple table with filter/search
│   ├── geno-clinical-brief-modal/              # Printable/copyable AI clinical brief
│   ├── geno-population-heatmap/                # Abu Dhabi carrier epidemiology chart
│   └── geno-referral-dialog/                   # PGT-M electronic referral dispatcher
├── features/
│   ├── generate-clinical-brief/                # AI synthesis formatting logic
│   ├── dispatch-pgtm-referral/                 # Status transition & referral record
│   └── filter-triage-queue/                    # Multi-parameter severity/date filter
└── entities/
    └── genomics/                               # Shared types & mock cohort registry
```

---

## 4. Acceptance Criteria & Verification Strategy

- [ ] **AC-008-1 (Triage Sorting Accuracy):** Tier 1 couples with wedding dates $<30$ days consistently appear in top rows of the default queue.
- [ ] **AC-008-2 (Brief Generation Latency):** Clinical brief modal renders and populates in $<500\text{ms}$.
- [ ] **AC-008-3 (Malaffi Copy Format):** Clipboard export contains valid markdown text with complete variant and guideline citations.
- [ ] **AC-008-4 (VUS Sequestration):** VUS variants render with warning badges in clinician view and are verified absent from citizen endpoints.
