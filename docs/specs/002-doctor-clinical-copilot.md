# Feature Specification: Doctor Clinical Copilot

**Feature Branch**: `002-doctor-clinical-copilot`  
**Created**: 2026-10-20  
**Status**: Ready for Planning  
**Architecture Standard**: Feature-Sliced Design (FSD v2) + React 19 + Tailwind CSS  
**Target User**: Primary Care Physician (Puskesmas Doctor / UAE Primary Care Clinician)

---

## 1. Summary & Objectives

The **Doctor Clinical Copilot** is an ergonomic, zero-alert-fatigue clinical workstation interface designed to fit seamlessly into a 3–5 minute primary care encounter. It overcomes the pervasive 82% therapeutic inertia in CKD care by providing:
1. **Global Health System Context Switcher:** Instant toggle between Indonesia (BPJS Kesehatan / Puskesmas) and Abu Dhabi (DoH / Malaffi HIE), adapting currency, language, and clinical pathways.
2. **Longitudinal Trajectory Visualizer:** Interactive Recharts visualizer displaying historical eGFR points, OLS regression slope line, and projected drop to dialysis ($eGFR < 15$).
3. **1-Click GDMT Order Set Card:** Instant pre-filled orders for SGLT2i + ARB with automated reflex 4-week potassium and creatinine safety orders.
4. **Hemodynamic Dip Reassurance Modal:** Interactive explanation reassuring clinicians that an acute $\le 30\%$ initial eGFR dip represents beneficial intraglomerular pressure decompression.

---

## 2. User Scenarios & Prioritized User Stories

### User Story 1 - Global Health System Context Switcher (Priority: P1)
As a platform evaluator or clinician,  
I want to toggle between Indonesia (BPJS Kesehatan) and Abu Dhabi (DoH / Malaffi) modes from the navigation bar,  
So that the entire interface dynamically reflects the relevant clinical terminology, currency (IDR vs. USD/AED), and health system integration touchpoints.

- **Acceptance Scenarios:**
  1. **Given** Indonesia mode is active, **Then** all financial figures render in Indonesian Rupiah (`Rp xx,xxx,xxx`), clinical guidelines cite Puskesmas / BPJS formularies, and escalation buttons target *Kader* (Community Health Workers).
  2. **Given** Abu Dhabi mode is active, **Then** currency renders in USD/AED, clinical terminology aligns with Malaffi HIE standards, and copy is in English.

---

### User Story 2 - Longitudinal Trajectory Visualizer (Priority: P1)
As a primary care doctor,  
I want to view the patient's historical eGFR trajectory and projected decline on an interactive chart,  
So that I can immediately identify rapid progressors losing $\ge 3\text{ mL/min/yr}$ and see their estimated dialysis horizon.

- **Acceptance Scenarios:**
  1. **Given** a patient with $\ge 2$ historical readings, **When** viewing the chart, **Then** display observation data points, OLS trend line, and a dotted projection line extending to the dialysis threshold ($eGFR = 15$).
  2. **Given** a rapid progression slope ($\le -3.0\text{ mL/min/yr}$), **Then** display a dual-encoded amber/red "Rapid Progressor" warning badge with an alert icon and exact loss rate.

---

### User Story 3 - 1-Click GDMT Order Set Card (Priority: P1)
As a busy physician,  
I want to review and authorize guideline-directed medical therapy in a single click,  
So that I can prescribe organ-protective SGLT2i + ARB along with mandatory follow-up lab orders in under 30 seconds.

- **Acceptance Scenarios:**
  1. **Given** a patient meeting KDIGO criteria with no contraindications, **When** the physician clicks "Authorize 1-Click GDMT Order Set", **Then**:
     - Pre-selects Dapagliflozin 10 mg + Losartan 50 mg.
     - Automatically attaches a 4-week reflex order for Serum Potassium and Creatinine.
     - Displays confirmation toast with full prescription bundle.
  2. **Given** a patient with contraindications (e.g. potassium $>5.5$ or eGFR $<20$), **When** rendered, **Then** the contraindicated medication is disabled with an explanatory tooltip and nephrology referral recommendation.

---

### User Story 4 - Hemodynamic Dip Reassurance Modal (Priority: P2)
As a clinician concerned about initiating SGLT2i or ACEi/ARB in a patient with reduced eGFR,  
I want an easily accessible visual explanation of the expected 10–20% hemodynamic dip,  
So that I am reassured not to inappropriately discontinue therapy when lab values show an initial dip.

- **Acceptance Scenarios:**
  1. **Given** the physician clicks the "Hemodynamic Dip Guide" badge on the prescription card, **When** opened, **Then** show an interactive diagram showing intraglomerular pressure before and after SGLT2i initiation, citing KDIGO 2024 guidance.

---

### User Story 5 - Source Visual Citation Lightbox (Priority: P1)
As a primary care doctor reviewing lab results ingested from an external paper slip or uploaded PDF,  
I want to click directly on an OCR-derived biomarker badge (e.g., Creatinine: 1.4 mg/dL or eGFR: 42) to inspect the original source document with a highlighted bounding box,  
So that I have 100% confidence in the extracted values with zero fear of AI hallucinations or transcription errors before authorizing GDMT.

- **Acceptance Scenarios:**
  1. **Given** a patient whose clinical data originates from an optical lab report (`source: "SNAP_TO_CARE_OCR"`), **When** viewing the patient summary, **Then** display an optical document citation badge next to the biomarker.
  2. **Given** the physician clicks the citation badge, **When** the lightbox opens, **Then** render the original scanned document/PDF with a glowing green bounding box (`[ymin, xmin, ymax, xmax]`) centered on the extracted analyte.
  3. **Given** the bounding box view, **Then** display an extraction metadata tooltip showing: original raw text string, normalized LOINC code, confidence score ($\ge 90\%$), and timestamp.
  4. **Given** an image that underwent Human-in-the-Loop triage, **Then** display a "Nurse Verified" badge with the triaging nurse's ID.

---

## 3. Architecture & FSD Component Hierarchy

Strict adherence to Feature-Sliced Design (FSD v2):
```text
frontend/src/
├── pages/
│   └── doctor-copilot/          # Patient consultation view
├── widgets/
│   ├── egfr-trajectory-chart/   # Recharts trajectory & slope visualizer
│   ├── gdmt-prescription-card/  # 1-click order set with safety reflex orders
│   ├── patient-risk-summary/    # KDIGO grid tile & vital signs
│   ├── hemodynamic-dip-modal/   # Clinical reassurance interactive modal
│   └── source-citation-lightbox/# Interactive bounding-box viewer for scanned slips
├── features/
│   ├── initiate-gdmt/           # Order submission mutation & state
│   ├── toggle-system-context/   # BPJS vs. DoH global switch
│   └── filter-patient-list/     # Rapid progressor filtering
├── entities/
│   ├── patient/                 # Patient model, types, and hooks
│   └── cardiorenal-risk/        # KFRE and slope data models
└── shared/
    ├── ui/                      # Button, Badge, Modal, Tooltip, Card, Lightbox
    ├── api/                     # Axios/Fetch client with React Query
    └── lib/formatters/          # Medical formatting (eGFR, slope, currency)
```

---

## 4. Success Criteria

- **SC-001 (Speed to Action):** Physician can assess risk and authorize complete GDMT in $< 3\text{ clicks}$ ($< 30\text{ seconds}$).
- **SC-002 (Zero Uncoupled Prescribing):** 100% of generated GDMT order sets include the reflex 4-week potassium and creatinine safety check.
- **SC-003 (Accessibility & Responsiveness):** Compliant with WCAG 2.2 AA (4.5:1 text contrast, 44px touch targets).
- **SC-004 (Source Verification Auditability):** Any paper-ingested analyte provides instantaneous ($< 200\text{ ms}$) source document lightbox inspection with pixel-accurate bounding box highlighting.
