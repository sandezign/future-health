# RENAL-PULSE 🫘
> **Cardiorenal Upstream Interception & Scalable Care Engine**  
> *Developed for the Future Health Digital Innovation Challenge (Hack2skill / Abu Dhabi Global Initiative)*  
> **Track:** Population Health — *Turning Health Risk Signals into Upstream Preventive Action and Scalable Chronic Disease Risk Management*  
> **Motto:** *“To Sense is to Predict”*

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Track](https://img.shields.io/badge/Track-Population%20Health-orange.svg)](docs/INITIAL_CONTEXT.md)

---

## The Problem: The "Silent Kidney Drop"

End-Stage Kidney Disease (ESKD) is among the most catastrophic health events in the world:
* In Indonesia, **BPJS Kesehatan spends over Rp 11 Trillion annually** on kidney failure and hemodialysis.
* Globally, hemodialysis costs **$35,000–$60,000 per patient/year**, devastating health insurance funds and family livelihoods.
* **The Silent Window:** Chronic Kidney Disease (CKD) progresses asymptomatically for 5–10 years. Over 85% of early CKD (Stages 1–3a) is missed because clinicians rely on serum creatinine alone (which only rises after 50% of nephrons are destroyed), and urine albumin-to-creatinine ratio (uACR) is ordered in <15% of patients.
* **The Treatment Revolution:** Landmark trials ([DAPA-CKD](https://www.nejm.org/doi/full/10.1056/NEJMoa2024816), [EMPA-KIDNEY](https://www.nejm.org/doi/full/10.1056/NEJMoa2204233)) prove SGLT2 inhibitors and guideline-directed medical therapy (GDMT) reduce kidney failure and mortality by **30%–40%** (NNT 14–19). Yet primary care clinicians delay prescribing due to therapeutic inertia and unfamiliarity with updated guidelines.

---

## The Solution: RENAL-PULSE

**RENAL-PULSE** turns routine, latent primary care lab data into proactive cardiorenal protection:

```
[ Routine Labs & EHR ] ──► [ RENAL-PULSE Engine ] ──► ┌──► [ Doctor Copilot (1-Click GDMT) ]
 (Creatinine, BP, Sugar)      (eGFR Slope + KFRE)     └──► [ Patient WhatsApp Agent (Booking) ]
                                                                      │
                                                        [ Community Health Worker Dispatch ]
```

1. **Algorithmic Trajectory Engine:** Ingests routine serial creatinine, blood pressure, and dipstick records; calculates the **CKD-EPI 2021 eGFR slope** and the **4-variable Kidney Failure Risk Equation (KFRE)**.
2. **Frontline Doctor Copilot:** Non-interruptive, 1-click clinical decision support that overcomes therapeutic inertia, recommends evidence-based SGLT2i + ARB dosing, reassures against transient hemodynamic creatinine dips, and sets 4-week safety monitoring orders.
3. **Conversational Patient Agent:** Multilingual WhatsApp engagement channel (English & Bahasa Indonesia) that reframes asymptomatic filtration damage using intuitive metaphors, demystifies kidney health, and secures clinic appointments.
4. **Community Health Escalation:** Dispatches follow-up tasks to local community health workers (*kader* / CHWs) if high-risk patients lapse in medication refills or missed appointments.

---

## Repository Structure

```
future-health/
├── docs/
│   ├── STRATEGIC_RESEARCH_BLUEPRINT.md # Exhaustive research, track analysis & winning blueprint
│   ├── INITIAL_CONTEXT.md              # Initial context and strategic overview
│   ├── USER_FLOWS.md                   # System scope, macro architecture & user flow specifications
│   ├── ARCHITECTURE.md                 # Technical specifications, FHIR mappings, API schemas
│   ├── CLINICAL_FORMULAS.md            # CKD-EPI 2021, KFRE 4-var, and KDIGO 2024 algorithms
│   └── pitch/                     # Pitch deck outline, presentation notes, video demo script
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entrypoint
│   │   ├── core/                  # Configurations, clinical constants, logging
│   │   ├── api/                   # REST endpoints (patients, calculations, cds, webhooks)
│   │   ├── models/                # Pydantic schemas and database models
│   │   └── services/              # CKD-EPI, eGFR slope, KFRE, GDMT rules engine
│   ├── tests/                     # Unit and regression test suites for clinical math
│   └── requirements.txt           # Python dependencies
├── frontend/                      # Doctor Copilot Web Application (React + Tailwind)
├── data/
│   ├── synthetic/                 # Realistic synthetic patient cohorts (NHANES / BPJS aligned)
│   └── schemas/                   # JSON schemas for EHR & lab ingestion
├── scripts/
│   ├── generate_synthetic_data.py # Cohort generator for testing & demo
│   └── simulate_markov_model.py   # Health economics simulation (dialysis cases averted)
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules
└── README.md                      # Project documentation overview
```

---

## Quickstart

### Prerequisites
- Python 3.11+
- Node.js 20+ or Bun
- Git

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
bun install # or npm install
bun dev     # or npm run dev
```
Open `http://localhost:5173` to view the Doctor Copilot dashboard.

---

## Key References & Evidence
* **KDIGO 2024:** [Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease](https://kdigo.org/guidelines/ckd-evaluation-and-management/)
* **DAPA-CKD Trial:** [Dapagliflozin in Patients with Chronic Kidney Disease (NEJM 2020)](https://www.nejm.org/doi/full/10.1056/NEJMoa2024816)
* **EMPA-KIDNEY Trial:** [Empagliflozin in Patients with Chronic Kidney Disease (NEJM 2023)](https://www.nejm.org/doi/full/10.1056/NEJMoa2204233)
* **KFRE Validation:** [Multinational Assessment of Accuracy of Equations for Predicting Risk of Kidney Failure (JAMA 2016)](https://jamanetwork.com/journals/jama/fullarticle/2481003)
* **CKD-EPI 2021:** [New Creatinine- and Cystatin C–Based Equations to Estimate GFR without Race (NEJM 2021)](https://www.nejm.org/doi/full/10.1056/NEJMoa2102953)

---

## License
MIT License. Developed for the Future Health Digital Innovation Challenge 2026.
