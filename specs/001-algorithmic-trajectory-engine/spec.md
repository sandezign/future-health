# Feature Specification: Algorithmic Trajectory Engine

**Feature Branch**: `001-algorithmic-trajectory-engine`  
**Created**: 2026-10-20  
**Status**: Ready for Implementation  
**Input**: Sprint Plan Phase 1 & Clinical Formulas (`docs/CLINICAL_FORMULAS.md`)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Race-Free eGFR Calculation via CKD-EPI 2021 (Priority: P1)
Calculate race-free eGFR using the 2021 refit formula from serum creatinine, age, and sex.

**Why this priority**: Core primitive for all downstream kidney disease staging and risk stratification.

**Independent Test**: Can be tested directly with published NEJM 2021 benchmark values.

**Acceptance Scenarios**:
1. **Given** 55yo Male with Scr 1.2 mg/dL, **When** calculated, **Then** eGFR is 73.3 mL/min/1.73m2.
2. **Given** 62yo Female with Scr 0.6 mg/dL, **When** calculated, **Then** eGFR is 98.8 mL/min/1.73m2.
3. **Given** Scr <= 0 or missing, **When** evaluated, **Then** raise ValueError.

---

### User Story 2 - Longitudinal OLS eGFR Slope (Priority: P1)
Compute annual eGFR loss rate via Ordinary Least Squares linear regression over sequential observations.

**Why this priority**: Rapid progressors losing >=3 mL/min/yr must be intercepted before irreversible Stage 4 CKD.

**Independent Test**: Feed 3+ longitudinal observations and verify slope calculation against numpy/scipy benchmarks.

**Acceptance Scenarios**:
1. **Given** serial eGFR dropping 85 -> 72 -> 59 over 2 years, **When** slope calculated, **Then** slope is -13.0 mL/min/yr and classified as `RAPID_PROGRESSION`.
2. **Given** fewer than 2 readings, **When** slope evaluated, **Then** return `INSUFFICIENT_DATA` status.

---

### User Story 3 - Tangri 4-Variable KFRE 2-Year & 5-Year Risk (Priority: P1)
Compute 2-year and 5-year probability of End-Stage Kidney Disease (dialysis or kidney transplant).

**Why this priority**: Validated clinical standard (JAMA 2016) used worldwide for dialysis risk quantification and specialist referral.

**Independent Test**: Validate against JAMA 2016 coefficients and baseline survival rates.

**Acceptance Scenarios**:
1. **Given** 60yo Male, eGFR 35, uACR 450 mg/g, **When** computed with non-North American calibration, **Then** returns accurate 2-year and 5-year percentage risks.
2. **Given** uACR in mg/mmol, **When** parsed, **Then** converts to mg/g before computing linear predictor.

---

### User Story 4 - KDIGO 2024 Staging & 1-Click GDMT Recommendation (Priority: P1)
Map patient to KDIGO G1-G5 / A1-A3 grid and generate GDMT order set (SGLT2i + ACEi/ARB) with contraindication checks.

**Why this priority**: Overcomes primary care therapeutic inertia by turning guidelines into instant, safe clinical order sets.

**Independent Test**: Test against KDIGO 2024 matrix rules with normal and contraindicated patients.

**Acceptance Scenarios**:
1. **Given** eGFR 42 and uACR 350 mg/g with normal potassium, **When** evaluated, **Then** recommend Dapagliflozin 10mg + Losartan 50mg + 4-week K+/Scr reflex lab order.
2. **Given** eGFR < 20, **When** evaluated, **Then** withhold SGLT2i with specialist referral advice.
3. **Given** K+ > 5.5 mEq/L, **When** evaluated, **Then** withhold ACEi/ARB with hyperkalemia warning.

---

### User Story 5 - REST API Endpoints (Priority: P2)
Expose patient trajectories and GDMT recommendations via FastAPI.

**Acceptance Scenarios**:
1. **Given** client calls `GET /api/v1/patients`, **Then** returns list of patients with risk stratification.
2. **Given** client calls `GET /api/v1/patients/{id}/trajectory`, **Then** returns serial observations, slope, and projected dialysis date.
3. **Given** client calls `POST /api/v1/clinical-decision/gdmt`, **Then** returns validated prescription order set.

---

## Edge Cases
- Serum creatinine values at or below $\kappa$ (0.7 female, 0.9 male).
- Observation dates that are identical or out of chronological order.
- Negative time intervals or single observation points.
- Extremely elevated uACR ($> 5000\text{ mg/g}$).
- Extreme potassium levels ($> 6.5\text{ mEq/L}$).

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST implement race-free CKD-EPI 2021 refit formula.
- **FR-002**: System MUST compute OLS eGFR slope over time (in years).
- **FR-003**: System MUST classify slope into Normal, Mild, Rapid ($\ge 3$), or Catastrophic ($\ge 5$).
- **FR-004**: System MUST project time to dialysis threshold ($\text{eGFR} < 15$).
- **FR-005**: System MUST compute Tangri 4-variable 2-year and 5-year ESKD risk.
- **FR-006**: System MUST map patient to KDIGO 2024 stage and composite risk tier.
- **FR-007**: System MUST provide 1-click GDMT order set with reflex 4-week safety order.
- **FR-008**: System MUST screen for SGLT2i contraindications ($\text{eGFR} < 20$, T1D).
- **FR-009**: System MUST screen for RAS blockade contraindications ($\text{K}^+ > 5.5\text{ mEq/L}$).
- **FR-010**: System MUST include hemodynamic dip reassurance explaining benign $\le 30\%$ initial eGFR drop.

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: 100% mathematical parity against NEJM 2021 and JAMA 2016 benchmarks.
- **SC-002**: 100% of unit tests pass in `pytest backend/tests`.
- **SC-003**: API response time $< 50\text{ ms}$ for trajectory computations.
- **SC-004**: Zero prescriptions generated without reflex safety lab monitoring orders.
