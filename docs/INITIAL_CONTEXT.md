# RENAL-PULSE: Initial Context & Strategic Blueprint
**Competition:** Future Health Digital Innovation Challenge (Hack2skill / Abu Dhabi Global Initiative)  
**Track:** Population Health — *Turning Health Risk Signals into Upstream Preventive Action and Scalable Chronic Disease Risk Management*  
**Core Motto:** *“To Sense is to Predict”*  
**Winning Concept:** **RENAL-PULSE** (Cardiorenal Upstream Interception & Scalable Care Engine)  

---

## Executive Summary

The chronic disease burden across both emerging economies (e.g., Indonesia's BPJS Kesehatan) and advanced health economies (e.g., Abu Dhabi's Department of Health) is heavily concentrated in downstream catastrophic events: **End-Stage Kidney Disease (ESKD) requiring lifelong hemodialysis, strokes, and heart failure**. 

In Indonesia, kidney disease and hemodialysis alone consume over **Rp 11 trillion** annually. Globally, dialysis costs **$35,000–$60,000 per patient annually**. Yet, Chronic Kidney Disease (CKD) has an asymptomatic, multi-year progression window (Stages 1–3a) during which the newest Class 1A guideline-directed medical therapies (SGLT2 inhibitors like Dapagliflozin/Empagliflozin and non-steroidal MRAs) reduce the risk of kidney failure, dialysis, and cardiovascular death by **30% to 40%** (NNT 14–19).

**The Breakdown:** The signal already exists in routine laboratory systems (serum creatinine, dipstick protein, blood pressure, fasting glucose), but:
1. **eGFR alone masks glomerular damage:** Serum creatinine only spikes after 50% of nephrons are destroyed; urine albumin-to-creatinine ratio (uACR) is ordered in <15% of high-risk patients.
2. **Clinician Therapeutic Inertia:** Primary care clinicians have 3–5 minutes per patient, lack automated eGFR slope tracking, fear transient 10–20% hemodynamic creatinine dips upon starting SGLT2i/ACEi, and delay action until Stage 4.
3. **The Asymptomatic Trap:** Patients have no pain, swelling, or symptoms, so they ignore routine appointments and drop out of follow-up.

**RENAL-PULSE** bridges this "Signal-to-Action Translation Chasm" by:
1. Ingesting routine primary care laboratory and EHR data via FHIR APIs to compute longitudinal **eGFR slope** and the **Kidney Failure Risk Equation (KFRE)**.
2. Providing frontline primary care doctors with an **EHR-integrated, 1-click Guideline-Directed Medical Therapy (GDMT) Copilot** that overcomes therapeutic inertia and dosing anxiety.
3. Engaging asymptomatic patients through a **culturally-tuned conversational WhatsApp agent** that demystifies silent kidney risk, addresses medication fears, and automates consultation booking.
4. Dispatching tasks to **Community Health Workers (Kader / CHWs)** for high-risk patients who lapse in medication refills.

---

## 1. Population Health Track Analysis

### Competition Context
- **Organizers:** Future Health – A Global Initiative by Abu Dhabi, Department of Health – Abu Dhabi, Microsoft, Inception42, Mohamed bin Zayed University of Artificial Intelligence (MBZUAI), hosted on Hack2skill.
- **Prizes:** Total USD $105,000 (Winner: $50,000; 1st Runner-up: $35,000; 2nd Runner-up: $20,000) + Live Presentation at GITEX + Incubation across Abu Dhabi's health ecosystem.
- **Pillars Evaluated:**
  - *Innovation & Originality (25%)*
  - *Impact Potential (25%)*
  - *Technical Feasibility & Architecture (20%)*
  - *Execution & Prototype Quality (15%)*
  - *Scalability & Ecosystem Fit (15%)*

### Winning Criteria & Pitfalls
- **The "Dashboard Trap":** Judges reject passive dashboards that create alert fatigue for clinicians or generic consumer wellness apps with 90% churn.
- **Closed-Loop Action:** Every signal must trigger an automated, protocolized, multi-stakeholder action (patient behavior change + primary care clinical decision support + health system escalation).
- **Dual Applicability:** Must demonstrate high feasibility in resource-constrained environments (e.g., Indonesia's BPJS/Puskesmas) while plugging seamlessly into advanced data ecosystems (e.g., Abu Dhabi's Malaffi HIE).

---

## 2. Signal → Action Opportunity Map

| Chronic Disease / Risk Area | Available Signal | Signal Source / Owner | Current Clinical Action | Failure Point (Why It Breaks) | Upstream Preventive Opportunity | Population Scalability & Economic ROI |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Diabetic Kidney Disease (DKD) & Early CKD** | Serum creatinine, eGFR, urine dipstick protein, opportunistic BP, HbA1c | Primary care labs, Puskesmas, routine checkups, outpatient EHR | Serum creatinine checked; if eGFR >60 mL/min, labeled "normal". uACR ordered in <15% of patients. | **Silent progression:** eGFR remains normal while glomerular damage accelerates. Therapeutic inertia delays SGLT2 inhibitors and ACEi/ARBs until Stage 4. | Automated eGFR slope + uACR reflex ordering; guideline-directed medical therapy (GDMT) decision support; conversational patient activation. | **Highest:** Dialysis consumes Rp 11T+ in Indonesia (BPJS) and $30K–$50K/pt/yr globally. SGLT2i delays dialysis by 5–10 years. |
| **Silent Prehypertension / Stage 1 HTN** | Opportunistic blood pressure readings (130–139/80–89 mmHg) | Community pharmacies, Posbindu PTM, workplace health checks | Dismissed as "white coat effect", transient stress, or pain. Patient told: "relax and recheck next year." | **No confirmatory protocol:** No out-of-office home BP monitoring (HBPM) is initiated. Patient is asymptomatic and feels healthy. | Trigger 7-day protocolized WhatsApp/SMS out-of-office BP logging; lifestyle micro-nudges (sodium reduction); automated titration protocol. | **High:** Primary driver of hemorrhagic and ischemic stroke (WHO HEARTS). Low marginal cost to capture via mobile. |
| **Prediabetes Rapid-Progressors** | Fasting blood glucose (100–125 mg/dL) or HbA1c (5.7–6.4%) | Periodic screening (e.g., BPJS Mobile JKN Skrining, corporate health exams) | Generic counseling: "watch your sugar, eat less rice." No follow-up until next routine checkup. | **No structured delivery:** DPP programs require manual coaches costing $400+/person. 90% receive zero structured lifestyle intervention. | AI-adapted micro-habit dietary coaching (staple food substitution); automated physical activity tracking; metformin risk-stratified escalation. | **High:** 58% relative risk reduction in T2D transition via structured lifestyle (DPP Trial, NEJM). Halts lifelong complications. |
| **Postpartum Cardiometabolic Risk (Post-GDM / PE)** | Documented GDM or Preeclampsia in obstetric records | Hospital discharge summaries, maternal health logbooks (Buku KIA) | Patient discharged home. Care shifts entirely to infant vaccination and growth milestones. | **The Postpartum Cliff:** 70–85% of women never undergo the 6–12 week postpartum OGTT. Obstetric and adult primary care records are siloed. | Automatic handoff to primary care registry; automated WhatsApp maternal metabolic re-engagement; scheduled home fasting glucose or local lab check. | **Moderate-High:** 50% of GDM mothers develop overt T2D within 5–10 years (Lancet Review). Concentrated high-risk population. |
| **Metabolic Liver Fibrosis (MASLD / MASH)** | Routine CBC (platelets) + Liver Panel (AST, ALT) + Age | Routine outpatient lab panels, primary care EHRs | Liver enzymes mildly elevated (AST/ALT 40–60 U/L); marked as "mild fatty liver" on ultrasound; no staging. | **FIB-4 calculation omitted:** Platelets, AST, ALT, and age are already in the database, but FIB-4 index is not auto-calculated. Asymptomatic fibrosis progresses to cirrhosis. | Reflex zero-cost FIB-4 index calculation at lab/EHR level; automated risk stratification; structured metabolic/weight loss care pathway. | **Moderate:** High prevalence (25–30%), zero marginal data cost, but fewer low-cost targeted drugs approved in LMICs. |

---

## 3. Opportunity Scoring Matrix

Scoring weights:
- Health Impact (20%)
- Strength of Evidence (15%)
- Size of Unmet Need (15%)
- Upstream Prevention Potential (15%)
- Population Scalability (10%)
- Technical & Data Feasibility (10%)
- Innovation & Differentiation (10%)
- Competition Fit (5%)

| Evaluation Criteria | Weight | Opp 1: Cardiorenal / CKD Interception | Opp 2: Postpartum GDM Handoff | Opp 3: Out-of-Office BP / Stroke | Opp 4: National Survey Activation | Opp 5: Zero-Cost FIB-4 Liver |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Magnitude of Health Impact** | 20% | **5.0** | 4.2 | 4.8 | 3.8 | 4.0 |
| **Strength of Evidence** | 15% | **5.0** | 4.6 | 4.8 | 3.5 | 4.4 |
| **Size of Unmet Need** | 15% | **5.0** | 4.8 | 4.5 | 4.0 | 4.5 |
| **Potential for Upstream Prevention** | 15% | **5.0** | 4.5 | 4.2 | 3.8 | 4.8 |
| **Population Scalability** | 10% | **4.5** | 3.8 | 4.5 | 4.5 | **4.8** |
| **Technical & Data Feasibility** | 10% | **4.5** | 4.0 | 4.2 | 4.5 | **4.8** |
| **Innovation & Differentiation** | 10% | **4.8** | 4.2 | 3.5 | 3.2 | 4.2 |
| **Competition Fit** | 5% | **5.0** | 4.5 | 4.2 | 3.8 | 4.4 |
| **Weighted Total (out of 5.0)** | **100%** | **4.85** (#1) | **4.33** (#3) | **4.32** (#4) | **3.88** (#5) | **4.38** (#2) |

---

## 4. The Solution: RENAL-PULSE Specification

### System Architecture Overview

```
                      [ POPULATION HEALTH DATA SOURCES ]
            Routine Primary Care Labs (Creatinine, Glucose, Dipstick)
                  EHR Vitals (BP, Age, Sex) | FHIR API / CSV
                                      │
                                      ▼
                      [ RENAL-PULSE CORE ENGINE (FastAPI) ]
  ┌────────────────────────────────────────────────────────────────────────┐
  │ 1. CKD-EPI 2021 Equation: Automated eGFR calculation                   │
  │ 2. Longitudinal Trajectory: Ordinary Least Squares (OLS) eGFR Slope    │
  │ 3. Kidney Failure Risk Equation (KFRE): 4-variable 2-yr & 5-yr Risk    │
  │ 4. KDIGO 2024 Heatmap Staging: G1-G5 x A1-A3 Matrix                    │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    ▼                                   ▼
        [ CLINICAL COPILOT (Doctor) ]        [ BEHAVIORAL AGENT (Patient) ]
    - 1-Click GDMT Prescribing Card       - Asynchronous WhatsApp Channel
    - Pre-calculated SGLT2i / ARB dosing  - Visual Kitchen-Filter Analogy
    - Reassurance on hemodynamic dip      - Asymptomatic Risk Reframing
    - Automated 4-week safety order set   - 1-Click Consultation Booking
                    │                                   │
                    └─────────────────┬─────────────────┘
                                      ▼
                    [ ESCALATION & COMMUNITY CLOSURE ]
     - If patient misses appointment or lapses on medication >30 days:
       Dispatch targeted task to Community Health Worker (Kader / CHW)
```

### Clinical Rationale & Trial Evidence
1. **DAPA-CKD (NEJM 2020):** Dapagliflozin 10 mg demonstrated a **39% relative reduction** in the primary composite endpoint of sustained eGFR decline $\ge 50\%$, end-stage kidney disease, or renal/cardiovascular death (HR 0.61; 95% CI 0.51–0.72; $P < 0.001$; NNT = 19).
2. **EMPA-KIDNEY (NEJM 2023):** Empagliflozin 10 mg demonstrated a **28% relative reduction** in kidney disease progression or cardiovascular death across a broad range of eGFR (down to 20 mL/min/1.73m²) with or without diabetes (HR 0.72; 95% CI 0.64–0.82; $P < 0.001$).
3. **KFRE Validation (Tangri et al., JAMA 2016):** The 4-variable KFRE (Age, Sex, eGFR, uACR) has a pooled C-statistic of **0.89 to 0.91** for predicting 5-year kidney failure across >700,000 patients in 30+ international cohorts.
4. **KDIGO 2024 Guidelines:** Strongly recommend SGLT2 inhibitors and ACEi/ARBs as first-line organ-protective therapy for patients with CKD and T2D or persistent albuminuria, emphasizing that an initial eGFR dip of up to 30% is a benign hemodynamic effect, not acute tubular toxicity.

---

## 5. MVP Target Deliverables

1. **Backend Engine (`backend/`):**
   - Ingestion API for synthetic patient health records (FHIR JSON & CSV).
   - Python implementations of CKD-EPI 2021, eGFR slope regression, and 4-variable KFRE.
   - CDS engine mapping patient risk tier to KDIGO 2024 GDMT recommendations.
   - Twilio/WhatsApp webhook handlers for conversational flows.

2. **Doctor Copilot Web UI (`frontend/`):**
   - High-performance, clean interface for primary care physicians.
   - Longitudinal eGFR trajectory visualizer with projected 5-year dialysis horizon.
   - 1-click GDMT order card with pre-filled dosing and safety follow-up tests.
   - Patient risk stratification registry.

3. **Conversational Patient Copilot (`bot/` or integrated via Twilio):**
   - Empathetic, health-literate dialogue script in English and Bahasa Indonesia.
   - Reframes silent filtration loss without causing panic.
   - Direct interactive booking link to primary care appointment.

4. **Health Economics & Markov Model (`scripts/`):**
   - State-transition simulation quantifying dialysis cases averted and budgetary savings for health insurance programs (e.g., BPJS Kesehatan or Abu Dhabi DoH).

5. **Competition Deck & Video Demo (`docs/pitch/`):**
   - 3-minute pitch deck following the Hack2skill structure.
   - Script and recording plan for product demonstration.
