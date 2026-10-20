# RENAL-PULSE Constitution & Governance Standard

> **Mission:** Zero Preventable Dialysis. Bridge the "Signal-to-Action Translation Chasm" by converting latent primary care lab data into upstream cardiorenal protection.

---

## Core Principles

### Principle I: Uncompromising Clinical Rigor (NON-NEGOTIABLE)
- Every clinical algorithm, equation, classification, and alert must explicitly cite its peer-reviewed guideline origin:
  - **eGFR Calculation:** Race-Free CKD-EPI 2021 Refit Creatinine Equation (*Inker et al., NEJM 2021*).
  - **Kidney Failure Risk:** Tangri 4-Variable Kidney Failure Risk Equation (*Tangri et al., JAMA 2016*).
  - **Staging & Therapy:** KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease.
- Never invent, estimate, or hallucinate clinical cutoffs, thresholds, or drug recommendations.

### Principle II: Test-Driven Development for Math & Algorithms (TDD First)
- For every mathematical calculation, regression engine, or clinical risk score:
  1. A failing unit test with published clinical benchmark data must be written first.
  2. The service function must be implemented to achieve 100% mathematical parity.
  3. No algorithm is deployed or integrated without automated unit test verification.

### Principle III: Architecture Boundaries & Feature-Sliced Design (FSD v2)
- **Frontend (React 19 + TypeScript):** Strictly enforces downward-only dependencies:
  `app → pages → widgets → features → entities → shared`
  - Slices on the same layer may never import from each other.
  - `shared` must remain domain-agnostic and never import upward.
- **Backend (FastAPI + Python 3.11+):**
  - Services in `backend/app/services/` must be pure, deterministic, and testable without database or network mocks.
  - Input/output payloads must be strictly typed using Pydantic models.

### Principle IV: Clinical Safety & Zero Alert Fatigue
- Prescribing recommendations must enforce hard contraindication guardrails:
  - SGLT2i: contraindicated if $\text{eGFR} < 20\text{ mL/min/1.73m}^2$ or history of DKA.
  - RAS blockade (ACEi/ARB): contraindicated if $\text{K}^+ > 5.5\text{ mEq/L}$.
  - Mandatory 4-week reflex order set for serum $\text{K}^+$ and creatinine.
- **Hemodynamic Dip Reassurance:** Must explicitly contextualize that an acute $\le 30\%$ drop in eGFR at 4 weeks is a benign hemodynamic marker of reduced intraglomerular hyperfiltration, not acute kidney injury.
- UI must avoid blocking modal alarms for standard care pathways; use clear dual-encoded status badges (color + icon + text).

### Principle V: Dual Health System Context Parity
- The platform must seamlessly serve both:
  1. **Indonesia (BPJS Kesehatan / Puskesmas):** IDR currency formatting, Bahasa Indonesia clinical & patient copy, Community Health Worker (*Kader*) escalation.
  2. **Abu Dhabi (DoH / Malaffi HIE):** USD/AED formatting, English clinical copy, Malaffi HIE interoperability.

---

## Quality Gates & Verification Standards
1. **Linter & Type Checking:** Zero TypeScript or Python syntax/typing errors.
2. **Benchmark Tests:** Unit test suites (`pytest tests/`) must pass with 100% success rate.
3. **Execution Verification:** Before declaring any task complete, `make check` or dedicated test commands must be run and verified.

---

**Version**: 1.0.0 | **Ratified**: 2026-10-20 | **Target Track**: Future Health Digital Innovation Challenge
