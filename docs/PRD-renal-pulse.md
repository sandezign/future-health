# Product Requirements Document (PRD) — RENAL-PULSE

**Document Identifier:** `PRD-RENAL-PULSE-001`  
**Product Name:** RENAL-PULSE (Cardiorenal Upstream Interception & Scalable Care Engine)  
**Version:** `1.0.0`  
**Status:** `Approved / Ready for Implementation`  
**Author:** Product & Clinical Engineering Team  
**Clinical Baseline:** KDIGO 2024, CKD-EPI 2021 (NEJM), Tangri 4-Var KFRE (JAMA 2016)  

---

## 1. Summary

RENAL-PULSE is a cardiorenal population health engine that converts routine, latent primary care laboratory data (serum creatinine, blood pressure, urine dipstick) into early upstream clinical intervention before patients develop irreversible End-Stage Kidney Disease (ESKD) requiring lifelong hemodialysis.

* **Product Area:** Population Health, Primary Care Clinical Decision Support (CDS), Patient Engagement.
* **Work Type:** New Product / Core Platform MVP.
* **Context Documentation:**
  * Strategic & Competition Brief: [docs/INITIAL_CONTEXT.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/docs/INITIAL_CONTEXT.md)
  * Problem Space Research & Discovery: [docs/research/PROBLEM_SPACE_DISCOVERY.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/docs/research/PROBLEM_SPACE_DISCOVERY.md)
  * System Architecture & User Flows: [docs/USER_FLOWS.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/docs/USER_FLOWS.md)
  * Clinical Mathematical Proofs: [docs/CLINICAL_FORMULAS.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/docs/CLINICAL_FORMULAS.md)

---

## 2. Product Objective

1. **Bridge the "Signal-to-Action Translation Chasm":** Transform static, siloed primary care lab values into automated longitudinal trajectory alerts (eGFR slope and 4-variable KFRE risk scores).
2. **Eliminate Clinician Therapeutic Inertia:** Empower frontline primary care physicians (facing 3–5 minute consults) to safely prescribe guideline-directed medical therapy (GDMT: SGLT2i + ARB) with 1-click pre-filled order sets and reassurance regarding benign hemodynamic dips.
3. **Overcome the "Asymptomatic Trap":** Activate asymptomatic high-risk patients via culturally resonant WhatsApp dialogue using intuitive metaphors (*"Saringan Dapur" / Kitchen Filter*) to achieve verified clinic attendance.
4. **Preserve Healthcare Insurance Solvency:** Lower downstream catastrophic hemodialysis claims for national and regional health systems (e.g., BPJS Kesehatan, Abu Dhabi Department of Health).
5. **Existing Behavior to Preserve:** Ensure clinicians retain final prescription authority and can adjust or reject CDS recommendations without interface blockers.

---

## 3. User Outcome

| User / Stakeholder | Desired Outcome | Friction / Risk Reduced |
| :--- | :--- | :--- |
| **Frontline Physician (Puskesmas/FKTP)** | Confidently identify rapid progressors within 30 seconds and order organ-protective therapy with safety monitoring in 1 click. | Reduces dosing anxiety, eliminates manual eGFR slope math, and overcomes fear of transient creatinine dips. |
| **Asymptomatic Patient (Diabetic/Hypertensive)** | Understand silent renal vulnerability in plain language and confirm a primary care appointment without anxiety. | Eliminates denial of illness caused by lack of symptoms; demystifies chronic kidney medication safety. |
| **Community Health Worker (Kader / CHW)** | Receive prioritized geolocated lists of high-risk patients who have lapsed on prescriptions or appointments. | Eliminates manual tracking and disconnected community outreach. |
| **Health Authority / Payer Executive** | Visualize regional cardiorenal heatmaps and simulate multi-year cost offsets of dialysis cases averted. | Eliminates blind spots in regional disease progression and reactive catastrophic claims budgeting. |

---

## 4. Scope

### In-Scope
* **Data Ingestion Pipeline:** Standard REST API accepting batch CSV and FHIR-compliant JSON containing routine primary care inputs: Serum Creatinine, Blood Pressure, Urinalysis (dipstick protein / spot uACR), Fasting Blood Glucose / HbA1c, Age, and Sex.
* **Algorithmic Trajectory Engine:**
  * Race-free CKD-EPI 2021 Creatinine formula calculation.
  * Ordinary Least Squares (OLS) longitudinal eGFR slope regression with progression tiering.
  * Tangri 4-Variable KFRE (2-year and 5-year ESKD risk probability).
  * KDIGO 2024 heat map staging (G1–G5 x A1–A3).
* **Doctor Clinical Copilot (Web Application):**
  * Patient registry list sorted by progression velocity and failure risk.
  * Interactive dual-chart visualizer (historical trajectory + 5-year dialysis horizon).
  * 1-Click GDMT Order Card (pre-filled Dapagliflozin/Empagliflozin + Losartan + 4-week reflex safety labs).
  * Educational modal on benign hemodynamic dip ($\le 30\%$).
* **Patient Behavioral WhatsApp Agent:**
  * Asynchronous conversational interaction via WhatsApp API.
  * Intuitive metaphor-based risk translation (English & Bahasa Indonesia).
  * Interactive quick-reply decision tree addressing medication safety.
  * Direct appointment slot selection and clinic synchronization.
* **Community Escalation Engine:**
  * Automated escalation trigger for patients with uncollected medication lapses $>30\text{ days}$ or missed visits.
* **Population Health Command Center:**
  * Regional risk heatmap and Markov health-economic simulation of dialysis cases averted.

### Out-of-Scope
* Direct integration with hospital radiology systems (CT/MRI scans) or renal biopsy pathology.
* Acute Kidney Injury (AKI) inpatient continuous renal replacement therapy (CRRT) calculators.
* Pediatric nephrology models (patients $<18\text{ years old}$).
* Real-time life-threatening emergency dispatch (e.g., acute pulmonary edema / stroke triage).
* Direct automated drug dispensing without licensed physician authorization.

---

## 5. Functional Requirements

| ID | Requirement | Priority | Notes |
| :--- | :--- | :---: | :--- |
| **FR-1** | System must ingest patient records via REST API accepting FHIR JSON and tabular CSV with baseline vitals and serial lab tests. | P0 | Validates age, sex, serum creatinine, and date stamps. |
| **FR-2** | System must calculate eGFR for every creatinine record using the race-free CKD-EPI 2021 equation. | P0 | Cites Inker et al., NEJM 2021. |
| **FR-3** | System must compute longitudinal eGFR slope using OLS linear regression across serial records spanning $\ge 90\text{ days}$. | P0 | Flags "Rapid Progressor" if slope $\le -3.0\text{ mL/min/1.73m}^2/\text{yr}$. |
| **FR-4** | System must compute 2-year and 5-year ESKD risk probability via the Tangri 4-Variable KFRE equation. | P0 | Calibrated to non-North American baseline survival constants. |
| **FR-5** | Web UI must display patient risk registry with color-coded KDIGO 2024 risk badges (Green, Yellow, Orange, Red). | P0 | Follows Feature-Sliced Design (FSD) architecture. |
| **FR-6** | Web UI must render an interactive historical eGFR trajectory chart alongside projected trajectory to ESKD (eGFR $<15$). | P0 | Sub-second rendering using SVG/Recharts. |
| **FR-7** | Web UI must provide a 1-Click GDMT order card recommending SGLT2i + ARB with automated 4-week safety order reflex. | P0 | Complies with KDIGO 2024 Class 1A guidelines. |
| **FR-8** | Web UI must display a hemodynamic dip guidance modal if a physician expresses hesitation or questions creatinine change. | P1 | Educates that creatinine increases $\le 30\%$ are benign and expected. |
| **FR-9** | WhatsApp Agent must trigger empathetic outreach in Bahasa Indonesia or English when a patient is flagged as high-risk. | P0 | Uses the "Kitchen Water Filter" metaphor. |
| **FR-10** | WhatsApp Agent must provide interactive reply buttons answering common fears: asymptomatic denial and pill safety concerns. | P0 | Guided decision tree without hallucinations. |
| **FR-11** | WhatsApp Agent must confirm clinic booking and sync with scheduling records upon patient date/time selection. | P0 | Sends confirmation and H-1 reminder. |
| **FR-12** | System must generate a task ticket for community health workers (kader) if a patient misses a visit or lapses $>30\text{ days}$ on medication refills. | P1 | Escalates to mobile view / notification queue. |
| **FR-13** | Command Center must visualize regional risk heatmaps and display a Markov model simulation of dialysis costs averted. | P1 | Health economics module for payer ROI. |

---

## 6. Business & Product Rules

### 6.1 Clinical Validation Rules
* **eGFR Calculation Bound:** Serum creatinine must be between $0.2\text{ mg/dL}$ and $20.0\text{ mg/dL}$. Age must be between $18$ and $110\text{ years}$.
* **Slope Calculation Prerequisite:** Requires a minimum of $2$ distinct serum creatinine timestamps separated by at least $90\text{ days}$. If only $1$ point is present, mark trajectory as *"Pending Longitudinal Baseline"* and order a 6-month repeat.
* **KFRE Input Handling:** If spot uACR is not recorded but dipstick protein is present, map:
  * Negative / Trace $\rightarrow \text{uACR } 15\text{ mg/g}$
  * $1+ \rightarrow \text{uACR } 50\text{ mg/g}$
  * $2+ \rightarrow \text{uACR } 300\text{ mg/g}$
  * $\ge 3+ \rightarrow \text{uACR } 1000\text{ mg/g}$
  * Display clear disclaimer: *"Approximated from dipstick protein; reflex quantitative uACR ordered."*

### 6.2 Prescribing Safety Rules
* **SGLT2i Floor:** Do not recommend initiating SGLT2i if baseline $\text{eGFR} < 20\text{ mL/min/1.73m}^2$ (per EMPA-KIDNEY / DAPA-CKD inclusion criteria).
* **Hemodynamic Dip Threshold:** At the 4-week follow-up, an eGFR drop up to $30\%$ from baseline is clinically acceptable. Only flag for dose reduction or ultrasound investigation if eGFR reduction exceeds $30\%$ or serum potassium exceeds $5.5\text{ mEq/L}$.

### 6.3 Patient Communication Rules
* **No Diagnostic Shock Copy:** The WhatsApp agent must never use alarmist terminology like *"Gagal Ginjal Akut"*, *"Kerusakan Parah"*, or *"Dialisis Segera"*. All messaging must reframe kidney health around proactive protection and filtering efficiency.
* **Patient Privacy:** Never transmit full National Identity Numbers (NIK) or unmasked raw lab values over unencrypted chat channels.

---

## 7. Design & Architecture References

| Design / Engineering Artifact | Source Document / Reference |
| :--- | :--- |
| **User Flows & Branching Logic** | [docs/USER_FLOWS.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/docs/USER_FLOWS.md) |
| **Clinical Math & Benchmark Tests** | [docs/CLINICAL_FORMULAS.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/docs/CLINICAL_FORMULAS.md) |
| **Patient Data Model & Schema** | [`data/schemas/patient_schema.json`](file:///Users/mb-rci-backup/Documents/antigravity/future-health/data/schemas/patient_schema.json) |
| **Frontend Architecture Rules** | Feature-Sliced Design (`app → pages → widgets → features → entities → shared`) |
| **Visual Design Tokens** | Medical Teal (`#0284c7`), Risk Red (`#ef4444`), Caution Amber (`#f59e0b`), Slate Neutrals |

---

## 8. Technical & Integration Notes

* **Backend Service (`backend/`):** FastAPI running on Python 3.11+. Pure algorithmic modules in `app/services/` for CKD-EPI, OLS slope, and KFRE.
* **Frontend Application (`frontend/`):** React 19, TypeScript, Vite, Tailwind CSS. Must maintain sub-400ms interactions (Doherty Threshold).
* **Interoperability:** Data schemas align with HL7 FHIR (Observation, Patient, Condition resources) to enable plug-and-play pilots with Indonesia's SATUSEHAT / BPJS PCare and Abu Dhabi's Malaffi HIE.
* **Messaging Webhook:** Twilio / WhatsApp Cloud API webhook handler delivering structured templates with callback logging.

---

## 9. Success Metrics

### 9.1 Quantitative Metrics
* **Interception Rate:** $\ge 85\%$ of synthetic and clinical pilot rapid progressors correctly flagged by the trajectory engine.
* **Physician Adoption:** $\le 30\text{ seconds}$ average time spent by a primary care physician to review trajectory and authorize the 1-click GDMT order set.
* **Patient Activation Rate:** $\ge 60\%$ of contacted asymptomatic high-risk patients respond to the WhatsApp agent and book a confirmed clinic visit.
* **Economic ROI:** Demonstrates a projected multi-year reduction of $20\%–35\%$ in downstream 5-year incident dialysis cases via Markov state simulation.

### 9.2 Qualitative Metrics
* Zero reports of clinician alert fatigue during simulated 10-patient primary care shifts.
* Patient comprehension score $\ge 80\%$ regarding why kidney health matters even when asymptomatic.

---

## 10. Acceptance Criteria

* [ ] **AC-1 (Engine Math):** All unit tests in `backend/tests/` verify CKD-EPI 2021, OLS slope, and KFRE against published clinical benchmarks with zero margin of error $>0.1\%$.
* [ ] **AC-2 (Doctor Copilot UI):** Physician can navigate from the patient list, inspect the eGFR trajectory chart, and click "Authorize GDMT Order Set" within 3 clicks.
* [ ] **AC-3 (Safety Guardrails):** System explicitly displays the 4-week safety order set (Creatinine + Potassium) whenever GDMT is prescribed.
* [ ] **AC-4 (WhatsApp Dialogue):** Simulated WhatsApp webhook completes a full multi-turn interaction in Bahasa Indonesia and English, terminating in a confirmed appointment timestamp.
* [ ] **AC-5 (Community Escalation):** System successfully creates a prioritized CHW ticket when simulated medication adherence falls below 30 days.

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| **Physician Hesitation over Creatinine Dip** | High | Embed educational tooltip citing KDIGO 2024 affirming that $\le 30\%$ dip is expected and organ-protective. |
| **Patient Drop-out / Ignored WhatsApp** | High | Implement progressive multi-touch messaging (Day 1, Day 3, Day 7) and automated dispatch to Community Health Workers (*Kader*). |
| **Missing Quantitative uACR in Labs** | Medium | Built-in proxy mapping from qualitative urine dipstick protein with automated reflex uACR ordering. |
| **Data Interoperability Lag in Clinics** | Medium | Dual ingestion mode: Supports modern FHIR JSON APIs as well as simple CSV/Excel batch exports from legacy clinic systems. |

---

## 12. Open Questions & Decision Log

| Question | Owner | Required Before Build? | Status / Decision |
| :--- | :--- | :---: | :--- |
| What default SGLT2 inhibitor should be pre-selected in the 1-click order set? | Clinical Lead | Yes | **Decided:** Dapagliflozin 10 mg or Empagliflozin 10 mg based on formulary availability. |
| What non-North American baseline survival constants are used for KFRE? | Engineering Lead | Yes | **Decided:** $S_0(2) = 0.9832$ and $S_0(5) = 0.9365$ per Tangri JAMA 2016. |
| Which WhatsApp provider should be mocked or integrated for local demo? | Tech Lead | No | Mock webhook runner for local dev; Twilio API for live staging demonstrations. |
